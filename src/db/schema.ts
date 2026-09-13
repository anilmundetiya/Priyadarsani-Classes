import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  date,
  decimal,
  pgEnum,
  serial,
  uuid,
  jsonb,
  customType,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// ENUMS
// ============================================================

export const userRoleEnum = pgEnum("user_role", [
  "student",
  "teacher",
  "admin",
]);

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const statusEnum = pgEnum("status", ["active", "inactive", "suspended"]);

export const subjectEnum = pgEnum("subject_name", [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Marathi",
  "Social Science",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Algebra",
  "Geometry",
  "Other",
]);

export const classEnum = pgEnum("class_standard", [
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
]);

export const divisionEnum = pgEnum("division", ["A", "B", "C", "D"]);

export const batchTimingEnum = pgEnum("batch_timing", [
  "Morning",
  "Afternoon",
  "Evening",
  "Weekend",
]);

export const questionTypeEnum = pgEnum("question_type", [
  "mcq",
  "short",
  "long",
  "fill",
  "true_false",
]);

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

export const materialTypeEnum = pgEnum("material_type", [
  "pdf",
  "video",
  "image",
  "document",
  "link",
  "note",
]);

export const noticeTypeEnum = pgEnum("notice_type", [
  "general",
  "exam",
  "holiday",
  "result",
  "fee",
  "urgent",
]);

export const feeStatusEnum = pgEnum("fee_status", [
  "pending",
  "paid",
  "partial",
  "overdue",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "upi",
  "bank_transfer",
  "cheque",
  "online",
]);

export const attendanceStatusEnum = pgEnum("attendance_status", [
  "present",
  "absent",
  "late",
  "excused",
]);

export const aiInputTypeEnum = pgEnum("ai_input_type", [
  "text",
  "image",
  "voice",
]);

export const dayOfWeekEnum = pgEnum("day_of_week", [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

// ============================================================
// USERS TABLE (Authentication + Role)
// ============================================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("student"),
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// SUBJECTS TABLE
// ============================================================

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  description: text("description"),
  color: varchar("color", { length: 20 }).default("#3B82F6"),
  icon: varchar("icon", { length: 50 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// TEACHERS TABLE
// ============================================================

export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  teacherId: varchar("teacher_id", { length: 20 }).notNull().unique(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  mobile: varchar("mobile", { length: 15 }),
  gender: genderEnum("gender"),
  dateOfBirth: date("date_of_birth"),
  qualification: varchar("qualification", { length: 200 }),
  specialization: varchar("specialization", { length: 200 }),
  experience: integer("experience").default(0),
  bio: text("bio"),
  profileImage: text("profile_image"),
  address: text("address"),
  status: statusEnum("status").notNull().default("active"),
  joinDate: date("join_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// TEACHER SUBJECTS (many-to-many)
// ============================================================

export const teacherSubjects = pgTable("teacher_subjects", {
  id: serial("id").primaryKey(),
  teacherId: uuid("teacher_id")
    .notNull()
    .references(() => teachers.id, { onDelete: "cascade" }),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// BATCHES TABLE
// ============================================================

export const batches = pgTable("batches", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  classStandard: varchar("class_standard", { length: 10 }).notNull(),
  division: varchar("division", { length: 5 }),
  academicYear: varchar("academic_year", { length: 20 }).notNull(),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  subjectId: integer("subject_id").references(() => subjects.id),
  timing: batchTimingEnum("timing").notNull().default("Morning"),
  startTime: varchar("start_time", { length: 10 }).notNull(),
  endTime: varchar("end_time", { length: 10 }).notNull(),
  days: text("days").array(),
  maxStudents: integer("max_students").default(40),
  currentStudents: integer("current_students").default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// STUDENTS TABLE
// ============================================================

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  studentId: varchar("student_id", { length: 20 }).notNull().unique(),
  rollNumber: varchar("roll_number", { length: 20 }),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  mobile: varchar("mobile", { length: 15 }),
  gender: genderEnum("gender"),
  dateOfBirth: date("date_of_birth"),
  profileImage: text("profile_image"),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }).default("Maharashtra"),
  pincode: varchar("pincode", { length: 10 }),
  // Academic
  classStandard: varchar("class_standard", { length: 10 }),
  division: varchar("division", { length: 5 }),
  board: varchar("board", { length: 100 }).default("Maharashtra State Board"),
  school: varchar("school", { length: 200 }),
  academicYear: varchar("academic_year", { length: 20 }),
  batchId: uuid("batch_id").references(() => batches.id),
  // Parent info
  fatherName: varchar("father_name", { length: 200 }),
  motherName: varchar("mother_name", { length: 200 }),
  guardianMobile: varchar("guardian_mobile", { length: 15 }),
  parentEmail: varchar("parent_email", { length: 255 }),
  // Status
  status: statusEnum("status").notNull().default("active"),
  enrollmentDate: date("enrollment_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// STUDENT SUBJECTS (many-to-many)
// ============================================================

export const studentSubjects = pgTable("student_subjects", {
  id: serial("id").primaryKey(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
});

// ============================================================
// TIMETABLE
// ============================================================

export const timetable = pgTable("timetable", {
  id: serial("id").primaryKey(),
  batchId: uuid("batch_id")
    .notNull()
    .references(() => batches.id, { onDelete: "cascade" }),
  subjectId: integer("subject_id").references(() => subjects.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  dayOfWeek: dayOfWeekEnum("day_of_week").notNull(),
  startTime: varchar("start_time", { length: 10 }).notNull(),
  endTime: varchar("end_time", { length: 10 }).notNull(),
  room: varchar("room", { length: 50 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// ATTENDANCE
// ============================================================

export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  batchId: uuid("batch_id").references(() => batches.id),
  subjectId: integer("subject_id").references(() => subjects.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  date: date("date").notNull(),
  status: attendanceStatusEnum("status").notNull().default("present"),
  remarks: text("remarks"),
  markedAt: timestamp("marked_at").notNull().defaultNow(),
});

// ============================================================
// STUDY MATERIAL
// ============================================================

export const studyMaterial = pgTable("study_material", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  subjectId: integer("subject_id").references(() => subjects.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  classStandard: varchar("class_standard", { length: 10 }),
  type: materialTypeEnum("type").notNull().default("pdf"),
  fileUrl: text("file_url"),
  fileSize: integer("file_size"),
  fileName: text("file_name"),
  isPublic: boolean("is_public").notNull().default(false),
  downloadCount: integer("download_count").default(0),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// NOTICES
// ============================================================

export const notices = pgTable("notices", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 300 }).notNull(),
  content: text("content").notNull(),
  type: noticeTypeEnum("type").notNull().default("general"),
  targetRole: text("target_role").default("all"),
  targetClass: varchar("target_class", { length: 10 }),
  isActive: boolean("is_active").notNull().default(true),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// TESTS
// ============================================================

export const tests = pgTable("tests", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  subjectId: integer("subject_id").references(() => subjects.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  classStandard: varchar("class_standard", { length: 10 }),
  batchId: uuid("batch_id").references(() => batches.id),
  totalMarks: integer("total_marks").notNull().default(100),
  passingMarks: integer("passing_marks").default(35),
  duration: integer("duration"), // in minutes
  difficulty: difficultyEnum("difficulty").default("medium"),
  scheduledAt: timestamp("scheduled_at"),
  isActive: boolean("is_active").notNull().default(true),
  isAiGenerated: boolean("is_ai_generated").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// TEST QUESTIONS
// ============================================================

export const testQuestions = pgTable("test_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  testId: uuid("test_id")
    .notNull()
    .references(() => tests.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  type: questionTypeEnum("type").notNull().default("mcq"),
  options: jsonb("options"), // array of strings for MCQ
  correctAnswer: text("correct_answer"),
  explanation: text("explanation"),
  marks: integer("marks").notNull().default(1),
  difficulty: difficultyEnum("difficulty").default("medium"),
  chapter: varchar("chapter", { length: 200 }),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// TEST ATTEMPTS
// ============================================================

export const testAttempts = pgTable("test_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  testId: uuid("test_id")
    .notNull()
    .references(() => tests.id, { onDelete: "cascade" }),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  submittedAt: timestamp("submitted_at"),
  marksObtained: integer("marks_obtained"),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  grade: varchar("grade", { length: 5 }),
  isCompleted: boolean("is_completed").notNull().default(false),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// TEST ANSWERS
// ============================================================

export const testAnswers = pgTable("test_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  attemptId: uuid("attempt_id")
    .notNull()
    .references(() => testAttempts.id, { onDelete: "cascade" }),
  questionId: uuid("question_id")
    .notNull()
    .references(() => testQuestions.id, { onDelete: "cascade" }),
  answer: text("answer"),
  isCorrect: boolean("is_correct"),
  marksAwarded: integer("marks_awarded").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// ASSIGNMENTS
// ============================================================

export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  subjectId: integer("subject_id").references(() => subjects.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  batchId: uuid("batch_id").references(() => batches.id),
  classStandard: varchar("class_standard", { length: 10 }),
  dueDate: timestamp("due_date"),
  totalMarks: integer("total_marks").default(10),
  attachmentUrl: text("attachment_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// ASSIGNMENT SUBMISSIONS
// ============================================================

export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id")
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  fileUrl: text("file_url"),
  remarks: text("remarks"),
  marksAwarded: integer("marks_awarded"),
  feedback: text("feedback"),
  isLate: boolean("is_late").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// FEES
// ============================================================

export const fees = pgTable("fees", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: date("due_date"),
  status: feeStatusEnum("status").notNull().default("pending"),
  academicYear: varchar("academic_year", { length: 20 }),
  month: varchar("month", { length: 20 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// PAYMENTS
// ============================================================

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  feeId: uuid("fee_id").references(() => fees.id),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: paymentMethodEnum("method").notNull().default("cash"),
  transactionId: varchar("transaction_id", { length: 100 }),
  notes: text("notes"),
  receivedBy: uuid("received_by").references(() => users.id),
  paidAt: timestamp("paid_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// AI CONVERSATIONS
// ============================================================

export const aiConversations = pgTable("ai_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => students.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  subjectId: integer("subject_id").references(() => subjects.id),
  title: varchar("title", { length: 300 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// AI MESSAGES
// ============================================================

export const aiMessages = pgTable("ai_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => aiConversations.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  inputType: aiInputTypeEnum("input_type").default("text"),
  imageUrl: text("image_url"),
  audioUrl: text("audio_url"),
  tokensUsed: integer("tokens_used"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// AI USAGE TRACKING
// ============================================================

export const aiUsage = pgTable("ai_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  feature: varchar("feature", { length: 50 }).notNull(),
  tokensUsed: integer("tokens_used").default(0),
  cost: decimal("cost", { precision: 10, scale: 6 }).default("0"),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// AUDIT LOGS
// ============================================================

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }),
  entityId: text("entity_id"),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// AI RAG SYSTEM (Document Chunks & Vectors)
// ============================================================

// Custom vector type for Supabase pgvector extension
const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return "vector(1536)"; // 1536 is the dimension size for OpenAI embeddings
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: string): number[] {
    return JSON.parse(value);
  },
});

export const documentChunks = pgTable("document_chunks", {
  id: uuid("id").primaryKey().defaultRandom(),
  materialId: uuid("material_id")
    .notNull()
    .references(() => studyMaterial.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  embedding: vector("embedding"),
  pageNumber: integer("page_number"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// DEMO REQUESTS
// ============================================================

export const demoRequests = pgTable("demo_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentName: varchar("parent_name", { length: 200 }).notNull(),
  studentName: varchar("student_name", { length: 200 }).notNull(),
  mobile: varchar("mobile", { length: 15 }).notNull(),
  email: varchar("email", { length: 255 }),
  classStandard: varchar("class_standard", { length: 10 }),
  subjects: text("subjects"),
  message: text("message"),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// RELATIONS
// ============================================================

export const usersRelations = relations(users, ({ one }) => ({
  student: one(students, { fields: [users.id], references: [students.userId] }),
  teacher: one(teachers, { fields: [users.id], references: [teachers.userId] }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, { fields: [students.userId], references: [users.id] }),
  batch: one(batches, { fields: [students.batchId], references: [batches.id] }),
  studentSubjects: many(studentSubjects),
  attendance: many(attendance),
  testAttempts: many(testAttempts),
  fees: many(fees),
  payments: many(payments),
  assignments: many(assignmentSubmissions),
  aiConversations: many(aiConversations),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, { fields: [teachers.userId], references: [users.id] }),
  teacherSubjects: many(teacherSubjects),
  batches: many(batches),
  studyMaterial: many(studyMaterial),
  tests: many(tests),
}));

export const batchesRelations = relations(batches, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [batches.teacherId],
    references: [teachers.id],
  }),
  subject: one(subjects, {
    fields: [batches.subjectId],
    references: [subjects.id],
  }),
  students: many(students),
  timetable: many(timetable),
  attendance: many(attendance),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  teacherSubjects: many(teacherSubjects),
  studentSubjects: many(studentSubjects),
  batches: many(batches),
  studyMaterial: many(studyMaterial),
  tests: many(tests),
  timetable: many(timetable),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type Teacher = typeof teachers.$inferSelect;
export type NewTeacher = typeof teachers.$inferInsert;
export type Batch = typeof batches.$inferSelect;
export type NewBatch = typeof batches.$inferInsert;
export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;
export type Notice = typeof notices.$inferSelect;
export type Test = typeof tests.$inferSelect;
export type TestQuestion = typeof testQuestions.$inferSelect;
export type TestAttempt = typeof testAttempts.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
export type StudyMaterial = typeof studyMaterial.$inferSelect;
export type Fee = typeof fees.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type AiConversation = typeof aiConversations.$inferSelect;
export type AiMessage = typeof aiMessages.$inferSelect;
export type DemoRequest = typeof demoRequests.$inferSelect;
export type DocumentChunk = typeof documentChunks.$inferSelect;