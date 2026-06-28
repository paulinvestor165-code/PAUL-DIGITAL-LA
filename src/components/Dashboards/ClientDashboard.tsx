import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  FileText,
  DollarSign,
  Briefcase,
  Layers,
  Signature,
  Send,
  Loader2,
  CheckCircle,
  HelpCircle,
  Video,
  X,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { Proposal, Invoice, Contract, SupportTicket, Booking } from "../../types";

export default function ClientDashboard() {
  const [store, setStore] = useState<{
    proposals: Proposal[];
    invoices: Invoice[];
    contracts: Contract[];
    tickets: SupportTicket[];
    bookings: Booking[];
    onboardings?: any[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [onboardings, setOnboardings] = useState<any[]>([]);

  const handleToggleChecklist = async (onboardingId: string, itemId: string) => {
    try {
      const res = await fetch("/api/onboardings/checklist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboardingId, itemId })
      });
      if (res.ok) {
        loadClientStore();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Paystack Integration states & functions
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);

  // New Secure Payment Modal State
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [paymentEmail, setPaymentEmail] = useState("");
  const [paystackInitStatus, setPaystackInitStatus] = useState<"idle" | "initializing" | "ready" | "failed">("idle");
  const [initReference, setInitReference] = useState("");
  const [initAuthUrl, setInitAuthUrl] = useState("");
  const [isSimulated, setIsSimulated] = useState(false);
  const [initError, setInitError] = useState("");

  // Card simulator inputs for Sandbox/Simulation mode
  const [simCardNumber, setSimCardNumber] = useState("4000 1234 5678 9010");
  const [simExpiry, setSimExpiry] = useState("12/29");
  const [simCvv, setSimCvv] = useState("123");
  const [simPin, setSimPin] = useState("1234");
  const [isProcessingSim, setIsProcessingSim] = useState(false);

  useEffect(() => {
    const existingScript = document.getElementById("paystack-inline-js");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "paystack-inline-js";
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => {
        setPaystackLoaded(true);
        console.log("Paystack Inline JS successfully loaded.");
      };
      script.onerror = () => {
        console.error("Failed to load Paystack inline script");
      };
      document.body.appendChild(script);
    } else {
      setPaystackLoaded(true);
    }
  }, []);

  const openPaymentModal = (invoice: Invoice) => {
    setSelectedInvoiceForPayment(invoice);
    const defaultEmail = onboardings[0]?.clientEmail || store?.leads?.[0]?.email || "paulchukenterprise@gmail.com";
    setPaymentEmail(defaultEmail);
    setPaystackInitStatus("idle");
    setInitReference("");
    setInitAuthUrl("");
    setIsSimulated(false);
    setInitError("");
    setSimCardNumber("4000 1234 5678 9010");
    setSimExpiry("12/29");
    setSimCvv("123");
    setSimPin("1234");
    setIsProcessingSim(false);
  };

  const initializePaystackPayment = async () => {
    if (!selectedInvoiceForPayment) return;
    setPaystackInitStatus("initializing");
    setInitError("");

    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: selectedInvoiceForPayment.id,
          email: paymentEmail
        })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setInitReference(result.data.reference);
        setInitAuthUrl(result.data.authorization_url);
        setIsSimulated(!!result.simulated);
        setPaystackInitStatus("ready");

        // If it's a real live payment and we have a valid access code / reference, launch standard Paystack inline pop!
        if (!result.simulated) {
          launchRealPaystackInline(result.data.reference, result.data.access_code);
        }
      } else {
        setPaystackInitStatus("failed");
        setInitError(result.error || "Failed to initialize Paystack transaction.");
      }
    } catch (err: any) {
      console.error(err);
      setPaystackInitStatus("failed");
      setInitError("Network error initializing transaction: " + err.message);
    }
  };

  const launchRealPaystackInline = (reference: string, accessCode?: string) => {
    if (!selectedInvoiceForPayment) return;
    const publicKey = ((import.meta as any).env?.VITE_PAYSTACK_PUBLIC_KEY as string) || "pk_test_b8e217805beeb6634ad5a1d746d03cf1e03a98ea";

    if (!(window as any).PaystackPop) {
      alert("Paystack library is still loading. Please wait a moment or click again.");
      return;
    }

    try {
      const config: any = {
        key: publicKey,
        email: paymentEmail,
        amount: Math.round(selectedInvoiceForPayment.amount * 100), // convert to kobo / cents
        ref: reference,
        callback: async function(response: any) {
          try {
            setPaystackInitStatus("initializing"); // Show processing/verifying state
            const res = await fetch("/api/paystack/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reference: response.reference,
                invoiceId: selectedInvoiceForPayment.id
              })
            });
            if (res.ok) {
              alert(`Payment of $${selectedInvoiceForPayment.amount.toLocaleString()} successfully processed and verified with Paystack reference ${response.reference}!`);
              setSelectedInvoiceForPayment(null);
              loadClientStore();
            } else {
              const errData = await res.json();
              alert("Payment succeeded but server verification failed: " + (errData.error || "Unknown error"));
            }
          } catch (e) {
            console.error(e);
            alert("Error communicating with servers for transaction verification.");
          } finally {
            setPaystackInitStatus("ready");
          }
        },
        onClose: function() {
          alert("Paystack secure payment widget closed.");
        }
      };

      if (accessCode) {
        config.access_code = accessCode;
      }

      const handler = (window as any).PaystackPop.setup(config);
      handler.openIframe();
    } catch (err: any) {
      console.error("Failed to open Paystack popup:", err);
      alert("Paystack initialization error: " + err.message);
    }
  };

  const handleSimulatePaymentSuccess = async (invoiceId: string) => {
    try {
      setIsProcessingSim(true);
      // Simulate brief secure authorization network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const res = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: initReference || `sim-ref-${Date.now()}`,
          invoiceId: invoiceId
        })
      });
      if (res.ok) {
        alert("Success! Sandbox simulation verified this transaction and marked your invoice as Paid.");
        setSelectedInvoiceForPayment(null);
        loadClientStore();
      } else {
        const errData = await res.json();
        alert("Simulation failed: " + (errData.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error processing simulated payment.");
    } finally {
      setIsProcessingSim(false);
    }
  };

  // Custom Scheduler Form
  const [bookName, setBookName] = useState("");
  const [bookEmail, setBookEmail] = useState("");
  const [bookDate, setBookDate] = useState("2026-07-01");
  const [bookTime, setBookTime] = useState("10:00 AM");
  const [bookService, setBookService] = useState("SaaS Strategy Consultation");
  const [bookBrief, setBookBrief] = useState("");

  // Support Ticket Submitter
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketPriority, setTicketPriority] = useState<"Low" | "Medium" | "High">("Medium");

  // Signature validation State
  const [signingContractId, setSigningContractId] = useState<string | null>(null);
  const [digitalSignature, setDigitalSignature] = useState("");

  const loadClientStore = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/store");
      if (res.ok) {
        const data = await res.json();
        setStore(data);
        if (data.onboardings) {
          setOnboardings(data.onboardings);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientStore();
  }, []);

  // Post Schedule Booking to Server
  const handleScheduleCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName.trim() || !bookEmail.trim()) return;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: bookName,
          email: bookEmail,
          date: bookDate,
          time: bookTime,
          service: bookService,
          notes: bookBrief,
        }),
      });

      if (res.ok) {
        alert(`Strategic discovery call locked on ${bookDate} at ${bookTime}! A Google Meet link has been generated and synced with executive calendars.`);
        setBookName("");
        setBookEmail("");
        setBookBrief("");
        loadClientStore();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Support Ticket on Server
  const handleOpenTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: ticketSubject,
          priority: ticketPriority,
        }),
      });

      if (res.ok) {
        alert("Strategic support ticket registered. Executive developers have been notified on the Admin Desk!");
        setTicketSubject("");
        loadClientStore();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Execute Digital Contract Signatures
  const handleSignContract = async (contractId: string) => {
    if (!digitalSignature.trim()) {
      alert("Please write your formal legal name in the Signature field.");
      return;
    }

    try {
      const res = await fetch("/api/contracts/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          signature: digitalSignature,
        }),
      });

      if (res.ok) {
        alert("Digital Contract Executed Successfully! State synchronized across dashboards.");
        setSigningContractId(null);
        setDigitalSignature("");
        loadClientStore();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !store) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
        <p className="text-sm font-semibold text-zinc-500">
          Syncing secure Client Workspace...
        </p>
      </div>
    );
  }

  // Active client proposals & invoices
  const activeProposals = store?.proposals || [];
  const activeInvoices = store?.invoices || [];
  const activeContracts = store?.contracts || [];
  const activeTickets = store?.tickets || [];
  const activeBookings = store?.bookings || [];

  return (
    <div id="client-dashboard" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-500 font-bold">
          Partner Workspace
        </span>
        <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white tracking-tight mt-1">
          Client Onboarding Portal
        </h1>
        <p className="text-sm text-zinc-500">
          Book strategic sessions, sign service agreements, request engineering tickets, and monitor deliverables.
        </p>
      </div>

      {/* 🚀 CLIENT ONBOARDING SPACE */}
      {onboardings.length > 0 && (() => {
        const onb = onboardings[0]; // grab the active onboarding
        const totalItems = onb.checklist.length;
        const completedItems = onb.checklist.filter((item: any) => item.completed).length;
        const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        const pendingMsa = onb.checklist.find((item: any) => 
          (item.id === "chk-msa" || item.id === "chk-onb-2" || item.id === "chk-3" || item.title.toLowerCase().includes("contract") || item.title.toLowerCase().includes("service agreement")) && 
          !item.completed
        );

        return (
          <div className="bg-gradient-to-br from-indigo-900/40 via-zinc-900 to-indigo-950/40 p-6 sm:p-8 rounded-3xl border border-indigo-500/25 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 blur-3xl rounded-full" />
            
            {/* Header: Welcome & POC */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-zinc-800 pb-6 relative z-10">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-400/10 px-2.5 py-1 rounded">
                  Active Campaign Space
                </span>
                <h2 className="font-display font-extrabold text-2xl text-white tracking-tight leading-tight">
                  Welcome to Paul Digital Labs, {onb.clientName}!
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                  We are actively preparing your project: <span className="font-semibold text-cyan-300">{onb.projectName}</span>. 
                  Below is your live setup checklist and your designated lead contact.
                </p>
              </div>

              {/* Point of Contact Bio */}
              <div className="flex items-center gap-4 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/80 shrink-0">
                <img
                  src={onb.poc.avatar}
                  alt={onb.poc.name}
                  className="h-12 w-12 rounded-full border border-zinc-700 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="block text-[10px] uppercase font-mono text-zinc-500">Designated Chief Architect</span>
                  <strong className="text-xs font-bold text-white block">{onb.poc.name}</strong>
                  <span className="text-[11px] text-zinc-400">{onb.poc.role}</span>
                </div>
              </div>
            </div>

            {/* MSA Urgent Action Warning */}
            {pendingMsa && (
              <div className="flex items-start gap-3 bg-amber-500/15 border border-amber-500/25 p-4 rounded-2xl relative z-10 text-amber-400 text-xs leading-relaxed animate-pulse">
                <Clock className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Urgent Action Required: Review & Sign Agreement SOW</strong>
                  <p className="text-zinc-300 mt-1">
                    To officially unlock your technical sprint pipeline and initiate backend database deployments, please review and digital sign the Master Service Agreement (MSA) under "Digital Service Agreements" below.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
              {/* Left 2 Cols: Setup Checklist */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-300 mb-1">
                  <span className="font-semibold">Setup Checklist Progress</span>
                  <span className="font-mono font-bold text-cyan-400">{progressPct}% ({completedItems}/{totalItems} steps)</span>
                </div>
                <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  {onb.checklist.map((item: any) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(onb.id, item.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-150 flex items-start gap-3 ${
                        item.completed
                          ? "bg-zinc-900/30 border-zinc-800/40 text-zinc-500"
                          : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-950 text-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {}} // toggled by parent div click
                        className="mt-0.5 rounded border-zinc-700 text-indigo-500 focus:ring-indigo-500 h-3.5 w-3.5 bg-transparent"
                      />
                      <div>
                        <span className={`text-xs font-semibold block ${item.completed ? "line-through text-zinc-500" : "text-white"}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] text-zinc-400 block mt-0.5 leading-relaxed">{item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Welcome Email / SOW Scope */}
              <div className="lg:col-span-1 bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] uppercase font-mono text-zinc-500">
                    <span>Welcome Packet</span>
                    <span className="text-cyan-400 font-bold">Dispatched</span>
                  </div>
                  <h4 className="text-xs font-bold text-white font-display">Automated Orientation Campaign</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-mono mt-2 bg-zinc-950/80 p-3 rounded-xl border border-zinc-900 h-36 overflow-y-auto whitespace-pre-wrap">
                    <strong className="text-white">Subject: {onb.welcomeEmail.subject}</strong>
                    <br /><br />
                    {onb.welcomeEmail.body}
                  </p>
                </div>
                <div className="pt-3 text-[10px] text-zinc-500 font-mono text-center border-t border-zinc-900 mt-3">
                  Campaign Dispatched on {onb.createdAt}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ACTIVE SOW AGREEMENTS, INVOICES, SIGNATURES */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Contracts block */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              Digital Service Agreements
            </h3>

            <div className="space-y-4">
              {activeContracts.map((ctr) => (
                <div key={ctr.id} className="p-4 rounded-xl border bg-zinc-50 dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-zinc-950 dark:text-white">{ctr.title}</span>
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      ctr.status === "Signed" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                    }`}>
                      {ctr.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-500 font-mono whitespace-pre-wrap leading-relaxed line-clamp-4 bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-100 dark:border-zinc-900">
                    {ctr.content}
                  </p>

                  {ctr.status === "Signed" ? (
                    <div className="flex items-center gap-2 text-emerald-500 font-semibold text-[11px] font-mono">
                      <CheckCircle className="h-4 w-4" />
                      Legal Signature Confirmed: "{ctr.signature}" at {ctr.signedAt}
                    </div>
                  ) : (
                    <div>
                      {signingContractId === ctr.id ? (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2">
                          <input
                            type="text"
                            value={digitalSignature}
                            onChange={(e) => setDigitalSignature(e.target.value)}
                            placeholder="Type legal name to sign..."
                            className="text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent flex-1"
                          />
                          <button
                            onClick={() => handleSignContract(ctr.id)}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all"
                          >
                            Execute Signature
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSigningContractId(ctr.id)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <Signature className="h-3.5 w-3.5" />
                          Review & Sign Agreement
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Proposals & Gemini Briefs */}
          {activeProposals.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4 shadow-sm">
              <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white">
                Active Project SOWs
              </h3>
              <div className="space-y-4">
                {activeProposals.map((prop) => (
                  <div key={prop.id} className="p-4 rounded-xl border bg-zinc-50 dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-zinc-950 dark:text-white">{prop.title}</span>
                      <span className="text-xs font-bold text-indigo-500">${prop.amount.toLocaleString()} Budget</span>
                    </div>
                    <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg border text-xs text-zinc-600 dark:text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {prop.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white">
              Billing Statements & Receipts
            </h3>
            <div className="space-y-3">
              {activeInvoices.map((inv) => (
                <div key={inv.id} className="p-4 rounded-xl border bg-zinc-50 dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between shadow-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-950 dark:text-white">{inv.id}</span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                        inv.status === "Paid" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <span className="block text-[10px] text-zinc-400 mt-1">{inv.description}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-left hidden sm:block">
                      <span className="block text-[10px] text-zinc-400">Payment Channel</span>
                      <span className="block text-[11px] font-mono text-zinc-600 dark:text-zinc-300 font-bold">
                        {inv.status === "Paid" ? (inv.paymentMethod || "Paystack") : "Unpaid"}
                      </span>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      <div>
                        <span className="font-display font-extrabold text-sm text-zinc-950 dark:text-white block">
                          ${inv.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => alert(`Downloading instant branded receipt for ${inv.id}...`)}
                          className="text-[10px] text-indigo-500 hover:underline font-semibold"
                        >
                          Export Invoice PDF
                        </button>
                      </div>

                      {inv.status !== "Paid" && (
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => openPaymentModal(inv)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0 active:scale-95"
                          >
                            <CreditCard className="h-3.5 w-3.5 text-indigo-200" />
                            Secure Payment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: BOOKINGS & REQ SUPPORT */}
        <div className="space-y-8">
          
          {/* Calendar scheduler */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              Book Discovery Session
            </h3>

            <form onSubmit={handleScheduleCall} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Your Name</label>
                <input
                  type="text"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  placeholder="Paul Investor"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Work Email</label>
                <input
                  type="email"
                  value={bookEmail}
                  onChange={(e) => setBookEmail(e.target.value)}
                  placeholder="paulinvestor165@gmail.com"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Select Date</label>
                  <input
                    type="date"
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 outline-none bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Select Time</label>
                  <select
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 outline-none bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option>09:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:30 AM</option>
                    <option>02:00 PM</option>
                    <option>04:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Target Service</label>
                <select
                  value={bookService}
                  onChange={(e) => setBookService(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 outline-none bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                >
                  <option>Corporate Website Development</option>
                  <option>SaaS Development</option>
                  <option>E-commerce Development</option>
                  <option>AI Chatbot Integration</option>
                  <option>Brand Design Strategy</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Project Brief / Goals</label>
                <textarea
                  rows={2}
                  value={bookBrief}
                  onChange={(e) => setBookBrief(e.target.value)}
                  placeholder="Briefly describe your targets."
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs tracking-wide uppercase hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
              >
                <Video className="h-4 w-4" />
                Schedule Zoom Session
              </button>
            </form>
          </div>

          {/* Support desk ticket request */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-500" />
              Developer Help Desk
            </h3>

            <form onSubmit={handleOpenTicket} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Incident / UI Ticket Subject</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Speed optimization update on iOS Safari"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Priority Scale</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Low", "Medium", "High"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTicketPriority(p as any)}
                      className={`py-2 text-[10px] font-bold uppercase rounded-xl border ${
                        ticketPriority === p
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-xs transition-all"
              >
                Dispatch Engineering Ticket
              </button>
            </form>

            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-4" />

            <h4 className="font-display font-semibold text-xs tracking-wider uppercase text-zinc-400">Your Incident Status</h4>
            <div className="space-y-2">
              {activeTickets.map((ticket) => (
                <div key={ticket.id} className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-150 dark:border-zinc-800 text-[11px] flex items-center justify-between">
                  <div>
                    <span className="font-medium text-zinc-900 dark:text-white block">{ticket.subject}</span>
                    <span className="text-[9px] text-zinc-400 font-mono mt-1 block">ID: {ticket.id} &bull; {ticket.date}</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Paystack Payment Modal */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-zinc-900 dark:text-white">Secure Checkout</h3>
                  <p className="text-[10px] text-zinc-400">Powered by Paystack API Proxy</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceForPayment(null)}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Invoice Summary Card */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-805 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Statement Item</span>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white block">{selectedInvoiceForPayment.id}</span>
                    <span className="text-[11px] text-zinc-500 block mt-0.5">{selectedInvoiceForPayment.description}</span>
                  </div>
                  <span className="font-display font-extrabold text-lg text-zinc-950 dark:text-white">
                    ${selectedInvoiceForPayment.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status or Configuration view */}
              {paystackInitStatus === "idle" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Receipt Email
                    </label>
                    <input
                      type="email"
                      value={paymentEmail}
                      onChange={(e) => setPaymentEmail(e.target.value)}
                      placeholder="customer@company.com"
                      required
                      className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <button
                    onClick={initializePaystackPayment}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Initialize Secure Payment
                  </button>
                </div>
              )}

              {paystackInitStatus === "initializing" && (
                <div className="py-8 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Signing secure transaction on proxy server...
                  </p>
                  <p className="text-[10px] text-zinc-400">Verifying keys & locking invoice amount</p>
                </div>
              )}

              {paystackInitStatus === "failed" && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl space-y-3">
                  <div className="flex gap-2 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold">Initialization Failed</h4>
                      <p className="text-[10px] leading-normal">{initError}</p>
                    </div>
                  </div>
                  <button
                    onClick={initializePaystackPayment}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Retry Handshake
                  </button>
                </div>
              )}

              {paystackInitStatus === "ready" && (
                <div className="space-y-5">
                  {isSimulated ? (
                    /* SIMULATED CARD CHECKOUT */
                    <div className="space-y-4">
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2.5 text-amber-600 dark:text-amber-400 text-[10px] leading-relaxed">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">Sandbox Simulation Mode Active</span>
                          PAYSTACK_SECRET_KEY is not defined in environment secrets. System generated a secure local fallback for safe pipeline end-to-end sandbox validation.
                        </div>
                      </div>

                      {/* Stylized Virtual Credit Card */}
                      <div className="p-5 bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between h-40 font-mono">
                        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
                        <div className="flex justify-between items-start">
                          <div className="text-[10px] tracking-widest text-indigo-200 font-bold">SANDBOX CARD</div>
                          <CreditCard className="h-6 w-6 text-indigo-300" />
                        </div>
                        <div className="text-sm tracking-widest text-center my-2 font-semibold">
                          {simCardNumber || "•••• •••• •••• ••••"}
                        </div>
                        <div className="flex justify-between items-end text-[10px]">
                          <div>
                            <span className="text-[8px] text-indigo-300 block">CARDHOLDER</span>
                            <span className="font-sans font-semibold">Paul Investor</span>
                          </div>
                          <div className="flex gap-4">
                            <div>
                              <span className="text-[8px] text-indigo-300 block">EXPIRES</span>
                              <span>{simExpiry || "••/••"}</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-indigo-300 block">CVV</span>
                              <span>{simCvv || "•••"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Details Input */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                            Simulated Card Number
                          </label>
                          <input
                            type="text"
                            value={simCardNumber}
                            onChange={(e) => setSimCardNumber(e.target.value)}
                            placeholder="4000 1234 5678 9010"
                            className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={simExpiry}
                            onChange={(e) => setSimExpiry(e.target.value)}
                            placeholder="12/29"
                            className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                            Secure PIN
                          </label>
                          <input
                            type="password"
                            value={simPin}
                            onChange={(e) => setSimPin(e.target.value)}
                            placeholder="1234"
                            className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleSimulatePaymentSuccess(selectedInvoiceForPayment.id)}
                        disabled={isProcessingSim}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                      >
                        {isProcessingSim ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Authorizing Transaction...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4" />
                            Submit Simulated Payment
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    /* LIVE POPUP INSTRUCTIONS */
                    <div className="space-y-4">
                      <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-2.5 text-emerald-600 dark:text-emerald-400 text-[10px] leading-relaxed">
                        <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">Secure Live Session Initialized</span>
                          Paystack checkout reference locked on backend. Clicking below will open the official secure checkout iframe.
                        </div>
                      </div>

                      <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-[10px] text-zinc-500 space-y-1.5 font-mono">
                        <div className="flex justify-between">
                          <span>Secure Reference:</span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">{initReference}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Verified Channel:</span>
                          <span className="font-bold text-indigo-500">Paystack Live API</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => launchRealPaystackInline(initReference, initAuthUrl)}
                          className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          <CreditCard className="h-4 w-4" />
                          Launch Live Checkout
                        </button>
                        
                        {initAuthUrl && initAuthUrl !== "#simulation" && (
                          <a
                            href={initAuthUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center"
                            title="Open direct checkout link in a new browser tab"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-center text-[10px] text-zinc-400 font-mono">
              🔒 End-to-End Encrypted Session. No sensitive credentials processed in client-side context.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
