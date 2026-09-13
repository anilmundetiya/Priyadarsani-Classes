"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, GraduationCap, BookOpen, CreditCard, UserPlus, FileText, Library, BellRing, BarChart2, Bot, ArrowRight, Clock } from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatDate, getInitials } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface AdminDashboardData {
  stats: {
    totalStudents: number;
    activeStudents: number;
    totalTeachers: number;
    totalBatches: number;
    pendingFees: number;
  };
  recentStudents: Array<{ id: string; fullName: string; classStandard: string; createdAt: string; status: string }>;
  recentNotices: Array<{ id: string; title: string; type: string; publishedAt: string }>;
  studentGrowth: Array<{ month: string; total: number; newAdmissions: number }>;
  subjectPerformance: Array<{ subject: string; avgScore: number; color: string }>;
  pendingTasks: {
    pendingFeePayments: number;
    newStudentApplications: number;
    testsToEvaluate: number;
    assignmentsPending: number;
    teacherRequests: number;
  };
}

const quickActions = [
  { href: "/admin/students?action=add", icon: UserPlus, label: "Add Student", color: "bg-green-500 text-white" },
  { href: "/admin/batches?action=add", icon: BookOpen, label: "Create Batch", color: "bg-blue-500 text-white" },
  { href: "/admin/study-material?action=upload", icon: Library, label: "Upload Material", color: "bg-purple-500 text-white" },
  { href: "/admin/ai-tools", icon: Bot, label: "Generate Test Paper", color: "bg-orange-500 text-white" },
  { href: "/admin/notices?action=add", icon: BellRing, label: "Send Notice", color: "bg-amber-500 text-white" },
  { href: "/admin/reports", icon: BarChart2, label: "View Reports", color: "bg-teal-500 text-white" },
];

const recentActivity = [
  { name: "Rohan Sharma", action: "Submitted Maths Test", time: "2 min ago", avatar: "RS" },
  { name: "Sneha Patil", action: "Downloaded Science Notes", time: "10 min ago", avatar: "SP" },
  { name: "Aditya Jadhav", action: "Joined Live Class", time: "25 min ago", avatar: "AJ" },
  { name: "Pooja More", action: "Paid Fees (₹3,000)", time: "1 hour ago", avatar: "PM" },
  { name: "Karan Gupta", action: "Submitted Assignment", time: "2 hours ago", avatar: "KG" },
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/admin")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={data?.stats.totalStudents || 1254}
          subtitle={`${data?.stats.activeStudents || 1020} active`}
          color="text-blue-600"
          iconBg="bg-blue-50"
          icon={<Users className="w-5 h-5 text-blue-600" />}
          trend="up"
          trendValue="+42 this month"
        />
        <StatCard
          title="Teachers"
          value={data?.stats.totalTeachers || 12}
          subtitle="Subject experts"
          color="text-green-600"
          iconBg="bg-green-50"
          icon={<GraduationCap className="w-5 h-5 text-green-600" />}
        />
        <StatCard
          title="Batches"
          value={data?.stats.totalBatches || 28}
          subtitle="Active batches"
          color="text-amber-600"
          iconBg="bg-amber-50"
          icon={<BookOpen className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Active Students"
          value={data?.stats.activeStudents || 1020}
          subtitle="Currently enrolled"
          color="text-purple-600"
          iconBg="bg-purple-50"
          icon={<Users className="w-5 h-5 text-purple-600" />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student Growth Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Overview</CardTitle>
            <span className="text-xs text-slate-400">This Year</span>
          </CardHeader>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.studentGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={false} name="Total Students" />
                <Line type="monotone" dataKey="newAdmissions" stroke="#10b981" strokeWidth={2} dot={false} name="New Admissions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-3 h-0.5 bg-blue-500" /> Total Students</div>
            <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-3 h-0.5 bg-green-500" /> New Admissions</div>
          </div>
        </Card>

        {/* Top Performing Subjects */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Subjects</CardTitle>
            <span className="text-xs text-slate-400">Class 10th</span>
          </CardHeader>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.subjectPerformance || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis dataKey="subject" type="category" tick={{ fontSize: 10 }} width={45} />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Student Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Student Activity</CardTitle>
            <Link href="/admin/students" className="text-sm text-blue-600 font-medium flex items-center gap-1">
              View All Activity <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{activity.name}</p>
                  <p className="text-xs text-slate-500 truncate">{activity.action}</p>
                </div>
                <p className="text-xs text-slate-400 flex-shrink-0">{activity.time}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <Link href="/admin/reports" className="text-sm text-blue-600 font-medium">View All</Link>
          </CardHeader>
          <div className="space-y-3">
            {[
              { label: "Pending Fee Payments", count: data?.pendingTasks.pendingFeePayments || 15, action: "View", color: "text-red-600", href: "/admin/fees" },
              { label: "New Student Applications", count: data?.pendingTasks.newStudentApplications || 8, action: "Review", color: "text-blue-600", href: "/admin/students" },
              { label: "Tests to be Evaluated", count: data?.pendingTasks.testsToEvaluate || 5, action: "Evaluate", color: "text-purple-600", href: "/admin/tests" },
              { label: "Assignments Pending", count: data?.pendingTasks.assignmentsPending || 12, action: "View", color: "text-amber-600", href: "/admin/assignments" },
              { label: "Teacher Requests", count: data?.pendingTasks.teacherRequests || 3, action: "Review", color: "text-green-600", href: "/admin/teachers" },
            ].map((task) => (
              <div key={task.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-extrabold ${task.color}`}>{task.count}</span>
                  <span className="text-xs text-slate-600">{task.label}</span>
                </div>
                <Link href={task.href} className={`text-xs font-medium ${task.color} hover:underline`}>
                  {task.action}
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardTitle className="mb-4">Quick Actions</CardTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 text-center leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
