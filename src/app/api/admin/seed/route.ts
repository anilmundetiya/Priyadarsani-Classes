import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, students, teachers, subjects, batches, notices, fees, testAttempts, tests } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

// This endpoint seeds initial data for development/demo purposes
// MUST be disabled in production
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_SEED !== "true") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    // Seed Subjects
    const subjectData = [
      { name: "Mathematics", code: "MATH", color: "#3B82F6", icon: "calculator" },
      { name: "Science", code: "SCI", color: "#10B981", icon: "flask" },
      { name: "English", code: "ENG", color: "#8B5CF6", icon: "book" },
      { name: "Hindi", code: "HIN", color: "#F59E0B", icon: "book-open" },
      { name: "Marathi", code: "MAR", color: "#EC4899", icon: "book-open" },
      { name: "Social Science", code: "SST", color: "#EF4444", icon: "globe" },
      { name: "Physics", code: "PHY", color: "#06B6D4", icon: "atom" },
      { name: "Chemistry", code: "CHEM", color: "#84CC16", icon: "flask" },
      { name: "Biology", code: "BIO", color: "#14B8A6", icon: "dna" },
    ];

    for (const subj of subjectData) {
      const existing = await db.select().from(subjects).where(eq(subjects.code, subj.code)).limit(1);
      if (!existing[0]) {
        await db.insert(subjects).values(subj);
      }
    }

    // Seed Admin User
    const adminEmail = "admin@Priyadarshani.com";
    const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
    
    if (!existingAdmin[0]) {
      const adminHash = await hashPassword("Admin@123");
      await db.insert(users).values({
        email: adminEmail,
        passwordHash: adminHash,
        role: "admin",
      });
    }

    // Seed Teacher (Prem Sir)
    const teacherEmail = "prem.sir@Priyadarshani.com";
    const existingTeacher = await db.select().from(users).where(eq(users.email, teacherEmail)).limit(1);
    let teacherUserId: string;
    let teacherProfileId: string;

    if (!existingTeacher[0]) {
      const teacherHash = await hashPassword("Teacher@123");
      const teacherUser = await db.insert(users).values({
        email: teacherEmail,
        passwordHash: teacherHash,
        role: "teacher",
      }).returning();
      teacherUserId = teacherUser[0].id;

      const teacherProfile = await db.insert(teachers).values({
        userId: teacherUserId,
        teacherId: "TCH001",
        fullName: "Prem Sir",
        email: teacherEmail,
        mobile: "+91 98765 43210",
        qualification: "M.Sc. Mathematics",
        specialization: "Mathematics & Science",
        experience: 15,
        bio: "Prem Sir is the founder of Priyadarshani Classes with 15+ years of teaching experience. Known for making complex concepts simple and relatable.",
        status: "active",
        joinDate: "2010-01-01",
      }).returning();
      teacherProfileId = teacherProfile[0].id;
    } else {
      teacherUserId = existingTeacher[0].id;
      const tp = await db.select().from(teachers).where(eq(teachers.userId, teacherUserId)).limit(1);
      teacherProfileId = tp[0]?.id || "";
    }

    // Seed Sample Batch
    const existingBatch = await db.select().from(batches).limit(1);
    let batchId: string;

    if (!existingBatch[0] && teacherProfileId) {
      const mathSubject = await db.select().from(subjects).where(eq(subjects.code, "MATH")).limit(1);
      const batch = await db.insert(batches).values({
        name: "10th - Morning Batch",
        classStandard: "10th",
        division: "A",
        academicYear: "2024-25",
        teacherId: teacherProfileId,
        subjectId: mathSubject[0]?.id,
        timing: "Morning",
        startTime: "07:00",
        endTime: "09:00",
        days: ["Monday", "Wednesday", "Friday"],
        maxStudents: 40,
      }).returning();
      batchId = batch[0].id;
    } else {
      batchId = existingBatch[0]?.id || "";
    }

    // Seed Demo Student
    const studentEmail = "rohan.sharma@student.com";
    const existingStudent = await db.select().from(users).where(eq(users.email, studentEmail)).limit(1);

    if (!existingStudent[0] && batchId) {
      const studentHash = await hashPassword("Student@123");
      const studentUser = await db.insert(users).values({
        email: studentEmail,
        passwordHash: studentHash,
        role: "student",
      }).returning();

      await db.insert(students).values({
        userId: studentUser[0].id,
        studentId: "STU2410001",
        rollNumber: "23A45",
        fullName: "Rohan Sharma",
        email: studentEmail,
        mobile: "+91 98765 43210",
        gender: "male",
        dateOfBirth: "2009-05-12",
        classStandard: "10th",
        division: "A",
        board: "Maharashtra State Board",
        school: "Mumbai Municipal High School",
        academicYear: "2024-25",
        batchId,
        fatherName: "Mr. Rajesh Sharma",
        motherName: "Mrs. Pooja Sharma",
        guardianMobile: "+91 98765 43211",
        parentEmail: "rajesh.sharma@email.com",
        address: "Andheri West, Mumbai, Maharashtra - 400058",
        city: "Mumbai",
        status: "active",
        enrollmentDate: "2024-06-01",
      });
    }

    // Seed Notices
    const existingNotices = await db.select().from(notices).limit(1);
    if (!existingNotices[0]) {
      await db.insert(notices).values([
        {
          title: "Half Yearly Exam Schedule",
          content: "Half Yearly examinations will begin from 10th September 2024. All students must carry their admit cards.",
          type: "exam",
          targetRole: "all",
          publishedAt: new Date("2024-08-24"),
        },
        {
          title: "New Study Material Added - Science",
          content: "New study notes for Chapter 5 - Chemical Reactions have been uploaded to the study material section.",
          type: "general",
          targetRole: "all",
          publishedAt: new Date("2024-08-22"),
        },
        {
          title: "Class Timings Updated",
          content: "Class timings for morning batch have been updated. Please check the timetable section for details.",
          type: "general",
          targetRole: "all",
          publishedAt: new Date("2024-08-20"),
        },
        {
          title: "Holiday on 26th August",
          content: "The institute will remain closed on 26th August 2024 on account of a public holiday.",
          type: "holiday",
          targetRole: "all",
          publishedAt: new Date("2024-08-18"),
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      credentials: {
        admin: { email: "admin@Priyadarshani.com", password: "Admin@123" },
        teacher: { email: "prem.sir@Priyadarshani.com", password: "Teacher@123" },
        student: { email: "rohan.sharma@student.com", password: "Student@123" },
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
