"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments } from "@/hooks/useAppointments";
import { Skeleton } from "@/components/ui/skeleton";
import {
  WelcomeCard,
  StatsCards,
  AppointmentCard,
  EmptyState,
  SortControl,
  Pagination,
} from "@/components/dashboard";

const ITEMS_PER_PAGE = 10;

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    appointments,
    loading: appointmentsLoading,
    getAppointments,
    updateStatus,
  } = useAppointments(user?.id);

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user?.id) {
      getAppointments();
    }
  }, [user?.id]);

  // Sort appointments
  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const dateA = new Date(a.dateTime).getTime();
      const dateB = new Date(b.dateTime).getTime();
      return sortOrder === "oldest" ? dateA - dateB : dateB - dateA;
    });
  }, [appointments, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedAppointments.length / ITEMS_PER_PAGE);
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAppointments.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedAppointments, currentPage]);

  // Reset to page 1 when sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder]);

  const isPatient = user?.role === "PATIENT";
  const isDoctor = user?.role === "DOCTOR";

  return (
    <div className="space-y-8">
      <WelcomeCard userName={user?.name || ""} isPatient={isPatient} />

      <StatsCards appointments={appointments} />

      {/* Appointments List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">
            {isPatient ? "Your Appointments" : "Appointment Requests"}
          </h2>

          {appointments.length > 0 && (
            <SortControl sortOrder={sortOrder} onSortChange={setSortOrder} />
          )}
        </div>

        {appointments.length === 0 ? (
          <EmptyState isPatient={isPatient} />
        ) : (
          <>
            <div className="space-y-4">
              {paginatedAppointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  isDoctor={isDoctor}
                  onApprove={(id) => updateStatus(id, "APPROVED")}
                  onReject={(id) => updateStatus(id, "REJECTED")}
                />
              ))}
            </div>

            {appointments.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
