import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { testAttempts, tests, subjects, students } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const limit = parseInt(searchParams.get("limit") || "10");

    let targetStudentId = studentId;

    if (session.role === "student") {
      const studentData = await db
        .select()
        .from(students)
        .where(eq(students.userId, session.userId))
        .limit(1);
      if (!studentData[0]) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }
      targetStudentId = studentData[0].id;
    }

    if (!targetStudentId) {
      return NextResponse.json({ error: "Student ID required" }, { status: 400 });
    }

    const results = await db
      .select({
        attempt: testAttempts,
        test: tests,
        subject: subjects,
      })
      .from(testAttempts)
      .innerJoin(tests, eq(testAttempts.testId, tests.id))
      .leftJoin(subjects, eq(tests.subjectId, subjects.id))
      .where(
        and(
          eq(testAttempts.studentId, targetStudentId),
          eq(testAttempts.isCompleted, true)
        )
      )
      .orderBy(desc(testAttempts.submittedAt))
      .limit(limit);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Get results error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
