import { Card, CardContent } from "@/components/ui/card";

interface Appointment {
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
}

interface StatsCardsProps {
  appointments: Appointment[];
}

export function StatsCards({ appointments }: StatsCardsProps) {
  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === "PENDING").length;
  const approved = appointments.filter((a) => a.status === "APPROVED").length;
  const cancelled = appointments.filter(
    (a) => a.status === "CANCELLED" || a.status === "REJECTED"
  ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm text-slate-500 mb-1">Total</p>
          <p className="text-2xl font-bold text-slate-800">{total}</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm text-slate-500 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm text-slate-500 mb-1">Approved</p>
          <p className="text-2xl font-bold text-emerald-600">{approved}</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm text-slate-500 mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-slate-400">{cancelled}</p>
        </CardContent>
      </Card>
    </div>
  );
}
