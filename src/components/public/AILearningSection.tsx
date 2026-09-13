"use client";
import { useState } from "react";
import { Bot, ImageIcon, Mic, Send, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

const demoConversation = [
  {
    role: "user",
    text: "How does photosynthesis work? I'm in Class 9.",
  },
  {
    role: "ai",
    text: `Great question! Photosynthesis is the process by which plants make their own food using sunlight.

**The simple equation:**
6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂

**Step-by-step:**
1. **Light Absorption** — Chlorophyll in leaves absorbs sunlight
2. **Water Splitting** — Water molecules split into H⁺ and O₂ (oxygen is released)
3. **Carbon Fixation** — CO₂ from air is converted into glucose (food)

**Remember:** This happens in two stages:
- Light reactions (in thylakoids) 
- Dark reactions/Calvin Cycle (in stroma)

For Maharashtra Board Class 9, focus on understanding the basic equation and the role of chlorophyll. 🌿

Keep learning! You're doing great! 🌟`,
  },
];

export default function AILearningSection() {
  const [activeDemo, setActiveDemo] = useState<"text" | "image" | "voice">("text");

  return (
    <section id="ai-learning" className="py-20 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            AI-Powered Learning
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Your 24/7 AI <span className="text-blue-400">Doubt Solver</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Ask any question via text, image, or voice. Get detailed, step-by-step explanations aligned with Maharashtra State Board curriculum.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Features */}
          <div className="space-y-5">
            {[
              {
                icon: Bot,
                title: "Text Doubt Solver",
                description: "Type your question and get an instant, detailed explanation with step-by-step solutions.",
                color: "bg-blue-500/20 text-blue-400",
                key: "text" as const,
              },
              {
                icon: ImageIcon,
                title: "Image Question Solver",
                description: "Take a photo of your textbook question. AI reads the image and solves it with full explanation.",
                color: "bg-green-500/20 text-green-400",
                key: "image" as const,
              },
              {
                icon: Mic,
                title: "Voice AI Learning",
                description: "Speak your doubt and hear the answer. Perfect for younger students and on-the-go learning.",
                color: "bg-purple-500/20 text-purple-400",
                key: "voice" as const,
              },
            ].map((feature) => (
              <button
                key={feature.key}
                onClick={() => setActiveDemo(feature.key)}
                className={`w-full flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 text-left ${
                  activeDemo === feature.key
                    ? "bg-white/10 border-blue-400/40"
                    : "border-white/5 hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </button>
            ))}

            <div className="pt-2">
              <Link href="/login">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-400 shadow-lg shadow-blue-500/30">
                  <Bot className="w-5 h-5" />
                  Try AI Doubt Solver
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Demo Chat */}
          <div className="bg-slate-800/60 rounded-3xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900/80 px-5 py-4 flex items-center gap-3 border-b border-white/10">
              <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AI Doubt Solver</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-green-400 text-xs">Online • Powered by Prem Sir's knowledge</p>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-amber-400 ml-auto" />
            </div>

            {/* Messages */}
            <div className="p-5 space-y-4 max-h-80 overflow-y-auto">
              {demoConversation.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-slate-700/80 text-slate-200 rounded-bl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-white text-xs font-bold">
                      S
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-900/60 rounded-xl border border-white/10 flex items-center px-4">
                  <input
                    type="text"
                    placeholder="Ask your doubt..."
                    className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    readOnly
                  />
                  <div className="flex gap-2 items-center">
                    <button className="p-1 text-slate-400 hover:text-slate-200">
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-200">
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-xs text-slate-500 text-center mt-2">
                Login to access the full AI Doubt Solver
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
