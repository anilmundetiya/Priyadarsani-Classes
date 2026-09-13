"use client";
import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

interface AttendanceData {
  attendance: Array<{ id: string; date: string; status: string; remarks: string | null }>;
  stats: { total: number; present: number; absent: number; percentage: number };
}

const statusConfig: Record<string, { label: string; color: "green" | "red" | "yellow" | "gray"; icon: React.ElementType }> = {
  present: { label: "Present", color: "green", icon: CheckCircle },
  absent: { label: "Absent", color: "red", icon: XCircle },
  late: { label: "Late", color: "yellow", icon: AlertTriangle },
  excused: { label: "Excused", color: "gray", icon: AlertTriangle },
};

export default function AttendancePage() {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/attendance?limit=60")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const stats = data?.stats;
  const percentage = stats?.percentage || 0;
  const attendanceColor = percentage >= 75 ? "text-green-600" : percentage >= 60 ? "text-amber-600" : "text-red-600";

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Attendance</h1>
        <p className="text-slate-500 text-sm mt-0.5">Track your attendance record</p>
      </div>

      {/* Summary stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          title="Attendance"
          value={`${percentage}%`}
          subtitle="Overall"
          color={attendanceColor}
          icon={<Clock className="w-5 h-5" />}
          iconBg={percentage >= 75 ? "bg-green-50" : "bg-amber-50"}
        />
        <StatCard
          title="Present"
          value={stats?.present || 0}
          subtitle={`of ${stats?.total || 0} classes`}
          color="text-green-600"
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-50"
        />
        <StatCard
          title="Absent"
          value={stats?.absent || 0}
          subtitle="Total absences"
          color="text-red-500"
          icon={<XCircle className="w-5 h-5 text-red-500" />}
          iconBg="bg-red-50"
        />
      </div>

      {/* Attendance warning */}
      {percentage < 75 && percentage > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">Low Attendance Warning</p>
            <p className="text-sm text-amber-700 mt-0.5">Your attendance is below 75%. Please attend classes regularly to avoid any academic issues.</p>
          </div>
        </div>
      )}

      {/* Attendance list */}
      <Card>
        <h2 className="font-bold text-slate-800 mb-4">Attendance Records</h2>
        {(!data?.attendance || data.attendance.length === 0) ? (
          <EmptyState
            icon={<Clock className="w-8 h-8" />}
            title="No attendance records"
            description="Your attendance will appear here once marked by your teacher"
          />
        ) : (
          <div className="space-y-2">
            {data.attendance.map(record => {
              const config = statusConfig[record.status] || statusConfig.present;
              const Icon = config.icon;
              return (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      record.status === "present" ? "bg-green-50" : record.status === "absent" ? "bg-red-50" : "bg-amber-50"
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        record.status === "present" ? "text-green-600" : record.status === "absent" ? "text-red-500" : "text-amber-500"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{formatDate(record.date)}</p>
                      {record.remarks && <p className="text-xs text-slate-500">{record.remarks}</p>}
                    </div>
                  </div>
                  <Badge variant={config.color}>{config.label}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
