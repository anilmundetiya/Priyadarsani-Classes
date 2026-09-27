"use client";
import { useState, useEffect } from "react";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { FileText, Clock, Bot, Play, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TestAttempt {
  id: string;
  marksObtained: number | null;
  percentage: string | null;
  isCompleted: boolean;
}

interface Test {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  totalMarks: number;
  duration: number | null;
  scheduledAt: string | null;
  isAiGenerated: boolean | null;
  attempt: TestAttempt | null;
}

export default function PracticeTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/tests")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const upcomingTests = tests.filter(t => !t.attempt?.isCompleted);
  const completedTests = tests.filter(t => t.attempt?.isCompleted);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Practice Tests</h1>
          <p className="text-slate-500 mt-1">Take assigned tests and generate custom AI practice tests.</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30">
          <Bot className="w-4 h-4 mr-2" />
          Generate AI Test
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Pending Tests</h2>
          {upcomingTests.length === 0 ? (
            <Card className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-bold text-slate-700">You're all caught up!</p>
              <p className="text-sm text-slate-500">No pending tests assigned.</p>
            </Card>
          ) : (
            upcomingTests.map((test) => (
              <Card key={test.id} className="border-l-4 border-l-blue-500 flex flex-col justify-between h-[180px]">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 line-clamp-1">{test.title}</h3>
                    {test.isAiGenerated && <Badge variant="purple" size="sm">AI Generated</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{test.subject} • {test.totalMarks} Marks • {test.duration || 60} Mins</p>
                  <p className="text-sm text-slate-600 line-clamp-2">{test.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-medium text-amber-600">
                    {test.scheduledAt ? `Scheduled: ${formatDate(test.scheduledAt)}` : "Open anytime"}
                  </p>
                  <Button size="sm">
                    <Play className="w-3 h-3 mr-1.5" /> Start
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Completed Tests</h2>
          {completedTests.length === 0 ? (
            <Card className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-700">No history</p>
              <p className="text-sm text-slate-500">You haven't completed any tests yet.</p>
            </Card>
          ) : (
            completedTests.map((test) => (
              <Card key={test.id} className="border-l-4 border-l-green-500 flex flex-col justify-between h-[180px]">
                <div>
                  <h3 className="font-bold text-slate-900 line-clamp-1 mb-1">{test.title}</h3>
                  <p className="text-xs text-slate-500">{test.subject} • {test.totalMarks} Marks</p>
                </div>
                
                <div className="mt-4 flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase">Score</p>
                    <p className="text-xl font-black text-slate-800">
                      {test.attempt?.marksObtained} <span className="text-sm font-medium text-slate-400">/ {test.totalMarks}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-medium uppercase">Percentage</p>
                    <p className={`text-xl font-black ${
                      parseFloat(test.attempt?.percentage || "0") >= 75 ? "text-green-600" :
                      parseFloat(test.attempt?.percentage || "0") >= 50 ? "text-amber-600" : "text-red-600"
                    }`}>
                      {test.attempt?.percentage}%
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-right">
                  <Button variant="outline" size="sm" className="text-blue-600">
                    View Detailed Analysis
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
