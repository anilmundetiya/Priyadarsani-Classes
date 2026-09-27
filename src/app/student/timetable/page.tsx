"use client";
import { useState, useEffect } from "react";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import Card from "@/components/ui/Card";
import { Calendar, Clock, MapPin, User as UserIcon } from "lucide-react";

interface TimetableEntry {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string | null;
  subject: string | null;
  teacher: string | null;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TimetablePage() {
  const [schedule, setSchedule] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/timetable")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSchedule(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Weekly Timetable</h1>
        <p className="text-slate-500 mt-1">Your class schedule for the current batch.</p>
      </div>

      {schedule.length === 0 ? (
        <Card className="text-center py-16 border-dashed border-2">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-700 text-lg">No timetable assigned yet.</p>
          <p className="text-sm text-slate-500 mt-1">Contact your batch teacher for the schedule.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {days.map(day => {
            const dayClasses = schedule.filter(s => s.dayOfWeek === day);
            if (dayClasses.length === 0) return null;

            return (
              <Card key={day} className="p-0 overflow-hidden border-l-4 border-l-blue-500">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">{day}</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {dayClasses.map(cls => (
                    <div key={cls.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex gap-4 items-start">
                        <div className="bg-blue-50 text-blue-700 rounded-lg px-3 py-2 text-center min-w-[100px]">
                          <p className="text-sm font-bold">{cls.startTime}</p>
                          <p className="text-xs font-medium opacity-70">to {cls.endTime}</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-lg">{cls.subject}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                            {cls.teacher && (
                              <span className="flex items-center gap-1">
                                <UserIcon className="w-3.5 h-3.5" />
                                {cls.teacher}
                              </span>
                            )}
                            {cls.room && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                Room {cls.room}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
