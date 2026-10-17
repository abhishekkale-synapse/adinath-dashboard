import React, { useState } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Plus, Download, FileSpreadsheet, 
  FileText, Sun, Moon, Shield, Filter, Search, RotateCcw, CheckSquare
} from 'lucide-react';
import { FilterState, UserRole } from '../types';

interface HeaderProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNewProject: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onResetDemo: () => void;
  activeView: 'grid' | 'timeline' | 'analytics';
  onViewChange: (view: 'grid' | 'timeline' | 'analytics') => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const Header: React.FC<HeaderProps> = ({
  filters,
  onFilterChange,
  role,
  onRoleChange,
  darkMode,
  onToggleDarkMode,
  onNewProject,
  onExportPDF,
  onExportExcel,
  onResetDemo,
  activeView,
  onViewChange
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handlePrevMonth = () => {
    if (filters.month === 0) {
      onFilterChange({ month: 11, year: filters.year - 1 });
    } else {
      onFilterChange({ month: filters.month - 1 });
    }
  };

  const handleNextMonth = () => {
    if (filters.month === 11) {
      onFilterChange({ month: 0, year: filters.year + 1 });
    } else {
      onFilterChange({ month: filters.month + 1 });
    }
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    onFilterChange({ month: now.getMonth(), year: now.getFullYear() });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      {/* Top Branding & Main Controls Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Company Title */}
          <div className="flex items-center space-x-3 min-w-max">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl tracking-wider">
              A
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  ADINATH
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Core Projects Tracking & Governance
              </p>
            </div>
          </div>

          {/* Month Selector in Header */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={handlePrevMonth}
              title="Previous Month"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center px-3 gap-1.5 cursor-pointer">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 min-w-[125px] text-center select-none">
                {MONTH_NAMES[filters.month]} {filters.year}
              </span>
            </div>

            <button
              onClick={handleNextMonth}
              title="Next Month"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleCurrentMonth}
              className="hidden md:inline-flex text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 px-2 py-1 ml-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
            >
              Current
            </button>
          </div>

          {/* Actions & Role Switcher */}
          <div className="flex items-center space-x-2">
            {/* View Switcher */}
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium">
              <button
                onClick={() => onViewChange('grid')}
                className={`px-3 py-1.5 rounded-md transition ${activeView === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                Cards
              </button>
              <button
                onClick={() => onViewChange('timeline')}
                className={`px-3 py-1.5 rounded-md transition ${activeView === 'timeline' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                Timeline
              </button>
              <button
                onClick={() => onViewChange('analytics')}
                className={`px-3 py-1.5 rounded-md transition ${activeView === 'analytics' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                Analytics
              </button>
            </div>

            {/* Role Switcher */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <select
                value={role}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="Project Manager" className="dark:bg-slate-800">PM (Full Edit)</option>
                <option value="Team Member" className="dark:bg-slate-800">Team (Tasks)</option>
                <option value="Viewer" className="dark:bg-slate-800">Viewer (Read Only)</option>
              </select>
            </div>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
                title="Export Options"
              >
                <Download className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {showExportMenu && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2"
                  onClick={() => setShowExportMenu(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Export {MONTH_NAMES[filters.month]} {filters.year}
                  </div>
                  <button
                    onClick={onExportPDF}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 transition"
                  >
                    <FileText className="w-4 h-4 text-rose-500" />
                    <div>
                      <div className="font-semibold">Export as PDF</div>
                      <div className="text-[10px] text-slate-400">Executive printable report</div>
                    </div>
                  </button>
                  <button
                    onClick={onExportExcel}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 transition"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-semibold">Export as Excel</div>
                      <div className="text-[10px] text-slate-400">Multi-sheet .xlsx workbook</div>
                    </div>
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                  <button
                    onClick={onResetDemo}
                    className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-[11px]"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-500" />
                    <span>Reset Sample Projects</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* New Project Button */}
            {role !== 'Viewer' && (
              <button
                onClick={onNewProject}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Project</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="py-2.5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects, owners, tags..."
                value={filters.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Completed">Completed</option>
              <option value="Planning">Planning</option>
              <option value="On Hold">On Hold</option>
            </select>

            {/* Department Filter */}
            <select
              value={filters.department}
              onChange={(e) => onFilterChange({ department: e.target.value })}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Product & Design">Product & Design</option>
              <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
              <option value="Customer Experience">Customer Experience</option>
              <option value="Legal & Security">Legal & Security</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filters.priority}
              onChange={(e) => onFilterChange({ priority: e.target.value })}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Month Scope Toggle & Overdue Toggle */}
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
              <input
                type="checkbox"
                checked={filters.filterByMonth}
                onChange={(e) => onFilterChange({ filterByMonth: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium">Active in {MONTH_NAMES[filters.month]}</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-rose-600 dark:text-rose-400 font-medium">
              <input
                type="checkbox"
                checked={filters.onlyOverdue}
                onChange={(e) => onFilterChange({ onlyOverdue: e.target.checked })}
                className="rounded border-rose-300 text-rose-600 focus:ring-rose-500"
              />
              <span>Only Overdue</span>
            </label>
          </div>
        </div>
      </div>
    </header>
  );
};
