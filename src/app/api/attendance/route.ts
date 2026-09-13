import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { attendance, students } from "@/db/schema";
import { eq, and, gte, lte, desc, count } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") || "30");

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

    const conditions = [eq(attendance.studentId, targetStudentId)];
    if (startDate) conditions.push(gte(attendance.date, startDate));
    if (endDate) conditions.push(lte(attendance.date, endDate));

    const attendanceData = await db
      .select()
      .from(attendance)
      .where(and(...conditions))
      .orderBy(desc(attendance.date))
      .limit(limit);

    // Stats
    const totalCount = await db
      .select({ count: count() })
      .from(attendance)
      .where(eq(attendance.studentId, targetStudentId));

    const presentCount = await db
      .select({ count: count() })
      .from(attendance)
      .where(
        and(
          eq(attendance.studentId, targetStudentId),
          eq(attendance.status, "present")
        )
      );

    const total = totalCount[0]?.count || 0;
    const present = presentCount[0]?.count || 0;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return NextResponse.json({
      attendance: attendanceData,
      stats: {
        total,
        present,
        absent: total - present,
        percentage,
      },
    });
  } catch (error) {
    console.error("Get attendance error:", error);
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
    const newAttendance = await db.insert(attendance).values(body).returning();
    return NextResponse.json({ attendance: newAttendance[0] }, { status: 201 });
  } catch (error) {
    console.error("Create attendance error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
