import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini client (Lazy initialization to prevent crashes if key is missing)
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI features will fallback to high-quality template responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Durable local storage for the prototype dashboard data
const DATA_FILE = path.join(process.cwd(), "data_store.json");

interface DataStore {
  leads: any[];
  bookings: any[];
  proposals: any[];
  invoices: any[];
  contracts: any[];
  tasks: any[];
  tickets: any[];
  chats: any[];
  blogPosts: any[];
  onboardings: any[];
}

const defaultStore: DataStore = {
  leads: [
    { id: "lead-1", name: "Sarah Jenkins", email: "sarah@apexventures.com", phone: "+1 (555) 234-5678", company: "Apex Ventures", value: 18500, service: "SaaS Development", status: "Closed Won", date: "2026-06-25", notes: "Interested in a custom CRM prototype." },
    { id: "lead-2", name: "Michael Chen", email: "m.chen@novaretail.io", phone: "+1 (555) 987-6543", company: "Nova Retail Group", value: 12000, service: "E-commerce Development", status: "Contacted", date: "2026-06-26", notes: "Wants a headless Shopify storefront with high-speed optimization." },
    { id: "lead-3", name: "Elena Rostova", email: "e.rostova@luxuryhomes.com", phone: "+44 20 7946 0958", company: "Rostov Real Estate", value: 25000, service: "Corporate Website Development", status: "Qualified", date: "2026-06-27", notes: "Premium Webflow/React website with interactive 3D virtual tour module." }
  ],
  bookings: [
    { id: "book-1", clientName: "Sarah Jenkins", email: "sarah@apexventures.com", date: "2026-07-02", time: "10:00 AM", service: "Discovery Call", notes: "Discuss custom database requirements.", platform: "Google Meet", joinUrl: "https://meet.google.com/abc-defg-hij" },
    { id: "book-2", clientName: "Michael Chen", email: "m.chen@novaretail.io", date: "2026-07-03", time: "2:30 PM", service: "Project Kickoff", notes: "Review design briefs.", platform: "Zoom", joinUrl: "https://zoom.us/j/9876543210" }
  ],
  proposals: [
    { id: "prop-101", title: "Apex Ventures Custom SaaS Portal", clientName: "Apex Ventures", amount: 18500, status: "Sent", date: "2026-06-25", content: "Executive Summary:\nPaul Digital Labs is pleased to submit this proposal for Apex Ventures' custom client portal. This platform will serve as an integrated workflow engine with custom databases, state-of-the-art visual dashboards, and Gemini-based analytics modules.\n\nDeliverables:\n1. Mobile-Responsive React App with TypeScript\n2. Scalable Express Backend with Secure JWT Roles\n3. Interactive Dashboard Charts for Investment Analytics\n4. Cloud Deployment & Maintenance Schedule\n\nTimeline:\n6 Weeks from signed agreement.\n\nInvestment:\n$18,500 USD (50% upfront, 50% on deployment)." }
  ],
  invoices: [
    { id: "INV-2026-001", clientName: "Apex Ventures", amount: 9250, status: "Paid", date: "2026-06-25", dueDate: "2026-07-05", description: "SaaS Portal - Initial Deposit (50%)", paymentMethod: "Stripe" },
    { id: "INV-2026-002", clientName: "Nova Retail Group", amount: 12000, status: "Sent", date: "2026-06-26", dueDate: "2026-07-10", description: "Headless E-commerce Storefront - Full Fee", paymentMethod: "Pending" }
  ],
  contracts: [
    { id: "CTR-901", title: "Apex Ventures Professional Services Agreement", clientName: "Apex Ventures", status: "Signed", date: "2026-06-25", signature: "Sarah Jenkins", signedAt: "2026-06-25 14:32", content: "This Professional Services Agreement is entered into by and between Paul Digital Labs and Apex Ventures.\n\n1. SCOPE OF WORK\nPaul Digital Labs shall build a SaaS Portal with advanced dashboard widgets, role security, and localized state caching.\n\n2. INDEMNITY & WARRANTY\nAll software is provided with a 12-month post-launch speed and stability warranty.\n\n3. DIGITAL SIGNATURE\nBy typing your name in the field, you authorize the dynamic lock execution of this binding contract." }
  ],
  tasks: [
    { id: "task-1", title: "Create custom schema blueprint", assignee: "Senior Software Architect", priority: "High", status: "Completed", dueDate: "2026-06-28", project: "Apex Portal" },
    { id: "task-2", title: "Integrate Gemini API into Chatbot route", assignee: "Senior Full-Stack Engineer", priority: "High", status: "In Progress", dueDate: "2026-06-29", project: "PDL AI Assistant" },
    { id: "task-3", title: "Design Apple-Level Portfolio Layout", assignee: "UI/UX Designer", priority: "Medium", status: "Completed", dueDate: "2026-06-27", project: "Paul Digital Labs Website" },
    { id: "task-4", title: "Draft high-contrast branding assets", assignee: "Branding Expert", priority: "Low", status: "In Progress", dueDate: "2026-07-02", project: "Nova Retail" }
  ],
  tickets: [
    { id: "tkt-1", subject: "Dashboard loading latency on iOS", clientName: "Apex Ventures", priority: "Medium", status: "Open", date: "2026-06-26" },
    { id: "tkt-2", subject: "Stripe webhook failed on subscription callback", clientName: "Nova Retail Group", priority: "High", status: "Resolved", date: "2026-06-27" }
  ],
  chats: [],
  blogPosts: [
    {
      id: "post-1",
      title: "The Shift to React 19 & Vite in Enterprise Development",
      category: "Engineering",
      excerpt: "Why the classic Webpack setup is officially dead, and how React 19's direct compiler integration is saving enterprises thousands in dev ops costs.",
      content: "Webpack represented an important historical chapter, but in 2026, Vite's native ES module bundling represents the only viable baseline. Learn how we optimized loading speeds to 0.4 seconds...\n\nReact 19 compiles your code statically, eliminating standard dependency loops and improving load safety in high-density corporate interfaces. In this deep dive, we walk through migration strategies for existing Webpack pipelines and how you can save up to 40% on memory usage across complex dashboards.",
      date: "June 25, 2026",
      readTime: "5 min read",
      author: "Alex Vance",
      tags: ["React 19", "Vite", "Web Performance"],
      status: "Published"
    },
    {
      id: "post-2",
      title: "Unlocking 142% Checkout Conversions on Headless Storefronts",
      category: "E-commerce",
      excerpt: "A data-driven breakdown of how minor layout improvements, instant search bars, and localized state handling affect premium e-commerce pipelines.",
      content: "Conversion is not an accident; it is the mathematical consequence of visual density, speed, and trust indicators. In this guide, we analyze the checkout flows of top brands...\n\nBy leveraging React Context, local caches, and seamless Stripe/Flutterwave payment gateways, we eliminate checkout lag. Minimizing inputs and implementing micro-interactions leads directly to an increase in transaction success rates. We explore the complete checkout visual hierarchy designed by our elite branding experts.",
      date: "June 26, 2026",
      readTime: "7 min read",
      author: "Paul",
      tags: ["E-commerce", "Stripe", "Conversion Optimization"],
      status: "Published"
    },
    {
      id: "post-3",
      title: "Deploying Custom AI Chatbots in Highly Regulated Markets",
      category: "AI Automation",
      excerpt: "How to safely leverage the @google/genai SDK to deploy customer desks while complying with strict HIPAA and GDPR security rules.",
      content: "AI chatbots are revolutionary, but direct client-side integration exposes key secrets. By isolating calls inside an Express backend proxy and implementing robust data cleansing, enterprise clients safely query model completions...\n\nPaul Digital Labs implements strict schema validation on incoming queries to prevent prompt injection. We discuss encrypting chat transcripts and how our offline fallback layers prevent support tickets from escalating during peak traffic windows.",
      date: "June 27, 2026",
      readTime: "6 min read",
      author: "Alex Vance",
      tags: ["AI Automation", "Gemini", "GDPR Security"],
      status: "Published"
    }
  ],
  onboardings: [
    {
      id: "onb-1",
      clientId: "lead-1",
      clientName: "Sarah Jenkins",
      clientEmail: "sarah@apexventures.com",
      companyName: "Apex Ventures",
      projectName: "Apex Ventures Custom SaaS Portal",
      status: "In Progress",
      startedAt: "2026-06-25",
      pointOfContact: {
        name: "Sarah Croft",
        role: "Strategic Account Director",
        email: "sarah.c@pauldigitallabs.com",
        bio: "Sarah Croft has 8+ years of experience onboardings enterprise leaders, ensuring high-end digital automation runs smoothly.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
      },
      welcomeEmailSent: true,
      welcomeEmailContent: `Subject: Welcome to Paul Digital Labs - Apex Ventures SaaS Portal Kickoff!

Dear Sarah,

We are absolutely thrilled to partner with Apex Ventures on your Custom SaaS Portal. 

Over the next few weeks, our elite engineering team will build your custom dashboards, real-time charts, and secure data storage systems. 

As your Strategic Account Director, I will be your primary point of contact. You can schedule meetings, view project progress, and sign service agreements right here in your Partner Workspace.

Best regards,
Sarah Croft
Strategic Account Director
Paul Digital Labs`,
      checklist: [
        { id: "chk-1", title: "Verify business registration and details", description: "Complete legal validation of client business documents.", completed: true, completedAt: "2026-06-25 10:00" },
        { id: "chk-2", title: "Deploy client portal credentials", description: "Initialize custom workspace and database storage allocations.", completed: true, completedAt: "2026-06-25 11:30" },
        { id: "chk-3", title: "Contract review and digital signature", description: "Review and sign the Apex Ventures SOW.", completed: true, completedAt: "2026-06-25 14:32" },
        { id: "chk-4", title: "Initialize project space & code repo", description: "Setup high-contrast React 19 / Vite repository.", completed: false },
        { id: "chk-5", title: "Schedule kickoff workshop session", description: "Set milestones, review visual briefs, and assign developer sprints.", completed: false }
      ],
      contractId: "CTR-901"
    }
  ]
};

// Safe helper to load data from JSON
function loadData(): DataStore {
  try {
    let storeData: DataStore;
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      storeData = { ...defaultStore, ...JSON.parse(content) };
    } else {
      storeData = { ...defaultStore };
    }

    // High-resiliency data normalization for Onboarding items
    if (storeData.onboardings) {
      storeData.onboardings = storeData.onboardings.map((onb: any) => {
        const poc = onb.poc || onb.pointOfContact || {};
        const avatar = poc.avatar || poc.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200";
        const image = poc.image || poc.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200";
        
        const welcomeEmail = onb.welcomeEmail || {
          sent: onb.welcomeEmailSent || false,
          subject: onb.welcomeEmailContent && onb.welcomeEmailContent.includes("Subject:") 
            ? onb.welcomeEmailContent.split("\n")[0].replace("Subject: ", "") 
            : "Welcome to Paul Digital Labs!",
          body: onb.welcomeEmailContent && onb.welcomeEmailContent.includes("Subject:")
            ? onb.welcomeEmailContent.split("\n").slice(1).join("\n").trim()
            : onb.welcomeEmailContent || "We are absolutely thrilled to partner with you on this project."
        };

        return {
          ...onb,
          poc: { ...poc, avatar, image },
          pointOfContact: { ...poc, avatar, image },
          welcomeEmailSent: welcomeEmail.sent,
          welcomeEmailContent: onb.welcomeEmailContent || `Subject: ${welcomeEmail.subject}\n\n${welcomeEmail.body}`,
          welcomeEmail
        };
      });
    }

    return storeData;
  } catch (err) {
    console.error("Error reading data store file:", err);
  }
  return { ...defaultStore };
}

// Safe helper to save data to JSON
function saveData(data: DataStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing data store file:", err);
  }
}

// Initialize store file if missing
if (!fs.existsSync(DATA_FILE)) {
  saveData(defaultStore);
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// Basic Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", agency: "Paul Digital Labs", timestamp: new Date().toISOString() });
});

// GET all dashboard data
app.get("/api/store", (req, res) => {
  res.json(loadData());
});

// POST new lead
app.post("/api/leads", (req, res) => {
  const store = loadData();
  const newLead = {
    id: `lead-${Date.now()}`,
    name: req.body.name || "Anonymous Lead",
    email: req.body.email || "",
    phone: req.body.phone || "",
    company: req.body.company || "Self",
    value: Number(req.body.value) || 5000,
    service: req.body.service || "General Inquiry",
    status: "New",
    date: new Date().toISOString().split("T")[0],
    notes: req.body.notes || ""
  };
  store.leads.unshift(newLead);
  saveData(store);
  res.status(201).json({ success: true, data: newLead });
});

// POST new booking
app.post("/api/bookings", (req, res) => {
  const store = loadData();
  const date = req.body.date || new Date().toISOString().split("T")[0];
  const time = req.body.time || "11:00 AM";
  const newBooking = {
    id: `book-${Date.now()}`,
    clientName: req.body.clientName || "Prospect Client",
    email: req.body.email || "",
    date,
    time,
    service: req.body.service || "Strategic Consulting",
    notes: req.body.notes || "No notes provided.",
    platform: "Google Meet",
    joinUrl: `https://meet.google.com/pdl-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}`
  };
  store.bookings.unshift(newBooking);
  
  // Also add as a CRM lead automatically for workflow sync
  const newLead = {
    id: `lead-${Date.now()}`,
    name: req.body.clientName,
    email: req.body.email,
    phone: "",
    company: "Prospect Company",
    value: 7500,
    service: req.body.service,
    status: "Contacted",
    date: new Date().toISOString().split("T")[0],
    notes: `Scheduled meeting on ${date} at ${time}. Notes: ${req.body.notes || ""}`
  };
  store.leads.unshift(newLead);

  saveData(store);
  res.status(201).json({ success: true, data: newBooking });
});

// POST proposal generation
app.post("/api/proposals", (req, res) => {
  const store = loadData();
  const newProp = {
    id: `prop-${Date.now()}`,
    title: req.body.title || "Custom Digital Proposal",
    clientName: req.body.clientName || "Valued Client",
    amount: Number(req.body.amount) || 10000,
    status: "Draft",
    date: new Date().toISOString().split("T")[0],
    content: req.body.content || "Draft Proposal"
  };
  store.proposals.unshift(newProp);
  saveData(store);
  res.status(201).json({ success: true, data: newProp });
});

// POST invoice generation
app.post("/api/invoices", (req, res) => {
  const store = loadData();
  const newInvoice = {
    id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    clientName: req.body.clientName || "Valued Client",
    amount: Number(req.body.amount) || 5000,
    status: "Sent",
    date: new Date().toISOString().split("T")[0],
    dueDate: req.body.dueDate || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    description: req.body.description || "Digital Development Services",
    paymentMethod: "Pending"
  };
  store.invoices.unshift(newInvoice);
  saveData(store);
  res.status(201).json({ success: true, data: newInvoice });
});

// POST Paystack payment initialization
app.post("/api/paystack/initialize", async (req, res) => {
  const store = loadData();
  const { invoiceId, email } = req.body;

  if (!invoiceId) {
    return res.status(400).json({ success: false, error: "Missing invoiceId" });
  }

  const invoice = store.invoices.find((inv) => inv.id === invoiceId);
  if (!invoice) {
    return res.status(404).json({ success: false, error: "Invoice not found" });
  }

  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  const payEmail = email || "paulchukenterprise@gmail.com";

  if (paystackSecret && paystackSecret.trim() !== "") {
    try {
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: payEmail,
          amount: Math.round(invoice.amount * 100), // convert to kobo / cents
          reference: `ref-${Date.now()}-${invoice.id}`,
          metadata: {
            invoiceId: invoice.id
          }
        })
      });
      const data = await response.json();
      if (data && data.status && data.data) {
        return res.json({
          success: true,
          data: {
            authorization_url: data.data.authorization_url,
            access_code: data.data.access_code,
            reference: data.data.reference
          }
        });
      } else {
        return res.status(400).json({ success: false, error: "Paystack initialization failed: " + (data.message || "Unknown error") });
      }
    } catch (err: any) {
      console.error("Paystack initialize error:", err);
      return res.status(500).json({ success: false, error: "Error contacting Paystack API: " + err.message });
    }
  } else {
    // Sandbox / Simulation fallback
    const simulatedRef = `sim-${Date.now()}-${invoice.id}`;
    return res.json({
      success: true,
      simulated: true,
      data: {
        authorization_url: "#simulation",
        access_code: "sim_access_code",
        reference: simulatedRef
      }
    });
  }
});

// POST Paystack payment verification
app.post("/api/paystack/verify", async (req, res) => {
  const store = loadData();
  const { reference, invoiceId } = req.body;

  if (!invoiceId) {
    return res.status(400).json({ success: false, error: "Missing invoiceId" });
  }

  const invoice = store.invoices.find((inv) => inv.id === invoiceId);
  if (!invoice) {
    return res.status(404).json({ success: false, error: "Invoice not found" });
  }

  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

  if (paystackSecret && paystackSecret.trim() !== "") {
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (data && data.status && data.data && data.data.status === "success") {
        invoice.status = "Paid";
        invoice.paymentMethod = "Paystack";
        saveData(store);
        return res.json({ success: true, verified: true, data: invoice });
      } else {
        return res.status(400).json({ success: false, error: "Paystack verification failed: " + (data.message || "Unknown error") });
      }
    } catch (err: any) {
      console.error("Paystack API call error:", err);
      return res.status(500).json({ success: false, error: "Error contacting Paystack API: " + err.message });
    }
  } else {
    // Sandbox Simulation Mode if PAYSTACK_SECRET_KEY is not defined yet
    console.warn("PAYSTACK_SECRET_KEY not set. Falling back to sandbox/simulation payment.");
    invoice.status = "Paid";
    invoice.paymentMethod = "Paystack (Simulation)";
    saveData(store);
    return res.json({
      success: true,
      verified: true,
      simulated: true,
      message: "Simulation mode active: PAYSTACK_SECRET_KEY missing. Invoice successfully marked as Paid.",
      data: invoice
    });
  }
});

// POST sign contract
app.post("/api/contracts/sign", (req, res) => {
  const store = loadData();
  const { contractId, signature } = req.body;
  const contract = store.contracts.find((c) => c.id === contractId);
  if (contract) {
    contract.status = "Signed";
    contract.signature = signature;
    contract.signedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
    saveData(store);
    return res.json({ success: true, data: contract });
  }
  
  // Create default if not found
  const newContract = {
    id: contractId || `CTR-${Date.now()}`,
    title: req.body.title || "Service Agreement",
    clientName: req.body.clientName || "Client LLC",
    status: "Signed",
    date: new Date().toISOString().split("T")[0],
    signature: signature || "E-Signed",
    signedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    content: req.body.content || "This is a digital master service contract."
  };
  store.contracts.unshift(newContract);
  saveData(store);
  res.json({ success: true, data: newContract });
});

// PUT / POST support tickets
app.post("/api/tickets", (req, res) => {
  const store = loadData();
  const newTicket = {
    id: `tkt-${Math.floor(100 + Math.random() * 900)}`,
    subject: req.body.subject || "UI Bug Report",
    clientName: req.body.clientName || "Apex Ventures",
    priority: req.body.priority || "Medium",
    status: "Open",
    date: new Date().toISOString().split("T")[0]
  };
  store.tickets.unshift(newTicket);
  saveData(store);
  res.status(201).json({ success: true, data: newTicket });
});

// POST employee tasks
app.post("/api/tasks", (req, res) => {
  const store = loadData();
  const newTask = {
    id: `task-${Date.now()}`,
    title: req.body.title || "Review Client Specs",
    assignee: req.body.assignee || "Senior Full-Stack Engineer",
    priority: req.body.priority || "Medium",
    status: "In Progress",
    dueDate: req.body.dueDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    project: req.body.project || "Paul Digital Labs Launch"
  };
  store.tasks.unshift(newTask);
  saveData(store);
  res.status(201).json({ success: true, data: newTask });
});

// Update Task Status
app.post("/api/tasks/update-status", (req, res) => {
  const store = loadData();
  const { taskId, status } = req.body;
  const task = store.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = status;
    saveData(store);
    return res.json({ success: true, data: task });
  }
  res.status(404).json({ success: false, error: "Task not found" });
});


// -------------------------------------------------------------
// SECURE BACKEND CONTROLLERS
// -------------------------------------------------------------


// -------------------------------------------------------------
// BLOG CMS ENDPOINTS
// -------------------------------------------------------------

// GET all blog posts (published and draft)
app.get("/api/blog", (req, res) => {
  const store = loadData();
  res.json(store.blogPosts || []);
});

// POST save / create a blog post draft
app.post("/api/blog", (req, res) => {
  const store = loadData();
  const { title, category, excerpt, content, tags, status, author } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  const newPost = {
    id: `post-${Date.now()}`,
    title,
    category: category || "Uncategorized",
    excerpt: excerpt || content.substring(0, 160) + "...",
    content,
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    readTime: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`,
    author: author || "CEO Paul",
    tags: Array.isArray(tags) ? tags : [tags || "Growth"],
    status: status || "Draft"
  };

  if (!store.blogPosts) store.blogPosts = [];
  store.blogPosts.unshift(newPost);
  saveData(store);
  res.status(201).json({ success: true, data: newPost });
});

// POST edit / update a blog post
app.post("/api/blog/update", (req, res) => {
  const store = loadData();
  const { id, title, category, excerpt, content, tags, status, author } = req.body;
  if (!id) return res.status(400).json({ error: "Post ID is required." });

  if (!store.blogPosts) store.blogPosts = [];
  const postIndex = store.blogPosts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ error: "Blog post not found." });
  }

  const original = store.blogPosts[postIndex];
  const updatedPost = {
    ...original,
    title: title !== undefined ? title : original.title,
    category: category !== undefined ? category : original.category,
    excerpt: excerpt !== undefined ? excerpt : (content ? content.substring(0, 160) + "..." : original.excerpt),
    content: content !== undefined ? content : original.content,
    tags: tags !== undefined ? (Array.isArray(tags) ? tags : [tags]) : original.tags,
    status: status !== undefined ? status : original.status,
    author: author !== undefined ? author : original.author,
    readTime: content ? `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read` : original.readTime
  };

  store.blogPosts[postIndex] = updatedPost;
  saveData(store);
  res.json({ success: true, data: updatedPost });
});

// DELETE a blog post
app.delete("/api/blog/:id", (req, res) => {
  const store = loadData();
  const { id } = req.params;
  if (!store.blogPosts) store.blogPosts = [];
  store.blogPosts = store.blogPosts.filter(p => p.id !== id);
  saveData(store);
  res.json({ success: true });
});


// -------------------------------------------------------------
// CLIENT ONBOARDING ENDPOINTS
// -------------------------------------------------------------

// GET all onboarding workflows
app.get("/api/onboardings", (req, res) => {
  const store = loadData();
  res.json(store.onboardings || []);
});

// POST trigger new onboarding workflow for a client (integrates CRM + Project Management)
app.post("/api/onboardings", (req, res) => {
  const store = loadData();
  const { clientId, clientName, clientEmail, companyName, projectName, serviceType, budget } = req.body;

  if (!clientName || !clientEmail) {
    return res.status(400).json({ error: "Client Name and Email are required." });
  }

  const id = `onb-${Date.now()}`;
  
  // Assign designated POC randomly or dynamically
  const pocs = [
    {
      name: "Sarah Croft",
      role: "Strategic Account Director",
      email: "sarah.c@pauldigitallabs.com",
      bio: "Sarah Croft has 8+ years of experience onboardings enterprise leaders, ensuring high-end digital automation runs smoothly.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Alex Vance",
      role: "Lead Software Architect",
      email: "alex.v@pauldigitallabs.com",
      bio: "Alex Vance oversees enterprise server architectures, security hardening, and real-time dashboard state structures.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    }
  ];
  const assignedPoc = pocs[Math.floor(Math.random() * pocs.length)];

  // Automatically create a Contract draft for review!
  const contractId = `CTR-${Math.floor(100 + Math.random() * 900)}`;
  const service = serviceType || "Premium Digital Suite";
  const newContract = {
    id: contractId,
    title: `${companyName || clientName} Master Services Agreement`,
    clientName: clientName,
    status: "Draft",
    date: new Date().toISOString().split("T")[0],
    content: `This Master Services Agreement ("Agreement") is executed on this day by and between Paul Digital Labs and ${companyName || clientName} ("Client").

1. SCOPE OF SERVICES
Paul Digital Labs shall architect, design, and deploy a bespoke high-performance ${service}.

2. FINANCIAL ARRANGEMENT
The client agrees to invest the sum of $${budget || "15,000"} USD, structured with an initial deposit and subsequent development milestones.

3. ACCEPTANCE & SIGNATURE
By digitally executing this agreement in the Partner Workspace, both parties agree to the bound scopes, response latencies, and service standards.`
  };
  store.contracts.unshift(newContract);

  // Automatically integrate with CRM Lead Status
  if (clientId) {
    const lead = store.leads.find((l: any) => l.id === clientId);
    if (lead) {
      lead.status = "Closed Won";
      lead.notes += `\n[System] Onboarding initiated on ${new Date().toLocaleDateString()}.`;
    }
  }

  // Automatically create Onboarding-related project tasks inside the project management module!
  const projectTitle = projectName || `${companyName || clientName} Launch`;
  const initialTasks = [
    {
      id: `task-${Date.now()}-1`,
      title: `Review design requirements with ${clientName}`,
      assignee: "UI/UX Designer",
      priority: "High",
      status: "In Progress",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      project: projectTitle
    },
    {
      id: `task-${Date.now()}-2`,
      title: `Setup high-speed Vite sandbox environment`,
      assignee: "Senior Full-Stack Engineer",
      priority: "Medium",
      status: "Pending",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      project: projectTitle
    }
  ];
  store.tasks.unshift(...initialTasks);

  // Draft automated welcome email copy
  const welcomeEmailContent = `Subject: Welcome to Paul Digital Labs - ${projectTitle} Kickoff!

Dear ${clientName},

We are absolutely thrilled to partner with ${companyName || "your company"} on the ${projectTitle} project.

Our elite team is already preparing your design canvases and backend database scaffolding. As your designated point of contact, I am committed to delivering an exceptional, Apple-level experience.

Please sign in to your Partner Workspace to:
1. Complete our initial Business Setup Checklist.
2. Review and digitally execute your Master Services Agreement.
3. Access active developer tickets and schedule kickoff workshops.

Sincerely,
${assignedPoc.name}
${assignedPoc.role}
Paul Digital Labs`;

  const newOnboarding = {
    id,
    clientId: clientId || `client-${Date.now()}`,
    clientName,
    clientEmail,
    companyName: companyName || "Self-Employed",
    projectName: projectTitle,
    status: "In Progress",
    startedAt: new Date().toISOString().split("T")[0],
    pointOfContact: assignedPoc,
    welcomeEmailSent: false,
    welcomeEmailContent,
    checklist: [
      { id: "chk-onb-1", title: "Complete business briefing and asset share", description: "Provide vectors, fonts, and core branding guidelines.", completed: false },
      { id: "chk-onb-2", title: "Review and sign Master Service Agreement", description: "Read through terms and sign contract CTR-Agreement.", completed: false },
      { id: "chk-onb-3", title: "Secure first deposit milestone payment", description: "Settle first phase engineering invoicing.", completed: false },
      { id: "chk-onb-4", title: "Initialize Slack communication channel", description: "Sync client teams with our senior developers.", completed: false },
      { id: "chk-onb-5", title: "Schedule kickoff workshop calendar entry", description: "Lock down first interactive UI architecture meeting.", completed: false }
    ],
    contractId
  };

  if (!store.onboardings) store.onboardings = [];
  store.onboardings.unshift(newOnboarding);
  saveData(store);
  res.status(201).json({ success: true, data: newOnboarding });
});

// POST toggle onboarding checklist item
app.post("/api/onboardings/checklist/toggle", (req, res) => {
  const store = loadData();
  const { onboardingId, itemId } = req.body;

  if (!store.onboardings) store.onboardings = [];
  const onboarding = store.onboardings.find((o: any) => o.id === onboardingId);
  if (!onboarding) return res.status(404).json({ error: "Onboarding not found." });

  const item = onboarding.checklist.find((i: any) => i.id === itemId);
  if (item) {
    item.completed = !item.completed;
    item.completedAt = item.completed ? new Date().toISOString().replace("T", " ").substring(0, 16) : undefined;
    
    // Automatically trigger task or state completions if needed
    if (itemId === "chk-onb-2" && item.completed) {
      // If signed checklist completed, let's also sign the contract if it isn't signed
      const contract = store.contracts.find((c: any) => c.id === onboarding.contractId);
      if (contract && contract.status !== "Signed") {
        contract.status = "Signed";
        contract.signature = onboarding.clientName;
        contract.signedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
      }
    }

    saveData(store);
    return res.json({ success: true, data: onboarding });
  }

  res.status(404).json({ error: "Checklist item not found." });
});

// POST send automated welcome email (simulation)
app.post("/api/onboardings/email/send", (req, res) => {
  const store = loadData();
  const { onboardingId } = req.body;

  if (!store.onboardings) store.onboardings = [];
  const onboarding = store.onboardings.find((o: any) => o.id === onboardingId);
  if (onboarding) {
    onboarding.welcomeEmailSent = true;
    saveData(store);
    return res.json({ success: true, data: onboarding });
  }
  res.status(404).json({ error: "Onboarding campaign not found." });
});


// -------------------------------------------------------------
// AI GEMINI SERVICES (Server-Side Proxy)
// -------------------------------------------------------------

// 1. AI Intelligent Chatbot trained on agency services
app.post("/api/ai/chat", async (req, res) => {
  const { message, chatHistory } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const systemPrompt = `You are "PDL-Assistant", an elite, sophisticated, and highly persuasive AI Growth & Engineering Assistant for "Paul Digital Labs" (tagline: "Building Brands. Growing Businesses. Powered by AI."). 
Your CEO is Paul. The agency provides absolute world-class services: Corporate Web Development, E-commerce storefronts, SaaS, UI/UX Design, custom Brand Identities, Advanced AI Chatbots, Automations, Google/Meta/TikTok Ads, SEO, Cybersecurity, and cloud migration.
Address target clients like startups, hotels, hospitals, law firms, SME builders, churches, and finance firms.
Always be professional, polite, and direct, highlighting our capabilities. Emphasize that we design luxurious Apple-level user experiences.
If the client asks about quotes, booking meetings, or dashboards, warmly direct them to the interactive sliders, Contact section, booking calendar, or Client Dashboard on this site.
Keep responses concise, beautiful, readable, and structured using clean Markdown.`;

  try {
    const ai = getGeminiClient();
    
    // Check if the actual key is configured or we use high-quality simulated template responses
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const reply = response.text;
      return res.json({ response: reply });
    } else {
      // High-quality mock responses reflecting the system context
      let fallbackText = "";
      const msgLower = message.toLowerCase();
      if (msgLower.includes("services") || msgLower.includes("offer") || msgLower.includes("work")) {
        fallbackText = `### Paul Digital Labs Elite Services 🚀
We deliver bespoke digital excellence across three primary pillars:
1. **Premium Engineering**: Custom SaaS portals, Apple-level Corporate Web Development, and ultra-high-speed headless E-commerce platforms.
2. **Artificial Intelligence**: Advanced Conversational AI Chatbots, dynamic Voice Agents, CRM sync, and enterprise business automation.
3. **Elite Marketing**: Brand Identity Systems, Conversion-optimized Search Engine Optimization (SEO), and high-ROI Google/Facebook/TikTok advertising funnels.

Would you like to schedule a discovery meeting? You can use our **Interactive Booking System** on the homepage to lock in a consultation with our strategy team instantly!`;
      } else if (msgLower.includes("price") || msgLower.includes("pricing") || msgLower.includes("cost")) {
        fallbackText = `### Tailored Investment Plans 💎
At Paul Digital Labs, we value total transparency. Our standard visual suites start as follows:
- **Starter Growth Suite**: $2,500 – Perfect for luxury landing pages, brand identities, and local SEO campaigns.
- **Enterprise Automation Suite**: $7,500 – Full headless React development, CRM database hookups, and customized AI Chatbot integration.
- **Elite Custom Platform**: $15,000+ – Full-scale bespoke software, custom iOS/Android apps, custom security audits, and dedicated dev ops.

You can interact with our **Visual Budget Calculator** in the **Pricing Page** to model your exact project and submit a customized proposal query. What kind of project are you planning?`;
      } else if (msgLower.includes("dashboard") || msgLower.includes("admin") || msgLower.includes("client")) {
        fallbackText = `### Real-time Client & Employee Portals 🖥️
We pride ourselves on 100% operational transparency. Our platform includes integrated portals:
- **Client Dashboard**: Track your live project timeline, review contracts, sign branding proposals, generate instant PDF invoices, and send files directly.
- **Admin Dashboard**: Our executive team monitors pipeline analytics, leads, active developer tickets, and payroll structures.
- **Employee Workspace**: Assigned developers and designers log attendance, update tickets, and track individual performance metrics.

You can explore these live by switching the dashboard toggle views on the navbar!`;
      } else {
        fallbackText = `### Hello from Paul Digital Labs! 👋
I am **PDL-Assistant**, your AI Sales and Growth Specialist. We specialize in transforming digital brands with high-contrast luxury UI, speed-optimized web performance, and custom enterprise AI automation.

How can I help you grow your business today? We can:
- Discuss a **premium website development** or brand identity.
- Conceptualize an **automated AI customer support bot** for your company.
- Help you generate a custom, beautiful proposal right now!`;
      }
      return res.json({ response: fallbackText });
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to connect to AI server. Please check environment secrets." });
  }
});

// 2. AI Proposal Writer
app.post("/api/ai/proposal", async (req, res) => {
  const { clientName, serviceType, budget, businessGoals } = req.body;
  if (!clientName || !serviceType) {
    return res.status(400).json({ error: "Client Name and Service Type are required." });
  }

  const prompt = `Write a luxurious, professional, and convincing agency proposal for "${clientName}". 
Service Requested: "${serviceType}". 
Investment Budget: "$${budget || "To Be Disclosed"}". 
Client Business Goals: "${businessGoals || "Scaling digital presence, high conversion rate, premium visual identity"}".

Structure the response elegantly with:
- "Executive Summary" (gorgeous sales copywriting)
- "Scope of Work & High-End Architecture"
- "Implementation Timeline & Deliverables"
- "Investment Breakdown"
- "Support & Website Maintenance Plan"
Make it read like an elite international consultancy proposal (e.g. McKinsey or Apple-level execution). Output in structured Markdown format.`;

  try {
    const ai = getGeminiClient();
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { temperature: 0.75 },
      });
      return res.json({ text: response.text });
    } else {
      // High quality static fallback proposal
      const fallbackText = `### EXECUTIVE PROPOSAL
**PREPARED FOR:** ${clientName}
**PROJECT TYPE:** ${serviceType}
**AGENCY:** Paul Digital Labs
**DATE:** ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

---

#### 1. Executive Summary
In today's fast-paced digital landscape, generic templates represent a missed opportunity. **Paul Digital Labs** is honored to present this strategic blueprint to elevate **${clientName}**. Our vision is to blend breathtaking visual layouts, high-contrast typography, and bulletproof React/Node engineering to turn casual visitors into loyal customers.

Our unified goal is to achieve:
- **Breathtaking Design**: A responsive UI styled with modern Tailwind CSS and fluid animations.
- **Conversion Optimization**: Structured layouts focused heavily on guiding users to checkouts or scheduler widgets.
- **AI Automation Hookups**: Instant intelligence to handle basic client questions around the clock.

---

#### 2. Scope of High-End Architecture
To support the goals outlined by ${clientName}, we will implement a fully bespoke:
- **Premium Frontend Layer**: React 19 SPA bundled with Vite, styled via a high-end typography layout.
- **Durable Server Engine**: Node.js and Express API proxies guaranteeing secure environment handling.
- **Interactive CRM Modules**: Integrated databases monitoring bookings, lead flows, and support ticket states.

---

#### 3. Proposed Budget & Pricing
We recommend allocating an investment of **$${budget || "15,000"} USD**, representing:
- 40% - Strategy, Visual Wireframing, and Logo Identity
- 40% - Frontend Engineering & Custom CRM Core Setup
- 20% - AI Assistant Integration & Speed/SEO Optimization

*We look forward to partnering with your executive team.*`;
      return res.json({ text: fallbackText });
    }
  } catch (err) {
    console.error("AI Proposal Error:", err);
    res.status(500).json({ error: "Failed to generate AI proposal." });
  }
});

// 3. AI Blog Generator
app.post("/api/ai/blog", async (req, res) => {
  const { topic, category, tone } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required." });
  }

  const prompt = `Write an in-depth, extremely informative, SEO-optimized blog article. 
Topic: "${topic}". 
Category: "${category || "AI Automation"}". 
Tone: "${tone || "Professional and highly educational"}".

Ensure the article contains a compelling title, introduction, at least three structured body sections with headings, bullet points, a modern technological analysis, and a concluding summary. Wrap key phrases in bold and use clean Markdown. Include SEO keywords list at the very end.`;

  try {
    const ai = getGeminiClient();
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { temperature: 0.8 },
      });
      return res.json({ text: response.text });
    } else {
      const fallbackBlog = `# The New Epoch: Why AI-Powered Development is Dominating in 2026

**Category:** ${category || "Technology"}
**Tone:** ${tone || "Professional"}
**Published by:** Paul Digital Labs Editor

---

### Introduction
The old way of launching web applications—spending six months drafting static specifications followed by tedious manual coding cycles—is officially obsolete. In 2026, the intersection of **custom modular design** and **generative AI models** has ushered in an era where businesses launch robust, production-ready platforms in days, not months.

### 1. The Death of the Cookie-Cutter Layout
Modern clients possess a refined taste. Having grown accustomed to high-end interfaces like Apple and Stripe, visitors immediately distinguish between a pre-packaged template and a bespoke layout. Paul Digital Labs uses premium tools to construct custom typography, spacious glassmorphism, and responsive margins that align exactly with client branding.

### 2. Infusing intelligence at the Core
An app is no longer just a digital billboard; it is an active worker. By integrating Gemini API endpoints server-side, modern applications can:
- Generate custom pricing proposals on the fly.
- Provide responsive, human-like sales answers.
- Automate support tickets and CRM entries instantly.

### Conclusion
As we look to the remainder of 2026, companies that adopt AI-powered digital platforms will rapidly gain market share. Reach out to Paul Digital Labs to discover how we can build your brand, grow your business, and automate your workflows.`;
      return res.json({ text: fallbackBlog });
    }
  } catch (err) {
    console.error("AI Blog Error:", err);
    res.status(500).json({ error: "Failed to generate AI blog." });
  }
});

// -------------------------------------------------------------
// VITE DEV / PROD HANDLERS
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware attached.");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production build from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Paul Digital Labs Server] Operational at http://localhost:${PORT}`);
  });
}

startServer();
