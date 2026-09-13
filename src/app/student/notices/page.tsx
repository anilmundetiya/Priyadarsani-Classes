"use client";
import { useState, useEffect } from "react";
import { BellRing, Calendar, AlertCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";

interface Notice {
  id: string;
  title: string;
  content: string;
  type: string;
  publishedAt: string;
}

const noticeTypeColor: Record<string, "blue" | "red" | "yellow" | "green" | "purple" | "gray"> = {
  general: "blue", exam: "red", holiday: "yellow", result: "green", fee: "purple", urgent: "red",
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/notices?limit=50")
      .then(r => r.json())
      .then(d => { setNotices(d.notices || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const filtered = filter === "all" ? notices : notices.filter(n => n.type === filter);

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Notices</h1>
          <p className="text-slate-500 text-sm mt-0.5">Important announcements from Priyadarshani Classes</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "general", "exam", "holiday", "result", "fee", "urgent"].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === type ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<BellRing className="w-8 h-8" />}
          title="No notices found"
          description="Check back later for new announcements"
        />
      ) : (
        <div className="space-y-4">
          {filtered.map(notice => (
            <Card key={notice.id}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  notice.type === "exam" ? "bg-red-50" : notice.type === "holiday" ? "bg-amber-50" : "bg-blue-50"
                }`}>
                  <BellRing className={`w-5 h-5 ${
                    notice.type === "exam" ? "text-red-500" : notice.type === "holiday" ? "text-amber-500" : "text-blue-500"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h3 className="font-bold text-slate-800">{notice.title}</h3>
                    <Badge variant={noticeTypeColor[notice.type] || "blue"} size="sm">
                      {notice.type}
                    </Badge>
                  </div>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">{notice.content}</p>
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatDate(notice.publishedAt)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
