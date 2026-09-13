"use client";
import { Construction } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import Card from "@/components/ui/Card";

export default function Page() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Recorded Classes</h1>
        <p className="text-slate-500 text-sm mt-0.5">Priyadarsani Classes</p>
      </div>
      <Card>
        <EmptyState
          icon={<Construction className="w-8 h-8" />}
          title="Coming Soon"
          description="This feature is being built and will be available soon!"
        />
      </Card>
    </div>
  );
}
