"use client";
import React from "react";
import { motion } from "framer-motion";
import { ClientTime } from "@/components/ui/client-time";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuditLog } from "@/types";

const ACTION_ICONS: Record<string, string> = {
  LOGIN: "🔐", LOGOUT: "👋", BOOKING_CREATED: "📅", BOOKING_UPDATED: "✏️",
  BOOKING_CANCELLED: "❌", PAYMENT_RECEIVED: "💰", REFUND_ISSUED: "↩️",
  ROOM_STATUS_CHANGED: "🏨", ORDER_PLACED: "🍽️", ORDER_UPDATED: "📝",
  REPORT_GENERATED: "📊", USER_CREATED: "👤", USER_UPDATED: "⚙️",
  CHECKIN: "✅", CHECKOUT: "🚪",
};

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  BOOKING_CREATED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PAYMENT_RECEIVED: "bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400",
  BOOKING_CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  ORDER_PLACED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  ROOM_STATUS_CHANGED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

interface ActivityFeedProps {
  logs: AuditLog[];
  loading?: boolean;
}

export function ActivityFeed({ logs, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <span className="text-xs text-muted-foreground">{logs.length} entries</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {logs.slice(0, 8).map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base ${ACTION_COLORS[log.action] ?? "bg-muted text-muted-foreground"}`}>
                {ACTION_ICONS[log.action] ?? "📌"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {log.action.replace(/_/g, " ")} — {log.entity} {log.entityId}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{log.userName}</span>
                  <span className="text-muted-foreground/40">·</span>
                  <ClientTime dateStr={log.createdAt} className="text-xs text-muted-foreground" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {logs.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">No activity yet</div>
        )}
      </CardContent>
    </Card>
  );
}
