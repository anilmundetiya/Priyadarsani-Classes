import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { students, users, batches, subjects, studentSubjects } from "@/db/schema";
import { eq, like, and, or, desc, count } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";
import { generateStudentId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !["teacher", "admin"].includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const classStandard = searchParams.get("class") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          like(students.fullName, `%${search}%`),
          like(students.studentId, `%${search}%`),
          like(students.email, `%${search}%`)
        )
      );
    }
    if (classStandard) {
      conditions.push(eq(students.classStandard, classStandard));
    }
    if (status) {
      conditions.push(eq(students.status, status as "active" | "inactive" | "suspended"));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [studentsData, totalCount] = await Promise.all([
      db
        .select()
        .from(students)
        .where(whereClause)
        .orderBy(desc(students.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(students)
        .where(whereClause),
    ]);

    return NextResponse.json({
      students: studentsData,
      total: totalCount[0]?.count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error("List students error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const createStudentSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  mobile: z.string().optional(),
  classStandard: z.string().optional(),
  division: z.string().optional(),
  batchId: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  guardianMobile: z.string().optional(),
  parentEmail: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  school: z.string().optional(),
  rollNumber: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !["teacher", "admin"].includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validated = createStudentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email.toLowerCase()))
      .limit(1);

    if (existingUser[0]) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(data.password);
    const studentId = generateStudentId();
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;

    const newUser = await db
      .insert(users)
      .values({
        email: data.email.toLowerCase(),
        passwordHash,
        role: "student",
      })
      .returning();

    const newStudent = await db
      .insert(students)
      .values({
        userId: newUser[0].id,
        studentId,
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        mobile: data.mobile || null,
        classStandard: data.classStandard || null,
        division: data.division || null,
        batchId: data.batchId || null,
        gender: data.gender || null,
        dateOfBirth: data.dateOfBirth || null,
        fatherName: data.fatherName || null,
        motherName: data.motherName || null,
        guardianMobile: data.guardianMobile || null,
        parentEmail: data.parentEmail || null,
        address: data.address || null,
        school: data.school || null,
        rollNumber: data.rollNumber || null,
        academicYear,
        enrollmentDate: new Date().toISOString().split("T")[0],
      })
      .returning();

    return NextResponse.json({ student: newStudent[0] }, { status: 201 });
  } catch (error) {
    console.error("Create student error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
