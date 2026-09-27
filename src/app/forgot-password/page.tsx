"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 px-8 py-8 text-center">
            <div className="flex justify-center mb-4">
              <Logo size="sm" light />
            </div>
          </div>

          <div className="px-8 py-8">
            {sent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-2">Check your email</h2>
                <p className="text-slate-500 text-sm mb-6">
                  We sent a password reset link to <strong>{email}</strong>. It expires in 1 hour.
                </p>
                <Link href="/login" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  ← Back to Login
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Forgot password?</h2>
                <p className="text-slate-500 text-sm mb-6">Enter your email and we'll send a reset link.</p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail className="w-4 h-4" />}
                    required
                  />
                  <Button type="submit" fullWidth size="lg" loading={loading}>
                    Send Reset Link
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/login" className="text-sm text-slate-500 hover:text-blue-600 flex items-center justify-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
