import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tests, testAttempts, subjects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "Priyadarshani-classes-super-secret-key-2024"
);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("pc_auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "student") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const userId = payload.userId as string;

    const { students } = await import("@/db/schema");
    const studentRecord = await db.query.students.findFirst({
      where: eq(students.userId, userId),
    });

    if (!studentRecord || !studentRecord.batchId) {
      return NextResponse.json({ error: "Student or Batch not found" }, { status: 404 });
    }

    // Fetch tests assigned to this batch
    const batchTests = await db
      .select({
        id: tests.id,
        title: tests.title,
        description: tests.description,
        subject: subjects.name,
        totalMarks: tests.totalMarks,
        duration: tests.duration,
        scheduledAt: tests.scheduledAt,
        isAiGenerated: tests.isAiGenerated,
      })
      .from(tests)
      .leftJoin(subjects, eq(tests.subjectId, subjects.id))
      .where(eq(tests.batchId, studentRecord.batchId))
      .orderBy(desc(tests.scheduledAt));

    // Fetch attempts for this student
    const attempts = await db.query.testAttempts.findMany({
      where: eq(testAttempts.studentId, studentRecord.id),
    });

    const results = batchTests.map(t => {
      const attempt = attempts.find(a => a.testId === t.id);
      return {
        ...t,
        attempt: attempt || null
      };
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Tests API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
