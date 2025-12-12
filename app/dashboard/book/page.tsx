"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, FileText, User } from "lucide-react";
import Link from "next/link";
import { DoctorSelector } from "@/components/dashboard";

export default function BookAppointmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { doctors, createAppointment, loading, loadingDoctors, error } =
    useAppointments();
  const [doctorId, setDoctorId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId) return;

    try {
      const selectedDoctor = doctors.find((d) => d.id === doctorId);
      await createAppointment(
        doctorId,
        dateTime,
        reason,
        selectedDoctor?.name,
        user?.image || undefined, // patient image
        selectedDoctor?.image // doctor image
      );
      router.push("/dashboard");
    } catch {
      // error handled in hook
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Calendar className="h-7 w-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">
                Book Appointment
              </CardTitle>
              <CardDescription className="text-blue-100/90 text-lg">
                Schedule a consultation with a specialist
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Doctor Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <Label className="text-lg font-semibold">Select Doctor</Label>
              </div>

              <DoctorSelector
                doctors={doctors}
                selectedId={doctorId}
                onSelect={setDoctorId}
                loading={loadingDoctors}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Date & Time */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <Label className="text-lg font-semibold">Date & Time</Label>
                </div>
                <Input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="h-12 text-lg border-slate-200 rounded-xl"
                  required
                />
              </div>

              {/* Reason */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FileText className="w-4 h-4 text-amber-600" />
                  </div>
                  <Label className="text-lg font-semibold">
                    Reason (optional)
                  </Label>
                </div>
                <Input
                  placeholder="Brief description of your concern..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-12 text-lg border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                disabled={loading || !doctorId || !dateTime}
              >
                {loading ? "Confirming..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
