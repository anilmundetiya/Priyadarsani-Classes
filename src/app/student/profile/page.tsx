"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, Edit3, Save, X, Download, Camera, Bot, BookOpen, 
  FileText, TrendingUp, Library, Calendar, BellRing, 
  ChevronRight, Clock, Award, BarChart2
} from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface StudentProfile {
  student: {
    id: string;
    studentId: string;
    rollNumber: string;
    fullName: string;
    email: string;
    mobile: string;
    gender: string;
    dateOfBirth: string;
    address: string;
    city: string;
    pincode: string;
    classStandard: string;
    division: string;
    board: string;
    school: string;
    academicYear: string;
    fatherName: string;
    motherName: string;
    guardianMobile: string;
    parentEmail: string;
    status: string;
    profileImage: string | null;
    enrollmentDate: string;
  };
  batch?: {
    batch: { name: string; startTime: string; endTime: string };
    teacher: { fullName: string } | null;
  } | null;
  subjects: Array<{ id: number; name: string; color: string }>;
  lastLogin: string;
}

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const quickActions = [
  { href: "/student/ai-doubt", icon: Bot, label: "AI Doubt Solver", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
  { href: "/student/subjects", icon: BookOpen, label: "My Subjects", color: "bg-green-50 text-green-600 hover:bg-green-100" },
  { href: "/student/practice-tests", icon: FileText, label: "Practice Tests", color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
  { href: "/student/performance", icon: TrendingUp, label: "My Progress", color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
  { href: "/student/study-material", icon: Library, label: "Study Material", color: "bg-orange-50 text-orange-600 hover:bg-orange-100" },
  { href: "/student/timetable", icon: Calendar, label: "Timetable", color: "bg-teal-50 text-teal-600 hover:bg-teal-100" },
  { href: "/student/notices", icon: BellRing, label: "Notices", color: "bg-red-50 text-red-600 hover:bg-red-100" },
];

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<StudentProfile["student"]>>({});

  useEffect(() => {
    fetch("/api/students/profile")
      .then((r) => r.json())
      .then((d) => {
        setProfile(d);
        setEditData(d.student);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleEdit = () => {
    setEditData({ ...profile?.student });
    setEditing(true);
  };

  const handleCancel = () => {
    setEditData({ ...profile?.student });
    setEditing(false);
  };

const handleSave = async () => {
  setSaving(true);
  try {
    const payload = {
      fullName: editData.fullName,
      mobile: editData.mobile,
      dateOfBirth: editData.dateOfBirth,
      gender: editData.gender,
      address: editData.address,
      city: editData.city,
      pincode: editData.pincode,
      school: editData.school,
      fatherName: editData.fatherName,
      motherName: editData.motherName,
      guardianMobile: editData.guardianMobile,
      parentEmail: editData.parentEmail,
    };
    const res = await fetch("/api/students/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setProfile((prev) => prev ? { ...prev, student: { ...prev.student, ...data.student } } : prev);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } else {
      toast.error(data.error || "Failed to update profile");
    }
  } catch {
    toast.error("Network error. Please try again.");
  } finally {
    setSaving(false);
  }
};


  if (loading) return <DashboardSkeleton />;

  const student = profile?.student;

  return (
    <div className="space-y-6 animate-fade-in-up max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            <Link href="/student/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-3 h-3 inline mx-1" />
            My Profile
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4" />
          Download Profile
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card className="relative overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              {student?.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={student.profileImage}
                  alt={student.fullName}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <span className="text-white text-4xl font-extrabold">
                  {student?.fullName?.[0]?.toUpperCase() || "S"}
                </span>
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-extrabold text-slate-900">{student?.fullName}</h2>
                  <Badge variant={student?.status === "active" ? "green" : "red"} size="md">
                    {student?.status === "active" ? "Active Student" : student?.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-slate-500 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-slate-700">Roll No:</span> {student?.rollNumber || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-slate-700">Student ID:</span> {student?.studentId}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    Class {student?.classStandard} - {student?.division || "A"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    Priyadarshani Classes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-green-500" />
                    Academic Year {student?.academicYear}
                  </span>
                </div>
              </div>

              {/* Quote + Edit */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl px-5 py-4 text-white text-sm max-w-xs">
                <p className="italic text-blue-100 text-xs leading-relaxed">
                  "The expert in anything was once a beginner."
                </p>
                {!editing ? (
                  <button
                    onClick={handleEdit}
                    className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-white hover:text-blue-200 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white text-xs font-medium rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              {!editing && (
                <button onClick={handleEdit} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </CardHeader>

            {editing ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={editData.fullName || ""}
                  onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={editData.dateOfBirth || ""}
                    onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Select
                  label="Gender"
                  options={genderOptions}
                  value={editData.gender || ""}
                  onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                />
                <Input
                  label="Mobile Number"
                  value={editData.mobile || ""}
                  onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                />
                <Input
                  label="Address"
                  value={editData.address || ""}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  className="sm:col-span-2"
                />
                <Input
                  label="City"
                  value={editData.city || ""}
                  onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                />
                <Input
                  label="Pincode"
                  value={editData.pincode || ""}
                  onChange={(e) => setEditData({ ...editData, pincode: e.target.value })}
                />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Date of Birth", value: formatDate(student?.dateOfBirth || null) },
                  { label: "Gender", value: student?.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : "—" },
                  { label: "Email", value: student?.email || "—" },
                  { label: "Mobile Number", value: student?.mobile || "—" },
                  { label: "Address", value: [student?.address, student?.city, "Maharashtra", student?.pincode].filter(Boolean).join(", ") || "—", full: true },
                ].map((field) => (
                  <div key={field.label} className={field.full ? "sm:col-span-2" : ""}>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{field.label}</p>
                    <p className="text-sm font-medium text-slate-800">{field.value}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Parent Info */}
          <Card>
            <CardHeader>
              <CardTitle>Parent / Guardian Information</CardTitle>
              {!editing && (
                <button onClick={handleEdit} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </CardHeader>

            {editing ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Father's Name"
                  value={editData.fatherName || ""}
                  onChange={(e) => setEditData({ ...editData, fatherName: e.target.value })}
                />
                <Input
                  label="Mother's Name"
                  value={editData.motherName || ""}
                  onChange={(e) => setEditData({ ...editData, motherName: e.target.value })}
                />
                <Input
                  label="Guardian Mobile"
                  value={editData.guardianMobile || ""}
                  onChange={(e) => setEditData({ ...editData, guardianMobile: e.target.value })}
                />
                <Input
                  label="Parent Email"
                  type="email"
                  value={editData.parentEmail || ""}
                  onChange={(e) => setEditData({ ...editData, parentEmail: e.target.value })}
                />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Father's Name", value: student?.fatherName || "—" },
                  { label: "Mother's Name", value: student?.motherName || "—" },
                  { label: "Guardian Mobile", value: student?.guardianMobile || "—" },
                  { label: "Parent Email", value: student?.parentEmail || "—" },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{field.label}</p>
                    <p className="text-sm font-medium text-slate-800">{field.value}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Overview */}
          <Card>
            <CardTitle className="mb-4">Quick Overview</CardTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Attendance", value: "92.5%", subtitle: "This Month", icon: Clock, color: "text-green-600", bg: "bg-green-50" },
                { label: "Tests Attempted", value: "12", subtitle: "This Month", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Average Score", value: "78.4%", subtitle: "This Month", icon: BarChart2, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Rank", value: "5 / 45", subtitle: "In Class", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                    <p className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Academic Info */}
          <Card>
            <CardTitle className="mb-4">Academic Information</CardTitle>
            <div className="space-y-3">
              {[
                { label: "Board", value: student?.board || "Maharashtra State Board" },
                { label: "Class / Standard", value: student?.classStandard || "—" },
                { label: "Division", value: student?.division || "—" },
                { label: "Subjects", value: profile?.subjects?.map((s) => s.name).join(", ") || "—" },
                { label: "Batch", value: profile?.batch?.batch?.name || "—" },
                { label: "Class Teacher", value: profile?.batch?.teacher?.fullName || "Mr. Prem Sir" },
                { label: "Batch Timing", value: profile?.batch ? `${profile.batch.batch.startTime} – ${profile.batch.batch.endTime}` : "—" },
                { label: "School", value: student?.school || "—" },
              ].map((field) => (
                <div key={field.label} className="flex justify-between items-start gap-2">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide flex-shrink-0">{field.label}</p>
                  <p className="text-sm font-medium text-slate-800 text-right">{field.value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Account & Security */}
          <Card>
            <CardTitle className="mb-4">Account & Security</CardTitle>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
                <p className="text-sm text-slate-800 font-medium truncate max-w-[150px]">{student?.email}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Password</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-300">••••••••</span>
                  <Link href="/student/change-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Change
                  </Link>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Last Login</p>
                <p className="text-sm text-slate-600">{profile?.lastLogin ? formatDate(profile.lastLogin) : "—"}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Status</p>
                <Badge variant={student?.status === "active" ? "green" : "red"}>
                  {student?.status || "active"}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardTitle className="mb-4">Quick Actions</CardTitle>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${action.color}`}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* AI Help CTA */}
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 border-0">
            <div className="text-center text-white">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold mb-1">Need Help?</h4>
              <p className="text-blue-100 text-xs mb-3">Ask your doubts to AI 24/7</p>
              <Link
                href="/student/ai-doubt"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Ask AI Now
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
