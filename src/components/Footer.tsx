import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, Sparkles, Send } from "lucide-react";

interface FooterProps {
  onViewChange: (view: string) => void;
  onDashboardChange: (dash: "none" | "admin" | "client" | "employee") => void;
}

export default function Footer({ onViewChange, onDashboardChange }: FooterProps) {
  const handlePageSelect = (viewId: string) => {
    onDashboardChange("none");
    onViewChange(viewId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="main-footer"
      className="border-t bg-zinc-50 border-zinc-200 text-zinc-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400 pt-20 pb-12 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16">
          
          {/* Company Bio */}
          <div id="footer-bio-col" className="space-y-5">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handlePageSelect("home")}>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/10">
                P
              </div>
              <div>
                <span className="font-display font-bold text-base tracking-tight text-zinc-900 dark:text-white">
                  Paul Digital Labs
                </span>
                <span className="block text-[8px] font-mono tracking-widest text-indigo-500 dark:text-cyan-400 uppercase font-bold">
                  POWERED BY AI
                </span>
              </div>
            </div>
            
            <p className="text-xs leading-relaxed max-w-sm">
              We design luxurious Apple-level user experiences, engineer lightning-fast digital pipelines, and deploy secure conversational AI assistants to grow business value exponentially.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Core Pages Links */}
          <div id="footer-navigation-col" className="space-y-4">
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-zinc-950 dark:text-white">
              Corporate Site
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => handlePageSelect("home")} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">Home</button></li>
                <li><button onClick={() => handlePageSelect("about")} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">About Story</button></li>
                <li><button onClick={() => handlePageSelect("services")} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">Elite Services</button></li>
                <li><button onClick={() => handlePageSelect("portfolio")} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">Case Portfolio</button></li>
                <li><button onClick={() => handlePageSelect("case-studies")} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">Performance Studies</button></li>
              </ul>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => handlePageSelect("pricing")} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">Standard Pricing</button></li>
                <li><button onClick={() => handlePageSelect("blog")} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">Growth Insights</button></li>
                <li><button onClick={() => handlePageSelect("careers")} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">Open Positions</button></li>
                <li><button onClick={() => handlePageSelect("resources")} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">Templates & Tools</button></li>
                <li><button onClick={() => handlePageSelect("contact")} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">Contact Strategy</button></li>
              </ul>
            </div>
          </div>

          {/* Contact Details */}
          <div id="footer-contact-col" className="space-y-4">
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-zinc-950 dark:text-white">
              International Headquarters
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  One Apple Park Way, Suite 100<br />
                  Cupertino, CA 95014, USA
                </span>
              </li>
              <li className="flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-indigo-500 shrink-0" />
                  <a href="tel:+2347089724573" className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors font-semibold">
                    +234 (0) 708 972 4573 (Call / WhatsApp)
                  </a>
                </div>
                <div className="pl-7">
                  <a href="https://wa.me/2347089724573" target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-500 hover:underline font-mono">
                    WhatsApp Chat Link
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
                <a href="mailto:paulchukenterprise@gmail.com" className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors font-semibold">
                  paulchukenterprise@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Input */}
          <div id="footer-newsletter-col" className="space-y-4">
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Weekly Strategic Content
            </h4>
            <p className="text-xs leading-relaxed">
              Stay ahead of digital product engineering and AI workflow automations. Direct to your inbox.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Subscription complete! Welcome to Paul Digital Labs.");
              }}
              className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20"
            >
              <input
                type="email"
                placeholder="Enter work email..."
                required
                className="w-full text-xs px-2.5 py-1.5 outline-none bg-transparent"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                aria-label="Submit newsletter subscription"
              >
                <Send className="h-3 w-3" />
              </button>
            </form>
          </div>

        </div>

        {/* Lower row */}
        <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-medium tracking-wide">
          <div>
            &copy; 2026 Paul Digital Labs. All Rights Reserved. Designed by Paul and Vance.
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => handlePageSelect("privacy-policy")} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => handlePageSelect("terms-of-service")} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">
              Terms of Service
            </button>
            <button onClick={() => handlePageSelect("cookie-policy")} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors">
              Cookie Settings
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
