"use client";
import { useState, useEffect } from "react";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { FileText, Download, PlayCircle, ImageIcon, Link as LinkIcon, File } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface StudyMaterial {
  id: string;
  title: string;
  description: string | null;
  type: "pdf" | "video" | "image" | "document" | "link" | "note";
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  subject: string | null;
  createdAt: string;
}

const typeConfig = {
  pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50" },
  video: { icon: PlayCircle, color: "text-blue-500", bg: "bg-blue-50" },
  image: { icon: ImageIcon, color: "text-green-500", bg: "bg-green-50" },
  document: { icon: File, color: "text-purple-500", bg: "bg-purple-50" },
  link: { icon: LinkIcon, color: "text-amber-500", bg: "bg-amber-50" },
  note: { icon: FileText, color: "text-slate-500", bg: "bg-slate-50" },
};

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function StudyMaterialPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/student/study-material")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMaterials(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const filteredMaterials = filter === "all" ? materials : materials.filter(m => m.subject === filter);
  const subjects = Array.from(new Set(materials.map(m => m.subject).filter(Boolean)));

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Study Material</h1>
          <p className="text-slate-500 mt-1">Download notes, PDFs, and resources uploaded by your teachers.</p>
        </div>
        
        {subjects.length > 0 && (
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => <option key={s as string} value={s as string}>{s}</option>)}
          </select>
        )}
      </div>

      {filteredMaterials.length === 0 ? (
        <Card className="text-center py-16 border-dashed border-2">
          <Library className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-700 text-lg">No materials found.</p>
          <p className="text-sm text-slate-500 mt-1">Teachers haven't uploaded any study material for this selection yet.</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => {
            const Icon = typeConfig[material.type]?.icon || FileText;
            return (
              <Card key={material.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeConfig[material.type]?.bg || "bg-slate-50"}`}>
                    <Icon className={`w-6 h-6 ${typeConfig[material.type]?.color || "text-slate-500"}`} />
                  </div>
                  {material.subject && (
                    <Badge variant="blue" size="sm">{material.subject}</Badge>
                  )}
                </div>
                
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{material.title}</h3>
                {material.description && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">{material.description}</p>
                )}
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="text-xs text-slate-400 font-medium">
                    {formatDate(material.createdAt)}
                    {material.fileSize ? ` • ${formatBytes(material.fileSize)}` : ""}
                  </div>
                  {material.fileUrl && (
                    <a 
                      href={material.fileUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Adding missing import
import { Library } from "lucide-react";
