import React, { useState, useEffect } from "react";
import {
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  DollarSign,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Loader2,
  Calendar,
  Layers
} from "lucide-react";
import { EmployeeTask } from "../../types";

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState<EmployeeTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Clock state metrics
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [totalHoursToday, setTotalHoursToday] = useState("0.0");

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/store");
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggleClock = () => {
    if (!isClockedIn) {
      const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      setIsClockedIn(true);
      setClockInTime(now);
      alert(`Clocked In successfully at ${now}. Let's build world-class tech!`);
    } else {
      setIsClockedIn(false);
      setClockInTime(null);
      setTotalHoursToday("8.0");
      alert("Clocked Out successfully! Excellent sprint metrics recorded.");
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Completed" ? "In Progress" : "Completed";
    try {
      const res = await fetch("/api/tasks/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: nextStatus }),
      });
      if (res.ok) {
        loadTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 text-zinc-700 animate-spin" />
        <p className="text-sm font-semibold text-zinc-500">
          Syncing secure Team Workspace...
        </p>
      </div>
    );
  }

  return (
    <div id="employee-dashboard" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
            Executive Developer Desk
          </span>
          <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white tracking-tight mt-1">
            Employee Workspace
          </h1>
          <p className="text-sm text-zinc-500">
            Clock metrics, claim assigned tickets, complete milestones, and review official corporate guidelines.
          </p>
        </div>

        {/* Clock In Widget */}
        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 p-2 rounded-2xl border">
          <div className="text-right px-2">
            <span className="block text-[10px] uppercase font-mono text-zinc-400">Sprint Tracking</span>
            <span className="font-semibold text-xs text-zinc-900 dark:text-white">
              {isClockedIn ? `Active since ${clockInTime}` : `Logged: ${totalHoursToday} hrs`}
            </span>
          </div>
          <button
            onClick={handleToggleClock}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              isClockedIn
                ? "bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-600/10"
                : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/10"
            }`}
          >
            {isClockedIn ? "Clock Out" : "Clock In"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SPRINT TICKETS WORKSPACE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-500" />
              Assigned Sprints & SOW Deliverables
            </h3>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl border bg-zinc-50 dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-xs ${task.status === "Completed" ? "line-through text-zinc-400" : "text-zinc-950 dark:text-white"}`}>
                        {task.title}
                      </span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                        task.priority === "High" ? "bg-rose-500/10 text-rose-500" : "bg-zinc-500/15 text-zinc-500"
                      }`}>
                        {task.priority} Priority
                      </span>
                    </div>
                    <span className="block text-[10px] text-zinc-400 font-mono mt-1">Project: {task.project} &bull; Due: {task.dueDate}</span>
                  </div>

                  <button
                    onClick={() => handleUpdateTaskStatus(task.id, task.status)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors shrink-0 ${
                      task.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                    }`}
                  >
                    {task.status === "Completed" ? "Completed ✓" : "Mark Complete"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Internal chat */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-500" />
              Team Communication Channel
            </h3>

            <div className="space-y-3 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border max-h-64 overflow-y-auto">
              <div className="text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-indigo-500">CEO Paul:</span>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    Team, let's keep a flawless focus on Web Vitals. Our next client expects high-contrast grids and zero Cumulative Layout Shift.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-cyan-500">Sarah Lin:</span>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    Just finalized the vector geometries for the real estate logo assets. Ready for developer markup.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-purple-400">Alex Vance:</span>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    Got it. Implementing the esbuild bundle structures now to bypass strict ES Module imports.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Message team channel..."
                className="text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    alert("Message sent to Paul Digital Labs internal Slack!");
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
              <button
                onClick={() => alert("Message sent to team!")}
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CORPORATE DOCUMENTS & SALARY */}
        <div className="space-y-8">
          
          {/* Payroll panel */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white flex items-center gap-1.5">
              <DollarSign className="h-5 w-5 text-indigo-500" />
              Compensation & Sprints
            </h3>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Base Salary Milestone</span>
                <span className="font-bold text-zinc-900 dark:text-white">$9,500.00 / mo</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Completed Sprint Bonuses</span>
                <span className="font-bold text-emerald-500">+$1,250.00</span>
              </div>
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
              <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-white">
                <span>Next Payroll Date</span>
                <span>July 05, 2026</span>
              </div>
            </div>

            <button
              onClick={() => alert("Exporting secure payment ledger with tax and pension specifications...")}
              className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-xs font-bold transition-colors"
            >
              Export Paystub Receipt
            </button>
          </div>

          {/* Handbook references */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              Standard Operating Files
            </h3>

            <div className="space-y-3.5">
              <div
                onClick={() => alert("Executive Guidelines:\n1. All commits must pass ESLint.\n2. Do not log sensitive API keys client side.\n3. Verify all layout spacing against the Figma design system.")}
                className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 hover:border-indigo-500/50 cursor-pointer transition-all flex items-center gap-3"
              >
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-semibold">Employee Handbook</span>
                  <span className="text-[10px] text-zinc-400">Rules of operation</span>
                </div>
              </div>

              <div
                onClick={() => alert("Service Agreements:\n- 12-month software stability maintenance.\n- Automated hourly database backups on GCP Cloud SQL/Firestore.\n- Instant emergency rollbacks.")}
                className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 hover:border-indigo-500/50 cursor-pointer transition-all flex items-center gap-3"
              >
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-semibold">Service Level Policy</span>
                  <span className="text-[10px] text-zinc-400">Maintenance specifications</span>
                </div>
              </div>

              <div
                onClick={() => alert("Client Onboarding Checklist:\n1. Schedule 30-min strategy Zoom.\n2. Draft Gemini proposal brief.\n3. Capture secure digital signature.\n4. Create initial deposit invoice.")}
                className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 hover:border-indigo-500/50 cursor-pointer transition-all flex items-center gap-3"
              >
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-semibold">Client Onboarding Guides</span>
                  <span className="text-[10px] text-zinc-400">Standard workflows</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
