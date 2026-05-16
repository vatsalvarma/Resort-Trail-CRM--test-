"use client";
import React, { useState } from "react";
import {
  BedDouble, Users, Calendar, ChevronRight, ChevronLeft,
  Check, Star, Wifi, Wind, Flame, Trees, Phone, Mail, User, IndianRupee, Shield,
} from "lucide-react";
import { roomCategories } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { RoomCategory } from "@/types";

declare global {
  interface Window { Razorpay: (options: Record<string, unknown>) => { open: () => void }; }
}

const BOULDER_BAY_ROOMS = [
  { id: "BB-A", label: "Boulder Stay A", capacity: 2 },
  { id: "BB-B", label: "Boulder Stay B", capacity: 2 },
  { id: "BB-C", label: "Boulder Stay C", capacity: 2 },
  { id: "BB-D", label: "Boulder Stay D", capacity: 2 },
];

const GST_RATES: Record<string, number> = {
  BOULDER_BAY_CORPORATE: 0.18,
  BOULDER_BAY_PRIVATE: 0.05,
  DEFAULT: 0.12,
};

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  AC: <Wind className="w-3.5 h-3.5" />,
  WiFi: <Wifi className="w-3.5 h-3.5" />,
  Fireplace: <Flame className="w-3.5 h-3.5" />,
};

const getIcon = (amenity: string) =>
  AMENITY_ICONS[amenity] ?? <Star className="w-3.5 h-3.5" />;

type Step = 1 | 2 | 3 | 4;

interface BookingForm {
  category: RoomCategory | "";
  boulderType: "PRIVATE" | "CORPORATE" | "";
  boulderRooms: string[];
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  name: string;
  email: string;
  phone: string;
  specialRequests: string;
}

const EMPTY_FORM: BookingForm = {
  category: "", boulderType: "", boulderRooms: [],
  checkIn: "", checkOut: "", adults: 1, children: 0,
  name: "", email: "", phone: "", specialRequests: "",
};

export default function GuestBookingPage() {
  const [step, setStep]       = useState<Step>(1);
  const [form, setForm]       = useState<BookingForm>(EMPTY_FORM);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const set = <K extends keyof BookingForm>(k: K, v: BookingForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
    : 0;

  const selectedCat = roomCategories.find((c) => c.slug === form.category);

  const gstKey = form.category === "BOULDER_BAY"
    ? form.boulderType === "CORPORATE" ? "BOULDER_BAY_CORPORATE" : "BOULDER_BAY_PRIVATE"
    : "DEFAULT";
  const gstRate   = GST_RATES[gstKey] ?? 0.12;
  const baseTotal = selectedCat ? nights * selectedCat.pricePerNight : 0;
  const gstAmt    = Math.round(baseTotal * gstRate);
  const grandTotal = baseTotal + gstAmt;

  const handleRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      const rzp = window.Razorpay({
        key: "rzp_test_REPLACE_WITH_YOUR_KEY",
        amount: grandTotal * 100,
        currency: "INR",
        name: "Village Trails Resort",
        description: `${selectedCat?.name} · ${nights} night(s)`,
        image: "/logo.png",
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#2D6A4F" },
        handler: () => {
          const ref = "VT" + Date.now().toString().slice(-8);
          setBookingRef(ref);
          setConfirmed(true);
        },
      });
      rzp.open();
    };
    document.head.appendChild(script);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-1">Reference: <span className="font-mono font-bold text-foreground">{bookingRef}</span></p>
          <p className="text-sm text-muted-foreground mb-6">A confirmation has been sent to {form.email}</p>
          <div className="bg-muted rounded-xl p-4 text-left text-sm space-y-1 mb-6">
            <p><span className="text-muted-foreground">Stay:</span> <span className="font-medium">{selectedCat?.name}</span></p>
            <p><span className="text-muted-foreground">Check-In:</span> <span className="font-medium">{form.checkIn}</span></p>
            <p><span className="text-muted-foreground">Check-Out:</span> <span className="font-medium">{form.checkOut}</span></p>
            <p><span className="text-muted-foreground">Total Paid:</span> <span className="font-bold text-green-600">₹{grandTotal.toLocaleString()}</span></p>
          </div>
          <button
            onClick={() => { setConfirmed(false); setForm(EMPTY_FORM); setStep(1); }}
            className="w-full py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold transition-colors"
          >
            Book Another Stay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trees className="w-8 h-8 text-gold-400" />
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Village Trails Resort</h1>
            <p className="text-white/50 text-xs">A nature retreat experience</p>
          </div>
        </div>
        <a href="tel:+919876543210" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors">
          <Phone className="w-4 h-4" /> +91 98765 43210
        </a>
      </header>

      {/* Progress */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-8">
          {(["Choose Stay", "Dates", "Your Details", "Confirm"] as const).map((label, i) => {
            const s = (i + 1) as Step;
            const done = step > s;
            const active = step === s;
            return (
              <React.Fragment key={label}>
                <div className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-all",
                  active ? "text-white" : done ? "text-green-400" : "text-white/40"
                )}>
                  <span className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                    active ? "bg-white text-forest-800 border-white" :
                    done ? "bg-green-500 border-green-500 text-white" :
                    "border-white/30 text-white/40"
                  )}>
                    {done ? <Check className="w-3.5 h-3.5" /> : s}
                  </span>
                  <span className="hidden sm:block">{label}</span>
                </div>
                {i < 3 && <div className={cn("flex-1 h-px", done ? "bg-green-500" : "bg-white/20")} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* STEP 1: Choose Stay */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Choose Your Stay</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roomCategories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => set("category", cat.slug)}
                  className={cn(
                    "rounded-2xl overflow-hidden text-left border-2 transition-all hover:scale-[1.02] group",
                    form.category === cat.slug
                      ? "border-gold-400 shadow-lg shadow-gold-500/20"
                      : "border-transparent hover:border-white/30"
                  )}
                >
                  <div className="relative h-40">
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    {form.category === cat.slug && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold-400 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-forest-900" />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-sm">{cat.name}</p>
                      <p className="text-white/70 text-xs">Up to {cat.capacity} guests</p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-3">
                    <p className="text-white/80 text-xs line-clamp-2 mb-2">{cat.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {cat.amenities.slice(0, 4).map((a) => (
                        <span key={a} className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/70">
                          {getIcon(a)} {a}
                        </span>
                      ))}
                    </div>
                    <p className="text-gold-400 font-bold text-sm">₹{cat.pricePerNight.toLocaleString()}<span className="text-white/50 font-normal text-xs">/night</span></p>
                  </div>
                </button>
              ))}
            </div>

            {/* Boulder Bay special options */}
            {form.category === "BOULDER_BAY" && (
              <div className="bg-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-white font-semibold">Boulder Bay Booking Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(["PRIVATE", "CORPORATE"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => set("boulderType", type)}
                      className={cn(
                        "rounded-xl p-4 border-2 text-left transition-all",
                        form.boulderType === type
                          ? "border-gold-400 bg-gold-400/10"
                          : "border-white/20 hover:border-white/40"
                      )}
                    >
                      <p className="text-white font-semibold text-sm">{type === "PRIVATE" ? "Private Booking" : "Corporate Booking"}</p>
                      <p className="text-white/60 text-xs mt-1">
                        {type === "PRIVATE" ? "5% GST · Choose sub-rooms A/B/C/D" : "18% GST · Full block · 8 occupancy"}
                      </p>
                    </button>
                  ))}
                </div>
                {form.boulderType === "PRIVATE" && (
                  <div>
                    <p className="text-white/80 text-sm mb-2">Select sub-rooms:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {BOULDER_BAY_ROOMS.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => {
                            const cur = form.boulderRooms;
                            set("boulderRooms", cur.includes(r.id) ? cur.filter((x) => x !== r.id) : [...cur, r.id]);
                          }}
                          className={cn(
                            "rounded-lg p-3 border text-left text-sm transition-all",
                            form.boulderRooms.includes(r.id)
                              ? "border-gold-400 bg-gold-400/10 text-white"
                              : "border-white/20 text-white/60 hover:border-white/40"
                          )}
                        >
                          <span className="font-semibold">{r.label}</span>
                          <span className="block text-xs opacity-70">{r.capacity} guests</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!form.category || (form.category === "BOULDER_BAY" && !form.boulderType)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Dates & Guests */}
        {step === 2 && (
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-white">Select Dates</h2>
            <div className="bg-white/10 rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />Check-In
                  </label>
                  <input
                    type="date"
                    value={form.checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => set("checkIn", e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />Check-Out
                  </label>
                  <input
                    type="date"
                    value={form.checkOut}
                    min={form.checkIn || new Date().toISOString().split("T")[0]}
                    onChange={(e) => set("checkOut", e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">
                    <Users className="w-3.5 h-3.5 inline mr-1" />Adults
                  </label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => set("adults", Math.max(1, form.adults - 1))} className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center text-lg font-bold">−</button>
                    <span className="text-white font-bold text-lg w-6 text-center">{form.adults}</span>
                    <button onClick={() => set("adults", Math.min(selectedCat?.capacity ?? 10, form.adults + 1))} className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center text-lg font-bold">+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">Children</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => set("children", Math.max(0, form.children - 1))} className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center text-lg font-bold">−</button>
                    <span className="text-white font-bold text-lg w-6 text-center">{form.children}</span>
                    <button onClick={() => set("children", form.children + 1)} className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center text-lg font-bold">+</button>
                  </div>
                </div>
              </div>

              {nights > 0 && selectedCat && (
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-sm space-y-1">
                  <div className="flex justify-between text-white/70">
                    <span>{nights} night{nights > 1 ? "s" : ""} × ₹{selectedCat.pricePerNight.toLocaleString()}</span>
                    <span>₹{baseTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>GST ({(gstRate * 100).toFixed(0)}%)</span>
                    <span>₹{gstAmt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gold-400 border-t border-white/10 pt-2 mt-2">
                    <span>Total</span>
                    <span>₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.checkIn || !form.checkOut || nights <= 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Guest Details */}
        {step === 3 && (
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-white">Your Details</h2>
            <div className="bg-white/10 rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">
                  <User className="w-3.5 h-3.5 inline mr-1" />Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="As per ID proof"
                  className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">
                    <Phone className="w-3.5 h-3.5 inline mr-1" />Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">
                    <Mail className="w-3.5 h-3.5 inline mr-1" />Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">Special Requests (optional)</label>
                <textarea
                  value={form.specialRequests}
                  onChange={(e) => set("specialRequests", e.target.value)}
                  placeholder="Dietary requirements, early check-in, celebrations..."
                  rows={3}
                  className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!form.name || !form.phone || !form.email}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                Review Booking <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Confirm & Pay */}
        {step === 4 && (
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-white">Review & Pay</h2>
            <div className="bg-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex gap-4">
                <img src={selectedCat?.imageUrl} alt="" className="w-24 h-20 rounded-xl object-cover flex-shrink-0" />
                <div>
                  <p className="text-white font-bold text-lg">{selectedCat?.name}</p>
                  <p className="text-white/60 text-sm">{form.checkIn} → {form.checkOut} · {nights} night{nights > 1 ? "s" : ""}</p>
                  <p className="text-white/60 text-sm">{form.adults} adult{form.adults > 1 ? "s" : ""}{form.children ? ` · ${form.children} child${form.children > 1 ? "ren" : ""}` : ""}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-1 text-sm">
                <div className="flex justify-between text-white/70"><span>Guest</span><span className="text-white font-medium">{form.name}</span></div>
                <div className="flex justify-between text-white/70"><span>Phone</span><span className="text-white">{form.phone}</span></div>
                <div className="flex justify-between text-white/70"><span>Email</span><span className="text-white">{form.email}</span></div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-1 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>{nights} night{nights > 1 ? "s" : ""} × ₹{selectedCat?.pricePerNight.toLocaleString()}</span>
                  <span className="text-white">₹{baseTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>GST ({(gstRate * 100).toFixed(0)}%)</span>
                  <span className="text-white">₹{gstAmt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-2 mt-1 text-gold-400">
                  <span>Total Payable</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/50 text-xs">
              <Shield className="w-4 h-4" />
              Payments are secured by Razorpay. SSL encrypted.
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleRazorpay}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold text-base transition-all shadow-lg shadow-gold-500/30"
              >
                <IndianRupee className="w-5 h-5" />
                Pay ₹{grandTotal.toLocaleString()}
              </button>
            </div>
          </div>
        )}

        <div className="h-16" />
      </div>
    </div>
  );
}
