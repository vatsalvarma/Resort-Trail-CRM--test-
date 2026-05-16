"use client";
import React from "react";
import { BedDouble, Calendar, MoreVertical } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, formatDate, getInitials, cn } from "@/lib/utils";
import type { Booking, BookingStatus, PaymentStatus } from "@/types";

interface BookingTableProps {
  bookings: Booking[];
  onAction?: (booking: Booking, action: "view" | "checkin" | "checkout" | "cancel") => void;
}

const BOOKING_STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING:     "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED:   "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  CHECKED_IN:  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CHECKED_OUT: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  CANCELLED:   "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  NO_SHOW:     "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  PAID:     "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  PENDING:  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PARTIAL:  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  REFUNDED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  FAILED:   "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function BookingTable({ bookings, onAction }: BookingTableProps) {
  if (!bookings.length) {
    return (
      <div className="text-center py-14 text-muted-foreground">
        <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p>No bookings found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest</TableHead>
            <TableHead>Booking #</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Check-In</TableHead>
            <TableHead>Check-Out</TableHead>
            <TableHead>Nights</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id} className="hover:bg-muted/30">
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300 text-xs">
                      {getInitials(b.guest.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{b.guest.name}</p>
                    <p className="text-xs text-muted-foreground">{b.guest.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs font-semibold">{b.bookingNumber}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-sm">
                  <BedDouble className="w-3.5 h-3.5 text-muted-foreground" />
                  {b.room.roomNumber}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatDate(b.checkIn)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatDate(b.checkOut)}</TableCell>
              <TableCell className="text-sm tabular-nums text-center">{b.nights}</TableCell>
              <TableCell className="text-sm font-semibold tabular-nums">{formatCurrency(b.totalAmount)}</TableCell>
              <TableCell className={cn("text-sm tabular-nums", b.balanceDue > 0 ? "text-red-600 font-semibold" : "text-muted-foreground")}>
                {formatCurrency(b.balanceDue)}
              </TableCell>
              <TableCell>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", BOOKING_STATUS_STYLES[b.status as BookingStatus])}>
                  {b.status.replace("_", " ")}
                </span>
              </TableCell>
              <TableCell>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", PAYMENT_STYLES[b.paymentStatus as PaymentStatus])}>
                  {b.paymentStatus}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7"
                  onClick={() => onAction?.(b, "view")}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
