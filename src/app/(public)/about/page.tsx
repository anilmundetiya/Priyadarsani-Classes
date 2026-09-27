import { Shield, BookOpen, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            About Priyadarsani Classes
          </h1>
          <p className="mt-4 text-xl text-slate-600">
            Empowering students in Mumbai to achieve academic excellence through traditional teaching and modern AI tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Vision</h2>
            <p className="text-lg text-slate-600 mb-4">
              At Priyadarsani Classes, we believe that every student has the potential to excel. Founded by Prem Sir, our institute has been a cornerstone of quality education in Mumbai for the Maharashtra State Board.
            </p>
            <p className="text-lg text-slate-600 mb-6">
              We combine years of proven teaching methodologies with cutting-edge Artificial Intelligence to provide personalized learning experiences, doubt solving, and comprehensive performance tracking.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-slate-900">Proven Track Record</h3>
                  <p className="mt-1 text-slate-600">Years of excellent board results and successful students.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-slate-900">Comprehensive Curriculum</h3>
                  <p className="mt-1 text-slate-600">Covering 8th, 9th, and 10th standard Maharashtra Board syllabus.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-slate-900">Expert Faculty</h3>
                  <p className="mt-1 text-slate-600">Learn from Prem Sir and other dedicated, experienced teachers.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative h-[500px] rounded-2xl overflow-hidden bg-slate-100 shadow-xl border border-slate-200 flex items-center justify-center">
            {/* Placeholder for actual institute/teacher image */}
            <div className="text-slate-400 flex flex-col items-center">
              <Users className="w-16 h-16 mb-4 opacity-50" />
              <p className="font-medium">Image of Prem Sir / Institute</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
