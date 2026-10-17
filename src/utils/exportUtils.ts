import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Project, Task } from '../types';

export const isTaskOverdue = (task: Task): boolean => {
  if (task.status === 'Completed') return false;
  const today = new Date().toISOString().split('T')[0];
  return task.dueDate < today;
};

export const calculateProjectProgress = (project: Project): number => {
  if (!project.tasks || project.tasks.length === 0) {
    return project.status === 'Completed' ? 100 : 0;
  }
  const completed = project.tasks.filter(t => t.status === 'Completed').length;
  return Math.round((completed / project.tasks.length) * 100);
};

// Export Dashboard as Excel
export const exportDashboardToExcel = (projects: Project[], monthName: string, year: number) => {
  const wb = XLSX.utils.book_new();

  // 1. KPI Summary Sheet
  const totalProjects = projects.length;
  const allTasks = projects.flatMap(p => p.tasks || []);
  const completedTasks = allTasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = allTasks.filter(t => t.status === 'In Progress').length;
  const todoTasks = allTasks.filter(t => t.status === 'To Do').length;
  const overdueTasks = allTasks.filter(isTaskOverdue).length;
  const overallProgress = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;

  const summaryData = [
    ["ADINATH ENTERPRISE - CORE PROJECTS EXECUTIVE DASHBOARD"],
    [`Reporting Period: ${monthName} ${year}`],
    [`Generated On: ${new Date().toLocaleString()}`],
    [],
    ["METRIC", "VALUE", "NOTES"],
    ["Total Projects", totalProjects, "Core Active Initiatives"],
    ["Overall Progress", `${overallProgress}%`, "Weighted task completion across initiatives"],
    ["Tasks Completed", completedTasks, "Successfully closed deliverables"],
    ["Tasks In Progress", inProgressTasks, "Currently active work items"],
    ["Tasks To Do", todoTasks, "Scheduled backlog items"],
    ["Overdue Tasks", overdueTasks, "Deliverables requiring immediate attention"],
    ["Total Files Uploaded", projects.reduce((acc, p) => acc + (p.files?.length || 0), 0), "Centralized documentation"]
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 45 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Executive Summary");

  // 2. Projects Master Sheet
  const projectsData = projects.map(p => {
    const pTasks = p.tasks || [];
    const done = pTasks.filter(t => t.status === 'Completed').length;
    const inProg = pTasks.filter(t => t.status === 'In Progress').length;
    const todo = pTasks.filter(t => t.status === 'To Do').length;
    const progress = calculateProjectProgress(p);

    return {
      "Project ID": p.id,
      "Project Name": p.name,
      "Status": p.status,
      "Priority": p.priority,
      "Project Owner": p.owner,
      "Department": p.department,
      "Client": p.client || "Internal",
      "Start Date": p.startDate,
      "End Date": p.endDate,
      "Progress %": `${progress}%`,
      "Done Tasks": done,
      "In Progress Tasks": inProg,
      "To Do Tasks": todo,
      "Total Tasks": pTasks.length,
      "Budget (USD)": p.budget || 0,
      "Files Count": p.files?.length || 0
    };
  });

  const wsProjects = XLSX.utils.json_to_sheet(projectsData);
  wsProjects['!cols'] = [
    { wch: 12 }, { wch: 36 }, { wch: 14 }, { wch: 12 }, { wch: 20 },
    { wch: 22 }, { wch: 25 }, { wch: 14 }, { wch: 14 }, { wch: 12 },
    { wch: 12 }, { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 12 }
  ];
  XLSX.utils.book_append_sheet(wb, wsProjects, "Projects Master");

  // 3. Tasks Breakdown Sheet
  const tasksData = projects.flatMap(p => 
    (p.tasks || []).map(t => ({
      "Project": p.name,
      "Task ID": t.id,
      "Task Title": t.title,
      "Status": t.status,
      "Priority": t.priority,
      "Assignee": t.assignee,
      "Due Date": t.dueDate,
      "Is Overdue?": isTaskOverdue(t) ? "YES (OVERDUE)" : "NO",
      "Tags": (t.tags || []).join(", ")
    }))
  );

  const wsTasks = XLSX.utils.json_to_sheet(tasksData);
  wsTasks['!cols'] = [
    { wch: 32 }, { wch: 12 }, { wch: 38 }, { wch: 14 }, { wch: 12 },
    { wch: 20 }, { wch: 14 }, { wch: 16 }, { wch: 25 }
  ];
  XLSX.utils.book_append_sheet(wb, wsTasks, "Tasks Breakdown");

  // Save workbook
  const filename = `Adinath_Dashboard_${monthName}_${year}.xlsx`.replace(/\s+/g, '_');
  XLSX.writeFile(wb, filename);
};

// Export Single Project as Excel
export const exportProjectToExcel = (project: Project) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Project Info
  const progress = calculateProjectProgress(project);
  const infoData = [
    ["ADINATH ENTERPRISE - PROJECT STATUS REPORT"],
    [`Generated On: ${new Date().toLocaleString()}`],
    [],
    ["FIELD", "VALUE"],
    ["Project ID", project.id],
    ["Project Name", project.name],
    ["Owner", project.owner],
    ["Department", project.department],
    ["Client", project.client || "Internal"],
    ["Status", project.status],
    ["Priority", project.priority],
    ["Start Date", project.startDate],
    ["End Date", project.endDate],
    ["Budget", project.budget ? `$${project.budget.toLocaleString()}` : "$0"],
    ["Overall Progress", `${progress}%`],
    ["Total Tasks", project.tasks?.length || 0],
    ["Total Attachments", project.files?.length || 0],
    [],
    ["PROJECT NOTES & STRATEGY:"],
    [project.notes || "No notes entered."]
  ];

  const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
  wsInfo['!cols'] = [{ wch: 24 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsInfo, "Project Overview");

  // Sheet 2: Tasks
  const tasksData = (project.tasks || []).map(t => ({
    "Task ID": t.id,
    "Title": t.title,
    "Description": t.description || "",
    "Status": t.status,
    "Priority": t.priority,
    "Assignee": t.assignee,
    "Due Date": t.dueDate,
    "Overdue": isTaskOverdue(t) ? "OVERDUE" : "On Track",
    "Tags": (t.tags || []).join(", ")
  }));

  const wsTasks = XLSX.utils.json_to_sheet(tasksData);
  wsTasks['!cols'] = [
    { wch: 12 }, { wch: 35 }, { wch: 45 }, { wch: 14 }, { wch: 12 },
    { wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 25 }
  ];
  XLSX.utils.book_append_sheet(wb, wsTasks, "Kanban Tasks");

  // Sheet 3: Files
  const filesData = (project.files || []).map(f => ({
    "File ID": f.id,
    "File Name": f.originalName,
    "Size (KB)": Math.round(f.size / 1024),
    "File Type": f.mimeType,
    "Uploaded At": f.uploadedAt,
    "Local Path": f.url
  }));

  const wsFiles = XLSX.utils.json_to_sheet(filesData);
  wsFiles['!cols'] = [
    { wch: 12 }, { wch: 38 }, { wch: 12 }, { wch: 25 }, { wch: 24 }, { wch: 35 }
  ];
  XLSX.utils.book_append_sheet(wb, wsFiles, "Files & Attachments");

  const filename = `Adinath_Project_${project.name.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
  XLSX.writeFile(wb, filename);
};

// Export Dashboard as PDF
export const exportDashboardToPDF = (
  projects: Project[],
  monthName: string,
  year: number
) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Brand Header Banner
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, pageWidth, 68, 'F');

  // Accent bar
  doc.setFillColor(99, 102, 241); // Indigo-500
  doc.rect(0, 64, pageWidth, 4, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text("ADINATH ENTERPRISE", 36, 32);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(199, 210, 254);
  doc.text(`Core Projects Executive Summary • ${monthName} ${year}`, 36, 50);

  // Date on right
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth - 36, 42, { align: 'right' });

  // Summary Metrics Computation
  const totalProjects = projects.length;
  const allTasks = projects.flatMap(p => p.tasks || []);
  const completedTasks = allTasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = allTasks.filter(t => t.status === 'In Progress').length;
  const todoTasks = allTasks.filter(t => t.status === 'To Do').length;
  const overdueTasks = allTasks.filter(isTaskOverdue).length;
  const overallProgress = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;

  // KPI Metric Boxes
  const startY = 88;
  const boxWidth = (pageWidth - 72 - 50) / 6;
  const boxHeight = 50;

  const kpis = [
    { label: "Total Projects", val: `${totalProjects}`, color: [79, 70, 229] },
    { label: "Overall Progress", val: `${overallProgress}%`, color: [16, 185, 129] },
    { label: "Tasks Completed", val: `${completedTasks}`, color: [16, 185, 129] },
    { label: "In Progress", val: `${inProgressTasks}`, color: [59, 130, 246] },
    { label: "Tasks To Do", val: `${todoTasks}`, color: [100, 116, 139] },
    { label: "Overdue Alert", val: `${overdueTasks}`, color: overdueTasks > 0 ? [239, 68, 68] : [16, 185, 129] }
  ];

  kpis.forEach((kpi, idx) => {
    const x = 36 + idx * (boxWidth + 10);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, startY, boxWidth, boxHeight, 4, 4, 'FD');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 10, startY + 18);

    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.text(kpi.val, x + 10, startY + 40);
  });

  // Projects Table
  const tableData = projects.map(p => {
    const pTasks = p.tasks || [];
    const done = pTasks.filter(t => t.status === 'Completed').length;
    const inProg = pTasks.filter(t => t.status === 'In Progress').length;
    const todo = pTasks.filter(t => t.status === 'To Do').length;
    const prog = calculateProjectProgress(p);

    return [
      p.name,
      p.owner,
      p.department,
      p.status,
      p.priority,
      `${p.startDate} to ${p.endDate}`,
      `${prog}%`,
      `${done} Done / ${inProg} In Prog / ${todo} To Do`
    ];
  });

  autoTable(doc, {
    startY: startY + boxHeight + 20,
    head: [['Project Name', 'Owner', 'Department', 'Status', 'Priority', 'Timeline', 'Progress', 'Task Breakdown']],
    body: tableData,
    margin: { left: 36, right: 36 },
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 6,
      textColor: [30, 41, 59]
    },
    columnStyles: {
      0: { cellWidth: 160 },
      1: { cellWidth: 90 },
      2: { cellWidth: 95 },
      3: { cellWidth: 70 },
      4: { cellWidth: 60 },
      5: { cellWidth: 110 },
      6: { cellWidth: 55, halign: 'center' },
      7: { cellWidth: 130 }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Adinath Enterprise Project Cloud • Confidential • Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 18,
      { align: 'center' }
    );
  }

  const filename = `Adinath_Dashboard_${monthName}_${year}.pdf`.replace(/\s+/g, '_');
  doc.save(filename);
};
