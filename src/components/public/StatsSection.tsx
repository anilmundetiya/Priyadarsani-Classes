import { Users, Award, Clock, Star } from "lucide-react";

const stats = [
  { value: "1,000+", label: "Happy Students", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { value: "15+", label: "Years of Excellence", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
  { value: "24/7", label: "AI Doubt Support", icon: Clock, color: "text-green-600", bg: "bg-green-50" },
  { value: "98%", label: "Student Satisfaction", icon: Star, color: "text-purple-600", bg: "bg-purple-50" },
];

export default function StatsSection() {
  return (
    <section className="bg-white py-12 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center p-6 rounded-2xl hover:shadow-md transition-all duration-200"
            >
              <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <p className={`text-3xl font-extrabold ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
