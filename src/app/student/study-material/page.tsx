"use client";
import { useState, useEffect } from "react";
import { Library, FileText, Video, BookOpen, ExternalLink, Download } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatDate } from "@/lib/utils";

interface Material {
  material: { id: string; title: string; description: string | null; type: string; fileUrl: string | null; createdAt: string; downloadCount: number };
  subject: { name: string; color: string } | null;
  teacher: { fullName: string } | null;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  pdf: { icon: FileText, color: "text-red-600", bg: "bg-red-50" },
  video: { icon: Video, color: "text-blue-600", bg: "bg-blue-50" },
  document: { icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
  note: { icon: BookOpen, color: "text-green-600", bg: "bg-green-50" },
  link: { icon: ExternalLink, color: "text-amber-600", bg: "bg-amber-50" },
};

export default function StudyMaterialPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/study-material?limit=50").then(r => r.json()).then(d => { setMaterials(d.materials || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const filtered = filter === "all" ? materials : materials.filter(m => m.material.type === filter);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Study Material</h1>
        <p className="text-slate-500 text-sm mt-0.5">Notes, PDFs, videos and resources uploaded by your teachers</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "pdf", "video", "document", "note", "link"].map(type => (
          <button key={type} onClick={() => setFilter(type)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === type ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card><EmptyState icon={<Library className="w-8 h-8" />} title="No material found" description="Study materials uploaded by your teachers will appear here" /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const config = typeConfig[item.material.type] || typeConfig.document;
            const Icon = config.icon;
            return (
              <Card key={item.material.id} hover>
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-2">{item.material.title}</h3>
                    {item.subject && <p className="text-xs text-slate-500 mt-0.5">{item.subject.name}</p>}
                    {item.material.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.material.description}</p>}
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-slate-400">{formatDate(item.material.createdAt)}</p>
                      {item.material.fileUrl && (
                        <a href={item.material.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                          <Download className="w-3 h-3" /> Download
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
