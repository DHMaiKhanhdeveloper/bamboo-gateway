import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, ExternalLink } from "lucide-react";

export default function ReportDetailPage() {
  const { category, suite } = useParams<{ category: string; suite: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);

  const suitePath = `${category}/${suite}`;
  const reportUrl = `/public/reports/${suitePath}/details/index.html`;

  const handleRefresh = () => {
    setLoading(true);
    setKey(prev => prev + 1);
  };

  const handleBack = () => {
    navigate(`/reports/${suitePath}`);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
              aria-label="Back to suite details"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-700 border-0 text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Playwright Report
                </Badge>
              </div>
              <h1 className="text-slate-900 truncate text-base sm:text-xl md:text-2xl">
                {suite}
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Detailed Test Report
              </p>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600">Loading detailed report...</p>
            </div>
          </div>
        )}
        <iframe
          key={key}
          src={reportUrl}
          className="w-full h-full border-0"
          title={`Test Report for ${suite}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            console.error("Failed to load report");
          }}
        />
      </div>

      {/* Mobile Action Bar - Sticky at bottom */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 shadow-lg z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="w-full gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reload Report
        </Button>
      </div>
    </div>
  );
}
