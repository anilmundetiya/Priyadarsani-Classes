import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { studyMaterial, subjects, teachers, students } from "@/db/schema";
import { eq, desc, and, or } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const classStandard = searchParams.get("class");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "20");

    const conditions = [];

    // Students see public + their class material
    if (session.role === "student") {
      const studentData = await db
        .select()
        .from(students)
        .where(eq(students.userId, session.userId))
        .limit(1);

      const studentClass = studentData[0]?.classStandard;
      if (studentClass) {
        conditions.push(
          or(
            eq(studyMaterial.isPublic, true),
            eq(studyMaterial.classStandard, studentClass)
          )
        );
      } else {
        conditions.push(eq(studyMaterial.isPublic, true));
      }
    }

    if (subjectId) conditions.push(eq(studyMaterial.subjectId, parseInt(subjectId)));
    if (classStandard) conditions.push(eq(studyMaterial.classStandard, classStandard));
    if (type) conditions.push(eq(studyMaterial.type, type as "pdf" | "video" | "image" | "document" | "link" | "note"));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const materials = await db
      .select({ material: studyMaterial, subject: subjects, teacher: teachers })
      .from(studyMaterial)
      .leftJoin(subjects, eq(studyMaterial.subjectId, subjects.id))
      .leftJoin(teachers, eq(studyMaterial.teacherId, teachers.id))
      .where(whereClause)
      .orderBy(desc(studyMaterial.createdAt))
      .limit(limit);

    return NextResponse.json({ materials });
  } catch (error) {
    console.error("Get study material error:", error);
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
    const newMaterial = await db.insert(studyMaterial).values(body).returning();
    return NextResponse.json({ material: newMaterial[0] }, { status: 201 });
  } catch (error) {
    console.error("Create study material error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
