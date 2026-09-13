import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { fees, payments, students } from "@/db/schema";
import { eq, desc, and, sum } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    let targetStudentId = studentId;

    if (session.role === "student") {
      const studentData = await db
        .select()
        .from(students)
        .where(eq(students.userId, session.userId))
        .limit(1);
      if (!studentData[0]) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }
      targetStudentId = studentData[0].id;
    }

    if (!targetStudentId) {
      return NextResponse.json({ error: "Student ID required" }, { status: 400 });
    }

    const feesData = await db
      .select()
      .from(fees)
      .where(eq(fees.studentId, targetStudentId))
      .orderBy(desc(fees.createdAt));

    const paymentsData = await db
      .select()
      .from(payments)
      .where(eq(payments.studentId, targetStudentId))
      .orderBy(desc(payments.paidAt));

    const totalFees = feesData.reduce((acc, f) => acc + parseFloat(String(f.amount)), 0);
    const paidFees = paymentsData.reduce((acc, p) => acc + parseFloat(String(p.amount)), 0);
    const pendingFees = totalFees - paidFees;

    return NextResponse.json({
      fees: feesData,
      payments: paymentsData,
      summary: {
        total: totalFees,
        paid: paidFees,
        pending: pendingFees,
      },
    });
  } catch (error) {
    console.error("Get fees error:", error);
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
    const newFee = await db.insert(fees).values(body).returning();
    return NextResponse.json({ fee: newFee[0] }, { status: 201 });
  } catch (error) {
    console.error("Create fee error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
