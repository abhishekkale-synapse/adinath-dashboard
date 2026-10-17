import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { ProjectCard } from './components/ProjectCard';
import { ProjectBoardModal } from './components/ProjectBoardModal';
import { ProjectModal } from './components/ProjectModal';
import { GanttView } from './components/GanttView';
import { AnalyticsView } from './components/AnalyticsView';
import { Project, FilterState, UserRole, Task } from './types';
import { api } from './api';
import { exportDashboardToExcel, exportDashboardToPDF, isTaskOverdue } from './utils/exportUtils';
import { Loader2, Plus, Sparkles, AlertCircle, RefreshCw, Layers } from 'lucide-react';

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('adinath_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Role state
  const [role, setRole] = useState<UserRole>('Project Manager');

  // View state
  const [activeView, setActiveView] = useState<'grid' | 'timeline' | 'analytics'>('grid');

  // Filter state
  const currentDate = new Date();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'ALL',
    priority: 'ALL',
    department: 'ALL',
    month: currentDate.getMonth(), // Current month
    year: currentDate.getFullYear(),
    filterByMonth: true,
    onlyOverdue: false
  });

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('adinath_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Load projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProjects();
      setProjects(data);
    } catch (err: any) {
      console.error("Failed to load projects from server:", err);
      setError("Unable to connect to live API server. Make sure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on criteria
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // 1. Month active filter
      if (filters.filterByMonth) {
        const startOfMonth = new Date(filters.year, filters.month, 1).toISOString().split('T')[0];
        const endOfMonth = new Date(filters.year, filters.month + 1, 0).toISOString().split('T')[0];
        const isProjectActiveInMonth = project.startDate <= endOfMonth && project.endDate >= startOfMonth;
        if (!isProjectActiveInMonth) return false;
      }

      // 2. Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesName = project.name.toLowerCase().includes(query);
        const matchesOwner = project.owner.toLowerCase().includes(query);
        const matchesClient = (project.client || '').toLowerCase().includes(query);
        const matchesDepartment = project.department.toLowerCase().includes(query);
        const matchesTask = (project.tasks || []).some(t => 
          t.title.toLowerCase().includes(query) || (t.assignee && t.assignee.toLowerCase().includes(query))
        );
        if (!matchesName && !matchesOwner && !matchesClient && !matchesDepartment && !matchesTask) {
          return false;
        }
      }

      // 3. Status
      if (filters.status !== 'ALL' && project.status !== filters.status) {
        return false;
      }

      // 4. Department
      if (filters.department !== 'ALL' && project.department !== filters.department) {
        return false;
      }

      // 5. Priority
      if (filters.priority !== 'ALL' && project.priority !== filters.priority) {
        return false;
      }

      // 6. Only Overdue
      if (filters.onlyOverdue) {
        const hasOverdue = (project.tasks || []).some(isTaskOverdue);
        if (!hasOverdue) return false;
      }

      return true;
    });
  }, [projects, filters]);

  // Selected project for board
  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return projects.find(p => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  // Project Actions
  const handleCreateProject = async (projectData: Partial<Project>) => {
    try {
      const created = await api.createProject(projectData);
      setProjects([created, ...projects]);
      showToast(`Project "${created.name}" created successfully!`);
    } catch (err: any) {
      alert("Failed to create project: " + err.message);
    }
  };

  const handleUpdateProject = async (projectId: string, projectData: Partial<Project>) => {
    try {
      const updated = await api.updateProject(projectId, projectData);
      setProjects(projects.map(p => p.id === projectId ? updated : p));
      showToast("Project updated successfully!");
    } catch (err: any) {
      alert("Failed to update project: " + err.message);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await api.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      if (selectedProjectId === projectId) setSelectedProjectId(null);
      showToast("Project deleted.");
    } catch (err: any) {
      alert("Failed to delete project: " + err.message);
    }
  };

  // Task Actions
  const handleAddTask = async (taskData: Partial<Task>) => {
    if (!selectedProjectId) return;
    try {
      const newTask = await api.createTask(selectedProjectId, taskData);
      setProjects(projects.map(p => {
        if (p.id === selectedProjectId) {
          return { ...p, tasks: [...(p.tasks || []), newTask] };
        }
        return p;
      }));
      showToast("Task added.");
    } catch (err: any) {
      alert("Failed to add task: " + err.message);
    }
  };

  const handleUpdateTask = async (taskId: string, taskData: Partial<Task>) => {
    if (!selectedProjectId) return;
    try {
      const updated = await api.updateTask(selectedProjectId, taskId, taskData);
      setProjects(projects.map(p => {
        if (p.id === selectedProjectId) {
          return {
            ...p,
            tasks: (p.tasks || []).map(t => t.id === taskId ? updated : t)
          };
        }
        return p;
      }));
    } catch (err: any) {
      alert("Failed to update task: " + err.message);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!selectedProjectId) return;
    try {
      await api.deleteTask(selectedProjectId, taskId);
      setProjects(projects.map(p => {
        if (p.id === selectedProjectId) {
          return {
            ...p,
            tasks: (p.tasks || []).filter(t => t.id !== taskId)
          };
        }
        return p;
      }));
      showToast("Task removed.");
    } catch (err: any) {
      alert("Failed to delete task: " + err.message);
    }
  };

  // File Actions
  const handleUploadFile = async (file: File) => {
    if (!selectedProjectId) return;
    const newFile = await api.uploadFile(selectedProjectId, file);
    setProjects(projects.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          files: [...(p.files || []), newFile]
        };
      }
      return p;
    }));
    showToast(`File "${file.name}" uploaded successfully!`);
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!selectedProjectId) return;
    await api.deleteFile(selectedProjectId, fileId);
    setProjects(projects.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          files: (p.files || []).filter(f => f.id !== fileId)
        };
      }
      return p;
    }));
    showToast("File deleted.");
  };

  // Reset Demo
  const handleResetDemo = async () => {
    if (window.confirm("Reset all projects to original Adinath demo dataset? Any custom projects will be reset.")) {
      try {
        const resetProjects = await api.resetDemoData();
        setProjects(resetProjects);
        showToast("Demo data reloaded.");
      } catch (err: any) {
        alert("Failed to reset: " + err.message);
      }
    }
  };

  // Exports
  const handleExportPDF = () => {
    const monthName = MONTH_NAMES[filters.month];
    exportDashboardToPDF(filteredProjects, monthName, filters.year);
    showToast(`Dashboard exported as PDF for ${monthName} ${filters.year}`);
  };

  const handleExportExcel = () => {
    const monthName = MONTH_NAMES[filters.month];
    exportDashboardToExcel(filteredProjects, monthName, filters.year);
    showToast(`Dashboard exported as Excel for ${monthName} ${filters.year}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-70 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        filters={filters}
        onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
        role={role}
        onRoleChange={setRole}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onNewProject={() => setIsNewProjectOpen(true)}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        onResetDemo={handleResetDemo}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        
        {/* Loading State */}
        {loading && (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-3" />
            <p className="text-sm font-semibold text-slate-500">Loading Adinath Projects Hub...</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchProjects}
              className="px-3 py-1.5 rounded-lg font-bold bg-rose-600 text-white hover:bg-rose-700 transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {!loading && (
          <>
            {/* KPI Summary Cards */}
            <SummaryCards
              projects={filteredProjects}
              monthName={MONTH_NAMES[filters.month]}
              year={filters.year}
              onFilterOverdueToggle={() => setFilters({ ...filters, onlyOverdue: !filters.onlyOverdue })}
              isOverdueFiltered={filters.onlyOverdue}
            />

            {/* View Title & Active Indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeView === 'grid' && 'Core Projects Cards'}
                  {activeView === 'timeline' && 'Timeline & Schedule Roadmap'}
                  {activeView === 'analytics' && 'Executive Analytics & Performance'}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {filteredProjects.length} showing
                </span>
              </div>

              {/* View Switcher for mobile */}
              <div className="flex lg:hidden items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setActiveView('grid')}
                  className={`px-2.5 py-1 rounded-md transition ${activeView === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setActiveView('timeline')}
                  className={`px-2.5 py-1 rounded-md transition ${activeView === 'timeline' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setActiveView('analytics')}
                  className={`px-2.5 py-1 rounded-md transition ${activeView === 'analytics' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Analytics
                </button>
              </div>
            </div>

            {/* TAB 1: GRID CARDS VIEW */}
            {activeView === 'grid' && (
              filteredProjects.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    No Projects Found Matching Filter
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                    {filters.filterByMonth ? `No projects active in ${MONTH_NAMES[filters.month]} ${filters.year}. Try unchecking "Active in month" or change filters.` : 'Try clearing your search query or status filters.'}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {filters.filterByMonth && (
                      <button
                        onClick={() => setFilters({ ...filters, filterByMonth: false })}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                      >
                        Show All Months
                      </button>
                    )}
                    {role !== 'Viewer' && (
                      <button
                        onClick={() => setIsNewProjectOpen(true)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                      >
                        + Create New Project
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProjects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onOpenProject={(p) => setSelectedProjectId(p.id)}
                      onEditProject={(p) => setEditingProject(p)}
                      onDeleteProject={handleDeleteProject}
                      role={role}
                    />
                  ))}
                </div>
              )
            )}

            {/* TAB 2: TIMELINE / GANTT VIEW */}
            {activeView === 'timeline' && (
              <GanttView
                projects={filteredProjects}
                selectedMonth={filters.month}
                selectedYear={filters.year}
                onOpenProject={(p) => setSelectedProjectId(p.id)}
              />
            )}

            {/* TAB 3: ANALYTICS & WORKLOAD VIEW */}
            {activeView === 'analytics' && (
              <AnalyticsView projects={filteredProjects} />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-4 text-center text-xs text-slate-400">
        <p>Adinath Enterprise Core Projects Dashboard • Multi-user synced & persistent</p>
      </footer>

      {/* DEEP PROJECT KANBAN & FILE MANAGEMENT MODAL */}
      {selectedProject && (
        <ProjectBoardModal
          project={selectedProject}
          onClose={() => setSelectedProjectId(null)}
          onUpdateProject={(data) => handleUpdateProject(selectedProject.id, data)}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onUploadFile={handleUploadFile}
          onDeleteFile={handleDeleteFile}
          role={role}
        />
      )}

      {/* CREATE NEW PROJECT MODAL */}
      <ProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onSave={handleCreateProject}
      />

      {/* EDIT PROJECT MODAL */}
      <ProjectModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSave={(data) => {
          if (editingProject) {
            handleUpdateProject(editingProject.id, data);
            setEditingProject(null);
          }
        }}
        project={editingProject}
      />

    </div>
  );
};

export default App;
