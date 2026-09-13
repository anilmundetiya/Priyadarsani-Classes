import { Bot, BookOpen, BarChart2, Users, FileText, Mic, Video, Shield } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Doubt Solver",
    description: "Ask doubts anytime — text, image, or voice. Get step-by-step explanations powered by AI, trained on Maharashtra State Board curriculum.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    badge: "24/7 Available",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    icon: FileText,
    title: "Practice Tests & AI Papers",
    description: "AI-generated practice tests based on your weak topics. Teachers can generate custom question papers in minutes.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    badge: "AI Powered",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  {
    icon: BarChart2,
    title: "Performance Analytics",
    description: "Track attendance, test scores, subject performance, and progress over time with detailed analytics and reports.",
    color: "text-green-600",
    bg: "bg-green-50",
    badge: "Real-time",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    icon: Video,
    title: "Live & Recorded Classes",
    description: "Attend live classes or watch recorded sessions at your own pace. Never miss a lesson again.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    badge: "HD Quality",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  {
    icon: BookOpen,
    title: "Study Material Library",
    description: "Organized notes, PDFs, worksheets, and resources uploaded by expert teachers for all subjects.",
    color: "text-pink-600",
    bg: "bg-pink-50",
    badge: "All Subjects",
    badgeColor: "bg-pink-100 text-pink-700",
  },
  {
    icon: Mic,
    title: "Voice AI Learning",
    description: "Speak your doubt and hear the answer. Perfect for younger students and hands-free learning.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    badge: "Voice Input",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
  {
    icon: Users,
    title: "Batch Management",
    description: "Organized batches by class and timing. Track attendance, assignments, and fees for every batch.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    badge: "Organized",
    badgeColor: "bg-teal-100 text-teal-700",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Student data is protected with industry-standard security. Role-based access ensures privacy.",
    color: "text-slate-600",
    bg: "bg-slate-50",
    badge: "Secure",
    badgeColor: "bg-slate-100 text-slate-700",
  },
];

export default function FeaturesSection() {
  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-blue-100">
            Why Students & Parents Love Priyadarshani Classes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Everything you need to{" "}
            <span className="text-blue-600">excel</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            A complete education platform combining expert teaching with AI-powered learning tools,
            designed specifically for Maharashtra State Board students.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${feature.badgeColor}`}>
                  {feature.badge}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
