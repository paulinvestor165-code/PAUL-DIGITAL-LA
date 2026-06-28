import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, ArrowRight } from "lucide-react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "### Welcome to Paul Digital Labs! 👋\nI am **PDL-Assistant**, your specialized Growth & Strategy Specialist.\n\nI can help you:\n- **Conceptualize a custom web application** or SaaS platform.\n- **Estimate pricing** for our design, engineering, or AI automation suites.\n- **Outline a marketing campaign** to grow your user base.\n- **Guide you** through our client, employee, and admin dashboards!\n\nWhat kind of digital project are we building today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI agent.");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "**Connection Latency Alert:** I'm currently operating in offline mode. Please verify your GEMINI_API_KEY inside AI Studio's Secrets panel to enable the live model. \n\nWe design beautiful websites starting at $4,500! Let's schedule a Zoom call under our contact page to discuss details.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-chatbot-wrapper" className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          id="chatbot-toggle-btn"
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:scale-105 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/40 cursor-pointer group transition-all duration-300"
          title="Chat with PDL AI"
        >
          <MessageSquare className="h-6 w-6 group-hover:rotate-6 transition-transform" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 border border-white rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 border border-white rounded-full" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="chatbot-window"
          className="w-80 md:w-96 h-[500px] md:h-[600px] rounded-3xl shadow-3xl border flex flex-col overflow-hidden bg-white border-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 transition-all duration-300 transform scale-100 origin-bottom-right"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-zinc-900 to-indigo-950 px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                  PDL Assistant
                  <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
                </h4>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE & BULLETPROOF
                </p>
              </div>
            </div>
            <button
              id="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Box */}
          <div
            id="chatbot-messages-box"
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50 dark:bg-zinc-900/40"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-xs ${
                    msg.sender === "user"
                      ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {msg.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 mr-auto max-w-[85%]">
                <div className="h-7 w-7 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 animate-bounce" />
                </div>
                <div className="bg-white dark:bg-zinc-800 rounded-2xl px-4 py-3 shadow-sm border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-500 text-xs flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />
                  Paul's AI is writing...
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            id="chatbot-form"
            onSubmit={handleSendMessage}
            className="p-3 border-t border-zinc-100 bg-white dark:bg-zinc-900 dark:border-zinc-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about pricing, services, or dashboards..."
              required
              className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:bg-zinc-800 dark:border-zinc-700"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="h-9 w-9 shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white flex items-center justify-center transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
