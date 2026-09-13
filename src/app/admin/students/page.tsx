"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Users, Search, Plus, Eye, Edit, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { getInitials } from "@/lib/utils";

interface Student {
  id: string;
  fullName: string;
  email: string;
  mobile: string | null;
  classStandard: string | null;
  division: string | null;
  studentId: string;
  rollNumber: string | null;
  status: string;
  createdAt: string;
}

const statusColor: Record<string, "green" | "red" | "yellow"> = {
  active: "green", inactive: "red", suspended: "yellow",
};

const classOptions = ["5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set("search", search);
    if (classFilter) params.set("class", classFilter);
    if (statusFilter) params.set("status", statusFilter);

    try {
      const res = await fetch(`/api/students?${params}`);
      const data = await res.json();
      setStudents(data.students || []);
      setTotal(data.total || 0);
    } catch {}
    setLoading(false);
  }, [search, classFilter, statusFilter, page]);

  useEffect(() => {
    const timer = setTimeout(fetchStudents, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Students</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} total students</p>
        </div>
        <Link href="/admin/students/add">
          <Button>
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48">
            <Input
              placeholder="Search by name, ID, email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={classFilter}
            onChange={(e) => { setClassFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Classes</option>
            {classOptions.map(c => <option key={c} value={c}>Class {c}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </Card>

      {/* Students Table */}
      <Card padding="none">
        {loading ? (
          <div className="p-6"><DashboardSkeleton /></div>
        ) : students.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={<Users className="w-8 h-8" />} title="No students found" description="Try adjusting your search or filters" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {["Student", "Class", "Mobile", "Student ID", "Status", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                            {getInitials(student.fullName)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{student.fullName}</p>
                            <p className="text-xs text-slate-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-700">
                          {student.classStandard ? `Class ${student.classStandard}${student.division ? ` - ${student.division}` : ""}` : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{student.mobile || "—"}</td>
                      <td className="px-4 py-3 text-sm font-mono text-slate-600">{student.studentId}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusColor[student.status] || "gray"}>
                          {student.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/students/${student.id}`}>
                            <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                          <Link href={`/admin/students/${student.id}/edit`}>
                            <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-slate-700">{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
