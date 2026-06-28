import React, { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Search,
  Filter,
  Briefcase,
  HelpCircle,
  Mail,
  Send,
  Loader2,
  Calendar,
  Layers,
  ChevronDown,
  Cpu,
  Fingerprint,
  Zap
} from "lucide-react";

// Mock database
import {
  mockServices,
  mockPortfolio,
  mockCaseStudies,
  mockTeamMembers,
  mockTestimonials,
  mockFAQ,
  mockBlogPosts,
  mockJobs
} from "../data/mockData";

// Modular Components
import Navigation from "./Navigation";
import Footer from "./Footer";
import AIChatbot from "./AIChatbot";
import AdminDashboard from "./Dashboards/AdminDashboard";
import ClientDashboard from "./Dashboards/ClientDashboard";
import EmployeeDashboard from "./Dashboards/EmployeeDashboard";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [currentDashboard, setCurrentDashboard] = useState<"none" | "admin" | "client" | "employee">("none");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // General Interactive States
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactService, setContactService] = useState("Corporate Website Development");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Pricing Page Interactive States
  const [designBudget, setDesignBudget] = useState(3000);
  const [engineeringBudget, setEngineeringBudget] = useState(5000);
  const [aiBudget, setAiBudget] = useState(4000);
  const [marketingBudget, setMarketingBudget] = useState(2000);

  // Portfolio Interactive States
  const [portfolioCategory, setPortfolioCategory] = useState<string>("All");
  const [portfolioSearch, setPortfolioSearch] = useState<string>("");

  // FAQ Interactive States
  const [faqSearch, setFaqSearch] = useState("");

  // Blog states
  const [activeBlog, setActiveBlog] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(false);

  const fetchBlogPosts = async () => {
    try {
      setLoadingBlog(true);
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        const published = data.filter((p: any) => p.status === "Published");
        setBlogPosts(published.length > 0 ? published : mockBlogPosts);
      } else {
        setBlogPosts(mockBlogPosts);
      }
    } catch (err) {
      console.error(err);
      setBlogPosts(mockBlogPosts);
    } finally {
      setLoadingBlog(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, [currentView]);

  // Synchronize CSS class for Dark Mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle Contact / Lead generation submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setIsSubmittingContact(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          service: contactService,
          value: designBudget + engineeringBudget + aiBudget + marketingBudget,
          notes: contactMessage,
        }),
      });

      if (res.ok) {
        alert(`Thank you, ${contactName}! Your strategic growth brief was dispatched to CEO Paul. We will reach out within 4 business hours with your custom proposal. Check the Client Dashboard to view active proposals!`);
        setContactName("");
        setContactEmail("");
        setContactMessage("");
      }
    } catch (err) {
      console.error(err);
      alert("Submission successful! (Offline proxy fallback). Check client portal.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Calculate calculated budget
  const calculatedTotalBudget = designBudget + engineeringBudget + aiBudget + marketingBudget;

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans antialiased">
      
      {/* Sticky Premium Navigation */}
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        currentDashboard={currentDashboard}
        onDashboardChange={setCurrentDashboard}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* RENDER VIEW ROUTER */}
      <main className="relative z-10">
        
        {/* VIEW: DASHBOARDS OVERLAY */}
        {currentDashboard !== "none" ? (
          <div>
            {currentDashboard === "admin" && <AdminDashboard />}
            {currentDashboard === "client" && <ClientDashboard />}
            {currentDashboard === "employee" && <EmployeeDashboard />}
          </div>
        ) : (
          <div>
            
            {/* VIEW: HOME PAGE */}
            {currentView === "home" && (
              <div className="space-y-24 pb-20">
                
                {/* SECTION 1: HERO */}
                <section id="hero-section" className="relative pt-20 pb-16 overflow-hidden">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-600 dark:text-cyan-400 font-mono text-[10px] uppercase tracking-wider font-bold animate-fade-in">
                      <Sparkles className="h-3 w-3 animate-pulse" />
                      Elite Digital Agency
                    </div>

                    <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-none text-zinc-900 dark:text-white max-w-5xl mx-auto">
                      Building Brands.<br />
                      <span className="bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-400 bg-clip-text text-transparent">
                        Growing Businesses.
                      </span><br />
                      Powered by AI.
                    </h1>

                    <p className="text-zinc-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                      Paul Digital Labs engineers breathtaking visual products, high-speed headless storefronts, and automated enterprise AI workflows for high-growth global companies.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                      <button
                        onClick={() => setCurrentView("contact")}
                        className="px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-103 text-white shadow-xl shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition-all duration-300"
                      >
                        Launch Your Project
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => {
                          setCurrentDashboard("client");
                          setCurrentView("dashboard");
                        }}
                        className="px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300"
                      >
                        Explore Client Workspace
                      </button>
                    </div>
                  </div>

                  {/* Aesthetic Background Accents */}
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-[120px] pointer-events-none" />
                </section>

                {/* SECTION 2: STATISTICS */}
                <section id="statistics-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white dark:bg-zinc-900/60 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-xs">
                    <div className="text-center space-y-1">
                      <span className="block font-display font-black text-3xl sm:text-4xl text-indigo-600 dark:text-cyan-400">99%</span>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">Lighthouse Speed Core</span>
                    </div>
                    <div className="text-center space-y-1 border-l border-zinc-100 dark:border-zinc-800">
                      <span className="block font-display font-black text-3xl sm:text-4xl text-indigo-600 dark:text-cyan-400">+142%</span>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">Average E-commerce ROI</span>
                    </div>
                    <div className="text-center space-y-1 border-l border-zinc-100 dark:border-zinc-800">
                      <span className="block font-display font-black text-3xl sm:text-4xl text-indigo-600 dark:text-cyan-400">-68%</span>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">Support Desk Overhead</span>
                    </div>
                    <div className="text-center space-y-1 border-l border-zinc-100 dark:border-zinc-800">
                      <span className="block font-display font-black text-3xl sm:text-4xl text-indigo-600 dark:text-cyan-400">$2.4M</span>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">Client Revenue Managed</span>
                    </div>
                  </div>
                </section>

                {/* SECTION 3: TRUSTED COMPANIES */}
                <section id="trusted-companies" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                    TRUSTED BY DISRUPTIVE CORPORATIONS & BRANDS
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale dark:invert">
                    <span className="font-display font-extrabold text-xl tracking-tight">APEX VENTURES</span>
                    <span className="font-display font-extrabold text-xl tracking-tight">NOVA RETAIL</span>
                    <span className="font-display font-extrabold text-xl tracking-tight">ROSTOV REAL ESTATE</span>
                    <span className="font-display font-extrabold text-xl tracking-tight">MEDICARE GROUP</span>
                    <span className="font-display font-extrabold text-xl tracking-tight">ACME GLOBAL</span>
                  </div>
                </section>

                {/* SECTION 4: SERVICES PREVIEW */}
                <section id="services-preview-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                  <div className="text-center space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Elite Deliverables</span>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-zinc-900 dark:text-white">
                      Full-Stack Capabilities
                    </h2>
                    <p className="text-sm text-zinc-500 max-w-xl mx-auto">
                      Explore our premium engineering and digital marketing categories tailored for startups and global SMEs.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 hover:shadow-xl transition-all space-y-4">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <Cpu className="h-6 w-6" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">Bespoke Engineering</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Corporate React portals, headless storefronts, and ultra-high-speed custom SaaS dashboards built with bulletproof architectures.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 hover:shadow-xl transition-all space-y-4">
                      <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                        <Fingerprint className="h-6 w-6" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">Premium UI/UX Design</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Design systems prioritizing meticulous whitespace, Space Grotesk typographies, custom vector identities, and Apple-level fluidity.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 hover:shadow-xl transition-all space-y-4">
                      <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                        <Zap className="h-6 w-6" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">Automations & AI</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Conversational Gemini assistants, support help desks, Voice Agents, and secure serverless administrative cron pipelines.
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setCurrentView("services")}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 hover:underline"
                    >
                      View all 25 luxury services
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </section>

                {/* SECTION 5: PORTFOLIO PREVIEW */}
                <section id="portfolio-preview-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Case Projects</span>
                      <h2 className="font-display font-bold text-3xl tracking-tight text-zinc-900 dark:text-white">
                        Designed for Performance
                      </h2>
                    </div>
                    <button
                      onClick={() => setCurrentView("portfolio")}
                      className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 hover:underline shrink-0"
                    >
                      Explore Full Showcase
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockPortfolio.slice(0, 2).map((proj) => (
                      <div
                        key={proj.id}
                        className="group bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
                        onClick={() => setCurrentView("portfolio")}
                      >
                        <div className="aspect-video w-full overflow-hidden relative">
                          <img
                            src={proj.image}
                            alt={proj.title}
                            referrerPolicy="no-referrer"
                            className="object-cover w-full h-full group-hover:scale-103 transition-transform duration-500"
                          />
                          <div className="absolute bottom-4 left-4 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-white font-mono text-[10px] uppercase font-bold tracking-wider">
                            {proj.category}
                          </div>
                        </div>

                        <div className="p-6 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">{proj.title}</h3>
                            <div className="text-right">
                              <span className="block text-xs font-extrabold text-indigo-500">{proj.stats.value}</span>
                              <span className="block text-[8px] uppercase font-mono text-zinc-400">{proj.stats.label}</span>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed">{proj.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* SECTION 6: CASE STUDIES PREVIEW */}
                <section id="case-studies-preview" className="bg-zinc-100 dark:bg-zinc-900/40 border-y border-zinc-200/60 dark:border-zinc-800/60 py-20">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center space-y-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Deep Analyses</span>
                      <h2 className="font-display font-bold text-3xl tracking-tight text-zinc-900 dark:text-white">
                        Performance-First Metrics
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {mockCaseStudies.map((cs) => (
                        <div
                          key={cs.id}
                          className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4 cursor-pointer"
                          onClick={() => setCurrentView("case-studies")}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">{cs.client}</span>
                            <span className="text-xs font-extrabold text-emerald-500">{cs.metric} {cs.metricLabel}</span>
                          </div>
                          <h3 className="font-display font-semibold text-sm text-zinc-900 dark:text-white">{cs.title}</h3>
                          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">{cs.challenge}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* SECTION 7: CLIENT TESTIMONIALS */}
                <section id="testimonials-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                  <div className="text-center space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Verification</span>
                    <h2 className="font-display font-bold text-3xl tracking-tight text-zinc-900 dark:text-white">
                      CEO & Founder Feedback
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mockTestimonials.map((tst) => (
                      <div key={tst.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4">
                        <p className="text-xs text-zinc-500 leading-relaxed italic">
                          "{tst.content}"
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          <img
                            src={tst.image}
                            alt={tst.name}
                            referrerPolicy="no-referrer"
                            className="h-10 w-10 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <span className="block font-bold text-xs text-zinc-900 dark:text-white">{tst.name}</span>
                            <span className="block text-[9px] text-zinc-400 font-mono">{tst.role} &bull; {tst.company}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* SECTION 8: PRICING SUMMARY CARD */}
                <section id="pricing-summary" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-gradient-to-r from-indigo-950 via-zinc-900 to-indigo-950 p-8 sm:p-12 rounded-3xl text-center space-y-6 text-white border border-zinc-800 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-bold">Transparent Investment</span>
                      <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight leading-none max-w-2xl mx-auto">
                        High-contrast pricing suites configured to grow budgets.
                      </h2>
                      <p className="text-xs text-zinc-400 max-w-md mx-auto">
                        Explore our budget calculator and pricing pages to configure your custom web, design, or AI automation platforms.
                      </p>
                      <button
                        onClick={() => setCurrentView("pricing")}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Model Budget Quote
                      </button>
                    </div>
                  </div>
                </section>

                {/* SECTION 9: OUR PROCESS */}
                <section id="process-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                  <div className="text-center space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Execution Plan</span>
                    <h2 className="font-display font-bold text-3xl tracking-tight text-zinc-900 dark:text-white">
                      The Six-Step Delivery Workflow
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { step: "01", title: "Strategy Session", desc: "A 30-min discovery session with CEO Paul to align exact KPIs, web speed metrics, and cloud boundaries." },
                      { step: "02", title: "Visual Blueprint", desc: "Our UI squad drafts high-end Figma concepts leveraging Inter & Space Grotesk guidelines." },
                      { step: "03", title: "Contract Signature", desc: "Clients execute secure digital agreements and SOWs inside their unique Client Dashboard." },
                      { step: "04", title: "Sprint Coding", desc: "Architect Alex and our software developers deploy type-safe React, Express API routes, and cloud microservices." },
                      { step: "05", title: "AI Tuning", desc: "Bespoke training of Gemini knowledge bases, support systems, and CRM pipeline triggers." },
                      { step: "06", title: "Core Web Launch", desc: "Rigorous lighthouse core audits, speed checks to 99, and zero-downtime Cloud deployment." }
                    ].map((proc, i) => (
                      <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
                        <span className="block font-display font-black text-2xl text-indigo-500/30">{proc.step}</span>
                        <h3 className="font-display font-bold text-sm text-zinc-900 dark:text-white">{proc.title}</h3>
                        <p className="text-xs text-zinc-500 leading-relaxed">{proc.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* SECTION 10: TECHNOLOGY STACK */}
                <section id="tech-stack-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                    PRODUCTION-READY INDUSTRIAL ARCHITECTURE
                  </span>
                  <div className="flex flex-wrap justify-center items-center gap-8 text-xs font-mono text-zinc-500">
                    <span className="bg-zinc-100 dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">React 19 & Vite</span>
                    <span className="bg-zinc-100 dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">Node.js & Express</span>
                    <span className="bg-zinc-100 dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">Tailwind CSS v4</span>
                    <span className="bg-zinc-100 dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">Gemini-3.5-Flash SDK</span>
                    <span className="bg-zinc-100 dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">Durable JSON DB</span>
                    <span className="bg-zinc-100 dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">Google Cloud Run</span>
                  </div>
                </section>

                {/* SECTION 11: WHY CHOOSE US */}
                <section id="why-choose-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Our Philosophy</span>
                    <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight leading-none text-zinc-900 dark:text-white">
                      We design luxurious visual products that operate like machinery.
                    </h2>
                    <p className="text-xs leading-relaxed text-zinc-500">
                      Most digital agencies assemble pre-packaged templates that bloat client applications and slow down search results. At Paul Digital Labs, we write handcrafted modular code. We guarantee a solid 95+ lighthouse score, robust role-based security, and fully transparent client portals to monitor development metrics in real-time.
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4.5 w-4.5 text-indigo-500" />
                        <span>Zero Template Bloat</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4.5 w-4.5 text-indigo-500" />
                        <span>Server-Isolated AI Keys</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4.5 w-4.5 text-indigo-500" />
                        <span>100% Client Access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4.5 w-4.5 text-indigo-500" />
                        <span>Lighthouse 95+ Score</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-100 dark:bg-zinc-900/60 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-6">
                    <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">The Paul Digital Labs Guarantee</h3>
                    <p className="text-xs leading-relaxed text-zinc-500">
                      We offer a 12-month speed, SEO stability, and dependencies maintenance warranty with every deployed web application. If security rules leak or performance index dips, we remediate the framework immediately at zero additional expense.
                    </p>
                    <button
                      onClick={() => setCurrentView("about")}
                      className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5"
                    >
                      Read our values
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </section>

                {/* SECTION 12: FAQ SUMMARY */}
                <section id="faq-summary" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  <div className="text-center space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Guides</span>
                    <h2 className="font-display font-bold text-3xl tracking-tight text-zinc-900 dark:text-white">
                      Answers from CEO Paul
                    </h2>
                  </div>

                  <div className="max-w-3xl mx-auto space-y-3">
                    {mockFAQ.slice(0, 3).map((item, i) => (
                      <div key={i} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 text-xs">
                        <span className="block font-bold text-sm text-zinc-900 dark:text-white mb-2">{item.question}</span>
                        <p className="text-zinc-500 leading-relaxed">{item.answer}</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setCurrentView("faq")}
                      className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline"
                    >
                      View all searchable FAQs
                    </button>
                  </div>
                </section>

                {/* SECTION 13: LATEST BLOG */}
                <section id="latest-blog-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                  <div className="flex items-end justify-between">
                    <div className="space-y-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Research Papers</span>
                      <h2 className="font-display font-bold text-3xl tracking-tight text-zinc-900 dark:text-white">
                        Growth Insights
                      </h2>
                    </div>
                    <button
                      onClick={() => setCurrentView("blog")}
                      className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 hover:underline shrink-0"
                    >
                      Browse CMS Library
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blogPosts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => {
                          setActiveBlog(post.id);
                          setCurrentView("blog");
                        }}
                      >
                        <span className="text-[9px] font-mono uppercase font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">
                          {post.category}
                        </span>
                        <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white leading-tight">{post.title}</h3>
                        <p className="text-xs text-zinc-500 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pt-2 border-t border-zinc-100 dark:border-zinc-800">
                          <span>{post.date}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* SECTION 14: NEWSLETTER (Full newsletter in footer) */}

                {/* SECTION 15: CALL TO ACTION */}
                <section id="cta-section-bottom" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 sm:p-16 rounded-3xl text-center text-white space-y-6 shadow-xl relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-bold">DISPATCH BRIEF</span>
                      <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-none max-w-3xl mx-auto">
                        Ready to automate workflows and double conversion rates?
                      </h2>
                      <p className="text-xs text-indigo-100 max-w-md mx-auto">
                        Connect with CEO Paul's strategy team today and lock in your custom speed-optimization blueprint.
                      </p>
                      <button
                        onClick={() => setCurrentView("contact")}
                        className="px-8 py-4 bg-white hover:bg-zinc-100 text-indigo-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        Initiate Strategic Consultation
                      </button>
                    </div>
                  </div>
                </section>

              </div>
            )}

            {/* VIEW: ABOUT PAGE */}
            {currentView === "about" && (
              <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Corporate Identity</span>
                  <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-zinc-900 dark:text-white tracking-tight">
                    Luxury Web Architects
                  </h1>
                  <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">
                    Founded by Paul, we are an elite team of designers, full-stack developers, and growth analysts. We operate with zero-overhead, production-ready standards to turn commercial startups into industry giants.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h2 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">Our Mission</h2>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      To help businesses achieve absolute scalability through premium bespoke engineering, custom conversational AI architectures, conversion-optimized branding identity, and positive ad spend ROAS.
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      We believe digital spaces are not passive screens—they are automated engines. If your database leaks, or layout stutters, it is a business fail. We guarantee secure, Apple-level operations with robust type safety in every module.
                    </p>
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-900/60 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-3">
                    <h3 className="font-display font-semibold text-sm">Key Values</h3>
                    <ul className="space-y-3.5 text-xs text-zinc-500">
                      <li>&bull; **Operational Transparency**: Review active contracts and sprint tasks inside your private portal 24/7.</li>
                      <li>&bull; **Zero Boilerplates**: Handmade, optimized React scripts built directly to your exact constraints.</li>
                      <li>&bull; **Bulletproof Audits**: Every deployed asset undergoes full cybersecurity and XSS vulnerability testing.</li>
                    </ul>
                  </div>
                </div>

                {/* Team Grid */}
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold font-bold">Executive Board</span>
                    <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-white">Meet the Leadership</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mockTeamMembers.map((member, i) => (
                      <div key={i} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden shadow-xs">
                        <div className="aspect-square w-full overflow-hidden">
                          <img
                            src={member.image}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="p-5 space-y-2">
                          <span className="block font-bold text-sm text-zinc-900 dark:text-white">{member.name}</span>
                          <span className="block text-[10px] font-mono text-indigo-500 dark:text-cyan-400 font-semibold">{member.role}</span>
                          <p className="text-[11px] text-zinc-500 leading-relaxed">{member.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: SERVICES PAGE (Interactive detailed showcase) */}
            {currentView === "services" && (
              <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Corporate Options</span>
                  <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-zinc-900 dark:text-white tracking-tight">
                    25 Elite Service Deliverables
                  </h1>
                  <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">
                    Compare technical details and standard budgets for our entire international digital agency offerings.
                  </p>
                </div>

                {/* Categorized Services List */}
                <div className="space-y-12">
                  {["Engineering", "Design", "Growth", "AI & Automation", "Cyber & Cloud"].map((cat) => {
                    const filtered = mockServices.filter(s => s.category === cat || (cat === "Growth" && s.category === "Growth"));
                    return (
                      <div key={cat} className="space-y-6">
                        <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white border-b pb-2 border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                          {cat} Solutions
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {filtered.map((srv) => (
                            <div key={srv.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">{srv.name}</h3>
                                  <span className="font-mono text-xs font-extrabold text-indigo-500 dark:text-cyan-400 shrink-0">
                                    {srv.priceEstimate}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed">{srv.description}</p>
                              </div>

                              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2">
                                {srv.features.map((feat, idx) => (
                                  <span key={idx} className="text-[9px] font-mono font-semibold bg-zinc-100 dark:bg-zinc-950 px-2 py-1 rounded">
                                    {feat}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW: PORTFOLIO PAGE */}
            {currentView === "portfolio" && (
              <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Case Showcase</span>
                  <h1 className="font-display font-extrabold text-4xl text-zinc-900 dark:text-white tracking-tight">
                    Commercial Project Showcase
                  </h1>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Handmade web tools, real estate portals, and custom conversational AI layouts engineered for total speed.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border">
                  <div className="flex flex-wrap gap-2">
                    {["All", "Web Development", "E-commerce", "AI Automation", "Branding"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setPortfolioCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          portfolioCategory === cat
                            ? "bg-indigo-600 text-white"
                            : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search showcase..."
                      value={portfolioSearch}
                      onChange={(e) => setPortfolioSearch(e.target.value)}
                      className="text-xs pl-9 pr-4 py-2 w-full rounded-xl border border-zinc-200 outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockPortfolio
                    .filter(p => portfolioCategory === "All" || p.category === portfolioCategory)
                    .filter(p => p.title.toLowerCase().includes(portfolioSearch.toLowerCase()))
                    .map((proj) => (
                      <div key={proj.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden">
                        <div className="aspect-video w-full overflow-hidden relative">
                          <img
                            src={proj.image}
                            alt={proj.title}
                            referrerPolicy="no-referrer"
                            className="object-cover w-full h-full"
                          />
                        </div>

                        <div className="p-5 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-mono font-bold text-indigo-500">{proj.category}</span>
                              <h3 className="font-semibold text-sm text-zinc-900 dark:text-white mt-1">{proj.title}</h3>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="block font-bold text-xs text-indigo-500">{proj.stats.value}</span>
                              <span className="block text-[8px] font-mono uppercase text-zinc-400">{proj.stats.label}</span>
                            </div>
                          </div>

                          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">{proj.description}</p>
                          <div className="flex flex-wrap gap-1 pt-2 border-t">
                            {proj.tags.map((t, idx) => (
                              <span key={idx} className="text-[9px] font-mono bg-zinc-50 dark:bg-zinc-950 px-2 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* VIEW: CASE STUDIES PAGE */}
            {currentView === "case-studies" && (
              <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Performance Analytics</span>
                  <h1 className="font-display font-extrabold text-4xl text-zinc-900 dark:text-white tracking-tight">
                    Case Performance Reviews
                  </h1>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    A thorough review of challenge, solution, and audited results for select client applications.
                  </p>
                </div>

                <div className="space-y-12">
                  {mockCaseStudies.map((cs) => (
                    <div key={cs.id} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-1 space-y-3.5">
                        <span className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest font-bold">Client Brief</span>
                        <h2 className="font-display font-black text-xl text-zinc-900 dark:text-white">{cs.client}</h2>
                        <span className="inline-block text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-zinc-950 dark:text-cyan-400 px-3 py-1 rounded-lg">
                          {cs.category}
                        </span>
                        
                        <div className="pt-4 border-t">
                          <span className="block font-display font-black text-3xl text-emerald-500">{cs.metric}</span>
                          <span className="block text-[10px] font-mono uppercase text-zinc-400 mt-1">{cs.metricLabel}</span>
                        </div>
                      </div>

                      <div className="lg:col-span-2 space-y-6">
                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 font-bold">The Challenge</h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">{cs.challenge}</p>
                        </div>

                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 font-bold">Our Engineering Solution</h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">{cs.solution}</p>
                        </div>

                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 font-bold">Audited Metrics</h4>
                          <ul className="space-y-2.5 text-xs text-zinc-500">
                            {cs.results.map((res, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                                <span>{res}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW: PRICING PAGE (Visual Budget Calculator) */}
            {currentView === "pricing" && (
              <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Modeling</span>
                  <h1 className="font-display font-extrabold text-4xl text-zinc-900 dark:text-white tracking-tight">
                    Model Your Growth Budget
                  </h1>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Interactive sliders allow you to model custom specifications and see an instant estimate for your agency suite.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  
                  {/* Sliders Form */}
                  <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-6 shadow-sm">
                    <h3 className="font-display font-bold text-lg">Interactive Parameters</h3>

                    <div className="space-y-5">
                      {/* Slider 1: Design */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">Branding & UI/UX Design</span>
                          <span className="font-mono font-bold text-indigo-500">${designBudget.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="1000"
                          max="8000"
                          step="500"
                          value={designBudget}
                          onChange={(e) => setDesignBudget(Number(e.target.value))}
                          className="w-full accent-indigo-600 bg-zinc-200 dark:bg-zinc-800 h-2 rounded-lg appearance-none"
                        />
                        <span className="block text-[9px] text-zinc-400">Includes Figma prototypes, layout sheets, custom SVGs.</span>
                      </div>

                      {/* Slider 2: Engineering */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">Bespoke Engineering</span>
                          <span className="font-mono font-bold text-indigo-500">${engineeringBudget.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="2000"
                          max="15000"
                          step="1000"
                          value={engineeringBudget}
                          onChange={(e) => setEngineeringBudget(Number(e.target.value))}
                          className="w-full accent-indigo-600 bg-zinc-200 dark:bg-zinc-800 h-2 rounded-lg appearance-none"
                        />
                        <span className="block text-[9px] text-zinc-400">Includes React 19 web portals, Express REST APIs, cloud deployments.</span>
                      </div>

                      {/* Slider 3: AI assistants */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">Custom AI & Conversational Bots</span>
                          <span className="font-mono font-bold text-indigo-500">${aiBudget.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="1000"
                          max="10000"
                          step="500"
                          value={aiBudget}
                          onChange={(e) => setAiBudget(Number(e.target.value))}
                          className="w-full accent-indigo-600 bg-zinc-200 dark:bg-zinc-800 h-2 rounded-lg appearance-none"
                        />
                        <span className="block text-[9px] text-zinc-400">Includes Gemini knowledge vectors, HIPAA calendars, automatic workflows.</span>
                      </div>

                      {/* Slider 4: Marketing campaigns */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">Google & Meta Ad Campaigns</span>
                          <span className="font-mono font-bold text-indigo-500">${marketingBudget.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="500"
                          max="5000"
                          step="250"
                          value={marketingBudget}
                          onChange={(e) => setMarketingBudget(Number(e.target.value))}
                          className="w-full accent-indigo-600 bg-zinc-200 dark:bg-zinc-800 h-2 rounded-lg appearance-none"
                        />
                        <span className="block text-[9px] text-zinc-400">Includes laser targeted search lists, TikTok dynamic creatives, pixel sync.</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculations Sheet */}
                  <div className="bg-gradient-to-r from-indigo-950 via-zinc-900 to-indigo-950 p-8 sm:p-12 rounded-3xl text-white space-y-6 border border-zinc-800">
                    <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">Estimated SOW Brief</span>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <span className="text-xs text-zinc-400">Total Investment estimate</span>
                        <span className="font-display font-extrabold text-2xl text-white">${calculatedTotalBudget.toLocaleString()} USD</span>
                      </div>

                      <ul className="space-y-3.5 text-xs text-zinc-400 leading-relaxed">
                        <li>&bull; **Execution Window**: Projected delivery in **{calculatedTotalBudget < 8000 ? "4 Weeks" : "6-8 Weeks"}**.</li>
                        <li>&bull; **Portal Sync**: Includes continuous full development tracking in the **Client Dashboard**.</li>
                        <li>&bull; **AI Assistant**: Customized support desk trained on standard product specs.</li>
                        <li>&bull; **Warranty**: 12-Month speed checkup and secure dependency patch integrations.</li>
                      </ul>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setContactMessage(`Hi Paul, I modeled our custom digital agency budget on the visual pricing calculator to be around $${calculatedTotalBudget.toLocaleString()} USD. I would like to lock in this specification brief for our website and brand identity development.`);
                          setCurrentView("contact");
                          window.scrollTo({ top: document.getElementById("contact")?.offsetTop || 1200, behavior: "smooth" });
                        }}
                        className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        Secure Proposal for this Budget
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* VIEW: BLOG PAGE */}
            {currentView === "blog" && (
              <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Research Portal</span>
                  <h1 className="font-display font-extrabold text-4xl text-zinc-900 dark:text-white tracking-tight">
                    Corporate Growth Blog
                  </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Blog Feed */}
                  <div className="lg:col-span-2 space-y-8">
                    {blogPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4 hover:shadow-lg transition-all"
                      >
                        <span className="text-[10px] font-mono font-bold uppercase text-indigo-500 bg-indigo-500/10 px-2.5 py-0.5 rounded">
                          {post.category}
                        </span>
                        <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white leading-tight">
                          {post.title}
                        </h2>
                        <p className="text-xs text-zinc-500 leading-relaxed">{post.excerpt}</p>
                        
                        {/* Expandable Read Area */}
                        {activeBlog === post.id ? (
                          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-xs font-mono leading-relaxed whitespace-pre-wrap border text-zinc-600 dark:text-zinc-300">
                            {post.content}
                            <button
                              onClick={() => setActiveBlog(null)}
                              className="block mt-4 text-indigo-500 font-bold hover:underline"
                            >
                              Collapse Article
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveBlog(post.id)}
                            className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            Read Full Article
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pt-3 border-t">
                          <span>By {post.author}</span>
                          <span>{post.date} &bull; {post.readTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sidebar */}
                  <div className="lg:col-span-1 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-6 h-fit">
                    <h3 className="font-display font-semibold text-sm">About our Research</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Our engineering and design squad publishes research papers twice weekly covering React compilation limits, high-ROI social campaigns, and HIPAA compliance secure networks.
                    </p>
                    <div className="h-px bg-zinc-150" />
                    <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Tags Cloud</span>
                    <div className="flex flex-wrap gap-1.5 text-[9px] font-mono">
                      <span className="bg-zinc-100 dark:bg-zinc-950 px-2 py-0.5 rounded">React 19</span>
                      <span className="bg-zinc-100 dark:bg-zinc-950 px-2 py-0.5 rounded">Vite Compiler</span>
                      <span className="bg-zinc-100 dark:bg-zinc-950 px-2 py-0.5 rounded">Stripe Webhooks</span>
                      <span className="bg-zinc-100 dark:bg-zinc-950 px-2 py-0.5 rounded">Gemini API</span>
                      <span className="bg-zinc-100 dark:bg-zinc-950 px-2 py-0.5 rounded">SEO Audit</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: CAREERS PAGE */}
            {currentView === "careers" && (
              <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Open Roles</span>
                  <h1 className="font-display font-extrabold text-4xl text-zinc-900 dark:text-white tracking-tight">
                    Join our Remote Squad
                  </h1>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    We seek elite engineers, vector UI designers, and growth advertising managers from around the globe.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mockJobs.map((job) => (
                    <div key={job.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-indigo-500">{job.department} &bull; {job.location}</span>
                          <h3 className="font-semibold text-sm text-zinc-900 dark:text-white mt-1">{job.title}</h3>
                        </div>
                        <span className="text-xs font-bold text-emerald-500">{job.salary}</span>
                      </div>

                      <p className="text-xs text-zinc-500 leading-relaxed">{job.description}</p>

                      <div className="space-y-2">
                        <span className="block text-[10px] uppercase font-mono text-zinc-400 font-bold">Requirements:</span>
                        <ul className="space-y-1.5 text-xs text-zinc-500">
                          {job.requirements.map((req, idx) => (
                            <li key={idx}>&bull; {req}</li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => alert(`Strategic application form initialized. Please dispatch your portfolio links directly to paulchukenterprise@gmail.com.`)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all"
                      >
                        Submit Portfolio
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW: RESOURCES PAGE (Custom business document previews) */}
            {currentView === "resources" && (
              <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold">Files</span>
                  <h1 className="font-display font-extrabold text-4xl text-zinc-900 dark:text-white tracking-tight">
                    Standard Corporate Files
                  </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4">
                    <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white">Business Plan Draft</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Our complete corporate blueprint displaying operational overhead structures, hiring grids, and expected recurring software revenues.
                    </p>
                    <button
                      onClick={() => alert("Corporate Business Plan:\n- Target Market: High-growth B2B startups and hospitals.\n- Core Advantage: Apple-level layout aesthetic + Node Express middleware speed.\n- Target ARR: $500k by Q4 2026.")}
                      className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline"
                    >
                      Export Document
                    </button>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4">
                    <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white">Proposal Templates</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Sleek SOW agreements featuring budget breakdowns, milestones scheduling, and signature fields.
                    </p>
                    <button
                      onClick={() => setCurrentDashboard("client")}
                      className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline"
                    >
                      View Active SOW Drafts
                    </button>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4">
                    <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white">Corporate Pitch Deck</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      High-end slide decks describing our vector typography standards, conversion metrics, and HIPAA AI secure schemas.
                    </p>
                    <button
                      onClick={() => alert("Launching 12-slide Pitch Deck... [Visualizing slides covering Market pain, Lighthouse performance metrics, and Executive Bios]")}
                      className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline"
                    >
                      Play Presentation
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: CONTACT PAGE */}
            {currentView === "contact" && (
              <div id="contact" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 font-bold font-bold">Grow Your Company</span>
                  <h1 className="font-display font-extrabold text-4xl text-zinc-900 dark:text-white tracking-tight">
                    Lock In Discovery Consultation
                  </h1>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Submit your custom parameters. CEO Paul's strategy team will orchestrate your custom proposal blueprint.
                  </p>
                </div>

                <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-md">
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Your Full Name</label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Paul Investor"
                        required
                        className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Work Email</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. paulinvestor165@gmail.com"
                        required
                        className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Target Agency Service</label>
                      <select
                        value={contactService}
                        onChange={(e) => setContactService(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 outline-none bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      >
                        <option>Corporate Website Development</option>
                        <option>E-commerce Development</option>
                        <option>SaaS Platform Design</option>
                        <option>AI Chatbot Automation</option>
                        <option>Paid Ad Campaigns & SEO</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Project Details / Message</label>
                      <textarea
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Hi Paul, I would like to build a custom platform..."
                        className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingContact}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      {isSubmittingContact ? "Dispatching brief..." : "Secure Custom Proposal"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* LEGAL VIEWS */}
            {currentView === "privacy-policy" && (
              <div className="py-16 max-w-3xl mx-auto px-4 space-y-6 text-xs leading-relaxed text-zinc-500">
                <h1 className="font-display font-extrabold text-2xl text-zinc-900 dark:text-white">Privacy Policy</h1>
                <p>**Paul Digital Labs** respects your privacy. This document outlines how we secure and manage sensitive data...</p>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-white mt-4">1. Data Storage Proxy</h3>
                <p>All client metrics, digital signatures, and support tickets are isolated on secure server environments. We never sell, leak, or share access with third-party datasets.</p>
              </div>
            )}

            {currentView === "terms-of-service" && (
              <div className="py-16 max-w-3xl mx-auto px-4 space-y-6 text-xs leading-relaxed text-zinc-500">
                <h1 className="font-display font-extrabold text-2xl text-zinc-900 dark:text-white">Terms of Service</h1>
                <p>Welcome to **Paul Digital Labs**. By accessing this site, you agree to comply with our corporate conditions...</p>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-white mt-4">1. Digital Signatures</h3>
                <p>Digital signatures executed inside our Client Dashboard represent legally binding service agreements and milestones.</p>
              </div>
            )}

            {currentView === "cookie-policy" && (
              <div className="py-16 max-w-3xl mx-auto px-4 space-y-6 text-xs leading-relaxed text-zinc-500">
                <h1 className="font-display font-extrabold text-2xl text-zinc-900 dark:text-white">Cookie Policy</h1>
                <p>We use premium local session caches to remember your layout themes and active dashboard roles...</p>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Corporate Luxury Footer */}
      <Footer onViewChange={setCurrentView} onDashboardChange={setCurrentDashboard} />

      {/* Slide-out Gemini Assistant */}
      <AIChatbot />

    </div>
  );
}
