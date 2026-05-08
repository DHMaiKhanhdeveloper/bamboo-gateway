import { motion } from "framer-motion";
import { useMemo } from "react";
import { Layers } from "lucide-react";
import type { TestSuiteSummary } from "@/types/test-suite";

interface CategoryBreakdownProps {
  suites: TestSuiteSummary[];
}

interface CategoryStat {
  category: string;
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  passRate: number;
}

const palette = [
  { bg: "bg-indigo-500", text: "text-indigo-700", soft: "bg-indigo-100" },
  { bg: "bg-emerald-500", text: "text-emerald-700", soft: "bg-emerald-100" },
  { bg: "bg-amber-500", text: "text-amber-700", soft: "bg-amber-100" },
  { bg: "bg-rose-500", text: "text-rose-700", soft: "bg-rose-100" },
  { bg: "bg-sky-500", text: "text-sky-700", soft: "bg-sky-100" },
  { bg: "bg-violet-500", text: "text-violet-700", soft: "bg-violet-100" },
];

export function CategoryBreakdown({ suites }: CategoryBreakdownProps) {
  const stats = useMemo<CategoryStat[]>(() => {
    const map = new Map<string, CategoryStat>();
    for (const s of suites) {
      if (!map.has(s.category)) {
        map.set(s.category, {
          category: s.category,
          passed: 0,
          failed: 0,
          skipped: 0,
          total: 0,
          passRate: 0,
        });
      }
      const e = map.get(s.category)!;
      e.passed += s.testCounts.passed;
      e.failed += s.testCounts.failed;
      e.skipped += s.testCounts.skipped;
      e.total += s.testCounts.total;
    }
    for (const e of map.values()) {
      e.passRate = e.total > 0 ? Math.round((e.passed / e.total) * 100) : 0;
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [suites]);

  if (stats.length === 0) return null;

  const maxTotal = Math.max(...stats.map(s => s.total), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.5 }}
      className="rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/70 shadow-sm shadow-slate-200/40 p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 ring-1 ring-indigo-200 flex items-center justify-center">
            <Layers className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-slate-900 font-semibold">By category</h2>
            <p className="text-xs text-slate-500">
              Test distribution across {stats.length} categor
              {stats.length !== 1 ? "ies" : "y"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {stats.map((s, i) => {
          const widthPct = (s.total / maxTotal) * 100;
          const passedW = s.total > 0 ? (s.passed / s.total) * 100 : 0;
          const failedW = s.total > 0 ? (s.failed / s.total) * 100 : 0;
          const skippedW = s.total > 0 ? (s.skipped / s.total) * 100 : 0;
          const c = palette[i % palette.length];
          return (
            <div key={s.category} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${c.bg}`} />
                  <span className={`text-sm font-medium ${c.text} capitalize`}>
                    {s.category}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {s.total} test{s.total !== 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums text-slate-900">
                  {s.passRate}%
                </span>
              </div>
              <div
                className="h-7 rounded-lg overflow-hidden flex bg-slate-50 ring-1 ring-slate-100"
                style={{ width: `${widthPct}%`, minWidth: "30%" }}
              >
                {passedW > 0 && (
                  <motion.div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-end px-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${passedW}%` }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.05 }}
                  >
                    {passedW > 15 && (
                      <span className="text-[10px] font-medium text-white/90 tabular-nums">
                        {s.passed}
                      </span>
                    )}
                  </motion.div>
                )}
                {failedW > 0 && (
                  <motion.div
                    className="bg-gradient-to-r from-rose-400 to-rose-500 flex items-center justify-center px-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${failedW}%` }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.05 }}
                  >
                    {failedW > 15 && (
                      <span className="text-[10px] font-medium text-white/90 tabular-nums">
                        {s.failed}
                      </span>
                    )}
                  </motion.div>
                )}
                {skippedW > 0 && (
                  <motion.div
                    className="bg-gradient-to-r from-slate-300 to-slate-400 flex items-center justify-center px-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${skippedW}%` }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.05 }}
                  >
                    {skippedW > 15 && (
                      <span className="text-[10px] font-medium text-white/90 tabular-nums">
                        {s.skipped}
                      </span>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
