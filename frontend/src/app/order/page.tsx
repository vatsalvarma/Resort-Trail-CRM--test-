"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  UtensilsCrossed, ShoppingCart, Plus, Minus, Check, ChefHat,
  Phone, User, BedDouble, Clock, Leaf, Drumstick, X, Trees, Search,
} from "lucide-react";
import { menuItems, roomCategories } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";

type MenuCategory = "ALL" | "BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS" | "BEVERAGES" | "DESSERTS";
type OrderStatus = "RECEIVED" | "COOKING" | "READY" | "DELIVERED";

interface CartItem { item: MenuItem; qty: number; note: string; }
interface GuestInfo { name: string; phone: string; roomType: string; }

const STATUS_STEPS: OrderStatus[] = ["RECEIVED", "COOKING", "READY", "DELIVERED"];
const STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: "Order Received",
  COOKING:  "Cooking in Progress",
  READY:    "Ready to Deliver",
  DELIVERED:"Delivered",
};

const CAT_LABELS: Record<MenuCategory, string> = {
  ALL: "All", BREAKFAST: "Breakfast", LUNCH: "Lunch", DINNER: "Dinner",
  SNACKS: "Snacks", BEVERAGES: "Beverages", DESSERTS: "Desserts",
};

export default function GuestOrderPage() {
  const [guestInfo, setGuestInfo]   = useState<GuestInfo | null>(null);
  const [guestForm, setGuestForm]   = useState({ name: "", phone: "", roomType: "" });
  const [category, setCategory]     = useState<MenuCategory>("ALL");
  const [search, setSearch]         = useState("");
  const [cart, setCart]             = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [spiceLevel, setSpiceLevel] = useState("MEDIUM");
  const [allergies, setAllergies]   = useState("");
  const [cookingNotes, setCookingNotes] = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("RECEIVED");
  const [orderRef, setOrderRef]     = useState("");

  const available = menuItems.filter((m) => m.isAvailable);
  const filtered  = available.filter((m) => {
    const matchCat = category === "ALL" || m.category === category;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const subTotal   = cart.reduce((s, c) => s + c.item.price * c.qty, 0);
  const gst        = Math.round(subTotal * 0.05);
  const grandTotal = subTotal + gst;

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) return prev.map((c) => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { item, qty: 1, note: "" }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === itemId);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((c) => c.item.id !== itemId);
      return prev.map((c) => c.item.id === itemId ? { ...c, qty: c.qty - 1 } : c);
    });
  }, []);

  const getQty = (itemId: string) => cart.find((c) => c.item.id === itemId)?.qty ?? 0;

  const handlePlaceOrder = () => {
    const ref = "ORD" + Date.now().toString().slice(-6);
    setOrderRef(ref);
    setSubmitted(true);
    // Simulate status progression
    const statuses: OrderStatus[] = ["RECEIVED", "COOKING", "READY", "DELIVERED"];
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < statuses.length) setOrderStatus(statuses[idx]);
      else clearInterval(interval);
    }, 8000);
  };

  if (!guestInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-forest-700 dark:text-forest-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Village Trails</h1>
              <p className="text-xs text-muted-foreground">In-Room Dining</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                <User className="w-3.5 h-3.5 inline mr-1" />Your Name
              </label>
              <input
                type="text"
                value={guestForm.name}
                onChange={(e) => setGuestForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Full name"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                <Phone className="w-3.5 h-3.5 inline mr-1" />Phone
              </label>
              <input
                type="tel"
                value={guestForm.phone}
                onChange={(e) => setGuestForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                <BedDouble className="w-3.5 h-3.5 inline mr-1" />Your Stay Type
              </label>
              <select
                value={guestForm.roomType}
                onChange={(e) => setGuestForm((f) => ({ ...f, roomType: e.target.value }))}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select your accommodation</option>
                {roomCategories.map((r) => (
                  <option key={r.slug} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                if (guestForm.name && guestForm.phone && guestForm.roomType)
                  setGuestInfo(guestForm);
              }}
              disabled={!guestForm.name || !guestForm.phone || !guestForm.roomType}
              className="w-full py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold transition-colors disabled:opacity-40"
            >
              Start Ordering
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    const curIdx = STATUS_STEPS.indexOf(orderStatus);
    return (
      <div className="min-h-screen bg-background p-6 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-forest-700 dark:text-forest-400" />
          </div>
          <h1 className="text-xl font-bold">Order Placed!</h1>
          <p className="text-muted-foreground text-sm">Ref: <span className="font-mono font-bold">{orderRef}</span></p>
        </div>

        {/* Status Tracker */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h2 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">Live Order Status</h2>
          <div className="space-y-3">
            {STATUS_STEPS.map((s, i) => {
              const done   = curIdx > i;
              const active = curIdx === i;
              return (
                <div key={s} className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500",
                    done   ? "bg-green-500 border-green-500" :
                    active ? "bg-forest-600 border-forest-600 animate-pulse" :
                    "border-border bg-muted"
                  )}>
                    {done ? <Check className="w-4 h-4 text-white" /> :
                      active ? <Clock className="w-3.5 h-3.5 text-white" /> :
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />}
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium", active ? "text-foreground" : done ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>
                      {STATUS_LABELS[s]}
                    </p>
                    {active && <p className="text-xs text-muted-foreground animate-pulse">In progress...</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-2xl border border-border p-5 space-y-2 mb-4">
          <h3 className="font-semibold text-sm">Your Order — {guestInfo.roomType}</h3>
          {cart.map((c) => (
            <div key={c.item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{c.item.name} × {c.qty}</span>
              <span>₹{(c.item.price * c.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
            <span>Total</span>
            <span>₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={() => { setSubmitted(false); setCart([]); setOrderStatus("RECEIVED"); }}
          className="w-full py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
        >
          Place Another Order
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-forest-800 text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <Trees className="w-6 h-6 text-gold-400" />
          <div>
            <p className="font-bold text-sm leading-tight">In-Room Dining</p>
            <p className="text-white/60 text-xs">{guestInfo.roomType} · {guestInfo.name}</p>
          </div>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="text-sm font-semibold">₹{grandTotal.toLocaleString()}</span>
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gold-400 text-forest-900 text-[10px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </header>

      {/* Category Tabs */}
      <div className="sticky top-14 z-20 bg-background border-b border-border px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {(Object.keys(CAT_LABELS) as MenuCategory[]).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
              category === c ? "bg-forest-700 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {CAT_LABELS[c]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-4 pb-32 space-y-2 mt-2">
        {filtered.map((item) => {
          const qty = getQty(item.id);
          return (
            <div key={item.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {item.isVeg
                    ? <Leaf className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    : <Drumstick className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                  <p className="text-sm font-semibold truncate">{item.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 inline mr-0.5" />{item.preparationTime} min
                  </span>
                  <span className="text-sm font-bold text-forest-700 dark:text-forest-400">₹{item.price}</span>
                </div>
              </div>
              {qty === 0 ? (
                <button
                  onClick={() => addToCart(item)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-sm w-5 text-center">{qty}</span>
                  <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-full bg-forest-700 hover:bg-forest-800 text-white flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <UtensilsCrossed className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No items found</p>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-background shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-lg">Your Order</h2>
              <button onClick={() => setCartOpen(false)} className="p-1 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  {cart.map((c) => (
                    <div key={c.item.id} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{c.item.name}</p>
                        <p className="text-xs text-muted-foreground">₹{c.item.price} × {c.qty}</p>
                      </div>
                      <span className="text-sm font-bold">₹{(c.item.price * c.qty).toLocaleString()}</span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => removeFromCart(c.item.id)} className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <Minus className="w-3 h-3" />
                        </button>
                        <button onClick={() => addToCart(c.item)} className="w-6 h-6 rounded-full bg-forest-700 text-white flex items-center justify-center">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Cooking Instructions */}
                  <div className="border-t border-border pt-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cooking Instructions</p>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Spice Level</p>
                      <div className="flex gap-2">
                        {["MILD", "MEDIUM", "SPICY", "EXTRA SPICY"].map((l) => (
                          <button
                            key={l}
                            onClick={() => setSpiceLevel(l)}
                            className={cn(
                              "px-2 py-1 rounded-full text-[10px] font-semibold border transition-all",
                              spiceLevel === l ? "bg-red-100 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400" : "border-border text-muted-foreground hover:bg-muted"
                            )}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Allergy Notes</p>
                      <input
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        placeholder="e.g. No nuts, lactose free..."
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Special Instructions</p>
                      <textarea
                        value={cookingNotes}
                        onChange={(e) => setCookingNotes(e.target.value)}
                        placeholder="Extra spicy gravy, no onion..."
                        rows={2}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-border p-5 space-y-3">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{subTotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>GST (5%)</span><span>₹{gst.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold text-base border-t border-border pt-1 mt-1"><span>Total</span><span className="text-forest-700 dark:text-forest-400">₹{grandTotal.toLocaleString()}</span></div>
                </div>
                <button
                  onClick={() => { setCartOpen(false); handlePlaceOrder(); }}
                  className="w-full py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold transition-colors"
                >
                  Place Order · ₹{grandTotal.toLocaleString()}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
