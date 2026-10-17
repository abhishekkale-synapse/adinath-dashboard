import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { defaultProjects } from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Initialize database file if missing
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultProjects, null, 2), 'utf-8');
}

// Create sample placeholder files if they don't exist
const sampleFiles = [
  'Cloud_Architecture_Specification_v2.pdf',
  'Budget_Allocation_Q3_Q4_2026.xlsx',
  'Mobile_Design_Guidelines_v3.pdf',
  'Fleet_Telemetry_Requirements.pdf',
  'Warehouse_Sensor_Inventory.xlsx',
  'Support_KB_Taxonomy.xlsx',
  'ISO_27001_Final_Audit_Report.pdf'
];
sampleFiles.forEach(f => {
  const filePath = path.join(UPLOADS_DIR, f);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `Adinath Enterprise Document: ${f}\nGenerated on ${new Date().toISOString()}\nConfidential and proprietary.`, 'utf-8');
  }
});

// Database Helpers
function readDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading DB file, returning fallback:", err);
    return defaultProjects;
  }
}

function writeDb(data) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error("Error writing DB file:", err);
    throw err;
  }
}

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB limit
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Adinath Projects API', time: new Date().toISOString() });
});

// Get all projects
app.get('/api/projects', (req, res) => {
  const projects = readDb();
  res.json(projects);
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  const projects = readDb();
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// Create new project
app.post('/api/projects', (req, res) => {
  const { name, owner, department, client, priority, status, startDate, endDate, budget, notes } = req.body;
  if (!name || !startDate || !endDate) {
    return res.status(400).json({ error: 'Name, startDate, and endDate are required.' });
  }

  const projects = readDb();
  const newProject = {
    id: 'proj-' + uuidv4().slice(0, 8),
    name: name.trim(),
    owner: (owner && owner.trim()) || 'Adinath Shah',
    ownerAvatar: (owner && owner.trim() ? owner.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AS'),
    department: department || 'General',
    client: client || 'Internal Project',
    priority: priority || 'Medium',
    status: status || 'Planning',
    startDate,
    endDate,
    budget: Number(budget) || 0,
    spent: 0,
    notes: notes || '',
    tasks: [],
    files: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  projects.unshift(newProject);
  writeDb(projects);
  res.status(201).json(newProject);
});

// Update project
app.put('/api/projects/:id', (req, res) => {
  const projects = readDb();
  const idx = projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const current = projects[idx];
  const updated = {
    ...current,
    ...req.body,
    id: current.id, // Preserve id
    tasks: current.tasks, // Preserve tasks
    files: current.files, // Preserve files
    updatedAt: new Date().toISOString()
  };

  if (req.body.owner) {
    updated.ownerAvatar = req.body.owner.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  projects[idx] = updated;
  writeDb(projects);
  res.json(updated);
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  const projects = readDb();
  const filtered = projects.filter(p => p.id !== req.params.id);
  if (filtered.length === projects.length) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // Remove associated files from disk
  const toDelete = projects.find(p => p.id === req.params.id);
  if (toDelete && toDelete.files) {
    toDelete.files.forEach(f => {
      const pth = path.join(UPLOADS_DIR, path.basename(f.url));
      if (fs.existsSync(pth)) {
        try { fs.unlinkSync(pth); } catch (e) { /* ignore */ }
      }
    });
  }

  writeDb(filtered);
  res.json({ success: true, message: 'Project deleted' });
});

// Add Task to project
app.post('/api/projects/:id/tasks', (req, res) => {
  const projects = readDb();
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { title, description, status, assignee, dueDate, priority, tags } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const newTask = {
    id: 'task-' + uuidv4().slice(0, 8),
    projectId: project.id,
    title: title.trim(),
    description: description ? description.trim() : '',
    status: status || 'To Do',
    assignee: (assignee && assignee.trim()) || project.owner || 'Unassigned',
    dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    priority: priority || 'Medium',
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
    createdAt: new Date().toISOString()
  };

  project.tasks.push(newTask);
  project.updatedAt = new Date().toISOString();
  writeDb(projects);

  res.status(201).json(newTask);
});

// Update Task
app.put('/api/projects/:id/tasks/:taskId', (req, res) => {
  const projects = readDb();
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const taskIndex = project.tasks.findIndex(t => t.id === req.params.taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const currentTask = project.tasks[taskIndex];
  const updatedTask = {
    ...currentTask,
    ...req.body,
    id: currentTask.id,
    projectId: currentTask.projectId
  };

  if (req.body.tags && !Array.isArray(req.body.tags)) {
    updatedTask.tags = req.body.tags.split(',').map(t => t.trim());
  }

  project.tasks[taskIndex] = updatedTask;
  project.updatedAt = new Date().toISOString();
  writeDb(projects);

  res.json(updatedTask);
});

// Delete Task
app.delete('/api/projects/:id/tasks/:taskId', (req, res) => {
  const projects = readDb();
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const initialLen = project.tasks.length;
  project.tasks = project.tasks.filter(t => t.id !== req.params.taskId);
  if (project.tasks.length === initialLen) {
    return res.status(404).json({ error: 'Task not found' });
  }

  project.updatedAt = new Date().toISOString();
  writeDb(projects);

  res.json({ success: true, message: 'Task deleted' });
});

// Upload File to project
app.post('/api/projects/:id/files', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const projects = readDb();
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    // cleanup file
    try { fs.unlinkSync(req.file.path); } catch (e) {}
    return res.status(404).json({ error: 'Project not found' });
  }

  const newFile = {
    id: 'file-' + uuidv4().slice(0, 8),
    projectId: project.id,
    name: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimeType: req.file.mimetype,
    uploadedAt: new Date().toISOString(),
    url: `/uploads/${req.file.filename}`
  };

  if (!project.files) project.files = [];
  project.files.push(newFile);
  project.updatedAt = new Date().toISOString();
  writeDb(projects);

  res.status(201).json(newFile);
});

// Delete File from project
app.delete('/api/projects/:id/files/:fileId', (req, res) => {
  const projects = readDb();
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const fileIdx = (project.files || []).findIndex(f => f.id === req.params.fileId);
  if (fileIdx === -1) {
    return res.status(404).json({ error: 'File not found' });
  }

  const [removedFile] = project.files.splice(fileIdx, 1);
  project.updatedAt = new Date().toISOString();
  writeDb(projects);

  // remove physical file
  if (removedFile && removedFile.name) {
    const fPath = path.join(UPLOADS_DIR, removedFile.name);
    if (fs.existsSync(fPath)) {
      try { fs.unlinkSync(fPath); } catch (e) {}
    }
  }

  res.json({ success: true, message: 'File deleted' });
});

// Reset demo data
app.post('/api/reset', (req, res) => {
  writeDb(defaultProjects);
  res.json({ success: true, message: 'Reset to demo projects successfully', projects: defaultProjects });
});

// Serve frontend build if dist exists
const DIST_DIR = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Adinath Projects Backend running on http://localhost:${PORT}`);
  console.log(`📁 Uploads available at http://localhost:${PORT}/uploads`);
});
