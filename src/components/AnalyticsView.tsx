import React from 'react';
import { 
  BarChart3, PieChart, Users, DollarSign, CheckCircle2, 
  Clock, AlertTriangle, ShieldCheck, Briefcase 
} from 'lucide-react';
import { Project, Task } from '../types';
import { isTaskOverdue, calculateProjectProgress } from '../utils/exportUtils';

interface AnalyticsViewProps {
  projects: Project[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ projects }) => {
  const allTasks: Task[] = projects.flatMap(p => p.tasks || []);
  const completedTasks = allTasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = allTasks.filter(t => t.status === 'In Progress').length;
  const todoTasks = allTasks.filter(t => t.status === 'To Do').length;
  const overdueTasks = allTasks.filter(isTaskOverdue).length;
  const totalTasks = allTasks.length;

  // Department counts
  const departmentCounts: Record<string, number> = {};
  projects.forEach(p => {
    const dept = p.department || 'Other';
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });

  // Priority counts
  const priorityCounts: Record<string, number> = {
    'Critical': 0,
    'High': 0,
    'Medium': 0,
    'Low': 0
  };
  projects.forEach(p => {
    if (priorityCounts[p.priority] !== undefined) {
      priorityCounts[p.priority]++;
    }
  });

  // Team Workload
  const teamWorkload: Record<string, { total: number; done: number; inProgress: number; overdue: number }> = {};
  allTasks.forEach(t => {
    const person = t.assignee || 'Unassigned';
    if (!teamWorkload[person]) {
      teamWorkload[person] = { total: 0, done: 0, inProgress: 0, overdue: 0 };
    }
    teamWorkload[person].total++;
    if (t.status === 'Completed') teamWorkload[person].done++;
    if (t.status === 'In Progress') teamWorkload[person].inProgress++;
    if (isTaskOverdue(t)) teamWorkload[person].overdue++;
  });

  // Budget calculations
  const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);
  const budgetUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Portfolio Budget</span>
            <DollarSign className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            ${totalBudget.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Allocated across {projects.length} core initiatives
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Disbursed / Spent</span>
            <Briefcase className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            ${totalSpent.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            {budgetUtilization}% overall burn rate
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Task Completion Rate</span>
            <CheckCircle2 className="w-5 h-5 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {completedTasks} completed out of {totalTasks} deliverables
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Risk & SLA Health</span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {overdueTasks} Overdue
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {overdueTasks === 0 ? 'All initiatives on schedule' : 'Requires operational intervention'}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <span>Projects by Department</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(departmentCounts).map(([dept, count]) => {
              const pct = Math.round((count / (projects.length || 1)) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{dept}</span>
                    <span className="font-bold text-slate-500 dark:text-slate-400">{count} initiatives ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-500" />
            <span>Priority Hierarchy</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
              <span className="text-[10px] font-bold text-rose-600 uppercase">Critical</span>
              <div className="text-2xl font-black text-rose-700 dark:text-rose-300">{priorityCounts['Critical'] || 0}</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
              <span className="text-[10px] font-bold text-amber-600 uppercase">High Priority</span>
              <div className="text-2xl font-black text-amber-700 dark:text-amber-300">{priorityCounts['High'] || 0}</div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Medium</span>
              <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300">{priorityCounts['Medium'] || 0}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Low</span>
              <div className="text-2xl font-black text-slate-700 dark:text-slate-300">{priorityCounts['Low'] || 0}</div>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Critical priority items receive 24/7 executive monitoring and expedited budget approvals.
          </p>
        </div>

      </div>

      {/* Team Workload & Allocation Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500" />
          <span>Team Workload & SLA Performance</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Team Member</th>
                <th className="pb-3">Assigned Tasks</th>
                <th className="pb-3">In Progress</th>
                <th className="pb-3">Completed</th>
                <th className="pb-3">Overdue</th>
                <th className="pb-3">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {Object.entries(teamWorkload).map(([name, stats]) => {
                const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
                return (
                  <tr key={name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-bold text-[10px]">
                        {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <span>{name}</span>
                    </td>
                    <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">{stats.total}</td>
                    <td className="py-3 text-blue-600 font-semibold">{stats.inProgress}</td>
                    <td className="py-3 text-emerald-600 font-semibold">{stats.done}</td>
                    <td className="py-3">
                      {stats.overdue > 0 ? (
                        <span className="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                          {stats.overdue} Overdue
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <span>{completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
