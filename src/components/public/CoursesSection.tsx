import { BookOpen, Calculator, FlaskConical, Globe, Languages, Atom } from "lucide-react";

const classes = [
  { std: "5th", label: "Class 5", subjects: ["Mathematics", "Science", "English", "Hindi", "Marathi", "EVS"], color: "bg-blue-500" },
  { std: "6th", label: "Class 6", subjects: ["Mathematics", "Science", "English", "Hindi", "Marathi", "SST"], color: "bg-green-500" },
  { std: "7th", label: "Class 7", subjects: ["Mathematics", "Science", "English", "Hindi", "Marathi", "SST"], color: "bg-purple-500" },
  { std: "8th", label: "Class 8", subjects: ["Mathematics", "Science", "English", "Hindi", "Marathi", "SST"], color: "bg-amber-500" },
  { std: "9th", label: "Class 9", subjects: ["Algebra", "Geometry", "Science-I", "Science-II", "English", "Hindi", "SST"], color: "bg-pink-500" },
  { std: "10th", label: "Class 10", subjects: ["Algebra", "Geometry", "Science-I", "Science-II", "English", "Hindi", "SST", "Marathi"], color: "bg-red-500" },
  { std: "11th", label: "Class 11", subjects: ["Physics", "Chemistry", "Biology", "Mathematics", "English"], color: "bg-indigo-500" },
  { std: "12th", label: "Class 12", subjects: ["Physics", "Chemistry", "Biology", "Mathematics", "English"], color: "bg-teal-500" },
];

const subjects = [
  { name: "Mathematics", icon: Calculator, color: "text-blue-600", bg: "bg-blue-50", description: "Algebra, Geometry, Calculus" },
  { name: "Science", icon: FlaskConical, color: "text-green-600", bg: "bg-green-50", description: "Physics, Chemistry, Biology" },
  { name: "English", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50", description: "Grammar, Literature, Writing" },
  { name: "Hindi", icon: Languages, color: "text-amber-600", bg: "bg-amber-50", description: "Reading, Writing, Grammar" },
  { name: "Social Science", icon: Globe, color: "text-pink-600", bg: "bg-pink-50", description: "History, Geography, Civics" },
  { name: "Physics", icon: Atom, color: "text-indigo-600", bg: "bg-indigo-50", description: "Mechanics, Optics, Electromagnetism" },
];

export default function CoursesSection() {
  return (
    <section id="courses" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-green-50 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-green-100">
            Maharashtra State Board
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Classes & <span className="text-green-600">Subjects</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Comprehensive coaching for Classes 5th to 12th. All subjects covered by subject expert teachers.
          </p>
        </div>

        {/* Class cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-12">
          {classes.map((cls) => (
            <div
              key={cls.std}
              className="group text-center p-4 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              <div className={`w-12 h-12 ${cls.color} rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg`}>
                {cls.std.replace("th", "")}
              </div>
              <p className="text-xs font-bold text-slate-700">{cls.label}</p>
              <p className="text-xs text-slate-400 mt-1">{cls.subjects.length} subjects</p>
            </div>
          ))}
        </div>

        {/* Subjects grid */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-800 text-center mb-8">Subject Expert Teaching</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-12 h-12 ${subject.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <subject.icon className={`w-6 h-6 ${subject.color}`} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{subject.name}</h4>
                  <p className="text-sm text-slate-500 mt-0.5">{subject.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Batch timings */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 text-center">Batch Timings</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { timing: "Morning Batch", time: "7:00 AM – 9:00 AM", days: "Mon, Wed, Fri", color: "bg-amber-400" },
              { timing: "Afternoon Batch", time: "1:00 PM – 3:00 PM", days: "Tue, Thu, Sat", color: "bg-blue-400" },
              { timing: "Evening Batch", time: "5:00 PM – 7:00 PM", days: "Mon, Wed, Fri", color: "bg-purple-400" },
            ].map((batch) => (
              <div key={batch.timing} className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                <div className={`w-3 h-3 ${batch.color} rounded-full mx-auto mb-2`} />
                <p className="font-bold text-slate-800 text-sm">{batch.timing}</p>
                <p className="text-slate-600 font-medium text-sm">{batch.time}</p>
                <p className="text-slate-400 text-xs mt-1">{batch.days}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-4">
            * Timings may vary by class and batch. Contact us for exact schedule.
          </p>
        </div>
      </div>
    </section>
  );
}
