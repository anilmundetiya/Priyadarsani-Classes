"use client";
import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";

interface Subject { id: number; name: string; code: string; color: string; description: string | null; }

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subjects").then(r => r.json()).then(d => { setSubjects(d.subjects || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Subjects</h1>
        <p className="text-slate-500 text-sm mt-0.5">Subjects enrolled in your batch</p>
      </div>
      {subjects.length === 0 ? (
        <Card><EmptyState icon={<BookOpen className="w-8 h-8" />} title="No subjects found" description="Your enrolled subjects will appear here" /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(subject => (
            <Card key={subject.id} hover className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${subject.color}20` }}>
                <BookOpen className="w-6 h-6" style={{ color: subject.color }} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{subject.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{subject.code}</p>
                {subject.description && <p className="text-sm text-slate-600 mt-1">{subject.description}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
