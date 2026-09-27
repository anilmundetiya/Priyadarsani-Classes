import TeachersSection from "@/components/public/TeachersSection";

export default function TeachersPage() {
  return (
    <div className="pt-10 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Meet Our Expert Faculty
        </h1>
        <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
          Our teachers are experienced professionals dedicated to helping every student achieve their highest potential.
        </p>
      </div>
      <TeachersSection />
    </div>
  );
}
