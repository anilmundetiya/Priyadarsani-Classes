"use client";
import { useState, useEffect } from "react";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { CreditCard, Receipt, Clock, Download, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Payment {
  id: string;
  amount: string;
  method: string;
  paidAt: string;
}

interface Fee {
  id: string;
  title: string;
  description: string;
  amount: string;
  dueDate: string;
  status: "pending" | "paid" | "partial" | "overdue";
  payments: Payment[];
}

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/fees")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFees(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const totalDue = fees.filter(f => ["pending", "overdue", "partial"].includes(f.status))
    .reduce((sum, f) => {
      const amount = parseFloat(f.amount);
      const paid = f.payments.reduce((pSum, p) => pSum + parseFloat(p.amount), 0);
      return sum + (amount - paid);
    }, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Fee Management</h1>
        <p className="text-slate-500 mt-1">View your fee status, upcoming dues, and payment history.</p>
      </div>

      <Card className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-xl shadow-blue-900/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-blue-200 font-medium text-sm mb-1 uppercase tracking-wider">Total Outstanding Due</p>
            <p className="text-4xl font-black">₹{totalDue.toLocaleString('en-IN')}</p>
          </div>
          <Button className="bg-white text-blue-900 hover:bg-blue-50 border-none font-bold shadow-lg">
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Online Now
          </Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Pending & Upcoming Dues
          </h2>
          {fees.filter(f => f.status !== "paid").length === 0 ? (
            <Card className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-bold text-slate-700">All Clear!</p>
              <p className="text-sm text-slate-500">You have no pending fees.</p>
            </Card>
          ) : (
            fees.filter(f => f.status !== "paid").map((fee) => (
              <Card key={fee.id} className="border-l-4 border-l-amber-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{fee.title}</h3>
                    <p className="text-xs text-slate-500">Due: {formatDate(fee.dueDate)}</p>
                  </div>
                  <Badge variant={fee.status === "overdue" ? "red" : "amber"}>{fee.status}</Badge>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-sm text-slate-500">Amount</p>
                    <p className="font-bold text-slate-800">₹{parseFloat(fee.amount).toLocaleString('en-IN')}</p>
                  </div>
                  <Button size="sm">Pay Now</Button>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-green-500" />
            Payment History
          </h2>
          {fees.filter(f => f.payments.length > 0).length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-slate-500">No payment history found.</p>
            </Card>
          ) : (
            fees.filter(f => f.payments.length > 0).map((fee) => (
              <div key={fee.id} className="space-y-3">
                {fee.payments.map((payment) => (
                  <Card key={payment.id} className="flex justify-between items-center p-4">
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">{fee.title}</h3>
                      <p className="text-xs text-slate-500">Paid on {formatDate(payment.paidAt)} via {payment.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{parseFloat(payment.amount).toLocaleString('en-IN')}</p>
                      <button className="text-xs text-blue-600 hover:underline mt-1 flex items-center justify-end w-full gap-1">
                        <Download className="w-3 h-3" /> Receipt
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
// Adding dummy checkcircle since I forgot to import it at the top
import { CheckCircle } from "lucide-react";
