import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tests, subjects, teachers, testAttempts, students } from "@/db/schema";
import { eq, desc, and, count, avg } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classStandard = searchParams.get("class") || "";
    const subjectId = searchParams.get("subjectId") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    const conditions = [eq(tests.isActive, true)];
    if (classStandard) conditions.push(eq(tests.classStandard, classStandard));
    if (subjectId) conditions.push(eq(tests.subjectId, parseInt(subjectId)));

    // If student, only show their class tests
    if (session.role === "student") {
      const studentData = await db
        .select()
        .from(students)
        .where(eq(students.userId, session.userId))
        .limit(1);
      if (studentData[0]?.classStandard) {
        conditions.push(eq(tests.classStandard, studentData[0].classStandard));
      }
    }

    const testsData = await db
      .select({
        test: tests,
        subject: subjects,
      })
      .from(tests)
      .leftJoin(subjects, eq(tests.subjectId, subjects.id))
      .where(and(...conditions))
      .orderBy(desc(tests.createdAt))
      .limit(limit);

    return NextResponse.json({ tests: testsData });
  } catch (error) {
    console.error("Get tests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !["teacher", "admin"].includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // Get teacher ID
    if (session.role === "teacher") {
      const teacherData = await db
        .select()
        .from(teachers)
        .where(eq(teachers.userId, session.userId))
        .limit(1);
      if (teacherData[0]) {
        body.teacherId = teacherData[0].id;
      }
    }

    const newTest = await db.insert(tests).values(body).returning();
    return NextResponse.json({ test: newTest[0] }, { status: 201 });
  } catch (error) {
    console.error("Create test error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
