import CoursesSection from "@/components/public/CoursesSection";

export default function CoursesPage() {
  return (
    <div className="pt-10 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Our Courses & Batches
        </h1>
        <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
          Comprehensive coaching for Maharashtra State Board students. We provide expert guidance for 8th, 9th, and 10th standards.
        </p>
      </div>
      <CoursesSection />
    </div>
  );
}
