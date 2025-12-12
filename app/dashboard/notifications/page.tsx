"use client";

import { useEffect, useState } from "react";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCircle, ArrowLeft, Inbox } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const { notifications, markAsRead, getNotifications } =
    useNotificationContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Bell className="h-5 w-5 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <Card className="border-0 shadow-sm text-center py-16">
          <CardContent>
            <Inbox className="h-16 w-16 mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              All caught up!
            </h3>
            <p className="text-slate-400">No notifications at the moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`border-0 shadow-sm transition-all hover:shadow-md ${
                !notif.read ? "bg-blue-50/50 ring-1 ring-blue-100" : "bg-white"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {!notif.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      )}
                      <h3 className="font-semibold text-slate-800">
                        {notif.title}
                      </h3>
                    </div>
                    <p className="text-slate-600 text-sm">{notif.message}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {!notif.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                      onClick={() => markAsRead(notif.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
