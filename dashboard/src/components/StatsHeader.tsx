import { useEffect, useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  Sparkles,
} from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface StatsHeaderProps {
  passRate: number;
  failedSuites: number;
  passedSuites: number;
  totalTests: number;
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
          ring: "#10b981",
          text: "text-emerald-700",
          chip: "bg-emerald-100 text-emerald-700 ring-emerald-200",
        }
      : passRate >= 50
        ? {
            ring: "#f59e0b",
            text: "text-amber-700",
            chip: "bg-amber-100 text-amber-700 ring-amber-200",
          }
        : {
            ring: "#f43f5e",
            text: "text-rose-700",
            chip: "bg-rose-100 text-rose-700 ring-rose-200",
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

  const donutData = [
    { name: "passed", value: Math.max(passRate, 0.001) },
    { name: "rest", value: Math.max(100 - passRate, 0.001) },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 25%, rgba(165,180,252,0.45), transparent 45%), radial-gradient(circle at 85% 80%, rgba(110,231,183,0.35), transparent 50%), radial-gradient(circle at 70% 12%, rgba(251,113,133,0.25), transparent 45%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-8 sm:pb-10">
        <motion.div
          className="flex items-center gap-2 mb-3"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 ring-1 ring-indigo-200 backdrop-blur-sm shadow-sm">
            <Sparkles className="h-3 w-3 text-indigo-500" />
            <span className="text-[11px] uppercase tracking-wider text-indigo-700 font-medium">
              Bamboo Gateway · E2E
            </span>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-slate-900 text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
              Test Dashboard
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-sm">
                  Updated {formatLastUpdated(lastUpdated)}
                </span>
              </span>
              <span className="text-slate-300">·</span>
              <span
                className={`inline-flex items-center gap-1.5 text-sm ${accent.text} font-medium`}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {statusText}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto lg:mx-0"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  innerRadius="74%"
                  outerRadius="92%"
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive
                  animationDuration={900}
                >
                  <Cell fill={accent.ring} />
                  <Cell fill="rgba(15,23,42,0.06)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-5xl sm:text-6xl font-semibold tabular-nums text-slate-900">
                <AnimatedCounter value={passRate} />
                <span className="text-2xl sm:text-3xl text-slate-400 ml-1">
                  %
                </span>
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                pass rate
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-7 sm:mt-9">
          <MetricCard
            delay={0.15}
            icon={<XCircle className="h-4 w-4" />}
            label="Failed Suites"
            value={failedSuites}
            tone={failedSuites > 0 ? "danger" : "neutral"}
            suffix={failedSuites === 1 ? "suite" : "suites"}
          />
          <MetricCard
            delay={0.22}
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Passed Suites"
            value={passedSuites}
            tone={passedSuites > 0 ? "success" : "neutral"}
            suffix={passedSuites === 1 ? "suite" : "suites"}
          />
          <MetricCard
            delay={0.29}
            icon={<Activity className="h-4 w-4" />}
            label="Total Tests"
            value={totalTests}
            tone="info"
            suffix={totalTests === 1 ? "test" : "tests"}
            className="col-span-2 sm:col-span-1"
          />
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix: string;
  tone: "success" | "danger" | "info" | "neutral";
  delay: number;
  className?: string;
}

function MetricCard({
  icon,
  label,
  value,
  suffix,
  tone,
  delay,
  className = "",
}: MetricCardProps) {
  const toneStyles = {
    success: {
      iconBg: "bg-emerald-100 text-emerald-700 ring-emerald-200",
      value: "text-emerald-900",
      stripe: "before:bg-emerald-400",
      gradient: "from-emerald-50/80 to-white",
    },
    danger: {
      iconBg: "bg-rose-100 text-rose-700 ring-rose-200",
      value: "text-rose-900",
      stripe: "before:bg-rose-400",
      gradient: "from-rose-50/80 to-white",
    },
    info: {
      iconBg: "bg-indigo-100 text-indigo-700 ring-indigo-200",
      value: "text-indigo-900",
      stripe: "before:bg-indigo-400",
      gradient: "from-indigo-50/80 to-white",
    },
    neutral: {
      iconBg: "bg-slate-100 text-slate-500 ring-slate-200",
      value: "text-slate-700",
      stripe: "before:bg-slate-300",
      gradient: "from-slate-50/80 to-white",
    },
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br ${toneStyles.gradient} backdrop-blur-md p-4 sm:p-5 shadow-sm shadow-slate-200/40 transition-all hover:shadow-md hover:-translate-y-0.5 before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] ${toneStyles.stripe} ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] uppercase tracking-widest text-slate-500 font-medium">
          {label}
        </span>
        <div
          className={`inline-flex items-center justify-center h-7 w-7 rounded-lg ring-1 ${toneStyles.iconBg}`}
        >
          {icon}
        </div>
      </div>
      <div
        className={`text-3xl sm:text-4xl font-semibold tabular-nums ${toneStyles.value}`}
      >
        <AnimatedCounter value={value} />
      </div>
      <div className="text-xs text-slate-500 mt-1">{suffix}</div>
    </motion.div>
  );
}
