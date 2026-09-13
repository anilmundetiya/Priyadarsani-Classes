import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subjects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const subjectsData = await db
      .select()
      .from(subjects)
      .where(eq(subjects.isActive, true));

    return NextResponse.json({ subjects: subjectsData });
  } catch (error) {
    console.error("Get subjects error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const newSubject = await db.insert(subjects).values(body).returning();
    return NextResponse.json({ subject: newSubject[0] }, { status: 201 });
  } catch (error) {
    console.error("Create subject error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
