"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      toast.success(`Welcome back, ${data.user.displayName}!`);

      // Redirect based on role
      if (data.user.role === "student") {
        router.push("/student/dashboard");
      } else if (data.user.role === "teacher") {
        router.push("/teacher/dashboard");
      } else if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 px-8 py-8 text-center">
            <div className="flex justify-center mb-4">
              <Logo size="sm" light />
            </div>
            <p className="text-slate-300 text-sm mt-2">
              "Smart Learning. Better Future."
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back</h2>
            <p className="text-slate-500 text-sm mb-6">Sign in to your account</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">⚠</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                leftIcon={<Mail className="w-4 h-4" />}
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
                autoComplete="current-password"
              />

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" fullWidth size="lg" loading={loading}>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Register here
                </Link>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs font-bold text-amber-700 mb-2">Demo Credentials (Development):</p>
              <div className="space-y-1 text-xs text-amber-600">
                <p><span className="font-medium">Admin:</span> admin@priyadarshani.com / Admin@123</p>
                <p><span className="font-medium">Teacher:</span> prem.sir@priyadarshani.com / Teacher@123</p>
                <p><span className="font-medium">Student:</span> rohan.sharma@student.com / Student@123</p>
              </div>
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
