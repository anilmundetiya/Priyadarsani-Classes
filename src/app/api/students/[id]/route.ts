import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { students, users, studentSubjects, subjects, batches, teachers, attendance, testAttempts, fees, tests } from "@/db/schema";
import { eq, desc, count, avg } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Students can only view their own profile; teachers/admins can view any
    if (session.role === "student") {
      const studentData = await db
        .select()
        .from(students)
        .where(eq(students.userId, session.userId))
        .limit(1);
      if (!studentData[0] || studentData[0].id !== id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const studentResult = await db
      .select()
      .from(students)
      .where(eq(students.id, id))
      .limit(1);

    if (!studentResult[0]) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const student = studentResult[0];

    // Get batch info
    let batchInfo = null;
    if (student.batchId) {
      const batchData = await db
        .select({ batch: batches, teacher: teachers })
        .from(batches)
        .leftJoin(teachers, eq(batches.teacherId, teachers.id))
        .where(eq(batches.id, student.batchId))
        .limit(1);
      batchInfo = batchData[0] || null;
    }

    // Get subjects
    const subjectsData = await db
      .select({ subject: subjects })
      .from(studentSubjects)
      .innerJoin(subjects, eq(studentSubjects.subjectId, subjects.id))
      .where(eq(studentSubjects.studentId, student.id));

    // Attendance stats
    const totalAttendance = await db
      .select({ count: count() })
      .from(attendance)
      .where(eq(attendance.studentId, student.id));

    const presentAttendance = await db
      .select({ count: count() })
      .from(attendance)
      .where(eq(attendance.studentId, student.id));

    // Test stats
    const testStats = await db
      .select({ count: count(), avg: avg(testAttempts.percentage) })
      .from(testAttempts)
      .where(eq(testAttempts.studentId, student.id));

    // Fees
    const feesData = await db
      .select()
      .from(fees)
      .where(eq(fees.studentId, student.id))
      .orderBy(desc(fees.createdAt))
      .limit(5);

    // User info
    const userInfo = await db
      .select({ lastLogin: users.lastLogin, createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, student.userId))
      .limit(1);

    return NextResponse.json({
      student,
      batch: batchInfo,
      subjects: subjectsData.map((s) => s.subject),
      stats: {
        totalClasses: totalAttendance[0]?.count || 0,
        presentClasses: presentAttendance[0]?.count || 0,
        testsAttempted: testStats[0]?.count || 0,
        averageScore: testStats[0]?.avg ? parseFloat(String(testStats[0].avg)).toFixed(1) : "0",
      },
      fees: feesData,
      userInfo: userInfo[0] || null,
    });
  } catch (error) {
    console.error("Get student error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !["teacher", "admin"].includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const allowedFields = [
      "fullName", "mobile", "dateOfBirth", "gender", "address", "city",
      "state", "pincode", "school", "classStandard", "division", "board",
      "academicYear", "batchId", "fatherName", "motherName", "guardianMobile",
      "parentEmail", "status", "rollNumber",
    ];

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const updated = await db
      .update(students)
      .set(updateData)
      .where(eq(students.id, id))
      .returning();

    if (!updated[0]) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ student: updated[0] });
  } catch (error) {
    console.error("Update student error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
