import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  MinusCircle,
  Sparkles,
  Activity,
} from "lucide-react";

interface TestCounts {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
}

interface Suite {
  suiteName: string;
  category: string;
  status: string;
  lastRun: string;
  successRate: number;
  healthScore: number;
  testCounts: TestCounts;
}

interface TestSuiteCardProps {
  suite: Suite;
  onClick?: () => void;
}

export function TestSuiteCard({ suite, onClick }: TestSuiteCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const passRate =
    suite.testCounts.total > 0
      ? Math.round((suite.testCounts.passed / suite.testCounts.total) * 100)
      : 0;

  const palette =
    suite.testCounts.failed > 0
      ? {
          accent: "from-rose-400 to-pink-500",
          ring: "stroke-rose-500",
          text: "text-rose-700",
          bg: "bg-rose-50/60",
          chip: "bg-rose-100 text-rose-700 ring-rose-200",
          icon: <XCircle className="h-4 w-4 text-rose-600" />,
          glow: "group-hover:shadow-rose-300/40",
          hairline: "from-rose-200/0 via-rose-300/70 to-rose-200/0",
          label: "Failed",
        }
      : passRate >= 90
        ? {
            accent: "from-emerald-400 to-teal-500",
            ring: "stroke-emerald-500",
            text: "text-emerald-700",
            bg: "bg-emerald-50/60",
            chip: "bg-emerald-100 text-emerald-700 ring-emerald-200",
            icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
            glow: "group-hover:shadow-emerald-300/40",
            hairline: "from-emerald-200/0 via-emerald-300/70 to-emerald-200/0",
            label: "Passing",
          }
        : passRate >= 60
          ? {
              accent: "from-amber-400 to-orange-500",
              ring: "stroke-amber-500",
              text: "text-amber-700",
              bg: "bg-amber-50/60",
              chip: "bg-amber-100 text-amber-700 ring-amber-200",
              icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
              glow: "group-hover:shadow-amber-300/40",
              hairline: "from-amber-200/0 via-amber-300/70 to-amber-200/0",
              label: "Warning",
            }
          : {
              accent: "from-slate-300 to-slate-400",
              ring: "stroke-slate-400",
              text: "text-slate-600",
              bg: "bg-slate-50/60",
              chip: "bg-slate-100 text-slate-600 ring-slate-200",
              icon: <MinusCircle className="h-4 w-4 text-slate-500" />,
              glow: "group-hover:shadow-slate-300/40",
              hairline: "from-slate-200/0 via-slate-300/70 to-slate-200/0",
              label: "Idle",
            };

  // Donut geometry
  const size = 64;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (passRate / 100) * c;

  // Mini bar segments
  const totalForBar = Math.max(suite.testCounts.total, 1);
  const passedW = (suite.testCounts.passed / totalForBar) * 100;
  const failedW = (suite.testCounts.failed / totalForBar) * 100;
  const skippedW = (suite.testCounts.skipped / totalForBar) * 100;

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <div
        onClick={onClick}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 sm:p-6 transition-all duration-300 hover:border-slate-300 hover:shadow-xl shadow-sm ${palette.glow}`}
      >
        {/* Top hairline */}
        <div
          className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${palette.hairline}`}
        />

        {/* Subtle corner glow */}
        <div
          className={`pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-gradient-to-br ${palette.accent} opacity-[0.07] blur-2xl group-hover:opacity-[0.12] transition`}
        />

        <div className="flex items-start gap-4 sm:gap-5">
          {/* Donut */}
          <div className="flex-shrink-0 relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                strokeWidth={stroke}
                className="stroke-slate-100 fill-none"
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                strokeWidth={stroke}
                strokeLinecap="round"
                className={`${palette.ring} fill-none`}
                initial={{ strokeDasharray: `0 ${c}` }}
                animate={{ strokeDasharray: `${dash} ${c}` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-base font-semibold tabular-nums ${palette.text}`}
              >
                {passRate}%
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-slate-900 font-semibold truncate">
                  {suite.suiteName}
                </h3>
              </div>
              <div className="flex-shrink-0 flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider ring-1 font-medium ${palette.chip}`}
                >
                  {palette.icon}
                  {palette.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider ring-1 bg-indigo-50 text-indigo-700 ring-indigo-200">
                {suite.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {formatDate(suite.lastRun)}
              </span>
              <span className="text-slate-300 text-xs">·</span>
              <span className="text-xs text-slate-500">
                <span className="font-medium text-slate-700 tabular-nums">
                  {suite.testCounts.total}
                </span>{" "}
                test{suite.testCounts.total !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Mini bar */}
            <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-slate-100">
              {passedW > 0 && (
                <motion.div
                  className="bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${passedW}%` }}
                  transition={{ duration: 0.7 }}
                />
              )}
              {failedW > 0 && (
                <motion.div
                  className="bg-rose-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${failedW}%` }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                />
              )}
              {skippedW > 0 && (
                <motion.div
                  className="bg-slate-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${skippedW}%` }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                />
              )}
            </div>

            {/* Inline stats */}
            <div className="mt-3 flex items-center gap-3 text-xs flex-wrap">
              {suite.testCounts.passed > 0 && (
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="font-medium tabular-nums">
                    {suite.testCounts.passed}
                  </span>{" "}
                  passed
                </span>
              )}
              {suite.testCounts.failed > 0 && (
                <span className="inline-flex items-center gap-1 text-rose-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span className="font-medium tabular-nums">
                    {suite.testCounts.failed}
                  </span>{" "}
                  failed
                </span>
              )}
              {suite.testCounts.skipped > 0 && (
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span className="font-medium tabular-nums">
                    {suite.testCounts.skipped}
                  </span>{" "}
                  skipped
                </span>
              )}
              {suite.testCounts.flaky > 0 && (
                <span className="inline-flex items-center gap-1 text-amber-600">
                  <Sparkles className="h-3 w-3" />
                  <span className="font-medium tabular-nums">
                    {suite.testCounts.flaky}
                  </span>{" "}
                  flaky
                </span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 self-center">
            <div
              className={`h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center transition-all group-hover:bg-slate-900 ${palette.bg}`}
            >
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-white transition" />
            </div>
          </div>
        </div>

        {/* Health score progress */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Health score
          </span>
          <span className="tabular-nums font-medium text-slate-700">
            {suite.healthScore}/100
          </span>
        </div>
      </div>
    </motion.div>
  );
}
