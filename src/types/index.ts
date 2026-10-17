export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical' | 'Urgent';

export type ProjectStatus = 'Planning' | 'Active' | 'On Track' | 'At Risk' | 'Completed' | 'On Hold';

export type UserRole = 'Project Manager' | 'Team Member' | 'Viewer';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee: string;
  assigneeAvatar?: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  tags?: string[];
  createdAt?: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  owner: string;
  ownerAvatar?: string;
  department: string;
  client?: string;
  priority: Priority;
  status: ProjectStatus;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  budget?: number;
  spent?: number;
  notes: string;
  tasks: Task[];
  files: ProjectFile[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  search: string;
  status: string;
  priority: string;
  department: string;
  month: number; // 0 - 11
  year: number;
  filterByMonth: boolean;
  onlyOverdue: boolean;
}
