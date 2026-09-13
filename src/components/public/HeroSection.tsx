"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Bot, BookOpen, Star, TrendingUp, Users, Mic } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 min-h-[92vh] flex items-center">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-300 text-sm font-medium">Maharashtra State Board • Mumbai</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              <span className="block">Smart</span>
              <span className="block text-blue-400">Learning.</span>
              <span className="block">Better</span>
              <span className="block text-amber-400">Future.</span>
            </h1>

            <p className="text-lg text-slate-300 mb-4 leading-relaxed">
              AI-powered coaching platform for Classes 5th to 12th.
              Maharashtra State Board | Expert teachers | 24/7 AI doubt solving.
            </p>

            <p className="text-base text-blue-300 italic mb-8 font-medium">
              "The expert in anything was once a beginner." — Prem Sir
            </p>

            {/* Features list */}
            <ul className="space-y-2 mb-8">
              {[
                { icon: Bot, text: "AI Doubt Solver 24/7" },
                { icon: BookOpen, text: "Personalized Tests & Practice" },
                { icon: TrendingUp, text: "Live + Recorded Classes" },
                { icon: Star, text: "Performance Reports & Analytics" },
                { icon: Users, text: "Expert Teachers in every subject" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-400 text-white font-bold shadow-lg shadow-blue-500/30">
                  Book Free Demo Class
                </Button>
              </a>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Student Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Right — Visual elements */}
          <div className="relative hidden lg:block">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/50">
              <Image
                src="/images/hero-student.jpg"
                alt="Student learning"
                width={600}
                height={500}
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3 min-w-[180px]">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">AI Doubt Solver</p>
                <p className="text-sm font-bold text-slate-800">Ask Anything</p>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Maths Test</p>
                  <p className="text-sm font-bold text-blue-600">Score: 85/100</p>
                </div>
              </div>
              <div className="text-xs text-slate-600">
                Rank <span className="font-bold text-blue-600">5/45</span> in class 🏆
              </div>
            </div>

            <div className="absolute top-1/2 -right-8 -translate-y-1/2 bg-white rounded-2xl p-4 shadow-xl border border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-1">Attendance</p>
              <p className="text-2xl font-extrabold text-green-600">92%</p>
              <p className="text-xs text-slate-400">This month</p>
            </div>
          </div>
        </div>

        {/* Bottom stats for mobile */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 lg:hidden">
          {[
            { value: "1000+", label: "Students" },
            { value: "15+", label: "Years Experience" },
            { value: "24/7", label: "AI Support" },
            { value: "98%", label: "Success Rate" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-extrabold text-blue-400">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
