"use client";
import { useState, useEffect } from "react";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AttendanceRecord {
  id: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  remarks: string | null;
  subject: string | null;
  teacher: string | null;
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/attendance")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRecords(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const presentCount = records.filter(r => r.status === "present").length;
  const totalCount = records.length;
  const percentage = totalCount === 0 ? 100 : Math.round((presentCount / totalCount) * 100);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Attendance Tracker</h1>
        <p className="text-slate-500 mt-1">View your daily attendance and overall percentage.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 flex items-center gap-4 p-6">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-600/80 uppercase tracking-wider">Overall</p>
            <p className="text-3xl font-black text-blue-900">{percentage}%</p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 flex items-center gap-4 p-6">
          <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-700/80 uppercase tracking-wider">Present Days</p>
            <p className="text-3xl font-black text-green-900">{presentCount}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-100 flex items-center gap-4 p-6">
          <div className="w-12 h-12 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-700/80 uppercase tracking-wider">Absent Days</p>
            <p className="text-3xl font-black text-red-900">{totalCount - presentCount}</p>
          </div>
        </Card>
      </div>

      {/* Records Table */}
      <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-lg">Recent Records</h2>
        </div>
        
        {records.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Clock className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-medium text-lg text-slate-600">No attendance records found.</p>
            <p className="text-sm mt-1">Your attendance will appear here once marked by teachers.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Teacher</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {record.subject || "General"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {record.teacher || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={
                          record.status === "present" ? "green" : 
                          record.status === "absent" ? "red" : 
                          record.status === "late" ? "amber" : "blue"
                        }
                      >
                        {record.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 italic">
                      {record.remarks || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
