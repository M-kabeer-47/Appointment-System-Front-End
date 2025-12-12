"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: string;
  reason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  createdAt?: string;
  patientName?: string;
  doctorName?: string;
  patientImage?: string;
  doctorImage?: string;
}

interface Doctor {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export function useAppointments(userId?: string | null) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const getAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5002/api/appointments", {
        withCredentials: true,
      });
      setAppointments(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const getDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const res = await axios.get("http://localhost:5001/api/auth/doctors", {
        withCredentials: true,
      });
      setDoctors(res.data.doctors);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch doctors");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const createAppointment = async (
    doctorId: string,
    dateTime: string,
    reason?: string,
    doctorName?: string,
    patientImage?: string,
    doctorImage?: string
  ) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5002/api/appointments",
        {
          doctorId,
          dateTime,
          reason,
          doctorName,
          patientImage,
          doctorImage,
        },
        { withCredentials: true }
      );
      setAppointments((prev) => [...prev, res.data]);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create appointment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await axios.patch(
        `http://localhost:5002/api/appointments/${id}/status`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prev) => prev.map((a) => (a.id === id ? res.data : a)));
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update status");
      throw err;
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5002/api/appointments/${id}`, {
        withCredentials: true,
      });
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to cancel appointment");
      throw err;
    }
  };

  // Fetch doctors on mount
  useEffect(() => {
    getDoctors();
  }, []);

  // Socket.IO connection for real-time updates
  useEffect(() => {
    if (!userId) return;

    const newSocket = io("http://localhost:5003");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join", userId);
      console.log("🔌 Connected to appointment updates");
    });

    // Listen for new appointments (for doctors)
    newSocket.on("appointmentNew", (appointment: Appointment) => {
      console.log("📥 New appointment received:", appointment);
      setAppointments((prev) => {
        // Avoid duplicates
        if (prev.some((a) => a.id === appointment.id)) return prev;
        return [appointment, ...prev];
      });
    });

    // Listen for status updates (for patients)
    newSocket.on(
      "appointmentStatusUpdated",
      (update: { id: string; status: Appointment["status"] }) => {
        console.log("📥 Appointment status updated:", update);
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === update.id ? { ...a, status: update.status } : a
          )
        );
      }
    );

    return () => {
      newSocket.close();
    };
  }, [userId]);

  return {
    appointments,
    doctors,
    loading,
    loadingDoctors,
    error,
    getAppointments,
    getDoctors,
    createAppointment,
    updateStatus,
    cancelAppointment,
  };
}
