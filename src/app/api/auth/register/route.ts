import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users, students } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";
import { generateStudentId } from "@/lib/utils";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  mobile: z.string().optional(),
  classStandard: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { fullName, email, password, mobile, classStandard } = validated.data;

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser[0]) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const studentId = generateStudentId();
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        role: "student",
      })
      .returning();

    // Create student profile
    await db.insert(students).values({
      userId: newUser[0].id,
      studentId,
      fullName,
      email: email.toLowerCase(),
      mobile: mobile || null,
      classStandard: classStandard || null,
      academicYear,
      enrollmentDate: new Date().toISOString().split("T")[0],
    });

    const token = await createToken({
      userId: newUser[0].id,
      email: newUser[0].email,
      role: "student",
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        role: "student",
        displayName: fullName,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
