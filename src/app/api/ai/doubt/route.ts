import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { aiConversations, aiMessages, aiUsage, students } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import OpenAI from "openai";

const doubtSchema = z.object({
  question: z.string().min(1, "Question is required").max(2000),
  conversationId: z.string().uuid().optional(),
  subject: z.string().optional(),
  classStandard: z.string().optional(),
  inputType: z.enum(["text", "image", "voice"]).default("text"),
  imageUrl: z.string().url().optional(),
});

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }
  return new OpenAI({ apiKey });
}

function buildSystemPrompt(
  studentClass: string,
  subject: string,
  studentName: string
): string {
  return `You are an expert AI tutor for Priyadarsani Classes, a coaching institute in Mumbai, Maharashtra, India. You are created by Prem Sir to help students learn better.

STUDENT CONTEXT:
- Student Name: ${studentName}
- Class/Standard: ${studentClass || "Not specified"}
- Subject: ${subject || "General"}
- Board: Maharashtra State Board

YOUR ROLE:
- Answer academic questions clearly and educationally
- Explain step-by-step for Mathematics and Science problems
- Use simple language appropriate for Maharashtra State Board students
- Encourage and motivate students
- When solving problems, show all steps clearly
- Use examples relevant to Maharashtra / Indian context where appropriate
- For Maharashtra State Board, align with the state curriculum

IMPORTANT RULES:
- Never give just the final answer — always explain the concept and steps
- Be encouraging and patient
- If unsure, clearly state uncertainty rather than guessing
- For complex topics, break down into simpler parts
- Support both English and Marathi/Hindi language questions
- Always end responses with encouragement

SUBJECT GUIDELINES:
- Mathematics: Show all calculation steps clearly
- Science: Explain concepts with real-world examples
- English: Correct grammar gently while explaining
- History/SST: Connect facts to present-day relevance
- Hindi/Marathi: Explain in the student's preferred language if needed

You represent Priyadarsani Classes and Prem Sir's teaching philosophy: "Smart Learning. Better Future."`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = doubtSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Get student info
    let studentName = "Student";
    let studentClass = data.classStandard || "";
    let studentId: string | null = null;

    if (session.role === "student") {
      const studentData = await db
        .select()
        .from(students)
        .where(eq(students.userId, session.userId))
        .limit(1);

      if (studentData[0]) {
        studentName = studentData[0].fullName;
        studentClass = studentData[0].classStandard || data.classStandard || "";
        studentId = studentData[0].id;
      }
    }

    // Check if OpenAI is configured
    let aiClient: OpenAI;
    try {
      aiClient = getOpenAIClient();
    } catch {
      // Return a mock response if no API key
      const mockAnswer = `Thank you for your question, ${studentName}! 

This is the AI Doubt Solver for Priyadarsani Classes. Currently, the AI service needs to be configured with an API key by the administrator.

Your question about "${data.question.slice(0, 100)}..." has been received. Please contact your teacher or Prem Sir for assistance.

Keep learning! 📚`;

      return NextResponse.json({
        answer: mockAnswer,
        conversationId: null,
        source: "system",
      });
    }

    // Get or create conversation
    let conversationId = data.conversationId;
    if (!conversationId) {
      const newConvo = await db
        .insert(aiConversations)
        .values({
          studentId: studentId,
          userId: session.userId,
          title: data.question.slice(0, 100),
        })
        .returning();
      conversationId = newConvo[0].id;
    }

    // Build messages for the API
    const systemPrompt = buildSystemPrompt(studentClass, data.subject || "", studentName);

    // Get conversation history
    const historyMessages = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.conversationId, conversationId))
      .limit(10);

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...historyMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // Add current question
    if (data.inputType === "image" && data.imageUrl) {
      messages.push({
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: data.imageUrl, detail: "high" },
          },
          {
            type: "text",
            text: data.question || "Please solve this question from the image.",
          },
        ],
      });
    } else {
      messages.push({ role: "user", content: data.question });
    }

    // Call OpenAI
    const model =
      data.inputType === "image" ? "gpt-4o" : "gpt-4o-mini";

    const completion = await aiClient.chat.completions.create({
      model,
      messages,
      max_tokens: 1500,
      temperature: 0.7,
    });

    const answer = completion.choices[0]?.message?.content || "I could not generate an answer. Please try again.";
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Save messages to DB
    await db.insert(aiMessages).values([
      {
        conversationId,
        role: "user",
        content: data.question,
        inputType: data.inputType,
        imageUrl: data.imageUrl || null,
      },
      {
        conversationId,
        role: "assistant",
        content: answer,
        tokensUsed,
      },
    ]);

    // Track usage
    const today = new Date().toISOString().split("T")[0];
    await db.insert(aiUsage).values({
      userId: session.userId,
      feature: "doubt_solver",
      tokensUsed,
      date: today,
    });

    return NextResponse.json({
      answer,
      conversationId,
      source: "ai",
      tokensUsed,
    });
  } catch (error) {
    console.error("AI doubt solver error:", error);

    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        { error: "AI service not configured. Please contact admin." },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "AI service error" }, { status: 500 });
  }
}
