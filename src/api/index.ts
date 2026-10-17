import { Project, Task, ProjectFile } from '../types';

const API_BASE = '/api';

export const api = {
  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProject(id: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    if (!res.ok) throw new Error('Failed to fetch project');
    return res.json();
  },

  async createProject(data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete project');
  },

  async createTask(projectId: string, data: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTask(projectId: string, taskId: string, data: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  async deleteTask(projectId: string, taskId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete task');
  },

  async uploadFile(projectId: string, file: File): Promise<ProjectFile> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/projects/${projectId}/files`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload file');
    return res.json();
  },

  async deleteFile(projectId: string, fileId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/files/${fileId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete file');
  },

  async resetDemoData(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset demo data');
    const data = await res.json();
    return data.projects;
  }
};
