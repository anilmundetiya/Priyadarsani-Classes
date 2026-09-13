import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { teachers, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StudentHeader from "@/components/student/StudentHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || !["teacher", "admin"].includes(session.role)) {
    redirect("/login");
  }

  let displayName = "Admin";
  let roleLabel = session.role === "admin" ? "Administrator" : "Teacher";

  const teacher = await db.select().from(teachers).where(eq(teachers.userId, session.userId)).limit(1);
  if (teacher[0]) displayName = teacher[0].fullName;

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar adminName={displayName} role={roleLabel} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <StudentHeader studentName={displayName} studentClass={roleLabel} notificationCount={5} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
