import { useEffect, useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Activity,
  Zap,
} from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface StatsHeaderProps {
  passRate: number;
  failedSuites: number;
  passedSuites: number;
  totalTests: number;
  totalSuites: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  lastUpdated: string;
}

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 120, damping: 22 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", latest => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springValue]);

  return (
    <>
      {displayValue}
      {suffix}
    </>
  );
}

export function StatsHeader({
  passRate,
  failedSuites,
  passedSuites,
  totalTests,
  totalSuites,
  passedTests,
  failedTests,
  skippedTests,
  lastUpdated,
}: StatsHeaderProps) {
  const formatLastUpdated = (dateString: string) => {
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
    return `${diffDays}d ago`;
  };

  const accent =
    passRate >= 80
      ? {
          bg: "from-emerald-400 to-teal-500",
          text: "text-emerald-700",
          dot: "bg-emerald-500",
          ring: "stroke-emerald-500",
          glow: "shadow-emerald-500/30",
        }
      : passRate >= 50
        ? {
            bg: "from-amber-400 to-orange-500",
            text: "text-amber-700",
            dot: "bg-amber-500",
            ring: "stroke-amber-500",
            glow: "shadow-amber-500/30",
          }
        : {
            bg: "from-rose-400 to-pink-500",
            text: "text-rose-700",
            dot: "bg-rose-500",
            ring: "stroke-rose-500",
            glow: "shadow-rose-500/30",
          };

  const statusText =
    failedSuites === 0
      ? "All systems green"
      : passRate >= 80
        ? "Mostly healthy"
        : passRate >= 50
          ? "Some failures detected"
          : "Needs attention";

  const TrendIcon = passRate >= 80 ? TrendingUp : TrendingDown;

  // Donut geometry
  const size = 220;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (passRate / 100) * c;

  // Test split for the bar
  const totalTestsForBar = Math.max(totalTests, 1);
  const passedW = (passedTests / totalTestsForBar) * 100;
  const failedW = (failedTests / totalTestsForBar) * 100;
  const skippedW = (skippedTests / totalTestsForBar) * 100;

  return (
    <div className="relative overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-indigo-50/60" />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 25% 20%, rgba(165,180,252,0.5), transparent 60%), radial-gradient(ellipse 50% 50% at 80% 70%, rgba(110,231,183,0.4), transparent 65%), radial-gradient(ellipse 40% 30% at 70% 5%, rgba(244,114,182,0.25), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at 50% 0%, black 35%, transparent 80%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-10">
        {/* Title row */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4 flex-wrap">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-medium">
                Live · E2E Test Run
              </span>
            </div>
            <h1 className="text-slate-900 text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
              Test Health <span className="text-slate-400">/</span>{" "}
              <span className={accent.text}>{statusText}</span>
            </h1>
            <div className="flex items-center gap-3 mt-3 flex-wrap text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Updated {formatLastUpdated(lastUpdated)}
              </span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                {totalSuites} suite{totalSuites !== 1 ? "s" : ""}
              </span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                {totalTests} test{totalTests !== 1 ? "s" : ""}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/70 shadow-sm ${accent.text}`}
          >
            <TrendIcon className="h-4 w-4" />
            <span className="font-semibold tabular-nums text-lg">
              <AnimatedCounter value={passRate} suffix="%" />
            </span>
            <span className="text-xs text-slate-500">overall</span>
          </motion.div>
        </div>

        {/* Hero grid: donut + metric grid */}
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Donut */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-4 flex items-center justify-center"
          >
            <div className="relative" style={{ width: size, height: size }}>
              {/* Outer glow */}
              <div
                className={`absolute inset-2 rounded-full blur-2xl opacity-30 bg-gradient-to-br ${accent.bg}`}
              />
              <svg
                width={size}
                height={size}
                className="relative -rotate-90 drop-shadow-md"
              >
                <defs>
                  <linearGradient
                    id="donutGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={
                        passRate >= 80
                          ? "#10b981"
                          : passRate >= 50
                            ? "#f59e0b"
                            : "#f43f5e"
                      }
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        passRate >= 80
                          ? "#14b8a6"
                          : passRate >= 50
                            ? "#fb923c"
                            : "#ec4899"
                      }
                    />
                  </linearGradient>
                </defs>
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  strokeWidth={stroke}
                  className="stroke-slate-200/60 fill-none"
                />
                <motion.circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  stroke="url(#donutGrad)"
                  className="fill-none"
                  initial={{ strokeDasharray: `0 ${c}` }}
                  animate={{ strokeDasharray: `${dash} ${c}` }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-6xl sm:text-7xl font-semibold tabular-nums text-slate-900">
                  <AnimatedCounter value={passRate} />
                  <span className="text-3xl text-slate-400 ml-1">%</span>
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.25em] text-slate-500 font-medium">
                  pass rate
                </div>
              </div>
            </div>
          </motion.div>

          {/* Metrics + bar */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <MetricTile
                tone="success"
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="Passed"
                value={passedTests}
                sub={`of ${totalTests}`}
                delay={0.18}
              />
              <MetricTile
                tone="danger"
                icon={<XCircle className="h-4 w-4" />}
                label="Failed"
                value={failedTests}
                sub={failedSuites > 0 ? `${failedSuites} suite${failedSuites > 1 ? "s" : ""}` : "no failures"}
                delay={0.24}
              />
              <MetricTile
                tone="muted"
                icon={<MinusCircle className="h-4 w-4" />}
                label="Skipped"
                value={skippedTests}
                sub={`${skippedTests > 0 ? "manual / gated" : "none"}`}
                delay={0.3}
              />
              <MetricTile
                tone="info"
                icon={<Activity className="h-4 w-4" />}
                label="Suites"
                value={totalSuites}
                sub={`${passedSuites} green · ${failedSuites} red`}
                delay={0.36}
              />
            </div>

            {/* Stacked bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/70 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">
                  Test breakdown
                </span>
                <span className="text-xs text-slate-500">
                  {totalTests} total
                </span>
              </div>
              <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100">
                {passedW > 0 && (
                  <motion.div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${passedW}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                )}
                {failedW > 0 && (
                  <motion.div
                    className="bg-gradient-to-r from-rose-400 to-rose-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${failedW}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  />
                )}
                {skippedW > 0 && (
                  <motion.div
                    className="bg-gradient-to-r from-slate-300 to-slate-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${skippedW}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  />
                )}
              </div>
              <div className="flex items-center gap-4 mt-3 flex-wrap text-xs">
                <Legend dot="bg-emerald-500" label="Passed" value={passedTests} />
                <Legend dot="bg-rose-500" label="Failed" value={failedTests} />
                <Legend
                  dot="bg-slate-400"
                  label="Skipped"
                  value={skippedTests}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({
  dot,
  label,
  value,
}: {
  dot: string;
  label: string;
  value: number;
}) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-900 tabular-nums font-medium">{value}</span>
    </div>
  );
}

interface MetricTileProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  tone: "success" | "danger" | "info" | "muted";
  delay: number;
}

function MetricTile({ icon, label, value, sub, tone, delay }: MetricTileProps) {
  const styles = {
    success: {
      iconBox: "bg-emerald-100 text-emerald-700 ring-emerald-200",
      value: "text-emerald-900",
      bar: "bg-gradient-to-b from-emerald-300 to-emerald-500",
      bg: "from-emerald-50/80 via-white to-white",
    },
    danger: {
      iconBox: "bg-rose-100 text-rose-700 ring-rose-200",
      value: "text-rose-900",
      bar: "bg-gradient-to-b from-rose-300 to-rose-500",
      bg: "from-rose-50/80 via-white to-white",
    },
    info: {
      iconBox: "bg-indigo-100 text-indigo-700 ring-indigo-200",
      value: "text-indigo-900",
      bar: "bg-gradient-to-b from-indigo-300 to-indigo-500",
      bg: "from-indigo-50/80 via-white to-white",
    },
    muted: {
      iconBox: "bg-slate-100 text-slate-500 ring-slate-200",
      value: "text-slate-700",
      bar: "bg-gradient-to-b from-slate-200 to-slate-400",
      bg: "from-slate-50/80 via-white to-white",
    },
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br ${styles.bg} backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}
    >
      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r ${styles.bar}`} />
      <div className="flex items-center justify-between mb-2 pl-1.5">
        <span className="text-[11px] uppercase tracking-widest text-slate-500 font-medium">
          {label}
        </span>
        <div
          className={`inline-flex items-center justify-center h-7 w-7 rounded-lg ring-1 ${styles.iconBox}`}
        >
          {icon}
        </div>
      </div>
      <div
        className={`pl-1.5 text-3xl sm:text-4xl font-semibold tabular-nums ${styles.value}`}
      >
        <AnimatedCounter value={value} />
      </div>
      <div className="pl-1.5 text-xs text-slate-500 mt-1">{sub}</div>
    </motion.div>
  );
}
