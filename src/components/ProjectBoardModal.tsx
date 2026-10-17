import React, { useState } from 'react';
import { 
  X, Plus, FileSpreadsheet, Paperclip, Upload, Trash2, Calendar, 
  CheckCircle2, Clock, ListTodo, AlertTriangle, ArrowRight, ArrowLeft, 
  ExternalLink, FileText, FileImage, FileCode, Check, Edit3, User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Project, Task, TaskStatus, ProjectFile, UserRole, Priority } from '../types';
import { isTaskOverdue, calculateProjectProgress, exportProjectToExcel } from '../utils/exportUtils';

interface ProjectBoardModalProps {
  project: Project;
  onClose: () => void;
  onUpdateProject: (updated: Partial<Project>) => void;
  onAddTask: (taskData: Partial<Task>) => void;
  onUpdateTask: (taskId: string, taskData: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onUploadFile: (file: File) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
  role: UserRole;
}

export const ProjectBoardModal: React.FC<ProjectBoardModalProps> = ({
  project,
  onClose,
  onUpdateProject,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onUploadFile,
  onDeleteFile,
  role
}) => {
  const [activeTab, setActiveTab] = useState<'board' | 'files' | 'notes'>('board');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesContent, setNotesContent] = useState(project.notes || '');
  const [uploading, setUploading] = useState(false);
  
  // Quick Task form modal or inline
  const [newTaskColumn, setNewTaskColumn] = useState<TaskStatus | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState(project.owner || '');
  const [newDueDate, setNewDueDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [newPriority, setNewPriority] = useState<Priority>('Medium');
  const [newDesc, setNewDesc] = useState('');

  // Editing existing task
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const tasks = project.tasks || [];
  const todoTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const progress = calculateProjectProgress(project);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTaskColumn) return;

    onAddTask({
      title: newTitle.trim(),
      description: newDesc.trim(),
      status: newTaskColumn,
      assignee: newAssignee.trim() || project.owner,
      dueDate: newDueDate,
      priority: newPriority,
      tags: []
    });

    // Reset
    setNewTitle('');
    setNewDesc('');
    setNewTaskColumn(null);
  };

  const handleMoveTask = (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;
    onUpdateTask(task.id, { status: newStatus });

    // Check if this move completes all tasks -> trigger confetti!
    if (newStatus === 'Completed') {
      const remainingUnfinished = tasks.filter(t => t.id !== task.id && t.status !== 'Completed').length;
      if (remainingUnfinished === 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await onUploadFile(files[i]);
      }
    } catch (err) {
      alert("Error uploading file: " + err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const getFileIcon = (mime: string, name: string) => {
    if (mime?.includes('pdf') || name?.endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-rose-500" />;
    }
    if (mime?.includes('sheet') || mime?.includes('excel') || name?.endsWith('.xlsx') || name?.endsWith('.xls')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    }
    if (mime?.includes('image') || name?.match(/\.(png|jpe?g|gif|webp|svg)$/i)) {
      return <FileImage className="w-5 h-5 text-purple-500" />;
    }
    return <FileCode className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Top Header of Project Modal */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {project.department || 'Project'}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-md font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {project.status}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {project.startDate} to {project.endDate}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {project.name}
              </h2>
            </div>
            
            {project.client && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Client / Initiative: <span className="font-semibold text-slate-700 dark:text-slate-300">{project.client}</span>
              </p>
            )}
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Overall Progress Pill */}
            <div className="hidden sm:flex flex-col items-end pr-3 border-r border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Progress</span>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{progress}%</span>
                <span className="text-xs text-slate-400">({completedTasks.length}/{tasks.length})</span>
              </div>
            </div>

            {/* Export Project Excel */}
            <button
              onClick={() => exportProjectToExcel(project)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition"
              title="Export this project as Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Excel</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('board')}
            className={`py-3 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'board'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>Kanban Board</span>
            <span className="px-1.5 py-0.2 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
              {tasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`py-3 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'files'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Paperclip className="w-4 h-4" />
            <span>Files & Attachments</span>
            <span className="px-1.5 py-0.2 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
              {project.files?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'notes'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Notes & Strategy</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/70 dark:bg-slate-950/60">
          
          {/* TAB 1: KANBAN BOARD */}
          {activeTab === 'board' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* COLUMN 1: TO DO */}
              <div className="flex flex-col bg-slate-100/80 dark:bg-slate-900/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 min-h-[500px]">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      To Do
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {todoTasks.length}
                    </span>
                  </div>

                  {role !== 'Viewer' && (
                    <button
                      onClick={() => setNewTaskColumn('To Do')}
                      className="p-1 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 transition"
                      title="Add task to To Do"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Tasks List */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {todoTasks.map(task => renderTaskCard(task))}
                  {todoTasks.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      No tasks in To Do
                    </div>
                  )}
                </div>

                {/* Bottom Quick Add Button */}
                {role !== 'Viewer' && (
                  <button
                    onClick={() => setNewTaskColumn('To Do')}
                    className="mt-3 w-full py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                )}
              </div>

              {/* COLUMN 2: IN PROGRESS */}
              <div className="flex flex-col bg-blue-50/40 dark:bg-blue-950/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30 min-h-[500px]">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="font-bold text-sm text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                      In Progress
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      {inProgressTasks.length}
                    </span>
                  </div>

                  {role !== 'Viewer' && (
                    <button
                      onClick={() => setNewTaskColumn('In Progress')}
                      className="p-1 rounded-lg text-blue-600 hover:bg-white dark:hover:bg-slate-800 transition"
                      title="Add task to In Progress"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Tasks List */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {inProgressTasks.map(task => renderTaskCard(task))}
                  {inProgressTasks.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-blue-200 dark:border-blue-900/40 rounded-xl">
                      No tasks in progress
                    </div>
                  )}
                </div>

                {/* Bottom Quick Add Button */}
                {role !== 'Viewer' && (
                  <button
                    onClick={() => setNewTaskColumn('In Progress')}
                    className="mt-3 w-full py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-900 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-xl transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                )}
              </div>

              {/* COLUMN 3: COMPLETED */}
              <div className="flex flex-col bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/30 min-h-[500px]">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-bold text-sm text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                      Completed
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                      {completedTasks.length}
                    </span>
                  </div>

                  {role !== 'Viewer' && (
                    <button
                      onClick={() => setNewTaskColumn('Completed')}
                      className="p-1 rounded-lg text-emerald-600 hover:bg-white dark:hover:bg-slate-800 transition"
                      title="Add task to Completed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Tasks List */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {completedTasks.map(task => renderTaskCard(task))}
                  {completedTasks.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-emerald-200 dark:border-emerald-900/40 rounded-xl">
                      No completed tasks yet
                    </div>
                  )}
                </div>

                {/* Bottom Quick Add Button */}
                {role !== 'Viewer' && (
                  <button
                    onClick={() => setNewTaskColumn('Completed')}
                    className="mt-3 w-full py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border border-emerald-200 dark:border-emerald-800 rounded-xl transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: FILES & ATTACHMENTS */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              {/* Upload Dropzone */}
              {role !== 'Viewer' && (
                <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-2xl p-8 text-center bg-indigo-50/30 dark:bg-indigo-950/20 transition group">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    Upload Core Project Files & Documents
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                    Attach PDFs, Excel spreadsheets (.xlsx, .xls), Word docs (.docx), architectural diagrams, or images. Up to 100MB per file.
                  </p>
                  
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 cursor-pointer transition">
                    <span>{uploading ? 'Uploading...' : 'Browse & Upload Files'}</span>
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileUpload} 
                      disabled={uploading} 
                      className="hidden" 
                    />
                  </label>
                </div>
              )}

              {/* Uploaded Files Grid / Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Attached Files ({project.files?.length || 0})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Files are securely stored and synced with team members
                  </span>
                </div>

                {(!project.files || project.files.length === 0) ? (
                  <div className="p-10 text-center text-slate-400 text-xs">
                    No files attached to this project yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {project.files.map(file => (
                      <div key={file.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                            {getFileIcon(file.mimeType, file.originalName)}
                          </div>
                          <div className="min-w-0">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate block"
                            >
                              {file.originalName}
                            </a>
                            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                              <span>{(file.size / 1024).toFixed(1)} KB</span>
                              <span>•</span>
                              <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            download={file.originalName}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View / Download</span>
                          </a>

                          {role !== 'Viewer' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete file "${file.originalName}"?`)) {
                                  onDeleteFile(file.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                              title="Delete file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: NOTES & STRATEGY */}
          {activeTab === 'notes' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Project Strategy & Execution Notes
                  </h4>
                  <p className="text-xs text-slate-400">
                    Document scope, architecture choices, key decisions and meeting minutes.
                  </p>
                </div>

                {role !== 'Viewer' && (
                  <div>
                    {editingNotes ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            onUpdateProject({ notes: notesContent });
                            setEditingNotes(false);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Notes</span>
                        </button>
                        <button
                          onClick={() => {
                            setNotesContent(project.notes || '');
                            setEditingNotes(false);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingNotes(true)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Notes</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {editingNotes ? (
                <textarea
                  value={notesContent}
                  onChange={(e) => setNotesContent(e.target.value)}
                  rows={14}
                  className="w-full p-4 rounded-xl font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                  placeholder="Type notes, scope, requirements or markdown formatting..."
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-sans bg-slate-50 dark:bg-slate-950/40 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {project.notes ? project.notes : (
                    <span className="text-slate-400 italic">No notes provided for this project yet. Click "Edit Notes" to add project documentation.</span>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* QUICK ADD / EDIT TASK POPUP MODAL */}
      {(newTaskColumn || editingTask) && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingTask ? 'Edit Task' : `Add Task to ${newTaskColumn}`}
              </h3>
              <button
                onClick={() => {
                  setNewTaskColumn(null);
                  setEditingTask(null);
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingTask) {
                  onUpdateTask(editingTask.id, {
                    title: editingTask.title,
                    description: editingTask.description,
                    assignee: editingTask.assignee,
                    dueDate: editingTask.dueDate,
                    priority: editingTask.priority,
                    status: editingTask.status
                  });
                  setEditingTask(null);
                } else {
                  handleCreateTask(e);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingTask ? editingTask.title : newTitle}
                  onChange={(e) => {
                    if (editingTask) setEditingTask({ ...editingTask, title: e.target.value });
                    else setNewTitle(e.target.value);
                  }}
                  placeholder="e.g. Ingest Knowledge Base documents"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Deliverables
                </label>
                <textarea
                  rows={3}
                  value={editingTask ? (editingTask.description || '') : newDesc}
                  onChange={(e) => {
                    if (editingTask) setEditingTask({ ...editingTask, description: e.target.value });
                    else setNewDesc(e.target.value);
                  }}
                  placeholder="Detailed criteria, checklist or link to specs..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assignee
                  </label>
                  <input
                    type="text"
                    value={editingTask ? editingTask.assignee : newAssignee}
                    onChange={(e) => {
                      if (editingTask) setEditingTask({ ...editingTask, assignee: e.target.value });
                      else setNewAssignee(e.target.value);
                    }}
                    placeholder="Assignee name"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingTask ? editingTask.dueDate : newDueDate}
                    onChange={(e) => {
                      if (editingTask) setEditingTask({ ...editingTask, dueDate: e.target.value });
                      else setNewDueDate(e.target.value);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={editingTask ? editingTask.priority : newPriority}
                    onChange={(e) => {
                      const val = e.target.value as Priority;
                      if (editingTask) setEditingTask({ ...editingTask, priority: val });
                      else setNewPriority(val);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                {editingTask && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Status / Column
                    </label>
                    <select
                      value={editingTask.status}
                      onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setNewTaskColumn(null);
                    setEditingTask(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );

  // Helper to render individual task card in kanban
  function renderTaskCard(task: Task) {
    const overdue = isTaskOverdue(task);

    return (
      <div
        key={task.id}
        className={`bg-white dark:bg-slate-900 rounded-xl p-3.5 shadow-xs border transition-all ${
          overdue
            ? 'border-rose-300 dark:border-rose-800/80 ring-1 ring-rose-400/50 bg-rose-50/20'
            : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
        }`}
      >
        {/* Task Header: Priority & Overdue Badge */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                task.priority === 'Critical' || task.priority === 'Urgent'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                  : task.priority === 'High'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {task.priority}
            </span>

            {overdue && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-500 text-white animate-pulse">
                <AlertTriangle className="w-2.5 h-2.5" />
                OVERDUE
              </span>
            )}
          </div>

          {/* Quick Edit/Delete */}
          {role !== 'Viewer' && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setEditingTask(task)}
                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Edit Task"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete task "${task.title}"?`)) {
                    onDeleteTask(task.id);
                  }
                }}
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                title="Delete Task"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Task Title */}
        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug mb-1">
          {task.title}
        </h4>

        {/* Description if present */}
        {task.description && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
            {task.description}
          </p>
        )}

        {/* Meta row: Assignee & Due Date */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1 truncate max-w-[130px]">
            <User className="w-3 h-3 text-slate-400" />
            <span className="truncate font-medium text-slate-700 dark:text-slate-300">{task.assignee}</span>
          </div>

          <div className={`flex items-center space-x-1 font-semibold ${overdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
            <Calendar className="w-3 h-3" />
            <span>{task.dueDate}</span>
          </div>
        </div>

        {/* Column Mover Controls */}
        {role !== 'Viewer' && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Move:</span>
            <div className="flex items-center space-x-1">
              {task.status !== 'To Do' && (
                <button
                  onClick={() => handleMoveTask(task, task.status === 'Completed' ? 'In Progress' : 'To Do')}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-0.5"
                  title="Move backwards"
                >
                  <ArrowLeft className="w-2.5 h-2.5" />
                  <span>{task.status === 'Completed' ? 'In Progress' : 'To Do'}</span>
                </button>
              )}

              {task.status !== 'Completed' && (
                <button
                  onClick={() => handleMoveTask(task, task.status === 'To Do' ? 'In Progress' : 'Completed')}
                  className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center gap-0.5"
                  title="Move forwards"
                >
                  <span>{task.status === 'To Do' ? 'In Progress' : 'Completed'}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
};
