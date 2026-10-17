import React from 'react';
import { FolderKanban, TrendingUp, CheckCircle2, Clock, ListTodo, AlertTriangle } from 'lucide-react';
import { Project, Task } from '../types';
import { isTaskOverdue } from '../utils/exportUtils';

interface SummaryCardsProps {
  projects: Project[];
  monthName: string;
  year: number;
  onFilterOverdueToggle?: () => void;
  isOverdueFiltered?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  projects,
  monthName,
  year,
  onFilterOverdueToggle,
  isOverdueFiltered
}) => {
  const totalProjects = projects.length;
  const allTasks: Task[] = projects.flatMap(p => p.tasks || []);
  
  const completedTasks = allTasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = allTasks.filter(t => t.status === 'In Progress').length;
  const todoTasks = allTasks.filter(t => t.status === 'To Do').length;
  const overdueTasks = allTasks.filter(isTaskOverdue).length;

  const totalTasks = allTasks.length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* 1. Total Projects */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold tracking-wide">TOTAL PROJECTS</span>
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <FolderKanban className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{totalProjects}</span>
          <span className="text-[11px] text-slate-400 font-medium">initiatives</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">
          Active in {monthName.slice(0, 3)} {year}
        </div>
      </div>

      {/* 2. Overall Progress % */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold tracking-wide">OVERALL PROGRESS</span>
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{overallProgress}%</span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {completedTasks}/{totalTasks} tasks
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* 3. Tasks Completed */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold tracking-wide">COMPLETED</span>
          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{completedTasks}</span>
          <span className="text-[11px] text-teal-600 font-medium">closed</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Ready & verified
        </div>
      </div>

      {/* 4. Tasks In Progress */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold tracking-wide">IN PROGRESS</span>
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{inProgressTasks}</span>
          <span className="text-[11px] text-blue-600 font-medium">active</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Being developed
        </div>
      </div>

      {/* 5. Tasks To Do */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold tracking-wide">TASKS TO DO</span>
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <ListTodo className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{todoTasks}</span>
          <span className="text-[11px] text-slate-400 font-medium">queued</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          In backlog queue
        </div>
      </div>

      {/* 6. Overdue Tasks */}
      <div
        onClick={onFilterOverdueToggle}
        className={`rounded-xl p-4 border shadow-xs hover:shadow-md transition cursor-pointer select-none ${
          overdueTasks > 0
            ? isOverdueFiltered
              ? 'bg-rose-100 dark:bg-rose-950/80 border-rose-400 ring-2 ring-rose-500'
              : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 hover:border-rose-300'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold tracking-wide text-rose-600 dark:text-rose-400">OVERDUE</span>
          <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{overdueTasks}</span>
          <span className="text-[11px] text-rose-500 font-semibold">past due</span>
        </div>
        <div className="mt-2 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
          {overdueTasks > 0 ? (isOverdueFiltered ? 'Filtering overdue ✕' : 'Click to filter →') : 'All on schedule'}
        </div>
      </div>
    </div>
  );
};
