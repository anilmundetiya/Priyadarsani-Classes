import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { fees, payments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "Priyadarshani-classes-super-secret-key-2024"
);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("pc_auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "student") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const userId = payload.userId as string;

    const { students } = await import("@/db/schema");
    const studentRecord = await db.query.students.findFirst({
      where: eq(students.userId, userId),
    });

    if (!studentRecord) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const studentFees = await db.query.fees.findMany({
      where: eq(fees.studentId, studentRecord.id),
      orderBy: [desc(fees.dueDate)],
      with: {
        payments: true,
      }
    });

    return NextResponse.json(studentFees);
  } catch (error) {
    console.error("Fees API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
