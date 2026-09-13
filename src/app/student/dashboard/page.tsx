"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Bot, BookOpen, FileText, TrendingUp, Library, Video, Calendar, BellRing, ArrowRight, Clock } from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatDate } from "@/lib/utils";

interface DashboardData {
  student: {
    fullName: string;
    classStandard: string;
    division: string;
    studentId: string;
  };
  stats: {
    attendance: number;
    averageScore: number;
    testsAttempted: number;
    classRank: string;
  };
  recentResults: Array<{
    attempt: { marksObtained: number; percentage: string; submittedAt: string };
    test: { title: string; totalMarks: number };
    subject: { name: string; color: string } | null;
  }>;
  recentNotices: Array<{
    id: string;
    title: string;
    type: string;
    publishedAt: string;
  }>;
  todayClasses: Array<{
    timetableEntry: { startTime: string; endTime: string };
    subject: { name: string } | null;
    teacher: { fullName: string } | null;
  }>;
  performanceData: Array<{ subject: string; score: number; color: string }>;
}

const quickActions = [
  { href: "/student/ai-doubt", icon: Bot, label: "AI Doubt Solver", desc: "Ask Anything", color: "bg-blue-500 text-white" },
  { href: "/student/practice-tests", icon: FileText, label: "Practice Tests", desc: "Improve Yourself", color: "bg-purple-500 text-white" },
  { href: "/student/study-material", icon: Library, label: "Study Material", desc: "Notes, PDFs, Videos", color: "bg-amber-500 text-white" },
  { href: "/student/live-classes", icon: Video, label: "Live Classes", desc: "Join Now", color: "bg-green-500 text-white" },
  { href: "/student/performance", icon: TrendingUp, label: "My Progress", desc: "Track Growth", color: "bg-pink-500 text-white" },
];

const noticeTypeColor: Record<string, "blue" | "red" | "green" | "yellow" | "purple" | "gray"> = {
  general: "blue",
  exam: "red",
  holiday: "yellow",
  result: "green",
  fee: "purple",
  urgent: "red",
};

export default function StudentDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/student")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const studentName = data?.student?.fullName?.split(" ")[0] || "Student";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-slate-900 to-blue-900 border-0 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white mb-1">
              {greeting}, {studentName}! 👋
            </h2>
            <p className="text-slate-300 text-sm">Keep learning, keep growing with Priyadarshani Classes</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-3 text-right flex-shrink-0">
            <p className="text-blue-200 text-xs font-medium">"The expert in anything</p>
            <p className="text-blue-200 text-xs">was once a beginner."</p>
            <p className="text-amber-400 text-xs font-bold mt-1">— Prem Sir</p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance"
          value={`${data?.stats.attendance || 92}%`}
          subtitle="This Month"
          color="text-green-600"
          iconBg="bg-green-50"
          icon={<Clock className="w-5 h-5 text-green-600" />}
          trend="up"
          trendValue="Good"
        />
        <StatCard
          title="Average Score"
          value={`${data?.stats.averageScore || 78}%`}
          subtitle="This Month"
          color="text-blue-600"
          iconBg="bg-blue-50"
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Tests Attempted"
          value={data?.stats.testsAttempted || 12}
          subtitle="This Month"
          color="text-purple-600"
          iconBg="bg-purple-50"
          icon={<FileText className="w-5 h-5 text-purple-600" />}
        />
        <StatCard
          title="Class Rank"
          value={data?.stats.classRank || "5 / 45"}
          subtitle="In Class"
          color="text-amber-600"
          iconBg="bg-amber-50"
          icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{action.label}</p>
                <p className="text-xs text-slate-400">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
            <Link href="/student/timetable" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {data?.todayClasses?.length ? (
              data.todayClasses.map((cls, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{cls.subject?.name || "Class"}</p>
                    <p className="text-xs text-slate-500">{cls.timetableEntry.startTime} – {cls.timetableEntry.endTime} | {cls.teacher?.fullName || "Teacher"}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Join
                  </button>
                </div>
              ))
            ) : (
              // Demo classes
              [
                { subject: "Mathematics", time: "8:00 AM – 9:00 AM", teacher: "Mr. Prem Sir" },
                { subject: "Science", time: "9:15 AM – 10:15 AM", teacher: "Ms. Neha Ma'am" },
                { subject: "English", time: "10:30 AM – 11:30 AM", teacher: "Mr. Rahul Sir" },
              ].map((cls, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">{cls.subject}</p>
                    <p className="text-xs text-slate-500">{cls.time} | {cls.teacher}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Join
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Notices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notices</CardTitle>
            <Link href="/student/notices" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {data?.recentNotices?.length ? (
              data.recentNotices.slice(0, 4).map((notice) => (
                <div key={notice.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notice.type === "exam" ? "bg-red-500" : notice.type === "holiday" ? "bg-amber-500" : "bg-blue-500"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 line-clamp-1">{notice.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(notice.publishedAt)}</p>
                  </div>
                  <Badge variant={noticeTypeColor[notice.type] || "blue"}>
                    {notice.type}
                  </Badge>
                </div>
              ))
            ) : (
              [
                { title: "Half Yearly Exam Schedule", type: "exam", date: "24 Aug 2024" },
                { title: "New Study Material Added - Science", type: "general", date: "22 Aug 2024" },
                { title: "Class Timings Updated", type: "general", date: "20 Aug 2024" },
                { title: "Holiday on 26th Aug", type: "holiday", date: "18 Aug 2024" },
              ].map((notice, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notice.type === "exam" ? "bg-red-500" : notice.type === "holiday" ? "bg-amber-500" : "bg-blue-500"}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{notice.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{notice.date}</p>
                  </div>
                  <Badge variant={noticeTypeColor[notice.type] || "blue"}>
                    {notice.type}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Performance & AI Help */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Performance */}
        <Card>
          <CardHeader>
            <CardTitle>My Performance</CardTitle>
            <Link href="/student/performance" className="text-sm text-blue-600 font-medium flex items-center gap-1">
              View Detailed Report <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {(data?.performanceData || [
              { subject: "Maths", score: 82, color: "#3B82F6" },
              { subject: "Science", score: 91, color: "#10B981" },
              { subject: "English", score: 74, color: "#8B5CF6" },
              { subject: "Hindi", score: 68, color: "#F59E0B" },
              { subject: "SST", score: 85, color: "#EC4899" },
            ]).map((item) => (
              <div key={item.subject} className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-500 w-14">{item.subject}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%`, backgroundColor: item.color }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-700 w-8 text-right">{item.score}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Doubt Solver CTA */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Need Help?</h3>
            <p className="text-slate-600 text-sm mb-1">Stuck on a question?</p>
            <p className="text-slate-500 text-sm mb-5">Ask our AI Doubt Solver anytime, 24/7!</p>
            <Link
              href="/student/ai-doubt"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Bot className="w-4 h-4" />
              Ask Now →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
