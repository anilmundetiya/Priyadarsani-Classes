import { NextResponse } from "next/server";
import { db } from "@/db";
import { students, teachers, batches, notices, fees, testAttempts, users } from "@/db/schema";
import { eq, count, desc, gte } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !["teacher", "admin"].includes(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalStudents,
      activeStudents,
      totalTeachers,
      totalBatches,
    ] = await Promise.all([
      db.select({ count: count() }).from(students),
      db.select({ count: count() }).from(students).where(eq(students.status, "active")),
      db.select({ count: count() }).from(teachers).where(eq(teachers.status, "active")),
      db.select({ count: count() }).from(batches).where(eq(batches.isActive, true)),
    ]);

    // Recent students
    const recentStudents = await db
      .select()
      .from(students)
      .orderBy(desc(students.createdAt))
      .limit(5);

    // Pending fees
    const pendingFeeCount = await db
      .select({ count: count() })
      .from(fees)
      .where(eq(fees.status, "pending"));

    // Recent notices
    const recentNotices = await db
      .select()
      .from(notices)
      .where(eq(notices.isActive, true))
      .orderBy(desc(notices.publishedAt))
      .limit(5);

    // Month-wise student growth (mock data for now)
    const studentGrowth = [
      { month: "Jan", total: 800, newAdmissions: 45 },
      { month: "Feb", total: 850, newAdmissions: 50 },
      { month: "Mar", total: 900, newAdmissions: 55 },
      { month: "Apr", total: 950, newAdmissions: 48 },
      { month: "May", total: 980, newAdmissions: 32 },
      { month: "Jun", total: Number(totalStudents[0]?.count || 1020), newAdmissions: 42 },
    ];

    // Top subjects performance (mock)
    const subjectPerformance = [
      { subject: "Maths", avgScore: 82, color: "#3B82F6" },
      { subject: "Science", avgScore: 78, color: "#10B981" },
      { subject: "English", avgScore: 74, color: "#8B5CF6" },
      { subject: "Hindi", avgScore: 68, color: "#F59E0B" },
      { subject: "SST", avgScore: 76, color: "#EC4899" },
    ];

    return NextResponse.json({
      stats: {
        totalStudents: Number(totalStudents[0]?.count || 0),
        activeStudents: Number(activeStudents[0]?.count || 0),
        totalTeachers: Number(totalTeachers[0]?.count || 0),
        totalBatches: Number(totalBatches[0]?.count || 0),
        pendingFees: Number(pendingFeeCount[0]?.count || 0),
      },
      recentStudents,
      recentNotices,
      studentGrowth,
      subjectPerformance,
      pendingTasks: {
        pendingFeePayments: 15,
        newStudentApplications: 8,
        testsToEvaluate: 5,
        assignmentsPending: 12,
        teacherRequests: 3,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
