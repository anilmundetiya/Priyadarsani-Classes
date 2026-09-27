import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { timetable, subjects, teachers } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
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

    const schedule = await db
      .select({
        id: timetable.id,
        dayOfWeek: timetable.dayOfWeek,
        startTime: timetable.startTime,
        endTime: timetable.endTime,
        room: timetable.room,
        subject: subjects.name,
        teacher: teachers.fullName,
      })
      .from(timetable)
      .leftJoin(subjects, eq(timetable.subjectId, subjects.id))
      .leftJoin(teachers, eq(timetable.teacherId, teachers.id))
      .where(eq(timetable.batchId, studentRecord.batchId))
      .orderBy(asc(timetable.dayOfWeek), asc(timetable.startTime));

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Timetable API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
