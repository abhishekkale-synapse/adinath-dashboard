# Adinath Enterprise — Core Projects Tracking Dashboard

A modern, high-performance, industry-standard project tracking web application built for enterprise project governance, task execution, document management, and executive reporting.

---

## 🌟 Key Highlights & Features

### 1. Main Dashboard
- **Interactive Month Selector**: Browse any month and year with `< Prev`, `Next >`, and quick reset to "Current Month".
- **Dynamic Month Filter**: Toggle between projects active during the selected month vs. all-time projects.
- **Real-Time Summary KPI Cards**:
  - **Total Projects**: Count of initiatives active in the period.
  - **Overall Progress %**: Weighted task completion with animated progress pill.
  - **Tasks Completed**: Closed and verified deliverables count.
  - **Tasks In Progress**: Actively developed work items.
  - **Tasks To Do**: Backlog items awaiting sprint pickup.
  - **Overdue Tasks Warning**: Highlighted alert badge with 1-click filter.
- **Multi-View System**:
  - **Cards View**: Rich project cards displaying name, owner with avatar, status badge, priority badge, department, client, progress bar, task counts, and quick actions.
  - **Gantt Timeline View**: Visual horizontal roadmap showing initiative delivery spans and completion markers.
  - **Executive Analytics View**: Donut breakdown, department project distribution, priority hierarchy, team member workload SLA table, and budget vs. actual spend.

### 2. Deep Project Workspace (Kanban & Governance)
- **3-Column Kanban Board**:
  - Columns: **To Do**, **In Progress**, **Completed**.
  - 1-click forward/backward movement controls.
  - Celebratory confetti celebration when the final deliverable is completed.
- **Overdue Task Highlighting**: Tasks whose due date has passed are highlighted in high-visibility red badges with overdue warnings.
- **Document & File Center**:
  - Multi-file drag-and-drop or file picker.
  - Supports documents, PDFs, Excel sheets (`.xlsx`, `.xls`), Word documents (`.docx`), architecture diagrams, images, and archives up to 100MB per file.
  - Instant in-browser view, download, or file removal.
- **Project Notes & Strategy**:
  - In-place rich notes and markdown documentation for milestones and meeting minutes.

### 3. Executive Export & Data Persistence
- **Export Dashboard to PDF**:
  - Formatted PDF report with Adinath header, KPI summary boxes, structured project status table, and timeline metadata.
- **Export Dashboard to Excel**:
  - Multi-worksheet workbook (`.xlsx`): Executive Summary, Projects Master Inventory, and All Tasks SLA Breakdown.
- **Export Single Project to Excel**:
  - Standalone project workbook with project specs, Kanban tasks, and file attachment log.
- **Shared Live Backend**:
  - Backed by an Express REST API with atomic JSON storage and Multer file upload handling.
  - All team members accessing the link see the same live, synchronized project data.

### 4. Design & Polish
- **Dark Mode & Light Mode**: Silky smooth color transitions with preference persisted in localStorage.
- **Role Switcher**:
  - **Project Manager**: Full edit permissions (create/edit/delete projects, manage tasks, upload/delete files).
  - **Team Member**: Task status and deliverable updates.
  - **Viewer**: Read-only executive dashboard inspection.
- **Brand Palette**: Polished corporate palette tailored for **Adinath Enterprise** with sapphire blue, emerald green, and slate.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Starting the Application
From the project directory `d:\Adinath_Dashbord`:

```bash
# Start the production server (serves both frontend UI and API on port 5000)
npm start
```

Open your browser and navigate to:
```
http://localhost:5000
```

### Development Mode (with Live Hot-Reload)
To develop with live hot-reloading:

```bash
npm run dev
```
- Vite Client: `http://localhost:3000`
- API Backend: `http://localhost:5000`

---

## 🌐 Sharing Across the Team / Publishing

### Sharing on Local Office Network
Since the server listens on `0.0.0.0:5000`, any team member on your local office network or Wi-Fi can view and edit the dashboard by visiting:
```
http://<YOUR_COMPUTER_IP>:5000
```
*(To find your IP on Windows, run `ipconfig` in Command Prompt or PowerShell).*

### Deploying to the Cloud (Link Sharing)
You can deploy this application directly to:
1. **Render / Railway / Fly.io / Heroku**:
   - Push to GitHub and connect repository.
   - Build command: `npm run build`
   - Start command: `npm start`
2. **Docker**:
   - The included `package.json` and production build serve statically from `dist/` and `uploads/`.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/projects` | Fetch all projects with tasks & attachments |
| `GET` | `/api/projects/:id` | Fetch single project |
| `POST` | `/api/projects` | Create a new project |
| `PUT` | `/api/projects/:id` | Update project metadata |
| `DELETE` | `/api/projects/:id` | Delete project and associated uploads |
| `POST` | `/api/projects/:id/tasks` | Add task to project |
| `PUT` | `/api/projects/:id/tasks/:taskId` | Update task or move status column |
| `DELETE` | `/api/projects/:id/tasks/:taskId` | Delete task |
| `POST` | `/api/projects/:id/files` | Upload file attachment (multipart/form-data) |
| `DELETE` | `/api/projects/:id/files/:fileId` | Delete file attachment |
| `POST` | `/api/reset` | Reset demo data to default sample initiatives |
