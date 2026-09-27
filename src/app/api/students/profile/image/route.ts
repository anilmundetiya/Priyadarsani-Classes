import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "Priyadarshani-classes-super-secret-key-2024"
);

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("pc_auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = payload.userId as string;

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = path.extname(file.name) || '.jpg';
    const filename = `student_${userId}_${Date.now()}${ext}`;
    
    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "profile-pictures");
    await mkdir(uploadDir, { recursive: true });
    
    // Write file
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/profile-pictures/${filename}`;

    // Update database
    await db
      .update(students)
      .set({ profileImage: imageUrl })
      .where(eq(students.userId, userId));

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Profile Image Upload Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
