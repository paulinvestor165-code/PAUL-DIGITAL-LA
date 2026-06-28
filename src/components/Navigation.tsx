import { useState } from "react";
import { Menu, X, Sun, Moon, Briefcase, User, ShieldCheck, ChevronDown, Rocket, Layers } from "lucide-react";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  currentDashboard: "none" | "admin" | "client" | "employee";
  onDashboardChange: (dash: "none" | "admin" | "client" | "employee") => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navigation({
  currentView,
  onViewChange,
  currentDashboard,
  onDashboardChange,
  isDarkMode,
  toggleDarkMode,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const mainPages = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Portfolio" },
    { id: "case-studies", label: "Case Studies" },
    { id: "pricing", label: "Pricing" },
    { id: "blog", label: "Blog" },
    { id: "careers", label: "Careers" },
    { id: "resources", label: "Resources" },
    { id: "contact", label: "Contact" },
  ];

  const handlePageSelect = (viewId: string) => {
    onDashboardChange("none");
    onViewChange(viewId);
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  };

  return (
    <nav
      id="main-navigation"
      className="sticky top-0 z-50 w-full backdrop-blur-xl border-b transition-colors duration-300 bg-white/70 border-zinc-200 text-zinc-900 dark:bg-zinc-950/70 dark:border-zinc-800 dark:text-zinc-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div
            id="nav-logo"
            onClick={() => handlePageSelect("home")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-300">
              P
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
                Paul Digital Labs
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-indigo-500 dark:text-cyan-400 uppercase font-semibold">
                POWERED BY AI
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div id="desktop-menu" className="hidden lg:flex items-center gap-1.5">
            {/* Mega Menu Toggle for Services */}
            <div className="relative">
              <button
                id="mega-menu-trigger"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onClick={() => handlePageSelect("services")}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
              >
                Services
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isMegaMenuOpen ? "rotate-185" : ""}`} />
              </button>

              {/* Mega Menu overlay */}
              {isMegaMenuOpen && (
                <div
                  id="nav-mega-menu"
                  onMouseLeave={() => setIsMegaMenuOpen(false)}
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-[480px] rounded-2xl p-6 shadow-2xl border bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-display font-semibold text-xs tracking-wider text-indigo-500 dark:text-cyan-400 uppercase mb-3">
                        Technical Solutions
                      </h4>
                      <ul className="space-y-2.5">
                        <li>
                          <button
                            onClick={() => handlePageSelect("services")}
                            className="block text-left text-sm font-medium hover:text-indigo-600 dark:hover:text-cyan-400"
                          >
                            Corporate Website Dev
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handlePageSelect("services")}
                            className="block text-left text-sm font-medium hover:text-indigo-600 dark:hover:text-cyan-400"
                          >
                            Headless E-commerce
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handlePageSelect("services")}
                            className="block text-left text-sm font-medium hover:text-indigo-600 dark:hover:text-cyan-400"
                          >
                            Custom SaaS Platforms
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handlePageSelect("services")}
                            className="block text-left text-sm font-medium hover:text-indigo-600 dark:hover:text-cyan-400"
                          >
                            AI Assistants & Chatbots
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-xs tracking-wider text-indigo-500 dark:text-cyan-400 uppercase mb-3">
                        Brand & Growth
                      </h4>
                      <ul className="space-y-2.5">
                        <li>
                          <button
                            onClick={() => handlePageSelect("services")}
                            className="block text-left text-sm font-medium hover:text-indigo-600 dark:hover:text-cyan-400"
                          >
                            Apple-Level UI/UX Design
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handlePageSelect("services")}
                            className="block text-left text-sm font-medium hover:text-indigo-600 dark:hover:text-cyan-400"
                          >
                            Custom Brand Identity
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handlePageSelect("services")}
                            className="block text-left text-sm font-medium hover:text-indigo-600 dark:hover:text-cyan-400"
                          >
                            Google & Meta Growth Ads
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handlePageSelect("services")}
                            className="block text-left text-sm font-medium hover:text-indigo-600 dark:hover:text-cyan-400"
                          >
                            Enterprise Automations
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {mainPages.filter(p => p.id !== "services").map((page) => (
              <button
                key={page.id}
                onClick={() => handlePageSelect(page.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === page.id && currentDashboard === "none"
                    ? "text-indigo-600 dark:text-cyan-400 bg-indigo-50/50 dark:bg-zinc-900/50"
                    : "hover:text-indigo-600 dark:hover:text-cyan-400"
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>

          {/* Actions & Portal Pickers */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Dashboard Picker Trigger Buttons */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
              <button
                id="portal-btn-admin"
                onClick={() => {
                  onDashboardChange("admin");
                  onViewChange("dashboard");
                }}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  currentDashboard === "admin"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                }`}
                title="Admin Dashboard"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </button>
              <button
                id="portal-btn-client"
                onClick={() => {
                  onDashboardChange("client");
                  onViewChange("dashboard");
                }}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  currentDashboard === "client"
                    ? "bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/10"
                    : "hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                }`}
                title="Client Dashboard"
              >
                <User className="h-4 w-4" />
                Client
              </button>
              <button
                id="portal-btn-employee"
                onClick={() => {
                  onDashboardChange("employee");
                  onViewChange("dashboard");
                }}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  currentDashboard === "employee"
                    ? "bg-zinc-700 text-white shadow-md"
                    : "hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                }`}
                title="Employee Dashboard"
              >
                <Briefcase className="h-4 w-4" />
                Team
              </button>
            </div>

            {/* Dark Mode toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-zinc-600" />}
            </button>

            {/* CTA */}
            <button
              id="header-cta-btn"
              onClick={() => handlePageSelect("contact")}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <Rocket className="h-3.5 w-3.5" />
              Grow Now
            </button>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              id="mobile-theme-toggle"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              id="mobile-menu-burger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu-panel"
          className="lg:hidden border-t bg-white dark:bg-zinc-950 px-4 py-6 space-y-4"
        >
          <div className="flex flex-col gap-2">
            {mainPages.map((page) => (
              <button
                key={page.id}
                onClick={() => handlePageSelect(page.id)}
                className={`block w-full text-left py-2.5 px-4 rounded-xl text-sm font-semibold ${
                  currentView === page.id && currentDashboard === "none"
                    ? "bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-cyan-400"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>

          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-4" />

          {/* Dashboards selector for mobile */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 px-4">
              Explore Active Dashboards
            </h4>
            <div className="grid grid-cols-3 gap-2 px-2">
              <button
                onClick={() => {
                  onDashboardChange("admin");
                  onViewChange("dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl flex flex-col items-center gap-1.5 text-[11px] font-bold ${
                  currentDashboard === "admin"
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <ShieldCheck className="h-5 w-5" />
                Admin
              </button>
              <button
                onClick={() => {
                  onDashboardChange("client");
                  onViewChange("dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl flex flex-col items-center gap-1.5 text-[11px] font-bold ${
                  currentDashboard === "client"
                    ? "bg-cyan-500 text-zinc-950"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <User className="h-5 w-5" />
                Client
              </button>
              <button
                onClick={() => {
                  onDashboardChange("employee");
                  onViewChange("dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl flex flex-col items-center gap-1.5 text-[11px] font-bold ${
                  currentDashboard === "employee"
                    ? "bg-zinc-700 text-white"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <Briefcase className="h-5 w-5" />
                Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
