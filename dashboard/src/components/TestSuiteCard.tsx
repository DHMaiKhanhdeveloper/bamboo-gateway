import { motion } from "framer-motion";
import { Card } from "./ui/card";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  AlertTriangle,
  MinusCircle,
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
    passRate >= 90
      ? {
          bar: "from-emerald-400 to-emerald-600",
          ring: "ring-emerald-200",
          glow: "group-hover:shadow-emerald-200/50",
          accent: "text-emerald-700",
          bg: "bg-emerald-50",
          stroke: "stroke-emerald-500",
          chip: "bg-emerald-100 text-emerald-700 ring-emerald-200",
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
        }
      : passRate >= 60
        ? {
            bar: "from-amber-400 to-amber-600",
            ring: "ring-amber-200",
            glow: "group-hover:shadow-amber-200/50",
            accent: "text-amber-700",
            bg: "bg-amber-50",
            stroke: "stroke-amber-500",
            chip: "bg-amber-100 text-amber-700 ring-amber-200",
            icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
          }
        : {
            bar: "from-rose-400 to-rose-600",
            ring: "ring-rose-200",
            glow: "group-hover:shadow-rose-200/50",
            accent: "text-rose-700",
            bg: "bg-rose-50",
            stroke: "stroke-rose-500",
            chip: "bg-rose-100 text-rose-700 ring-rose-200",
            icon: <XCircle className="h-4 w-4 text-rose-600" />,
          };

  // Donut chart geometry
  const size = 56;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (passRate / 100) * c;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.15 }}
    >
      <Card
        onClick={onClick}
        className={`group relative cursor-pointer overflow-hidden border border-slate-200 bg-white py-0 transition-all duration-300 hover:border-slate-300 hover:shadow-xl ${palette.glow}`}
      >
        <div
          className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${palette.bar}`}
        />

        <div className="flex items-center gap-4 p-4 sm:p-5 pl-5 sm:pl-6">
          <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
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
                className={`${palette.stroke} fill-none`}
                initial={{ strokeDasharray: `0 ${c}` }}
                animate={{ strokeDasharray: `${dash} ${c}` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-semibold tabular-nums ${palette.accent}`}>
                {passRate}%
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              {palette.icon}
              <h3 className="text-slate-900 font-medium truncate">
                {suite.suiteName}
              </h3>
              <span
                className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wider ring-1 ${palette.chip}`}
              >
                {suite.category}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(suite.lastRun)}
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-medium text-slate-700">
                {suite.testCounts.total}{" "}
                {suite.testCounts.total === 1 ? "test" : "tests"}
              </span>

              {suite.testCounts.passed > 0 && (
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {suite.testCounts.passed} passed
                </span>
              )}
              {suite.testCounts.failed > 0 && (
                <span className="inline-flex items-center gap-1 text-rose-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  {suite.testCounts.failed} failed
                </span>
              )}
              {suite.testCounts.skipped > 0 && (
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <MinusCircle className="h-3 w-3" />
                  {suite.testCounts.skipped} skipped
                </span>
              )}
              {suite.testCounts.flaky > 0 && (
                <span className="inline-flex items-center gap-1 text-amber-600">
                  <AlertTriangle className="h-3 w-3" />
                  {suite.testCounts.flaky} flaky
                </span>
              )}
            </div>
          </div>

          <ChevronRight className="hidden sm:block h-5 w-5 text-slate-300 transition-all group-hover:text-slate-600 group-hover:translate-x-0.5" />
        </div>

        <div className="h-1 w-full bg-slate-100">
          <motion.div
            className={`h-full bg-gradient-to-r ${palette.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${passRate}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </Card>
    </motion.div>
  );
}
