"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, User, BookOpen, Bot, FileText, TrendingUp,
  Library, Video, Radio, ClipboardList, Clock, Calendar,
  BellRing, CreditCard, HelpCircle, LogOut, ChevronLeft, ChevronRight,
  Menu, X
} from "lucide-react";
import toast from "react-hot-toast";

const navGroups = [
  {
    label: "MAIN",
    items: [
      { href: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/student/profile", icon: User, label: "My Profile" },
    ],
  },
  {
    label: "LEARNING",
    items: [
      { href: "/student/ai-doubt", icon: Bot, label: "AI Doubt Solver" },
      { href: "/student/subjects", icon: BookOpen, label: "My Subjects" },
      { href: "/student/study-material", icon: Library, label: "Study Material" },
      { href: "/student/live-classes", icon: Radio, label: "Live Classes" },
      { href: "/student/recorded-classes", icon: Video, label: "Recorded Classes" },
    ],
  },
  {
    label: "PRACTICE",
    items: [
      { href: "/student/practice-tests", icon: FileText, label: "Practice Tests" },
      { href: "/student/test-results", icon: TrendingUp, label: "Test Results" },
      { href: "/student/assignments", icon: ClipboardList, label: "Assignments" },
    ],
  },
  {
    label: "MY PROGRESS",
    items: [
      { href: "/student/attendance", icon: Clock, label: "Attendance" },
      { href: "/student/performance", icon: TrendingUp, label: "Performance" },
    ],
  },
  {
    label: "OTHERS",
    items: [
      { href: "/student/timetable", icon: Calendar, label: "Timetable" },
      { href: "/student/notices", icon: BellRing, label: "Notices" },
      { href: "/student/fees", icon: CreditCard, label: "Fees & Payments" },
      { href: "/student/help", icon: HelpCircle, label: "Help & Support" },
    ],
  },
];

interface StudentSidebarProps {
  studentName?: string;
  studentClass?: string;
  studentImage?: string | null;
}

export default function StudentSidebar({
  studentName = "Student",
  studentClass = "",
  studentImage,
}: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center px-4 py-5 border-b border-white/10",
        collapsed ? "justify-center" : "gap-3"
      )}>
        {collapsed ? (
          <Logo size="sm" variant="icon" />
        ) : (
          <Logo size="sm" light />
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-2">
            {!collapsed && (
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-white/15 text-white border-l-2 border-blue-400 pl-[10px]"
                      : "text-slate-300 hover:bg-white/8 hover:text-white",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User info & logout */}
      <div className="border-t border-white/10 p-3">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {studentName[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{studentName}</p>
              <p className="text-slate-400 text-xs truncate">{studentClass}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 transform transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-slate-900 transition-all duration-300 shadow-2xl",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white z-10 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
        <SidebarContent />
      </div>

      {/* Spacer */}
      <div className={cn("hidden lg:block flex-shrink-0 transition-all duration-300", collapsed ? "w-16" : "w-64")} />
    </>
  );
}
