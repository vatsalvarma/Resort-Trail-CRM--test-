"use client";
import React, { useState } from "react";
import { X, CalendarCheck, BedDouble, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { rooms, guests } from "@/data/mockData";

interface Props { open: boolean; onClose: () => void; }

const EMPTY = {
  guestId: "", roomId: "", checkIn: "", checkOut: "",
  adults: "1", children: "0", paymentMethod: "CASH",
  specialRequests: "", paymentStatus: "PENDING",
};

export function NewBookingModal({ open, onClose }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const availableRooms = rooms.filter((r) => r.status === "AVAILABLE");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
    : 0;

  const room = availableRooms.find((r) => r.id === form.roomId);
  const total = room ? nights * room.pricePerNight : 0;
  const gst   = Math.round(total * 0.12);

  const valid = form.guestId && form.roomId && form.checkIn && form.checkOut && nights > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm(EMPTY); onClose(); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-forest-800 text-white">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" />
            <h2 className="text-lg font-bold">New Booking</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CalendarCheck className="w-7 h-7 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-foreground">Booking Created!</p>
            <p className="text-sm text-muted-foreground mt-1">Confirmation will be sent to the guest.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
            {/* Guest */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                <User className="w-3.5 h-3.5 inline mr-1" />Guest
              </label>
              <Select value={form.guestId} onValueChange={(v) => set("guestId", v)}>
                <SelectTrigger><SelectValue placeholder="Select guest" /></SelectTrigger>
                <SelectContent>
                  {guests.map((g) => (
                    <SelectItem key={g.id} value={g.id}>{g.name} · {g.phone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Room */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                <BedDouble className="w-3.5 h-3.5 inline mr-1" />Room
              </label>
              <Select value={form.roomId} onValueChange={(v) => set("roomId", v)}>
                <SelectTrigger><SelectValue placeholder="Select available room" /></SelectTrigger>
                <SelectContent>
                  {availableRooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      #{r.roomNumber} – {r.category.replace(/_/g," ")} · ₹{r.pricePerNight.toLocaleString()}/night
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Check-In</label>
                <Input type="date" value={form.checkIn} onChange={(e) => set("checkIn", e.target.value)}
                  min={new Date().toISOString().split("T")[0]} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Check-Out</label>
                <Input type="date" value={form.checkOut} onChange={(e) => set("checkOut", e.target.value)}
                  min={form.checkIn || new Date().toISOString().split("T")[0]} />
              </div>
            </div>

            {/* Guests count */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Adults</label>
                <Select value={form.adults} onValueChange={(v) => set("adults", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Children</label>
                <Select value={form.children} onValueChange={(v) => set("children", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[0,1,2,3,4].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Payment */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Payment Method</label>
                <Select value={form.paymentMethod} onValueChange={(v) => set("paymentMethod", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="RAZORPAY">Razorpay</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Payment Status</label>
                <Select value={form.paymentStatus} onValueChange={(v) => set("paymentStatus", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PARTIAL">Partial</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Special Requests</label>
              <textarea
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring min-h-[72px]"
                placeholder="Any special arrangements, dietary needs..."
                value={form.specialRequests}
                onChange={(e) => set("specialRequests", e.target.value)}
              />
            </div>

            {/* Summary */}
            {nights > 0 && room && (
              <div className="rounded-xl bg-forest-50 dark:bg-forest-900/20 border border-forest-200 dark:border-forest-800 p-4 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">{nights} night{nights > 1 ? "s" : ""} × ₹{room.pricePerNight.toLocaleString()}</span>
                  <span>₹{(nights * room.pricePerNight).toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">GST (12%)</span>
                  <span>₹{gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-forest-200 dark:border-forest-700 pt-2 mt-2">
                  <span>Grand Total</span>
                  <span className="text-forest-700 dark:text-forest-400">₹{(total + gst).toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button
                type="submit"
                disabled={!valid}
                className="flex-1 bg-forest-700 hover:bg-forest-800 text-white"
              >
                Create Booking
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
