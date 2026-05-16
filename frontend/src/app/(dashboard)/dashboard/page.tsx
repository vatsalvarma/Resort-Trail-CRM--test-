"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  IndianRupee, BedDouble, CalendarCheck, ShoppingBag,
  Users, TrendingUp, Clock, CheckCircle2,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { dashboardStats, rooms, bookings, auditLogs } from "@/data/mockData";
import { formatCurrency, formatDate, getBookingStatusColor } from "@/lib/utils";
import type { BookingStatus } from "@/types";

const ROOM_STATUS_CONFIG = {
  AVAILABLE:   { color: "bg-green-500",  label: "Available"   },
  OCCUPIED:    { color: "bg-blue-500",   label: "Occupied"    },
  MAINTENANCE: { color: "bg-amber-500",  label: "Maintenance" },
  RESERVED:    { color: "bg-purple-500", label: "Reserved"    },
  CLEANING:    { color: "bg-cyan-500",   label: "Cleaning"    },
} as const;

export default function DashboardPage() {
  const stats = dashboardStats;
  const recentBookings = bookings.slice(0, 5);

  const roomSummary = rooms.reduce(
    (acc, r) => { acc[r.status] = (acc[r.status] ?? 0) + 1; return acc; },
    {} as Record<string, number>
  );

  const monthlyRevenue = [
    "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
  ].map((label, i) => ({
    label,
    value: Math.round(stats.totalRevenue * (0.04 + Math.sin(i * 0.6 + 1) * 0.03 + i * 0.006)),
  }));
  const totalRooms = rooms.length;
  const occupiedRooms = roomSummary["OCCUPIED"] ?? 0;
  const occupancyPct = Math.round((occupiedRooms / totalRooms) * 100);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Operations Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Live overview of Village Trails Resort
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          change={stats.revenueChange}
          changeLabel="vs last month"
          icon={IndianRupee}
          iconColor="text-gold-600"
          iconBg="bg-gold-50 dark:bg-gold-900/20"
          index={0}
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          subtitle={`${occupiedRooms} / ${totalRooms} rooms`}
          change={4.2}
          changeLabel="vs last week"
          icon={BedDouble}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          index={1}
        />
        <StatsCard
          title="Active Bookings"
          value={stats.totalBookings}
          subtitle={`${stats.checkInsToday} check-ins today`}
          icon={CalendarCheck}
          iconColor="text-forest-600"
          iconBg="bg-forest-50 dark:bg-forest-900/20"
          index={2}
        />
        <StatsCard
          title="Pending Orders"
          value={stats.activeOrders}
          subtitle="Kitchen & room service"
          change={-2}
          changeLabel="vs yesterday"
          icon={ShoppingBag}
          iconColor="text-purple-600"
          iconBg="bg-purple-50 dark:bg-purple-900/20"
          index={3}
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Revenue"
          value={formatCurrency(stats.totalRevenue * 0.08)}
          icon={TrendingUp}
          iconColor="text-green-600"
          iconBg="bg-green-50 dark:bg-green-900/20"
          index={4}
        />
        <StatsCard
          title="Pending Dues"
          value={formatCurrency(bookings.reduce((s, b) => s + b.balanceDue, 0))}
          subtitle="Awaiting collection"
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 dark:bg-amber-900/20"
          index={5}
        />
        <StatsCard
          title="Check-ins Today"
          value={stats.checkInsToday}
          icon={CheckCircle2}
          iconColor="text-teal-600"
          iconBg="bg-teal-50 dark:bg-teal-900/20"
          index={6}
        />
        <StatsCard
          title="Total Guests"
          value={stats.totalBookings}
          icon={Users}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50 dark:bg-indigo-900/20"
          index={7}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Bookings</CardTitle>
                <a href="/bookings" className="text-xs text-forest-600 hover:underline">
                  View all →
                </a>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentBookings.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-forest-50 dark:bg-forest-900/30 flex items-center justify-center flex-shrink-0">
                      <BedDouble className="w-4 h-4 text-forest-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{booking.guest.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Room {booking.room.roomNumber} · {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold tabular-nums">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-xs mt-0.5 ${getBookingStatusColor(booking.status as BookingStatus)}`}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Occupancy Chart */}
        <div>
          <OccupancyChart
            occupied={roomSummary["OCCUPIED"] ?? 0}
            available={roomSummary["AVAILABLE"] ?? 0}
            maintenance={roomSummary["MAINTENANCE"] ?? 0}
            reserved={roomSummary["RESERVED"] ?? 0}
            cleaning={roomSummary["CLEANING"] ?? 0}
          />
        </div>
      </div>

      {/* Revenue Chart */}
      <RevenueChart data={monthlyRevenue} title="Monthly Revenue (Projection)" />

      {/* Activity Feed */}
      <ActivityFeed logs={auditLogs} />
    </div>
  );
}
