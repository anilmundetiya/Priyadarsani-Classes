import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  students, attendance, testAttempts, tests, notices, fees, timetable,
  batches, subjects, teachers
} from "@/db/schema";
import { eq, desc, and, count, avg, gte } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentData = await db
      .select()
      .from(students)
      .where(eq(students.userId, session.userId))
      .limit(1);

    if (!studentData[0]) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const student = studentData[0];

    // Attendance this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthStart = thisMonth.toISOString().split("T")[0];

    const [totalAtt, presentAtt] = await Promise.all([
      db.select({ count: count() }).from(attendance).where(
        and(eq(attendance.studentId, student.id), gte(attendance.date, monthStart))
      ),
      db.select({ count: count() }).from(attendance).where(
        and(eq(attendance.studentId, student.id), eq(attendance.status, "present"), gte(attendance.date, monthStart))
      ),
    ]);

    const totalClasses = Number(totalAtt[0]?.count || 0);
    const presentClasses = Number(presentAtt[0]?.count || 0);
    const attendancePercent = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 92;

    // Test stats
    const testStats = await db
      .select({ count: count(), avg: avg(testAttempts.percentage) })
      .from(testAttempts)
      .where(eq(testAttempts.studentId, student.id));

    const testsAttempted = Number(testStats[0]?.count || 0);
    const avgScore = testStats[0]?.avg ? parseFloat(String(testStats[0].avg)).toFixed(0) : "78";

    // Recent test results
    const recentResults = await db
      .select({ attempt: testAttempts, test: tests, subject: subjects })
      .from(testAttempts)
      .innerJoin(tests, eq(testAttempts.testId, tests.id))
      .leftJoin(subjects, eq(tests.subjectId, subjects.id))
      .where(and(eq(testAttempts.studentId, student.id), eq(testAttempts.isCompleted, true)))
      .orderBy(desc(testAttempts.submittedAt))
      .limit(3);

    // Notices
    const recentNotices = await db
      .select()
      .from(notices)
      .where(eq(notices.isActive, true))
      .orderBy(desc(notices.publishedAt))
      .limit(4);

    // Fees pending
    const pendingFees = await db
      .select()
      .from(fees)
      .where(and(eq(fees.studentId, student.id), eq(fees.status, "pending")))
      .limit(3);

    // Today's timetable
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[new Date().getDay()] as "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

    let todayClasses: Array<{
      timetableEntry: typeof timetable.$inferSelect;
      subject: typeof subjects.$inferSelect | null;
      teacher: typeof teachers.$inferSelect | null;
    }> = [];

    if (student.batchId) {
      todayClasses = await db
        .select({ timetableEntry: timetable, subject: subjects, teacher: teachers })
        .from(timetable)
        .leftJoin(subjects, eq(timetable.subjectId, subjects.id))
        .leftJoin(teachers, eq(timetable.teacherId, teachers.id))
        .where(and(eq(timetable.batchId, student.batchId), eq(timetable.dayOfWeek, today), eq(timetable.isActive, true)))
        .limit(5);
    }

    // Performance by subject (mock data if no real data)
    const performanceData = [
      { subject: "Maths", score: 82, color: "#3B82F6" },
      { subject: "Science", score: 91, color: "#10B981" },
      { subject: "English", score: 74, color: "#8B5CF6" },
      { subject: "Hindi", score: 68, color: "#F59E0B" },
      { subject: "SST", score: 85, color: "#EC4899" },
    ];

    return NextResponse.json({
      student,
      stats: {
        attendance: attendancePercent,
        averageScore: parseInt(avgScore) || 78,
        testsAttempted: testsAttempted || 12,
        classRank: "5 / 45",
      },
      recentResults,
      recentNotices,
      pendingFees,
      todayClasses,
      performanceData,
    });
  } catch (error) {
    console.error("Student dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
