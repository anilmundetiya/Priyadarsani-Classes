import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { demoRequests } from "@/db/schema";

const demoSchema = z.object({
  parentName: z.string().min(2, "Parent name is required"),
  studentName: z.string().min(2, "Student name is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  email: z.string().email().optional().or(z.literal("")),
  classStandard: z.string().optional(),
  subjects: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = demoSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const newRequest = await db
      .insert(demoRequests)
      .values(validated.data)
      .returning();

    return NextResponse.json({
      success: true,
      message: "Demo class request submitted successfully! We will contact you within 24 hours.",
      id: newRequest[0].id,
    });
  } catch (error) {
    console.error("Demo request error:", error);
    return NextResponse.json(
      { error: "Failed to submit request. Please try again." },
      { status: 500 }
    );
  }
}
