import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import StudentSidebar from "@/components/student/StudentSidebar";
import StudentHeader from "@/components/student/StudentHeader";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "student") {
    redirect("/login");
  }

  const studentData = await db
    .select()
    .from(students)
    .where(eq(students.userId, session.userId))
    .limit(1);

  const student = studentData[0];
  const displayName = student?.fullName || session.email;
  const displayClass = student
    ? `Class ${student.classStandard} - ${student.division || ""}`.trim()
    : "";

  return (
    <div className="flex h-screen bg-slate-50">
      <StudentSidebar
        studentName={displayName}
        studentClass={displayClass}
        studentImage={student?.profileImage}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <StudentHeader
          studentName={displayName}
          studentClass={displayClass}
          notificationCount={2}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
