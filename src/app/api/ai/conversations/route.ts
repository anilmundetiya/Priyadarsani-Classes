import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aiConversations, aiMessages, students } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.userId, session.userId))
      .orderBy(desc(aiConversations.updatedAt))
      .limit(20);

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Get conversations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
