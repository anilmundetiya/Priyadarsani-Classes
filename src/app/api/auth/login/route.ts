import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users, students, teachers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = validated.data;

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    const user = userResult[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated. Please contact admin." },
        { status: 403 }
      );
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLogin: new Date(), updatedAt: new Date() })
      .where(eq(users.id, user.id));

    // Get profile info
    let profileId: string | null = null;
    let displayName: string = email;

    if (user.role === "student") {
      const student = await db
        .select()
        .from(students)
        .where(eq(students.userId, user.id))
        .limit(1);
      if (student[0]) {
        profileId = student[0].id;
        displayName = student[0].fullName;
      }
    } else if (user.role === "teacher" || user.role === "admin") {
      const teacher = await db
        .select()
        .from(teachers)
        .where(eq(teachers.userId, user.id))
        .limit(1);
      if (teacher[0]) {
        profileId = teacher[0].id;
        displayName = teacher[0].fullName;
      }
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profileId,
        displayName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
