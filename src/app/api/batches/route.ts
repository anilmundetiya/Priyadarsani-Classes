import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { batches, teachers, subjects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const batchesData = await db
      .select({
        batch: batches,
        teacher: teachers,
        subject: subjects,
      })
      .from(batches)
      .leftJoin(teachers, eq(batches.teacherId, teachers.id))
      .leftJoin(subjects, eq(batches.subjectId, subjects.id))
      .where(eq(batches.isActive, true))
      .orderBy(desc(batches.createdAt));

    return NextResponse.json({ batches: batchesData });
  } catch (error) {
    console.error("Get batches error:", error);
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
    const newBatch = await db.insert(batches).values(body).returning();
    return NextResponse.json({ batch: newBatch[0] }, { status: 201 });
  } catch (error) {
    console.error("Create batch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
