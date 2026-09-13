"use client";
import { useState, useEffect } from "react";
import { TrendingUp, Award } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatDate } from "@/lib/utils";

interface Result {
  attempt: { id: string; marksObtained: number | null; percentage: string | null; submittedAt: string | null; grade: string | null };
  test: { title: string; totalMarks: number };
  subject: { name: string; color: string } | null;
}

export default function TestResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tests/results?limit=20").then(r => r.json()).then(d => { setResults(d.results || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const getGradeColor = (pct: string | null): "green" | "blue" | "yellow" | "red" => {
    const p = parseFloat(pct || "0");
    if (p >= 80) return "green";
    if (p >= 60) return "blue";
    if (p >= 35) return "yellow";
    return "red";
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Test Results</h1>
        <p className="text-slate-500 text-sm mt-0.5">View your test scores and performance</p>
      </div>

      {results.length === 0 ? (
        <Card><EmptyState icon={<TrendingUp className="w-8 h-8" />} title="No test results yet" description="Your test results will appear here after you complete tests" /></Card>
      ) : (
        <div className="space-y-4">
          {results.map((result) => {
            const pct = parseFloat(result.attempt.percentage || "0");
            const marks = result.attempt.marksObtained;
            return (
              <Card key={result.attempt.id}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 ${pct >= 80 ? "bg-green-50" : pct >= 60 ? "bg-blue-50" : pct >= 35 ? "bg-amber-50" : "bg-red-50"}`}>
                      <span className={`text-lg font-extrabold ${pct >= 80 ? "text-green-600" : pct >= 60 ? "text-blue-600" : pct >= 35 ? "text-amber-600" : "text-red-600"}`}>
                        {Math.round(pct)}%
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{result.test.title}</h3>
                      <p className="text-sm text-slate-500">{result.subject?.name || "General"} • {marks}/{result.test.totalMarks} marks</p>
                      <p className="text-xs text-slate-400 mt-0.5">{result.attempt.submittedAt ? formatDate(result.attempt.submittedAt) : "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {result.attempt.grade && <Badge variant={getGradeColor(result.attempt.percentage)}>Grade {result.attempt.grade}</Badge>}
                    <Award className={`w-5 h-5 ${pct >= 80 ? "text-amber-500" : "text-slate-300"}`} />
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 bg-slate-100 rounded-full h-1.5">
                  <div className={`h-full rounded-full transition-all ${pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-blue-500" : pct >= 35 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
