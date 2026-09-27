import AILearningSection from "@/components/public/AILearningSection";

export default function AILearningPage() {
  return (
    <div className="pt-10 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          AI-Powered Learning
        </h1>
        <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
          Experience the future of education. Our platform combines traditional coaching with advanced Artificial Intelligence to provide 24/7 support.
        </p>
      </div>
      <AILearningSection />
    </div>
  );
}
