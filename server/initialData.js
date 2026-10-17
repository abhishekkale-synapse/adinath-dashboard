export const defaultProjects = [
  {
    id: "proj-1",
    name: "Enterprise ERP Cloud Migration",
    owner: "Adinath Shah",
    ownerAvatar: "AS",
    department: "Information Technology",
    client: "Adinath Global Operations",
    priority: "Critical",
    status: "Active",
    startDate: "2026-09-01",
    endDate: "2026-11-30",
    budget: 280000,
    spent: 165000,
    notes: `### Scope & Objectives
Migrate core ERP infrastructure from on-premise legacy servers to secure AWS Cloud architecture. 
- Ensure zero downtime during database transition.
- Integrate real-time SAP data connectors.
- Implement role-based encryption for payroll and procurement modules.

### Key Milestones
- [x] Cloud VPC & Security Gateway setup
- [/] Legacy Database Schema translation & validation
- [ ] User Acceptance Testing across supply chain branches
- [ ] Final cutover & executive sign-off`,
    tasks: [
      {
        id: "task-101",
        projectId: "proj-1",
        title: "Setup AWS VPC, Subnets & IAM Roles",
        description: "Configure multi-zone VPC peering with dedicated private subnets and security policies.",
        status: "Completed",
        assignee: "Adinath Shah",
        dueDate: "2026-09-15",
        priority: "High",
        tags: ["Cloud", "DevOps", "Security"],
        createdAt: "2026-09-01T08:00:00.000Z"
      },
      {
        id: "task-102",
        projectId: "proj-1",
        title: "Migrate Master Data & Financial Tables",
        description: "Execute automated ETL scripts to migrate 10 years of ledger transactions into Aurora PostgreSQL.",
        status: "Completed",
        assignee: "Priya Sharma",
        dueDate: "2026-10-05",
        priority: "Critical",
        tags: ["Database", "Finance"],
        createdAt: "2026-09-05T09:30:00.000Z"
      },
      {
        id: "task-103",
        projectId: "proj-1",
        title: "API Gateway Integration with Supplier Portal",
        description: "Connect external logistics endpoints with rate limiting and OAuth2 token auth.",
        status: "In Progress",
        assignee: "Vikram Malhotra",
        dueDate: "2026-10-24",
        priority: "High",
        tags: ["API", "Integration"],
        createdAt: "2026-09-12T11:00:00.000Z"
      },
      {
        id: "task-104",
        projectId: "proj-1",
        title: "Security Penetration Testing & Compliance Audit",
        description: "Contract external red team to test API gateways and data access boundaries.",
        status: "In Progress",
        assignee: "Ananya Iyer",
        dueDate: "2026-10-14", // intentionally overdue to demonstrate highlighting!
        priority: "Critical",
        tags: ["Security", "Compliance", "Audit"],
        createdAt: "2026-09-20T14:15:00.000Z"
      },
      {
        id: "task-105",
        projectId: "proj-1",
        title: "Staff Training & Operations Handover",
        description: "Host workshops for 40 regional operations managers on the new web interface.",
        status: "To Do",
        assignee: "Rohan Verma",
        dueDate: "2026-11-15",
        priority: "Medium",
        tags: ["Training", "Operations"],
        createdAt: "2026-10-01T10:00:00.000Z"
      },
      {
        id: "task-106",
        projectId: "proj-1",
        title: "Disaster Recovery Drill & Failover Validation",
        description: "Simulate primary zone outage and verify automated failover within 90 seconds.",
        status: "To Do",
        assignee: "Adinath Shah",
        dueDate: "2026-11-20",
        priority: "High",
        tags: ["DevOps", "DR"],
        createdAt: "2026-10-02T16:00:00.000Z"
      }
    ],
    files: [
      {
        id: "file-101",
        projectId: "proj-1",
        name: "Cloud_Architecture_Specification_v2.pdf",
        originalName: "Cloud_Architecture_Specification_v2.pdf",
        size: 1420500,
        mimeType: "application/pdf",
        uploadedAt: "2026-09-10T14:20:00.000Z",
        url: "/uploads/Cloud_Architecture_Specification_v2.pdf"
      },
      {
        id: "file-102",
        projectId: "proj-1",
        name: "Budget_Allocation_Q3_Q4_2026.xlsx",
        originalName: "Budget_Allocation_Q3_Q4_2026.xlsx",
        size: 285400,
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        uploadedAt: "2026-09-15T09:40:00.000Z",
        url: "/uploads/Budget_Allocation_Q3_Q4_2026.xlsx"
      }
    ],
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-10-15T12:00:00.000Z"
  },
  {
    id: "proj-2",
    name: "Adinath Mobile App 3.0 Revamp",
    owner: "Priya Sharma",
    ownerAvatar: "PS",
    department: "Product & Design",
    client: "Adinath Consumer Platform",
    priority: "High",
    status: "Active",
    startDate: "2026-09-15",
    endDate: "2026-12-15",
    budget: 190000,
    spent: 110000,
    notes: `### Mobile App v3.0 Redesign
Redesigning the cross-platform consumer app using modern React Native and a new design system.
Key focus on checkout speed, biometric login, and push notification personalization.`,
    tasks: [
      {
        id: "task-201",
        projectId: "proj-2",
        title: "Figma UX Flow & Design System Token Sync",
        description: "Standardize colors, dark theme styles, and accessible typography across iOS & Android.",
        status: "Completed",
        assignee: "Siddharth Roy",
        dueDate: "2026-09-28",
        priority: "High",
        tags: ["Design", "UI/UX"],
        createdAt: "2026-09-15T10:00:00.000Z"
      },
      {
        id: "task-202",
        projectId: "proj-2",
        title: "Biometric Auth & Token Keychain Storage",
        description: "Implement FaceID and Fingerprint authentication with encrypted secure storage.",
        status: "Completed",
        assignee: "Priya Sharma",
        dueDate: "2026-10-08",
        priority: "High",
        tags: ["Mobile", "Security"],
        createdAt: "2026-09-20T11:00:00.000Z"
      },
      {
        id: "task-203",
        projectId: "proj-2",
        title: "Cart & Checkout 1-Tap Payment Integration",
        description: "Integrate Apple Pay, Google Pay, and UPI seamless payment intents.",
        status: "In Progress",
        assignee: "Rahul Mehta",
        dueDate: "2026-10-22",
        priority: "Critical",
        tags: ["Payments", "Mobile"],
        createdAt: "2026-09-25T13:00:00.000Z"
      },
      {
        id: "task-204",
        projectId: "proj-2",
        title: "Offline Sync Engine for Order Tracking",
        description: "Cache orders in SQLite on device and sync when network recovers.",
        status: "To Do",
        assignee: "Priya Sharma",
        dueDate: "2026-11-05",
        priority: "Medium",
        tags: ["Offline", "Architecture"],
        createdAt: "2026-10-01T09:00:00.000Z"
      },
      {
        id: "task-205",
        projectId: "proj-2",
        title: "App Store & Play Store Compliance Review",
        description: "Prepare screenshots, localized release notes, privacy policy links.",
        status: "To Do",
        assignee: "Siddharth Roy",
        dueDate: "2026-11-28",
        priority: "Medium",
        tags: ["Release", "Store"],
        createdAt: "2026-10-05T15:00:00.000Z"
      }
    ],
    files: [
      {
        id: "file-201",
        projectId: "proj-2",
        name: "Mobile_Design_Guidelines_v3.pdf",
        originalName: "Mobile_Design_Guidelines_v3.pdf",
        size: 3200000,
        mimeType: "application/pdf",
        uploadedAt: "2026-09-22T10:15:00.000Z",
        url: "/uploads/Mobile_Design_Guidelines_v3.pdf"
      }
    ],
    createdAt: "2026-09-15T09:00:00.000Z",
    updatedAt: "2026-10-16T14:30:00.000Z"
  },
  {
    id: "proj-3",
    name: "Supply Chain & Logistics Optimization",
    owner: "Kavita Rao",
    ownerAvatar: "KR",
    department: "Supply Chain & Logistics",
    client: "Adinath Industrial Distribution",
    priority: "High",
    status: "At Risk",
    startDate: "2026-08-15",
    endDate: "2026-11-15",
    budget: 350000,
    spent: 290000,
    notes: `### Supply Chain Real-Time Telemetry
Integrating IoT GPS trackers on 120 freight vehicles and automated warehouse sorting sensors.
Currently flagged as 'At Risk' due to hardware vendor shipping delays in Pune and Bangalore hubs.`,
    tasks: [
      {
        id: "task-301",
        projectId: "proj-3",
        title: "Fleet GPS Gateway Firmware Flashing",
        description: "Flash standardized MQTT firmware across initial batch of 50 vehicles.",
        status: "Completed",
        assignee: "Kavita Rao",
        dueDate: "2026-09-10",
        priority: "High",
        tags: ["IoT", "Hardware"],
        createdAt: "2026-08-20T10:00:00.000Z"
      },
      {
        id: "task-302",
        projectId: "proj-3",
        title: "Warehouse Inventory Barcode Scanners Rollout",
        description: "Deploy Zebra Android mobile terminals in central distribution centers.",
        status: "Completed",
        assignee: "Arun Nair",
        dueDate: "2026-09-30",
        priority: "Medium",
        tags: ["Warehouse", "Hardware"],
        createdAt: "2026-08-25T11:00:00.000Z"
      },
      {
        id: "task-303",
        projectId: "proj-3",
        title: "Vendor Hardware SLA Resolution Meeting",
        description: "Escalate delayed delivery of 70 micro-controllers with the primary vendor.",
        status: "In Progress",
        assignee: "Kavita Rao",
        dueDate: "2026-10-12", // intentionally overdue
        priority: "Critical",
        tags: ["Vendor", "Risk"],
        createdAt: "2026-09-28T09:00:00.000Z"
      },
      {
        id: "task-304",
        projectId: "proj-3",
        title: "Predictive Fuel Consumption Algorithm",
        description: "Build Python model estimating fuel cost variations across highway corridors.",
        status: "To Do",
        assignee: "Arun Nair",
        dueDate: "2026-10-30",
        priority: "Medium",
        tags: ["Analytics", "AI"],
        createdAt: "2026-10-02T14:00:00.000Z"
      }
    ],
    files: [
      {
        id: "file-301",
        projectId: "proj-3",
        name: "Fleet_Telemetry_Requirements.pdf",
        originalName: "Fleet_Telemetry_Requirements.pdf",
        size: 980000,
        mimeType: "application/pdf",
        uploadedAt: "2026-08-22T08:30:00.000Z",
        url: "/uploads/Fleet_Telemetry_Requirements.pdf"
      },
      {
        id: "file-302",
        projectId: "proj-3",
        name: "Warehouse_Sensor_Inventory.xlsx",
        originalName: "Warehouse_Sensor_Inventory.xlsx",
        size: 412000,
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        uploadedAt: "2026-09-02T16:15:00.000Z",
        url: "/uploads/Warehouse_Sensor_Inventory.xlsx"
      }
    ],
    createdAt: "2026-08-15T09:00:00.000Z",
    updatedAt: "2026-10-14T11:20:00.000Z"
  },
  {
    id: "proj-4",
    name: "Customer Self-Service & AI Support Agent",
    owner: "Vikram Malhotra",
    ownerAvatar: "VM",
    department: "Customer Experience",
    client: "Adinath Services",
    priority: "Medium",
    status: "On Track",
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    budget: 140000,
    spent: 45000,
    notes: `### AI Helpdesk Implementation
Deploying LLM-powered virtual assistant to resolve 60% of Tier-1 support tickets automatically with knowledge base retrieval.`,
    tasks: [
      {
        id: "task-401",
        projectId: "proj-4",
        title: "Ingest Knowledge Base & PDF manuals into Vector Store",
        description: "Chunk and index 450 customer guides and warranty procedures.",
        status: "Completed",
        assignee: "Vikram Malhotra",
        dueDate: "2026-10-10",
        priority: "High",
        tags: ["AI", "RAG"],
        createdAt: "2026-10-01T10:00:00.000Z"
      },
      {
        id: "task-402",
        projectId: "proj-4",
        title: "Build Agentic Escalation Workflow to Live Support",
        description: "Seamless handover to human agents when sentiment score drops below threshold.",
        status: "In Progress",
        assignee: "Sneha Patel",
        dueDate: "2026-10-26",
        priority: "High",
        tags: ["Workflow", "Support"],
        createdAt: "2026-10-04T11:00:00.000Z"
      },
      {
        id: "task-403",
        projectId: "proj-4",
        title: "A/B Testing on Landing Page Widget",
        description: "Measure engagement conversion rate between floating bubble and sidebar drawer.",
        status: "To Do",
        assignee: "Sneha Patel",
        dueDate: "2026-11-12",
        priority: "Medium",
        tags: ["Analytics", "Frontend"],
        createdAt: "2026-10-08T15:00:00.000Z"
      }
    ],
    files: [
      {
        id: "file-401",
        projectId: "proj-4",
        name: "Support_KB_Taxonomy.xlsx",
        originalName: "Support_KB_Taxonomy.xlsx",
        size: 195000,
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        uploadedAt: "2026-10-02T13:40:00.000Z",
        url: "/uploads/Support_KB_Taxonomy.xlsx"
      }
    ],
    createdAt: "2026-10-01T08:30:00.000Z",
    updatedAt: "2026-10-16T16:00:00.000Z"
  },
  {
    id: "proj-5",
    name: "Information Security & ISO 27001 Certification",
    owner: "Ananya Iyer",
    ownerAvatar: "AI",
    department: "Legal & Security",
    client: "Adinath Board of Directors",
    priority: "Critical",
    status: "Completed",
    startDate: "2026-06-01",
    endDate: "2026-10-15",
    budget: 175000,
    spent: 172000,
    notes: `### ISO 27001:2022 Certification
Successfully passed Stage 1 and Stage 2 certification audits with zero major non-conformities.
All corporate assets, cloud servers, and employee access devices are now verified under compliance framework.`,
    tasks: [
      {
        id: "task-501",
        projectId: "proj-5",
        title: "Information Security Policy Document Sign-off",
        description: "Draft, review and achieve executive sign-off on 18 policy charters.",
        status: "Completed",
        assignee: "Ananya Iyer",
        dueDate: "2026-07-20",
        priority: "High",
        tags: ["Governance", "Policy"],
        createdAt: "2026-06-05T09:00:00.000Z"
      },
      {
        id: "task-502",
        projectId: "proj-5",
        title: "Quarterly Vulnerability Scanning & Patch Remediation",
        description: "Zero high/critical CVEs remaining across all production IP subnets.",
        status: "Completed",
        assignee: "Adinath Shah",
        dueDate: "2026-08-30",
        priority: "Critical",
        tags: ["SecOps", "Audit"],
        createdAt: "2026-07-01T10:00:00.000Z"
      },
      {
        id: "task-503",
        projectId: "proj-5",
        title: "External Stage 2 Audit & Certification Award",
        description: "Complete formal audit defense with British Standards Institution (BSI).",
        status: "Completed",
        assignee: "Ananya Iyer",
        dueDate: "2026-10-10",
        priority: "Critical",
        tags: ["Audit", "Milestone"],
        createdAt: "2026-09-01T14:00:00.000Z"
      }
    ],
    files: [
      {
        id: "file-501",
        projectId: "proj-5",
        name: "ISO_27001_Final_Audit_Report.pdf",
        originalName: "ISO_27001_Final_Audit_Report.pdf",
        size: 2150000,
        mimeType: "application/pdf",
        uploadedAt: "2026-10-12T17:00:00.000Z",
        url: "/uploads/ISO_27001_Final_Audit_Report.pdf"
      }
    ],
    createdAt: "2026-06-01T09:00:00.000Z",
    updatedAt: "2026-10-15T18:00:00.000Z"
  }
];
