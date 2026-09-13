import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { notices, users } from "@/db/schema";
import { eq, desc, and, gte, or, isNull } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const noticesData = await db
      .select()
      .from(notices)
      .where(eq(notices.isActive, true))
      .orderBy(desc(notices.publishedAt))
      .limit(limit);

    return NextResponse.json({ notices: noticesData });
  } catch (error) {
    console.error("Get notices error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const createNoticeSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  type: z.enum(["general", "exam", "holiday", "result", "fee", "urgent"]).default("general"),
  targetRole: z.string().default("all"),
  targetClass: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !["teacher", "admin"].includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validated = createNoticeSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const newNotice = await db
      .insert(notices)
      .values({
        ...validated.data,
        createdBy: session.userId,
      })
      .returning();

    return NextResponse.json({ notice: newNotice[0] }, { status: 201 });
  } catch (error) {
    console.error("Create notice error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
