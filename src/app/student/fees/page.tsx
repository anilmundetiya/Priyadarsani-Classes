"use client";
import { useState, useEffect } from "react";
import { CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate, formatCurrency } from "@/lib/utils";

interface FeesData {
  fees: Array<{ id: string; title: string; amount: string; dueDate: string; status: string; month: string }>;
  payments: Array<{ id: string; amount: string; method: string; paidAt: string }>;
  summary: { total: number; paid: number; pending: number };
}

const statusColor: Record<string, "green" | "yellow" | "red" | "gray"> = {
  paid: "green", pending: "yellow", partial: "yellow", overdue: "red",
};

export default function FeesPage() {
  const [data, setData] = useState<FeesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fees")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Fees & Payments</h1>
        <p className="text-slate-500 text-sm mt-0.5">View your fee details and payment history</p>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard title="Total Fees" value={formatCurrency(data?.summary.total || 0)} color="text-slate-800" icon={<CreditCard className="w-5 h-5 text-slate-600" />} iconBg="bg-slate-50" />
        <StatCard title="Amount Paid" value={formatCurrency(data?.summary.paid || 0)} color="text-green-600" icon={<CheckCircle className="w-5 h-5 text-green-600" />} iconBg="bg-green-50" />
        <StatCard title="Amount Pending" value={formatCurrency(data?.summary.pending || 0)} color="text-amber-600" icon={<Clock className="w-5 h-5 text-amber-600" />} iconBg="bg-amber-50" />
      </div>

      {/* Fees list */}
      <Card>
        <h2 className="font-bold text-slate-800 mb-4">Fee Details</h2>
        {(!data?.fees || data.fees.length === 0) ? (
          <EmptyState
            icon={<CreditCard className="w-8 h-8" />}
            title="No fee records found"
            description="Your fee information will appear here once added by admin"
          />
        ) : (
          <div className="space-y-3">
            {data.fees.map(fee => (
              <div key={fee.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-800">{fee.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Due: {fee.dueDate ? formatDate(fee.dueDate) : "—"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-slate-800">{formatCurrency(parseFloat(fee.amount))}</p>
                  <Badge variant={statusColor[fee.status] || "gray"}>
                    {fee.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Payment history */}
      <Card>
        <h2 className="font-bold text-slate-800 mb-4">Payment History</h2>
        {(!data?.payments || data.payments.length === 0) ? (
          <EmptyState
            icon={<CreditCard className="w-8 h-8" />}
            title="No payment history"
            description="Your payment records will appear here"
          />
        ) : (
          <div className="space-y-3">
            {data.payments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Payment Received</p>
                    <p className="text-xs text-slate-500">via {payment.method} • {formatDate(payment.paidAt)}</p>
                  </div>
                </div>
                <p className="font-bold text-green-700">{formatCurrency(parseFloat(payment.amount))}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Note about online payment */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
        <p className="font-semibold mb-1">Online Payment Coming Soon</p>
        <p>We're working on enabling UPI and online payment options. Currently, please pay your fees directly at the institute or via bank transfer to Priyadarsani Classes.</p>
      </div>
    </div>
  );
}
