import { Quote, Star } from "lucide-react";

// Placeholder testimonials — real ones to be added by the institute
const testimonials = [
  {
    name: "Parent of Class 10 Student",
    role: "Parent",
    text: "Priyadarsani Classes has transformed my child's approach to studying. The AI doubt solver is available whenever needed, and the teachers are very dedicated.",
    rating: 5,
    placeholder: true,
  },
  {
    name: "Class 9 Student",
    role: "Student",
    text: "I used to struggle with Mathematics, but Prem Sir's explanations are so clear. Now I actually enjoy solving problems!",
    rating: 5,
    placeholder: true,
  },
  {
    name: "Parent of Class 12 Student",
    role: "Parent",
    text: "The performance reports help us track our child's progress. We can see exactly which subjects need more attention.",
    rating: 5,
    placeholder: true,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-50 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-amber-100">
            What They Say
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Student & Parent <span className="text-amber-600">Reviews</span>
          </h2>
          <p className="text-slate-400 text-sm">
            * Testimonials will be updated with real student and parent reviews
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative"
            >
              <Quote className="w-8 h-8 text-slate-200 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
              {testimonial.placeholder && (
                <div className="absolute top-3 left-3 bg-slate-200 text-slate-500 text-xs px-2 py-0.5 rounded-full">
                  Sample
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quote from Prem Sir */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-center text-white">
          <Quote className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-2xl font-bold italic mb-4">
            "Education is not the filling of a pail, but the lighting of a fire."
          </p>
          <p className="text-blue-200">— Prem Sir, Founder, Priyadarsani Classes</p>
        </div>
      </div>
    </section>
  );
}
