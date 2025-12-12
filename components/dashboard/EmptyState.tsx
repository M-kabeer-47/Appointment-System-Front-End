import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  isPatient: boolean;
}

export function EmptyState({ isPatient }: EmptyStateProps) {
  return (
    <Card className="border-0 shadow-sm text-center py-16">
      <CardContent>
        <Calendar className="h-16 w-16 mx-auto text-slate-200 mb-4" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">
          No appointments yet
        </h3>
        <p className="text-slate-400 mb-6">
          {isPatient
            ? "Book your first appointment with a doctor"
            : "No patient requests at the moment"}
        </p>
        {isPatient && (
          <Link href="/dashboard/book">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
