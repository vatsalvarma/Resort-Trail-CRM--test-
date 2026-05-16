"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Search, Plus, Eye, Edit2, XCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { bookings } from "@/data/mockData";
import { NewBookingModal } from "@/components/modals/NewBookingModal";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { BookingStatus } from "@/types";

const STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING:    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED:  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  CHECKED_IN: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CHECKED_OUT:"bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  CANCELLED:  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  NO_SHOW:    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

const PAYMENT_STYLES: Record<string, string> = {
  PAID:    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PARTIAL: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  REFUNDED:"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  FAILED:  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function BookingsPage() {
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("ALL");
  const [showNewBooking, setShowNewBooking] = useState(false);

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.guest.name.toLowerCase().includes(search.toLowerCase()) ||
      b.room.roomNumber.includes(search);
    const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground text-sm mt-1">{bookings.length} total bookings</p>
        </div>
        <Button className="bg-forest-700 hover:bg-forest-800 text-white gap-2" onClick={() => setShowNewBooking(true)}>
          <Plus className="w-4 h-4" /> New Booking
        </Button>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2">
        {(["ALL", "PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED", "NO_SHOW"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
              statusFilter === s
                ? "bg-forest-700 text-white shadow"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {s === "ALL" ? "All" : s.replace("_", " ")}
            <span className="ml-1.5 opacity-70">
              {s === "ALL" ? bookings.length : counts[s] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search booking, guest, room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="sm:max-w-xs"
        />
        <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          {filtered.length} results
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking #</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-In</TableHead>
                  <TableHead>Check-Out</TableHead>
                  <TableHead>Nights</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((booking, i) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-mono text-xs font-semibold">
                      {booking.bookingNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{booking.guest.name}</p>
                        <p className="text-xs text-muted-foreground">{booking.guest.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">#{booking.room.roomNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.room.category.replace(/_/g, " ")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(booking.checkIn)}</TableCell>
                    <TableCell className="text-sm">{formatDate(booking.checkOut)}</TableCell>
                    <TableCell className="text-sm tabular-nums">{booking.nights}</TableCell>
                    <TableCell className="font-semibold text-sm tabular-nums">
                      {formatCurrency(booking.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", PAYMENT_STYLES[booking.paymentStatus])}>
                        {booking.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", STATUS_STYLES[booking.status as BookingStatus])}>
                        {booking.status.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" className="h-7 w-7">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="h-7 w-7">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-destructive hover:text-destructive">
                          <XCircle className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-14 text-muted-foreground">
              <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No bookings match your search</p>
            </div>
          )}
        </CardContent>
      </Card>

      <NewBookingModal open={showNewBooking} onClose={() => setShowNewBooking(false)} />
    </div>
  );
}
