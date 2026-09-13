import { Award, BookOpen, Star, Users } from "lucide-react";

export default function TeachersSection() {
  return (
    <section id="teachers" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-purple-50 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-purple-100">
            Expert Educators
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Meet Our <span className="text-purple-600">Teachers</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Experienced, passionate educators dedicated to your success.
          </p>
        </div>

        {/* Featured Teacher */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-3xl font-extrabold">P</span>
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h3 className="text-2xl font-extrabold text-slate-900">Prem Sir</h3>
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full border border-amber-100">
                    <Star className="w-3 h-3" />
                    Founder & Director
                  </span>
                </div>
                <p className="text-blue-600 font-semibold mb-3">Mathematics & Science Specialist</p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  With 15+ years of dedicated teaching experience, Prem Sir has guided thousands of students 
                  through Maharashtra State Board examinations. His unique teaching methodology combines 
                  conceptual clarity with practical application.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Users, value: "1000+", label: "Students Guided" },
                    { icon: Award, value: "15+", label: "Years Experience" },
                    { icon: BookOpen, value: "6+", label: "Subjects" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <stat.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="font-bold text-slate-800 text-lg">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other teachers placeholder */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "To be announced", subject: "Mathematics", initials: "T" },
            { name: "To be announced", subject: "Science", initials: "T" },
            { name: "To be announced", subject: "English & Languages", initials: "T" },
          ].map((teacher, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-100 text-center hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-slate-400 text-2xl font-bold">{teacher.initials}</span>
              </div>
              <h3 className="font-bold text-slate-700 mb-1">{teacher.name}</h3>
              <p className="text-sm text-slate-500">{teacher.subject} Expert</p>
              <div className="mt-3 inline-flex items-center gap-1 bg-slate-50 text-slate-500 text-xs px-3 py-1 rounded-full">
                Coming Soon
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          * More teacher profiles will be added when information is provided
        </p>
      </div>
    </section>
  );
}
