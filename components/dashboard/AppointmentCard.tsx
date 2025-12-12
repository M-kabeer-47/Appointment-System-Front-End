import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const statusConfig = {
  PENDING: {
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: AlertCircle,
    label: "Pending",
  },
  APPROVED: {
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
    label: "Approved",
  },
  REJECTED: {
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    label: "Rejected",
  },
  CANCELLED: {
    color: "bg-slate-100 text-slate-600 border-slate-200",
    icon: XCircle,
    label: "Cancelled",
  },
};

interface Appointment {
  id: string;
  dateTime: string;
  reason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  patientName?: string;
  doctorName?: string;
  patientImage?: string;
  doctorImage?: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  isDoctor: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function AppointmentCard({
  appointment,
  isDoctor,
  onApprove,
  onReject,
}: AppointmentCardProps) {
  const status = statusConfig[appointment.status];
  const StatusIcon = status.icon;

  const displayName = isDoctor
    ? appointment.patientName || "Patient"
    : appointment.doctorName || "Doctor";

  const displayImage = isDoctor
    ? appointment.patientImage || "/images/patient.png"
    : appointment.doctorImage || "/images/doctor.png";

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm">
              <img
                src={displayImage}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-lg">
                {isDoctor ? displayName : `Dr. ${displayName}`}
              </p>
              <div className="flex items-center gap-2 text-slate-500 text-sm mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {new Date(appointment.dateTime).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(appointment.dateTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {appointment.reason && (
                <p className="text-sm text-slate-400 mt-1 italic">
                  "{appointment.reason}"
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-3">
            <span
              className={`px-3 py-1 self-start md:self-auto rounded-full text-xs font-semibold flex items-center gap-1.5 border ${status.color}`}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {status.label}
            </span>

            {/* Doctor actions for PENDING appointments */}
            {isDoctor && appointment.status === "PENDING" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs"
                  onClick={() => onApprove?.(appointment.id)}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 text-xs"
                  onClick={() => onReject?.(appointment.id)}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
