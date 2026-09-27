import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { attendance, subjects, teachers } from "@/db/schema";
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
    const studentIdStr = payload.studentId as string; // This is the UUID of the student record, wait, the payload has userId or studentId? 
    // Wait, the payload in auth.ts usually contains { userId, role }. Let's assume it only has userId.
    // I should probably query the students table first to get the student UUID if it's not in the token.
    // Actually, I can just join with the students table on userId.

    // To be safe, let's fetch student record by userId
    const { students } = await import("@/db/schema");
    const userId = payload.userId as string;
    
    const studentRecord = await db.query.students.findFirst({
      where: eq(students.userId, userId),
    });

    if (!studentRecord) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const records = await db
      .select({
        id: attendance.id,
        date: attendance.date,
        status: attendance.status,
        remarks: attendance.remarks,
        subject: subjects.name,
        teacher: teachers.fullName,
      })
      .from(attendance)
      .leftJoin(subjects, eq(attendance.subjectId, subjects.id))
      .leftJoin(teachers, eq(attendance.teacherId, teachers.id))
      .where(eq(attendance.studentId, studentRecord.id))
      .orderBy(desc(attendance.date))
      .limit(50); // Just fetch the latest 50 for now

    return NextResponse.json(records);
  } catch (error) {
    console.error("Attendance API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
