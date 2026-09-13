import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aiConversations, aiMessages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const conversation = await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.id, id))
      .limit(1);

    if (!conversation[0]) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Security: user can only access their own conversations
    if (conversation[0].userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.conversationId, id))
      .orderBy(asc(aiMessages.createdAt));

    return NextResponse.json({ conversation: conversation[0], messages });
  } catch (error) {
    console.error("Get conversation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
