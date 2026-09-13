import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { students, users, studentSubjects, subjects, batches, teachers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  mobile: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.enum(["male", "female", "other"]).optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  school: z.string().optional().nullable(),
  fatherName: z.string().optional().nullable(),
  motherName: z.string().optional().nullable(),
  guardianMobile: z.string().optional().nullable(),
  parentEmail: z.string().email().optional().nullable().or(z.literal("")),
}).passthrough();


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

    // Get batch info
    let batchInfo = null;
    if (student.batchId) {
      const batchData = await db
        .select({
          batch: batches,
          teacher: teachers,
        })
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

    const userInfo = await db
      .select({ lastLogin: users.lastLogin })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    return NextResponse.json({
      student,
      batch: batchInfo,
      subjects: subjectsData.map((s) => s.subject),
      lastLogin: userInfo[0]?.lastLogin,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = updateProfileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const studentData = await db
      .select()
      .from(students)
      .where(eq(students.userId, session.userId))
      .limit(1);

    if (!studentData[0]) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    const data = validated.data;
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.mobile !== undefined) updateData.mobile = data.mobile;
    if (data.dateOfBirth !== undefined) updateData.dateOfBirth = data.dateOfBirth;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.pincode !== undefined) updateData.pincode = data.pincode;
    if (data.school !== undefined) updateData.school = data.school;
    if (data.fatherName !== undefined) updateData.fatherName = data.fatherName;
    if (data.motherName !== undefined) updateData.motherName = data.motherName;
    if (data.guardianMobile !== undefined) updateData.guardianMobile = data.guardianMobile;
    if (data.parentEmail !== undefined) updateData.parentEmail = data.parentEmail || null;

    const updated = await db
      .update(students)
      .set(updateData)
      .where(eq(students.id, studentData[0].id))
      .returning();

    return NextResponse.json({ student: updated[0] });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
