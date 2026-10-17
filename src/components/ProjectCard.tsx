import React from 'react';
import { 
  Calendar, CheckCircle2, Clock, ListTodo, MoreVertical, 
  Paperclip, FileSpreadsheet, ExternalLink, AlertCircle, Edit2, Trash2
} from 'lucide-react';
import { Project, UserRole } from '../types';
import { calculateProjectProgress, isTaskOverdue, exportProjectToExcel } from '../utils/exportUtils';

interface ProjectCardProps {
  project: Project;
  onOpenProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  role: UserRole;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenProject,
  onEditProject,
  onDeleteProject,
  role
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const tasks = project.tasks || [];
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const todoCount = tasks.filter(t => t.status === 'To Do').length;
  const overdueCount = tasks.filter(isTaskOverdue).length;
  const progress = calculateProjectProgress(project);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'On Track':
      case 'Active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'At Risk':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse';
      case 'On Hold':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200';
      case 'High':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200';
      case 'Medium':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-lg hover:border-indigo-200 dark:hover:border-slate-700 transition-all flex flex-col justify-between group">
      <div>
        {/* Top Header: Department, Priority, Status & Menu */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md border ${getStatusBadge(project.status)}`}>
              {project.status}
            </span>
            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${getPriorityBadge(project.priority)}`}>
              {project.priority}
            </span>
            {project.department && (
              <span className="px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md">
                {project.department}
              </span>
            )}
          </div>

          {/* More options menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-30 text-xs"
                onClick={() => setShowMenu(false)}
              >
                <button
                  onClick={() => onOpenProject(project)}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Open Kanban Board</span>
                </button>
                <button
                  onClick={() => exportProjectToExcel(project)}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Export to Excel</span>
                </button>
                {role === 'Project Manager' && (
                  <>
                    <button
                      onClick={() => onEditProject(project)}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Edit Details</span>
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
                          onDeleteProject(project.id);
                        }
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Project</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Project Title & Client */}
        <h3 
          onClick={() => onOpenProject(project)}
          className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer line-clamp-1 mb-1"
        >
          {project.name}
        </h3>
        {project.client && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-3">
            Client: <span className="font-medium text-slate-700 dark:text-slate-300">{project.client}</span>
          </p>
        )}

        {/* Owner & Date range */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 my-3 py-2 border-y border-slate-100 dark:border-slate-800">
          {/* Owner with avatar */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
              {project.ownerAvatar || project.owner.slice(0, 2).toUpperCase()}
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {project.owner}
            </span>
          </div>

          {/* Dates */}
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{project.startDate} → {project.endDate}</span>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Progress</span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                progress === 100 
                  ? 'bg-emerald-500' 
                  : progress >= 50 
                    ? 'bg-indigo-600' 
                    : 'bg-amber-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Task Counts Summary Pills */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-2 text-center text-xs">
          <div className="bg-teal-50/60 dark:bg-teal-950/30 p-2 rounded-lg border border-teal-100 dark:border-teal-900/40">
            <div className="text-[10px] text-teal-600 dark:text-teal-400 font-bold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>DONE</span>
            </div>
            <div className="text-base font-extrabold text-teal-700 dark:text-teal-300 mt-0.5">
              {completedCount}
            </div>
          </div>

          <div className="bg-blue-50/60 dark:bg-blue-950/30 p-2 rounded-lg border border-blue-100 dark:border-blue-900/40">
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              <span>IN PROG</span>
            </div>
            <div className="text-base font-extrabold text-blue-700 dark:text-blue-300 mt-0.5">
              {inProgressCount}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center gap-1">
              <ListTodo className="w-3 h-3" />
              <span>TO DO</span>
            </div>
            <div className="text-base font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
              {todoCount}
            </div>
          </div>
        </div>

        {/* Overdue Alert banner if any */}
        {overdueCount > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{overdueCount} {overdueCount === 1 ? 'task is overdue!' : 'tasks are overdue!'}</span>
          </div>
        )}
      </div>

      {/* Footer: Files badge & Open Board Button */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
          <Paperclip className="w-3.5 h-3.5" />
          <span>{project.files?.length || 0} files</span>
        </div>

        <button
          onClick={() => onOpenProject(project)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 dark:bg-indigo-950/60 dark:hover:bg-indigo-600 dark:text-indigo-300 transition-colors"
        >
          <span>Open Board</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
