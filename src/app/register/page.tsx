"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

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

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    classStandard: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          mobile: form.mobile,
          classStandard: form.classStandard,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      toast.success("Account created successfully! Welcome to Priyadarsani Classes.");
      router.push("/student/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 px-8 py-6 text-center">
            <div className="flex justify-center mb-3">
              <Logo size="sm" light />
            </div>
            <p className="text-slate-300 text-sm">Create your student account</p>
          </div>

          <div className="px-8 py-7">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Join Priyadarsani</h2>
            <p className="text-slate-500 text-sm mb-5">Start your learning journey today</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Your full name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Mobile Number"
                  type="tel"
                  placeholder="+91 98765..."
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  leftIcon={<Phone className="w-4 h-4" />}
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
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              <Input
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Button type="submit" fullWidth size="lg" loading={loading}>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <p className="text-xs text-slate-400 text-center mt-3">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>

            <div className="mt-5 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
