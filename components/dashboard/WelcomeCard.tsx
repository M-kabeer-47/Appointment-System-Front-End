import { Button } from "@/components/ui/button";
import { Plus, CalendarDays, Stethoscope } from "lucide-react";
import Link from "next/link";

interface WelcomeCardProps {
  userName: string;
  isPatient: boolean;
}

export function WelcomeCard({ userName, isPatient }: WelcomeCardProps) {
  return (
    <div
      className={`rounded-2xl p-8 text-white ${
        isPatient
          ? "bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400"
          : "bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 mb-1">Welcome back,</p>
          <h1 className="text-3xl font-bold mb-2">{userName}</h1>
          <p className="text-white/80">
            {isPatient
              ? "Manage your healthcare appointments"
              : "Review and manage patient appointments"}
          </p>
        </div>
        <div className="hidden md:block">
          {isPatient ? (
            <CalendarDays className="w-24 h-24 text-white/20" />
          ) : (
            <Stethoscope className="w-24 h-24 text-white/20" />
          )}
        </div>
      </div>

      {isPatient && (
        <Link href="/dashboard/book">
          <Button className="mt-6 bg-white text-blue-600 hover:bg-white/90 font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Book New Appointment
          </Button>
        </Link>
      )}
    </div>
  );
}
