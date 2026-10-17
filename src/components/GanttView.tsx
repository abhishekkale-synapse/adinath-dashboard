import React from 'react';
import { Calendar, ChevronRight, User } from 'lucide-react';
import { Project } from '../types';
import { calculateProjectProgress } from '../utils/exportUtils';

interface GanttViewProps {
  projects: Project[];
  selectedMonth: number;
  selectedYear: number;
  onOpenProject: (project: Project) => void;
}

export const GanttView: React.FC<GanttViewProps> = ({
  projects,
  selectedMonth,
  selectedYear,
  onOpenProject
}) => {
  // Days in month calculation
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getPositionPercent = (dateStr: string) => {
    const d = new Date(dateStr);
    const startOfMonth = new Date(selectedYear, selectedMonth, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

    if (d < startOfMonth) return 0;
    if (d > endOfMonth) return 100;

    const day = d.getDate();
    return Math.round(((day - 1) / daysInMonth) * 100);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs overflow-x-auto">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Gantt Schedule & Roadmap
          </h3>
          <p className="text-xs text-slate-400">
            Horizontal timeline distribution of project spans and milestone delivery dates.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Completed</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-600 dark:text-slate-400">Active</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-400">At Risk</span>
          </div>
        </div>
      </div>

      <div className="min-w-[800px]">
        {/* Timeline Header (Days ruler) */}
        <div className="grid grid-cols-12 gap-1 mb-3 text-center text-[10px] font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="col-span-4 text-left pl-2">Project / Owner</div>
          <div className="col-span-8 flex justify-between px-2">
            <span>Day 1</span>
            <span>Day 7</span>
            <span>Day 14</span>
            <span>Day 21</span>
            <span>Day {daysInMonth}</span>
          </div>
        </div>

        {/* Projects Timeline Rows */}
        <div className="space-y-4">
          {projects.map(p => {
            const startPct = getPositionPercent(p.startDate);
            const endPct = getPositionPercent(p.endDate);
            const widthPct = Math.max(endPct - startPct, 8);
            const progress = calculateProjectProgress(p);

            return (
              <div
                key={p.id}
                onClick={() => onOpenProject(p)}
                className="grid grid-cols-12 gap-1 items-center p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition group"
              >
                {/* Project Info */}
                <div className="col-span-4 pr-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">
                      {p.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{p.owner}</span>
                    <span>•</span>
                    <span>{p.startDate.slice(5)} to {p.endDate.slice(5)}</span>
                    <span>•</span>
                    <span className="font-bold text-indigo-600">{progress}%</span>
                  </div>
                </div>

                {/* Timeline Bar Track */}
                <div className="col-span-8 relative h-7 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center">
                  {/* Subtle Grid Dividers */}
                  <div className="absolute inset-0 grid grid-cols-4 pointer-events-none divide-x divide-slate-200/60 dark:divide-slate-700/60" />

                  {/* Gantt Bar */}
                  <div
                    className={`absolute h-5 rounded-md px-2 flex items-center justify-between text-[10px] font-bold text-white shadow-xs transition-all ${
                      p.status === 'Completed'
                        ? 'bg-emerald-600'
                        : p.status === 'At Risk'
                          ? 'bg-rose-500'
                          : 'bg-indigo-600'
                    }`}
                    style={{
                      left: `${startPct}%`,
                      width: `${Math.min(widthPct, 100 - startPct)}%`
                    }}
                  >
                    <span className="truncate">{progress}%</span>
                    <span className="truncate hidden sm:inline text-[9px] opacity-90">{p.status}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {projects.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              No projects active in this timeline view.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
