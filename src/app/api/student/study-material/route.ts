import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { studyMaterial, subjects } from "@/db/schema";
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

    const materials = await db
      .select({
        id: studyMaterial.id,
        title: studyMaterial.title,
        description: studyMaterial.description,
        type: studyMaterial.type,
        fileUrl: studyMaterial.fileUrl,
        fileName: studyMaterial.fileName,
        fileSize: studyMaterial.fileSize,
        subject: subjects.name,
        createdAt: studyMaterial.createdAt,
      })
      .from(studyMaterial)
      .leftJoin(subjects, eq(studyMaterial.subjectId, subjects.id))
      .orderBy(desc(studyMaterial.createdAt))
      .limit(50);

    return NextResponse.json(materials);
  } catch (error) {
    console.error("Study Material API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
