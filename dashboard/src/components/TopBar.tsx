import { motion } from "framer-motion";
import { Activity, Github, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30"
          >
            <Activity className="h-4 w-4 text-white" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition" />
          </motion.div>
          <div className="flex items-baseline gap-2">
            <span className="text-slate-900 font-semibold tracking-tight">
              Bamboo
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500 font-medium">
              QA Dashboard
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          <a
            href="/reports/index.html"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Open Playwright HTML report"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Playwright Report
          </a>
          <a
            href="https://github.com/DHMaiKhanhdeveloper/bamboo-gateway"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="GitHub repository"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
