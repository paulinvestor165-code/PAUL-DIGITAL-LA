import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  Plus,
  Loader2,
  CheckCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Send,
  Trash2
} from "lucide-react";
import { Lead, Booking, Proposal, Invoice, Contract, SupportTicket, EmployeeTask } from "../../types";

export default function AdminDashboard() {
  const [store, setStore] = useState<{
    leads: Lead[];
    bookings: Booking[];
    proposals: Proposal[];
    invoices: Invoice[];
    contracts: Contract[];
    tasks: EmployeeTask[];
    tickets: SupportTicket[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // CRM Pipeline State Modals / Creation states
  const [activeTab, setActiveTab] = useState<"pipeline" | "onboarding" | "blog-cms" | "proposals" | "invoices" | "bookings" | "tasks">("pipeline");
  const [aiGenerating, setAiGenerating] = useState(false);

  // Blog CMS Input States
  const [blogTopic, setBlogTopic] = useState("");
  const [blogCategory, setBlogCategory] = useState("AI Automation");
  const [blogTone, setBlogTone] = useState("Professional and highly educational");
  const [blogGenLoading, setBlogGenLoading] = useState(false);
  const [blogId, setBlogId] = useState<string | null>(null); // null means new, string means edit mode
  const [blogTitle, setBlogTitle] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogTags, setBlogTags] = useState("");
  const [blogStatus, setBlogStatus] = useState<"Draft" | "Published">("Draft");
  const [blogAuthor, setBlogAuthor] = useState("CEO Paul");

  // Onboarding Setup Input States
  const [showOnbModal, setShowOnbModal] = useState(false);
  const [onbClientId, setOnbClientId] = useState("");
  const [onbClientName, setOnbClientName] = useState("");
  const [onbClientEmail, setOnbClientEmail] = useState("");
  const [onbCompany, setOnbCompany] = useState("");
  const [onbProjectName, setOnbProjectName] = useState("");
  const [onbService, setOnbService] = useState("Corporate Website Development");
  const [onbBudget, setOnbBudget] = useState("15000");

  // Proposal modal input state
  const [propClient, setPropClient] = useState("");
  const [propService, setPropService] = useState("Corporate Website Development");
  const [propBudget, setPropBudget] = useState("12000");
  const [propGoals, setPropGoals] = useState("");
  const [generatedPropContent, setGeneratedPropContent] = useState("");

  // Invoice modal input state
  const [invClient, setInvClient] = useState("");
  const [invAmount, setInvAmount] = useState("");
  const [invDesc, setInvDesc] = useState("Corporate Web Engineering Deployment - Milestone #1");

  // Task modal input state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("Senior Full-Stack Engineer");
  const [taskPriority, setTaskPriority] = useState<"Low" | "Medium" | "High">("High");
  const [taskProject, setTaskProject] = useState("Paul Digital Labs Launch");

  // Fetch complete data store from fullstack server
  const fetchStore = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/store");
      if (!res.ok) throw new Error("Failed to load platform databases.");
      const data = await res.json();
      setStore(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  // Post dynamic proposal builder leveraging our AI proxy
  const generateAiProposal = async () => {
    if (!propClient.trim()) {
      alert("Please provide the prospect client's name.");
      return;
    }
    setAiGenerating(true);
    setGeneratedPropContent("");

    try {
      const res = await fetch("/api/ai/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: propClient,
          serviceType: propService,
          budget: propBudget,
          businessGoals: propGoals,
        }),
      });

      if (!res.ok) throw new Error("AI engine failure. Please review Gemini keys.");
      const data = await res.json();
      setGeneratedPropContent(data.text);
    } catch (err) {
      console.error(err);
      alert("Proposal engine fell back. Please try again.");
    } finally {
      setAiGenerating(false);
    }
  };

  // Save generated proposal to our server
  const saveProposal = async () => {
    if (!generatedPropContent) return;
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${propClient} - Brand Growth Strategy`,
          clientName: propClient,
          amount: Number(propBudget),
          content: generatedPropContent,
        }),
      });
      if (res.ok) {
        alert("Branded proposal generated and dispatched to the Client Portal!");
        setPropClient("");
        setPropGoals("");
        setGeneratedPropContent("");
        fetchStore();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Invoice on Server
  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invClient.trim() || !invAmount) return;

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: invClient,
          amount: Number(invAmount),
          description: invDesc,
        }),
      });
      if (res.ok) {
        alert("Invoice created and dispatched to the client portal!");
        setInvClient("");
        setInvAmount("");
        fetchStore();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Task on Server
  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskTitle,
          assignee: taskAssignee,
          priority: taskPriority,
          project: taskProject,
        }),
      });
      if (res.ok) {
        alert("Developer task successfully assigned to the employee desk!");
        setTaskTitle("");
        fetchStore();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 1. AI Blog Generation Handler
  const generateBlogDraft = async () => {
    if (!blogTopic.trim()) {
      alert("Please provide a topic or keywords first.");
      return;
    }
    setBlogGenLoading(true);
    try {
      const res = await fetch("/api/ai/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: blogTopic,
          category: blogCategory,
          tone: blogTone
        })
      });
      if (!res.ok) throw new Error("AI Blog generation failed.");
      const data = await res.json();
      
      setBlogTitle(blogTopic);
      setBlogContent(data.text);
      setBlogExcerpt(data.text.substring(0, 160).replace(/[#*`_-]/g, "") + "...");
      setBlogTags(blogCategory.toLowerCase().replace(/\s+/g, "-"));
      setBlogStatus("Draft");
      alert("Structured AI Draft compiled successfully! Review and edit the fields below.");
    } catch (err) {
      console.error(err);
      alert("Failed to generate blog post draft. Please check your network or key.");
    } finally {
      setBlogGenLoading(false);
    }
  };

  // 2. Save / Update Blog Post
  const saveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) {
      alert("Title and content are required to save a draft.");
      return;
    }

    try {
      const url = blogId ? "/api/blog/update" : "/api/blog";
      const payload = {
        id: blogId,
        title: blogTitle,
        category: blogCategory,
        excerpt: blogExcerpt,
        content: blogContent,
        tags: blogTags.split(",").map(t => t.trim()).filter(Boolean),
        status: blogStatus,
        author: blogAuthor
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(blogId ? "Blog post updated successfully!" : "New blog post draft successfully stored in CMS!");
        // Reset editor
        setBlogId(null);
        setBlogTopic("");
        setBlogTitle("");
        setBlogExcerpt("");
        setBlogContent("");
        setBlogTags("");
        setBlogStatus("Draft");
        fetchStore();
      } else {
        alert("CMS error. Failed to save draft.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving blog post.");
    }
  };

  // 3. Delete Blog Post
  const deleteBlogPost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Blog post successfully deleted.");
        fetchStore();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Initialize Onboarding Form
  const startOnboardingWizard = (lead: Lead) => {
    setOnbClientId(lead.id);
    setOnbClientName(lead.name);
    setOnbClientEmail(lead.email);
    setOnbCompany(lead.company || "Self-Employed");
    setOnbProjectName(`${lead.company || lead.name} Launch Project`);
    setOnbService(lead.service);
    setOnbBudget(String(lead.value));
    setShowOnbModal(true);
  };

  // 5. Submit Onboarding Setup
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onbClientName.trim() || !onbClientEmail.trim()) {
      alert("Client contact details are mandatory.");
      return;
    }

    try {
      const res = await fetch("/api/onboardings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: onbClientId,
          clientName: onbClientName,
          clientEmail: onbClientEmail,
          companyName: onbCompany,
          projectName: onbProjectName,
          serviceType: onbService,
          budget: Number(onbBudget)
        })
      });

      if (res.ok) {
        alert(`Onboarding initialized for ${onbClientName}! Account provisioned, welcome email drafted, and initial developer tasks assigned.`);
        setShowOnbModal(false);
        setActiveTab("onboarding");
        fetchStore();
      } else {
        alert("Onboarding setup failure.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 6. Toggle Onboarding Checklist Item
  const handleToggleChecklist = async (onboardingId: string, itemId: string) => {
    try {
      const res = await fetch("/api/onboardings/checklist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboardingId, itemId })
      });
      if (res.ok) {
        fetchStore();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 7. Send Simulated Welcome Email
  const handleSendWelcomeEmail = async (onboardingId: string) => {
    try {
      const res = await fetch("/api/onboardings/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboardingId })
      });
      if (res.ok) {
        alert("Automated welcome email successfully dispatched to the client inbox (Simulation)!");
        fetchStore();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !store) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold tracking-wide text-zinc-500">
          Loading executive analytics databases...
        </p>
      </div>
    );
  }

  // Calculate high-level financial parameters
  const activeLeads = store?.leads || [];
  const activeBookings = store?.bookings || [];
  const totalRevenue = store?.invoices.filter((i) => i.status === "Paid").reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const pendingReceivables = store?.invoices.filter((i) => i.status === "Sent").reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const pipelineValue = activeLeads.reduce((acc, curr) => acc + curr.value, 0) || 0;

  return (
    <div id="admin-dashboard-container" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 dark:text-cyan-400 font-bold">
            Executive Command Center
          </span>
          <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white tracking-tight">
            Paul's Operations Suite
          </h1>
          <p className="text-sm text-zinc-500">
            Monitor international pipelines, execute invoices, generate AI contracts, and assign developer sprints.
          </p>
        </div>
        
        <button
          onClick={fetchStore}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Sync Core Databases
        </button>
      </div>

      {/* High Level Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono text-zinc-400">Total Income</span>
            <span className="font-display font-extrabold text-xl text-zinc-900 dark:text-white">
              ${totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono text-zinc-400">CRM Pipeline</span>
            <span className="font-display font-extrabold text-xl text-zinc-900 dark:text-white">
              ${pipelineValue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono text-zinc-400">Prospect Leads</span>
            <span className="font-display font-extrabold text-xl text-zinc-900 dark:text-white">
              {activeLeads.length} Total
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono text-zinc-400">Pending Receivables</span>
            <span className="font-display font-extrabold text-xl text-zinc-900 dark:text-white">
              ${pendingReceivables.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-2 pb-px overflow-x-auto">
        {[
          { id: "pipeline", label: "CRM Lead Pipeline" },
          { id: "onboarding", label: "Onboarding Campaigns" },
          { id: "blog-cms", label: "AI Blog Drafts & CMS" },
          { id: "proposals", label: "AI Proposal Architect" },
          { id: "invoices", label: "Invoice Generator" },
          { id: "bookings", label: "Discovery Bookings" },
          { id: "tasks", label: "Developer Sprints" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 font-display text-xs uppercase tracking-wider font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600 dark:border-cyan-400 dark:text-cyan-400"
                : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div id="admin-dashboard-panel-content">
        
        {/* TAB 1: PIPELINE */}
        {activeTab === "pipeline" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
                Active Client Pipeline
              </h3>
              <span className="text-xs font-mono text-zinc-500">
                {activeLeads.length} Leads captured from web forms
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Kanban Column: New & Contacted */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-3">
                <h4 className="text-xs font-mono tracking-wider font-bold text-zinc-400 uppercase flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Intake & Contacted
                </h4>
                <div className="space-y-3">
                  {activeLeads.filter(l => l.status === "New" || l.status === "Contacted").map((lead) => (
                    <div key={lead.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-white">{lead.name}</span>
                        <span className="text-[10px] font-mono font-bold text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                          {lead.status}
                        </span>
                      </div>
                      <span className="block text-[10px] text-zinc-400 font-mono">{lead.company}</span>
                      <p className="text-[11px] text-zinc-500 line-clamp-2">{lead.notes || "No custom briefs."}</p>
                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                        <span className="font-semibold">${lead.value.toLocaleString()}</span>
                        <span className="text-[10px] text-zinc-400">{lead.service}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kanban Column: Qualified & Proposed */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-3">
                <h4 className="text-xs font-mono tracking-wider font-bold text-zinc-400 uppercase flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  Qualified & Proposal Sent
                </h4>
                <div className="space-y-3">
                  {activeLeads.filter(l => l.status === "Qualified" || l.status === "Proposal Sent").map((lead) => (
                    <div key={lead.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-white">{lead.name}</span>
                        <span className="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                          {lead.status}
                        </span>
                      </div>
                      <span className="block text-[10px] text-zinc-400 font-mono">{lead.company}</span>
                      <p className="text-[11px] text-zinc-500 line-clamp-2">{lead.notes || "Ready to draft master agreement."}</p>
                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                        <span className="font-semibold">${lead.value.toLocaleString()}</span>
                        <span className="text-[10px] text-zinc-400">{lead.service}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kanban Column: Closed Won */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-3">
                <h4 className="text-xs font-mono tracking-wider font-bold text-zinc-400 uppercase flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Closed Won (Signed!)
                </h4>
                <div className="space-y-3">
                  {/* Pull any actual closed won or signed contracts from invoice data */}
                  {store?.contracts.filter(c => c.status === "Signed").map((contract) => (
                    <div key={contract.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-emerald-500/20 dark:border-emerald-500/25 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-white">{contract.clientName}</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          Closed Won
                        </span>
                      </div>
                      <span className="block text-[10px] text-zinc-400 font-mono">Contract {contract.id}</span>
                      <p className="text-[11px] text-zinc-500 line-clamp-2">Signed by {contract.signature} at {contract.signedAt}</p>
                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                        <span className="font-semibold text-emerald-500">Active Retainer</span>
                        <span className="text-[10px] text-zinc-400">Signed SOW</span>
                      </div>
                    </div>
                  ))}
                  {activeLeads.filter(l => l.status === "Closed Won").map((lead) => (
                    <div key={lead.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-emerald-500/20 dark:border-emerald-500/25 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-white">{lead.name}</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          Won
                        </span>
                      </div>
                      <span className="block text-[10px] text-zinc-400 font-mono">{lead.company}</span>
                      <p className="text-[11px] text-zinc-500 line-clamp-2">{lead.notes}</p>
                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                        <span className="font-semibold">${lead.value.toLocaleString()}</span>
                        <button
                          onClick={() => startOnboardingWizard(lead)}
                          className="text-[10px] bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-mono font-bold uppercase tracking-wider px-2 py-1 rounded transition-all"
                        >
                          Onboard
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI PROPOSALS */}
        {activeTab === "proposals" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-1 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-5">
              <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
                AI Proposal Writer
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Prospect Client / Org</label>
                  <input
                    type="text"
                    value={propClient}
                    onChange={(e) => setPropClient(e.target.value)}
                    placeholder="e.g. Apex Ventures"
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Service Class</label>
                  <select
                    value={propService}
                    onChange={(e) => setPropService(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-zinc-50 dark:bg-zinc-800"
                  >
                    <option>Corporate Website Development</option>
                    <option>E-commerce Development</option>
                    <option>SaaS Development</option>
                    <option>AI Chatbots & Support</option>
                    <option>Brand Identity Suite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Investment Budget ($)</label>
                  <input
                    type="number"
                    value={propBudget}
                    onChange={(e) => setPropBudget(e.target.value)}
                    placeholder="e.g. 18500"
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Client Business Goals / Notes</label>
                  <textarea
                    rows={4}
                    value={propGoals}
                    onChange={(e) => setPropGoals(e.target.value)}
                    placeholder="Discussing integration of dynamic analytics and HIPAA secure logs."
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                  />
                </div>

                <button
                  type="button"
                  onClick={generateAiProposal}
                  disabled={aiGenerating}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gemini composing proposal...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Compose Custom SOW
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Generator Output Workspace */}
            <div className="lg:col-span-2 bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between border-b pb-4 mb-4 border-zinc-200 dark:border-zinc-800">
                <h4 className="font-display font-semibold text-sm">Proposal Draft Workspace</h4>
                {generatedPropContent && (
                  <button
                    onClick={saveProposal}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Dispatch to Client Portal
                  </button>
                )}
              </div>

              <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl border p-5 text-xs overflow-y-auto leading-relaxed font-mono">
                {generatedPropContent ? (
                  <p className="whitespace-pre-wrap">{generatedPropContent}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-2">
                    <Sparkles className="h-8 w-8 text-indigo-500 animate-pulse" />
                    Fill out the builder and let Gemini draft your customized Scope of Work.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INVOICES */}
        {activeTab === "invoices" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Invoice Creation Form */}
            <div className="lg:col-span-1 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
              <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white mb-5">
                Generate Invoice
              </h3>

              <form onSubmit={createInvoice} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Target Client</label>
                  <input
                    type="text"
                    value={invClient}
                    onChange={(e) => setInvClient(e.target.value)}
                    placeholder="e.g. Nova Retail Group"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    value={invAmount}
                    onChange={(e) => setInvAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={invDesc}
                    onChange={(e) => setInvDesc(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all"
                >
                  Generate Invoice PDF Draft
                </button>
              </form>
            </div>

            {/* Invoices List */}
            <div className="lg:col-span-2 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-4">
              <h4 className="font-display font-semibold text-sm">Dispatched Corporate Invoices</h4>
              
              <div className="space-y-3">
                {store?.invoices.map((inv) => (
                  <div key={inv.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-950 dark:text-white">{inv.id}</span>
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                          inv.status === "Paid" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">{inv.clientName} &bull; {inv.description}</p>
                      <span className="text-[10px] text-zinc-500 block mt-1">Due: {inv.dueDate}</span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display font-extrabold text-base text-zinc-900 dark:text-white block">
                        ${inv.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-zinc-400">{inv.paymentMethod}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-6">
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white">
              Discovery Schedules
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {store?.bookings.map((book) => (
                <div key={book.id} className="p-4 rounded-xl border bg-zinc-50 dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-900 dark:text-white">{book.clientName}</h4>
                    <span className="text-[10px] text-zinc-400 font-mono block mt-1">{book.service}</span>
                    <p className="text-[11px] text-zinc-500 mt-2">Brief: {book.notes}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-[10px] font-semibold bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded">
                        {book.date} &bull; {book.time}
                      </span>
                      <a href={book.joinUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold text-indigo-500 hover:underline">
                        Launch Room &bull; {book.platform}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SPRINT TASKS */}
        {activeTab === "tasks" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Task Creation */}
            <div className="lg:col-span-1 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
              <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white mb-5">
                Dispatch Work Sprints
              </h3>

              <form onSubmit={createTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Sprint Task Title</label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. Integrate Gemini REST hooks"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Assigned Executive Developer</label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-zinc-50 dark:bg-zinc-800"
                  >
                    <option>CEO & Chief Digital Strategist</option>
                    <option>Senior Software Architect</option>
                    <option>UI/UX Creative Director</option>
                    <option>Director of Paid Growth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Sprint Priority</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Low", "Medium", "High"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setTaskPriority(p as any)}
                        className={`py-2 text-xs font-semibold rounded-xl border ${
                          taskPriority === p
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Project Name</label>
                  <input
                    type="text"
                    value={taskProject}
                    onChange={(e) => setTaskProject(e.target.value)}
                    placeholder="Paul Digital Labs Launch"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all"
                >
                  Dispatch Sprint Task
                </button>
              </form>
            </div>

            {/* Task Sprints List */}
            <div className="lg:col-span-2 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-4">
              <h4 className="font-display font-semibold text-sm font-bold">Active Developer Sprints</h4>
              
              <div className="space-y-3">
                {store?.tasks.map((task) => (
                  <div key={task.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-zinc-950 dark:text-white">{task.title}</span>
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                          task.priority === "High" ? "bg-rose-500/10 text-rose-500" : "bg-zinc-500/15 text-zinc-500"
                        }`}>
                          {task.priority} Priority
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">Assignee: {task.assignee} &bull; Project: {task.project}</p>
                      <span className="text-[10px] text-zinc-500 block mt-1">Due Date: {task.dueDate}</span>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        task.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ONBOARDING */}
        {activeTab === "onboarding" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
                  Active Client Onboardings
                </h3>
                <p className="text-xs text-zinc-500">
                  Manage welcome sequences, setup checklists, master service agreement contracts, and technical handovers.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {(store?.onboardings || []).map((onb: any) => {
                const totalItems = onb.checklist.length;
                const completedItems = onb.checklist.filter((item: any) => item.completed).length;
                const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

                return (
                  <div key={onb.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 space-y-5 shadow-sm">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-extrabold text-base text-zinc-900 dark:text-white">
                            {onb.projectName}
                          </h4>
                          <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                            {onb.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                          Client: <span className="font-semibold text-zinc-600 dark:text-zinc-200">{onb.clientName} ({onb.clientEmail})</span> &bull; Co: {onb.companyName}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="block text-[10px] uppercase font-mono text-zinc-400">Strategic Point of Contact</span>
                          <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                            {onb.poc.name} ({onb.poc.role})
                          </span>
                        </div>
                        <img
                          src={onb.poc.avatar}
                          alt={onb.poc.name}
                          className="h-10 w-10 rounded-full border border-zinc-200 object-cover animate-pulse"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-600 dark:text-zinc-300">Onboarding Setup Progress</span>
                        <span className="font-mono font-bold text-indigo-600 dark:text-cyan-400">{progressPct}% ({completedItems}/{totalItems} tasks)</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 dark:bg-cyan-400 h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Interactive Checklist */}
                      <div className="space-y-3 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border">
                        <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Interactive Checklist</h5>
                        <div className="space-y-2">
                          {onb.checklist.map((item: any) => (
                            <label
                              key={item.id}
                              className="flex items-start gap-3 p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
                            >
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => handleToggleChecklist(onb.id, item.id)}
                                className="mt-1 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                              />
                              <div>
                                <span className={`text-xs font-semibold block ${item.completed ? "line-through text-zinc-400" : "text-zinc-900 dark:text-white"}`}>
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-zinc-400 block mt-0.5">{item.description}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Right: Automated Welcome Email & Campaign Details */}
                      <div className="space-y-3 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Automated Welcome Campaign</h5>
                            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                              onb.welcomeEmail.sent ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                            }`}>
                              {onb.welcomeEmail.sent ? "Sent" : "Ready to Send"}
                            </span>
                          </div>

                          <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 font-mono text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 h-32 overflow-y-auto whitespace-pre-wrap">
                            <strong className="text-zinc-900 dark:text-white">Subject: {onb.welcomeEmail.subject}</strong>
                            <br /><br />
                            {onb.welcomeEmail.body}
                          </div>
                        </div>

                        {!onb.welcomeEmail.sent && (
                          <button
                            onClick={() => handleSendWelcomeEmail(onb.id)}
                            className="w-full mt-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-500 dark:hover:bg-cyan-600 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                          >
                            <Send className="h-3.5 w-3.5" />
                            Dispatch Welcome Email Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {(store?.onboardings || []).length === 0 && (
                <div className="bg-zinc-50 dark:bg-zinc-900/50 border rounded-2xl py-12 text-center text-zinc-400">
                  No active client onboarding campaigns initialized. Check CRM pipeline and click "Onboard" to start.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: BLOG CMS */}
        {activeTab === "blog-cms" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
                  Corporate Insights & AI Blog CMS
                </h3>
                <p className="text-xs text-zinc-500">
                  Leverage the Gemini AI model to write research papers and insights, draft copy, edit content, and publish to the agency frontend.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: AI Draft Generator and Article Editor */}
              <div className="lg:col-span-1 space-y-6">
                {/* 1. AI Assistant Card */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4 shadow-sm">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    Gemini Research Writer
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">Target Topic / Keywords</label>
                      <input
                        type="text"
                        value={blogTopic}
                        onChange={(e) => setBlogTopic(e.target.value)}
                        placeholder="e.g. Scaling enterprise apps with Node.js and Gemini AI"
                        className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">Category</label>
                        <select
                          value={blogCategory}
                          onChange={(e) => setBlogCategory(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 outline-none bg-zinc-50 dark:bg-zinc-850"
                        >
                          <option>AI Automation</option>
                          <option>Engineering</option>
                          <option>Design</option>
                          <option>Cyber & Cloud</option>
                          <option>Business Strategy</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">Tone Of Voice</label>
                        <select
                          value={blogTone}
                          onChange={(e) => setBlogTone(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 outline-none bg-zinc-50 dark:bg-zinc-855"
                        >
                          <option>Professional and highly educational</option>
                          <option>Visionary technology focus</option>
                          <option>Analytical and case-study style</option>
                          <option>Friendly business growth advisor</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={generateBlogDraft}
                      disabled={blogGenLoading}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {blogGenLoading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Analyzing & Writing Draft...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          Generate Structured AI Draft
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Manual/Edit Draft Fields */}
                <form onSubmit={saveBlogPost} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-400">
                      {blogId ? "Edit CMS Post" : "Draft Editor"}
                    </h4>
                    {blogId && (
                      <button
                        type="button"
                        onClick={() => {
                          setBlogId(null);
                          setBlogTitle("");
                          setBlogExcerpt("");
                          setBlogContent("");
                          setBlogTags("");
                        }}
                        className="text-[10px] font-mono text-rose-500 hover:underline"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">Article Title</label>
                      <input
                        type="text"
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        placeholder="Article title..."
                        required
                        className="w-full text-xs p-2 rounded-xl border focus:ring-1 focus:ring-indigo-500 bg-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">Author</label>
                      <input
                        type="text"
                        value={blogAuthor}
                        onChange={(e) => setBlogAuthor(e.target.value)}
                        placeholder="CEO Paul..."
                        required
                        className="w-full text-xs p-2 rounded-xl border focus:ring-1 focus:ring-indigo-500 bg-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">Short Excerpt</label>
                      <textarea
                        rows={2}
                        value={blogExcerpt}
                        onChange={(e) => setBlogExcerpt(e.target.value)}
                        placeholder="Brief summary..."
                        required
                        className="w-full text-xs p-2 rounded-xl border focus:ring-1 focus:ring-indigo-500 bg-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">Content (Markdown supported)</label>
                      <textarea
                        rows={6}
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        placeholder="Type or paste markdown content here..."
                        required
                        className="w-full font-mono text-[11px] p-2 rounded-xl border focus:ring-1 focus:ring-indigo-500 bg-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">Tags (Comma separated)</label>
                        <input
                          type="text"
                          value={blogTags}
                          onChange={(e) => setBlogTags(e.target.value)}
                          placeholder="node, gemini, scale"
                          className="w-full text-xs p-2 rounded-xl border focus:ring-1 focus:ring-indigo-500 bg-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">CMS Status</label>
                        <select
                          value={blogStatus}
                          onChange={(e) => setBlogStatus(e.target.value as any)}
                          className="w-full text-xs p-2 rounded-xl border outline-none bg-zinc-50 dark:bg-zinc-800"
                        >
                          <option value="Draft">Save Draft</option>
                          <option value="Published">Publish Live</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      {blogId ? "Update Article" : "Store in CMS Library"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Library of Blog Posts */}
              <div className="lg:col-span-2 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-4">
                <h4 className="font-display font-semibold text-sm">CMS Library Index</h4>
                
                <div className="space-y-4">
                  {(store?.blogPosts || []).map((post: any) => (
                    <div key={post.id} className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col md:flex-row md:items-start justify-between gap-4 shadow-xs">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">
                            {post.category}
                          </span>
                          <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                            post.status === "Published" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                          }`}>
                            {post.status}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">By {post.author}</span>
                        </div>
                        <h5 className="font-display font-extrabold text-sm text-zinc-900 dark:text-white leading-tight">
                          {post.title}
                        </h5>
                        <p className="text-[11px] text-zinc-500 line-clamp-2">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {post.tags.map((tag: string, idx: number) => (
                            <span key={idx} className="text-[9px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 px-1.5 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 flex md:flex-col items-center md:items-end gap-2">
                        <button
                          onClick={() => {
                            setBlogId(post.id);
                            setBlogTitle(post.title);
                            setBlogCategory(post.category);
                            setBlogExcerpt(post.excerpt);
                            setBlogContent(post.content);
                            setBlogTags(post.tags.join(", "));
                            setBlogStatus(post.status);
                            setBlogAuthor(post.author);
                          }}
                          className="px-3 py-1.5 text-[10px] font-semibold uppercase bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteBlogPost(post.id)}
                          className="px-3 py-1.5 text-[10px] font-semibold uppercase bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  {(store?.blogPosts || []).length === 0 && (
                    <div className="text-center py-12 text-zinc-400">
                      No posts currently stored in CMS. Generate your first post with the Gemini assistant!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ONBOARDING SETUP MODAL */}
      {showOnbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowOnbModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-500 text-sm font-bold font-mono cursor-pointer"
            >
              ✕
            </button>
            
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-500 dark:text-cyan-400">Client Acquisition & Onboarding Wizard</span>
              <h3 className="font-display font-extrabold text-lg text-zinc-900 dark:text-white mt-1">
                Configure Campaign for {onbClientName}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Setup their digital workspace, assign their POC, draft their welcome contract and assign technical sprints.
              </p>
            </div>

            <form onSubmit={handleOnboardingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={onbCompany}
                    onChange={(e) => setOnbCompany(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border focus:ring-1 focus:ring-indigo-500 bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">Onboarding Project Space Name</label>
                  <input
                    type="text"
                    value={onbProjectName}
                    onChange={(e) => setOnbProjectName(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border focus:ring-1 focus:ring-indigo-500 bg-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">Core Service Type</label>
                  <input
                    type="text"
                    value={onbService}
                    readOnly
                    className="w-full text-xs p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-850 cursor-not-allowed text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">Agreement SOW Budget ($ USD)</label>
                  <input
                    type="number"
                    value={onbBudget}
                    onChange={(e) => setOnbBudget(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border focus:ring-1 focus:ring-indigo-500 bg-transparent"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl text-xs text-indigo-600 dark:text-indigo-400 leading-relaxed">
                <strong>⚡ Behind-the-scenes Automation</strong>
                <ul className="list-disc list-inside mt-1.5 space-y-1">
                  <li>Client database credential provisioned</li>
                  <li>Initial SOW contract drafted in Client Space</li>
                  <li>Automated onboarding email loaded into welcome queue</li>
                  <li>Standard 2-week Sprint setup tasks delegated to Engineers</li>
                </ul>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowOnbModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700 bg-zinc-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-500 dark:hover:bg-cyan-600 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Deploy Onboarding Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
