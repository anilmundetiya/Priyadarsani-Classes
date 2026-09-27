import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = schema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { email } = validated.data;

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    // Always return success — don't reveal if email exists
    if (!userResult[0]) {
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await db.insert(passwordResetTokens).values({
      userId: userResult[0].id,
      token,
      expiresAt,
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Priyadarshani Classes <onboarding@resend.dev>",      to: email,
      subject: "Reset your password — Priyadarshani Classes",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1e293b;">Reset Your Password</h2>
          <p style="color: #475569;">Click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">
            Reset Password
          </a>
          <p style="color:#94a3b8;font-size:12px;">If you did not request this, ignore this email.</p>
          <p style="color:#94a3b8;font-size:12px;">Priyadarshani Classes, Mumbai</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
