import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users, students, teachers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    const user = userResult[0];
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let profile = null;
    if (user.role === "student") {
      const studentResult = await db
        .select()
        .from(students)
        .where(eq(students.userId, user.id))
        .limit(1);
      profile = studentResult[0] || null;
    } else if (user.role === "teacher" || user.role === "admin") {
      const teacherResult = await db
        .select()
        .from(teachers)
        .where(eq(teachers.userId, user.id))
        .limit(1);
      profile = teacherResult[0] || null;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
      },
      profile,
    });
  } catch (error) {
    console.error("Me route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
