"use client";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const classOptions = [
  { value: "5th", label: "Class 5" },
  { value: "6th", label: "Class 6" },
  { value: "7th", label: "Class 7" },
  { value: "8th", label: "Class 8" },
  { value: "9th", label: "Class 9" },
  { value: "10th", label: "Class 10" },
  { value: "11th", label: "Class 11" },
  { value: "12th", label: "Class 12" },
];

export default function ContactSection() {
  const [form, setForm] = useState({
    parentName: "",
    studentName: "",
    mobile: "",
    email: "",
    classStandard: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to submit. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-blue-100">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Book a <span className="text-blue-600">Free Demo Class</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Experience our teaching methodology firsthand. Book a free demo class today.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg mb-5">Contact Information</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    label: "Address",
                    value: "Mumbai, Maharashtra\n(Exact address to be provided)",
                    color: "text-red-500 bg-red-50",
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: "+91 [Contact Number to be provided]",
                    color: "text-green-600 bg-green-50",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "info@Priyadarshaniclasses.com\n(to be confirmed)",
                    color: "text-blue-600 bg-blue-50",
                  },
                  {
                    icon: Clock,
                    label: "Office Hours",
                    value: "Monday – Saturday: 7:00 AM – 7:00 PM\nSunday: 9:00 AM – 12:00 PM",
                    color: "text-purple-600 bg-purple-50",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{item.label}</p>
                      <p className="text-slate-700 font-medium whitespace-pre-line text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden h-40 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Map will be added once address is confirmed</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Request Submitted! 🎉</h3>
                <p className="text-slate-600 text-sm max-w-xs">
                  Thank you! We will contact you within 24 hours to schedule your free demo class.
                </p>
                <p className="text-blue-600 font-semibold mt-4 text-sm">"Smart Learning. Better Future."</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-slate-800 text-lg mb-5">Book Free Demo Class</h3>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Parent's Name"
                      placeholder="Father/Mother's name"
                      value={form.parentName}
                      onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                      required
                    />
                    <Input
                      label="Student's Name"
                      placeholder="Student's full name"
                      value={form.studentName}
                      onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Mobile Number"
                      placeholder="+91 98765 43210"
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      required
                    />
                    <Select
                      label="Class / Standard"
                      options={classOptions}
                      placeholder="Select class"
                      value={form.classStandard}
                      onChange={(e) => setForm({ ...form, classStandard: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Email (optional)"
                    placeholder="parent@email.com"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Message (optional)
                    </label>
                    <textarea
                      placeholder="Any specific subjects or questions..."
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                  <Button type="submit" fullWidth loading={loading} size="lg">
                    <Send className="w-4 h-4" />
                    Book Free Demo Class
                  </Button>
                  <p className="text-xs text-slate-400 text-center">
                    By submitting, you agree to be contacted by Priyadarshani Classes.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
