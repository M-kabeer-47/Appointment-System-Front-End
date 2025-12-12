"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Fetch notifications
  const getNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get("http://localhost:5003/api/notifications", {
        withCredentials: true,
      });
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: Notification) => !n.read).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, [userId]);

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      await axios.patch(
        `http://localhost:5003/api/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  // Socket.IO connection
  useEffect(() => {
    if (!userId) return;

    const newSocket = io("http://localhost:5003");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join", userId);
    });

    newSocket.on("notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      newSocket.close();
    };
  }, [userId]);

  // Fetch on mount
  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  return { notifications, unreadCount, markAsRead, getNotifications };
}
