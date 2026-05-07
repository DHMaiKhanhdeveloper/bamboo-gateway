import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MinusCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Clock,
  Image as ImageIcon,
  Video,
  FileText,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Attachment {
  name: string;
  contentType: string;
  url: string;
}

interface ErrorInfo {
  message: string | null;
  snippet: string | null;
  location: string | null;
}

interface Annotation {
  type: string;
  description: string | null;
}

type TestStatus = "passed" | "failed" | "skipped" | "flaky";

interface TestCase {
  title: string;
  status: TestStatus;
  duration: number;
  startTime: string | null;
  retry: number;
  tags: string[];
  line: number | null;
  error: ErrorInfo | null;
  annotations: Annotation[];
  attachments: Attachment[];
  stdout: string | null;
  projectName: string | null;
}

interface SuiteDetail {
  suiteName: string;
  category: string;
  file: string;
  counts: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    flaky: number;
  };
  lastRun: string;
  tests: TestCase[];
}

interface SuiteDetailsResponse {
  suites: Record<string, SuiteDetail>;
  lastUpdated: string;
}

function formatDuration(ms: number): string {
  if (!ms || ms < 1000) return `${Math.round(ms)}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  const rs = Math.round(s % 60);
  return `${m}m ${rs}s`;
}

const statusMeta: Record<
  TestStatus,
  {
    label: string;
    chip: string;
    icon: React.ReactNode;
    bar: string;
    iconColor: string;
  }
> = {
  passed: {
    label: "Passed",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: <CheckCircle2 className="h-4 w-4" />,
    bar: "bg-emerald-500",
    iconColor: "text-emerald-600",
  },
  failed: {
    label: "Failed",
    chip: "bg-rose-50 text-rose-700 ring-rose-200",
    icon: <XCircle className="h-4 w-4" />,
    bar: "bg-rose-500",
    iconColor: "text-rose-600",
  },
  skipped: {
    label: "Skipped",
    chip: "bg-slate-100 text-slate-600 ring-slate-200",
    icon: <MinusCircle className="h-4 w-4" />,
    bar: "bg-slate-400",
    iconColor: "text-slate-500",
  },
  flaky: {
    label: "Flaky",
    chip: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: <AlertTriangle className="h-4 w-4" />,
    bar: "bg-amber-500",
    iconColor: "text-amber-600",
  },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* no-op */
        }
      }}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition"
      title="Copy"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CopyButtonLight({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* no-op */
        }
      }}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-white hover:bg-rose-50 text-rose-700 ring-1 ring-rose-200 transition"
      title="Copy"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function TestRow({ test, defaultOpen }: { test: TestCase; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const meta = statusMeta[test.status] ?? statusMeta.skipped;
  const screenshot = test.attachments.find(
    (a) => a.contentType === "image/png" || a.name === "screenshot"
  );
  const video = test.attachments.find(
    (a) => a.contentType === "video/webm" || a.name === "video"
  );
  const errorContext = test.attachments.find((a) => a.name === "error-context");
  const skipReason = test.annotations.find((a) => a.type === "skip");

  const expandable =
    !!test.error || !!test.stdout || !!skipReason || test.attachments.length > 0;

  return (
    <Card className="overflow-hidden border-slate-200 bg-white py-0 transition hover:border-slate-300 hover:shadow-sm">
      <button
        onClick={() => expandable && setOpen((v) => !v)}
        className={`w-full text-left flex items-center gap-3 p-4 sm:p-5 ${
          expandable ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <div className={`flex-shrink-0 ${meta.iconColor}`}>{meta.icon}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <span className="text-slate-900 font-medium break-words">
              {test.title}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wider ring-1 ${meta.chip}`}
            >
              {meta.label}
            </span>
            {test.retry > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wider ring-1 bg-amber-50 text-amber-700 ring-amber-200">
                Retry {test.retry}
              </span>
            )}
            {video && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wider ring-1 bg-indigo-50 text-indigo-700 ring-indigo-200">
                <Video className="h-3 w-3" />
                Video
              </span>
            )}
            {screenshot && !test.error && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wider ring-1 bg-sky-50 text-sky-700 ring-sky-200">
                <ImageIcon className="h-3 w-3" />
                Snap
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(test.duration)}
            </span>
            {test.line && (
              <>
                <span className="text-slate-300">·</span>
                <span className="font-mono">line {test.line}</span>
              </>
            )}
            {test.projectName && (
              <>
                <span className="text-slate-300">·</span>
                <span>{test.projectName}</span>
              </>
            )}
            {test.tags.length > 0 && (
              <>
                <span className="text-slate-300">·</span>
                <span className="inline-flex gap-1 flex-wrap">
                  {test.tags.map((t) => (
                    <span
                      key={t}
                      className="text-indigo-600 bg-indigo-50 ring-1 ring-indigo-100 rounded px-1.5"
                    >
                      @{t}
                    </span>
                  ))}
                </span>
              </>
            )}
          </div>
        </div>

        {expandable &&
          (open ? (
            <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
          ))}
      </button>

      <AnimatePresence initial={false}>
        {open && expandable && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-100 bg-slate-50/40"
          >
            <div className="p-4 sm:p-5 space-y-4">
              {skipReason && (
                <div className="rounded-lg bg-slate-100 border border-slate-200 p-3 text-sm text-slate-700">
                  <span className="font-medium">Skip reason:</span>{" "}
                  {skipReason.description ?? "No description provided."}
                </div>
              )}

              {test.error && (
                <div className="rounded-xl overflow-hidden bg-white ring-1 ring-rose-200 shadow-sm">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-rose-100 bg-rose-50/70">
                    <div className="flex items-center gap-2 text-rose-700">
                      <XCircle className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wider font-medium">
                        Error
                      </span>
                      {test.error.location && (
                        <span className="text-rose-500/80 font-mono text-xs">
                          {test.error.location}
                        </span>
                      )}
                    </div>
                    {test.error.message && (
                      <CopyButtonLight text={test.error.message} />
                    )}
                  </div>
                  {test.error.message && (
                    <pre className="px-4 py-3 text-sm text-rose-800 whitespace-pre-wrap break-words font-mono leading-relaxed bg-rose-50/30">
                      {test.error.message}
                    </pre>
                  )}
                  {test.error.snippet && (
                    <pre className="px-4 py-3 text-xs text-slate-700 whitespace-pre-wrap break-words font-mono leading-relaxed border-t border-rose-100 bg-slate-50">
                      {test.error.snippet}
                    </pre>
                  )}
                </div>
              )}

              {screenshot && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-700">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wider font-medium">
                        {test.status === "failed" ? "Failure screenshot" : "Screenshot"}
                      </span>
                    </div>
                    <a
                      href={screenshot.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open full size
                    </a>
                  </div>
                  <a href={screenshot.url} target="_blank" rel="noreferrer">
                    <img
                      src={screenshot.url}
                      alt="Failure screenshot"
                      className="w-full h-auto block hover:opacity-95 transition"
                      loading="lazy"
                    />
                  </a>
                </div>
              )}

              {video && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Video className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wider">
                        Recording
                      </span>
                    </div>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open
                    </a>
                  </div>
                  <video
                    src={video.url}
                    controls
                    className="w-full h-auto block bg-black"
                    preload="metadata"
                  />
                </div>
              )}

              {test.stdout && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-700">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wider">
                        stdout
                      </span>
                    </div>
                    <CopyButton text={test.stdout} />
                  </div>
                  <pre className="px-4 py-3 text-xs text-slate-700 whitespace-pre-wrap break-words font-mono max-h-64 overflow-auto">
                    {test.stdout}
                  </pre>
                </div>
              )}

              {errorContext && (
                <a
                  href={errorContext.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  <FileText className="h-4 w-4" />
                  Open error context (markdown)
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function SuiteDetailPage() {
  const { suiteName } = useParams<{ suiteName: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<SuiteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | TestStatus>("all");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await fetch("/suite-details.json");
        if (!r.ok) throw new Error("Failed to load suite details");
        const data: SuiteDetailsResponse = await r.json();
        const decoded = decodeURIComponent(suiteName ?? "");
        const found = data.suites?.[decoded];
        if (!found) {
          throw new Error(`Suite "${decoded}" not found in details`);
        }
        if (!cancelled) setDetails(found);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Load failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [suiteName]);

  const handleBack = () => navigate("/");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
          </div>
          <p className="text-slate-500 text-sm">Loading test details…</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/40">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Suites
          </Button>
          <Card className="border-rose-200 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-rose-600 mb-4">
                  {error ?? "Suite details not found"}
                </p>
                <Button onClick={() => location.reload()} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { counts, tests } = details;
  const passRate =
    counts.total > 0 ? Math.round((counts.passed / counts.total) * 100) : 0;

  const filteredTests =
    filter === "all" ? tests : tests.filter((t) => t.status === filter);

  const accent =
    counts.failed > 0
      ? "from-rose-500 to-pink-600"
      : passRate >= 90
        ? "from-emerald-500 to-teal-600"
        : "from-amber-500 to-orange-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-50">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 25%, rgba(165,180,252,0.45), transparent 45%), radial-gradient(circle at 85% 75%, rgba(251,113,133,0.25), transparent 50%)",
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
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-sm transition mb-5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to suites
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 ring-1 ring-indigo-200 backdrop-blur-sm shadow-sm mb-3">
                <span className="text-[11px] uppercase tracking-wider text-indigo-700 font-medium">
                  {details.category}
                </span>
              </div>
              <h1 className="text-slate-900 text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
                {details.suiteName}
              </h1>
              <p className="text-slate-500 font-mono text-sm break-all">
                {details.file}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <StatPill
                tone="success"
                icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                label={`${counts.passed} passed`}
              />
              <StatPill
                tone={counts.failed > 0 ? "danger" : "muted"}
                icon={<XCircle className="h-3.5 w-3.5" />}
                label={`${counts.failed} failed`}
              />
              <StatPill
                tone="muted"
                icon={<MinusCircle className="h-3.5 w-3.5" />}
                label={`${counts.skipped} skipped`}
              />
              {counts.flaky > 0 && (
                <StatPill
                  tone="warning"
                  icon={<AlertTriangle className="h-3.5 w-3.5" />}
                  label={`${counts.flaky} flaky`}
                />
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">
                Pass rate
              </span>
              <span className="text-slate-900 text-2xl font-semibold tabular-nums">
                {passRate}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200/70 overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${accent}`}
                initial={{ width: 0 }}
                animate={{ width: `${passRate}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 -mt-4 relative z-10">
        {/* Filter chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/70 shadow-lg shadow-slate-200/40 p-3 mb-6 flex flex-wrap items-center gap-2"
        >
          <FilterChip
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="All"
            count={counts.total}
          />
          <FilterChip
            active={filter === "failed"}
            onClick={() => setFilter("failed")}
            label="Failed"
            count={counts.failed}
            tone="danger"
          />
          <FilterChip
            active={filter === "passed"}
            onClick={() => setFilter("passed")}
            label="Passed"
            count={counts.passed}
            tone="success"
          />
          <FilterChip
            active={filter === "skipped"}
            onClick={() => setFilter("skipped")}
            label="Skipped"
            count={counts.skipped}
            tone="muted"
          />
          {counts.flaky > 0 && (
            <FilterChip
              active={filter === "flaky"}
              onClick={() => setFilter("flaky")}
              label="Flaky"
              count={counts.flaky}
              tone="warning"
            />
          )}
        </motion.div>

        <div className="space-y-3">
          {filteredTests.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No test cases match this filter.
            </div>
          ) : (
            filteredTests.map((t, i) => (
              <motion.div
                key={`${t.title}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <TestRow test={t} defaultOpen={t.status === "failed"} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatPill({
  tone,
  icon,
  label,
}: {
  tone: "success" | "danger" | "warning" | "muted";
  icon: React.ReactNode;
  label: string;
}) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    danger: "bg-rose-50 text-rose-700 ring-rose-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    muted: "bg-white/80 text-slate-600 ring-slate-200",
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 backdrop-blur-sm text-sm shadow-sm ${styles}`}
    >
      {icon}
      {label}
    </span>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  tone?: "success" | "danger" | "warning" | "muted";
}) {
  const activeStyles = {
    success: "bg-emerald-600 text-white",
    danger: "bg-rose-600 text-white",
    warning: "bg-amber-600 text-white",
    muted: "bg-slate-700 text-white",
  };
  const idleStyles = {
    success: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100",
    danger: "text-rose-700 bg-rose-50 hover:bg-rose-100",
    warning: "text-amber-700 bg-amber-50 hover:bg-amber-100",
    muted: "text-slate-700 bg-slate-100 hover:bg-slate-200",
  };
  const cls = active
    ? tone
      ? activeStyles[tone]
      : "bg-slate-900 text-white"
    : tone
      ? idleStyles[tone]
      : "text-slate-700 bg-slate-100 hover:bg-slate-200";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${cls}`}
    >
      {label}
      <span
        className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs ${
          active ? "bg-white/20" : "bg-white/70 text-slate-700"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
