"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat, Clock, CheckCircle2, AlertCircle, Flame, Plus, Trash2,
  Eye, EyeOff, Leaf, Drumstick, IndianRupee, Bell, BellOff,
  UtensilsCrossed, Phone, LayoutGrid, Edit2, X, Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { foodOrders as initialOrders, menuItems as initialMenu } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { ClientTime } from "@/components/ui/client-time";
import type { OrderStatus, MenuItem } from "@/types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING:   { label: "New Orders",  color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800", icon: AlertCircle  },
  ACCEPTED:  { label: "Accepted",    color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800", icon: CheckCircle2 },
  PREPARING: { label: "In Kitchen",  color: "text-blue-700",   bg: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",         icon: Flame        },
  READY:     { label: "Ready",       color: "text-green-700",  bg: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",      icon: CheckCircle2 },
  DELIVERED: { label: "Delivered",   color: "text-gray-600",   bg: "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800",          icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled",   color: "text-red-700",    bg: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",              icon: AlertCircle  },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "ACCEPTED", ACCEPTED: "PREPARING", PREPARING: "READY", READY: "DELIVERED",
};
const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  PENDING: "Accept", ACCEPTED: "Start Cooking", PREPARING: "Mark Ready", READY: "Delivered",
};
const COLUMNS: OrderStatus[] = ["PENDING", "ACCEPTED", "PREPARING", "READY"];

const EMPTY_ITEM = { name: "", category: "SNACKS" as MenuItem["category"], price: "", isVeg: true, preparationTime: "15", description: "" };

export default function KitchenPage() {
  const [tab, setTab] = useState<"orders" | "menu">("orders");
  const [orders, setOrders] = useState(initialOrders.map((o) => ({ ...o })));
  const [menu, setMenu]     = useState<MenuItem[]>(initialMenu.map((m) => ({ ...m })));
  const [alarmActive, setAlarmActive] = useState(false);
  const [alarmMuted, setAlarmMuted]   = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [newItem, setNewItem]         = useState(EMPTY_ITEM);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  useEffect(() => {
    if (pendingCount > 0 && !alarmMuted) setAlarmActive(true);
    else setAlarmActive(false);
  }, [pendingCount, alarmMuted]);

  const advanceStatus = useCallback((orderId: string) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== orderId) return o;
      const next = NEXT_STATUS[o.status as OrderStatus];
      return next ? { ...o, status: next } : o;
    }));
  }, []);

  const toggleAvailability = useCallback((itemId: string) => {
    setMenu((prev) => prev.map((m) => m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m));
  }, []);

  const deleteItem = useCallback((itemId: string) => {
    setMenu((prev) => prev.filter((m) => m.id !== itemId));
  }, []);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;
    const item: MenuItem = {
      id: `m-${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      price: Number(newItem.price),
      isVeg: newItem.isVeg,
      isAvailable: true,
      preparationTime: Number(newItem.preparationTime) || 15,
    };
    setMenu((prev) => [...prev, item]);
    setNewItem(EMPTY_ITEM);
    setShowAddItem(false);
  };

  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] ?? 0) + 1; return acc; }, {} as Record<string, number>);
  const categories = Array.from(new Set(menu.map((m) => m.category)));

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <AnimatePresence>
        {alarmActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-between gap-3 px-5 py-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-600 animate-bounce" />
              <p className="text-yellow-800 dark:text-yellow-300 font-semibold text-sm">
                {pendingCount} new order{pendingCount > 1 ? "s" : ""} waiting — please accept!
              </p>
            </div>
            <button
              onClick={() => setAlarmMuted(true)}
              className="text-yellow-700 dark:text-yellow-400 hover:text-yellow-900 transition-colors"
            >
              <BellOff className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kitchen Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">Order management & menu control</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-semibold">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Kitchen Live
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab("orders")}
          className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold transition-all", tab === "orders" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          <LayoutGrid className="w-4 h-4 inline mr-1.5" />Order Board
        </button>
        <button
          onClick={() => setTab("menu")}
          className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold transition-all", tab === "menu" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          <UtensilsCrossed className="w-4 h-4 inline mr-1.5" />Menu Management
        </button>
      </div>

      {/* ORDER BOARD TAB */}
      {tab === "orders" && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((s) => {
              const cfg = STATUS_CONFIG[s];
              const Icon = cfg.icon;
              return (
                <Card key={s} className="border">
                  <CardContent className="p-3 flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${cfg.color} flex-shrink-0`} />
                    <div>
                      <p className="text-[10px] text-muted-foreground">{cfg.label}</p>
                      <p className="text-lg font-bold">{counts[s] ?? 0}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Kanban */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLUMNS.map((status) => {
              const cfg = STATUS_CONFIG[status];
              const Icon = cfg.icon;
              const colOrders = orders.filter((o) => o.status === status);
              return (
                <div key={status} className="space-y-3">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg}`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                    <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                    <span className="ml-auto text-xs font-bold bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full">
                      {colOrders.length}
                    </span>
                    {status === "PENDING" && colOrders.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
                    )}
                  </div>

                  <AnimatePresence>
                    {colOrders.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed border-border rounded-xl">
                        No orders
                      </div>
                    ) : (
                      colOrders.map((order, i) => (
                        <motion.div
                          key={order.id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Card className={`border ${cfg.bg} hover:shadow-md transition-shadow`}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="text-xs font-mono font-semibold text-muted-foreground">#{order.orderNumber}</p>
                                  <p className="text-sm font-semibold mt-0.5">{order.guest.name}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">Room {order.roomNumber}</p>
                                  <a href={`tel:${order.guest.name}`} className="text-xs text-forest-600 dark:text-forest-400 hover:underline flex items-center gap-0.5 justify-end mt-0.5">
                                    <Phone className="w-3 h-3" /> Call
                                  </a>
                                </div>
                              </div>
                              <div className="space-y-1 mb-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between text-xs">
                                    <span className="font-medium">{item.quantity}× {item.menuItem.name}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" /><ClientTime dateStr={order.createdAt} />
                                </span>
                                {NEXT_STATUS[status as OrderStatus] && (
                                  <Button
                                    size="sm"
                                    className={cn(
                                      "h-7 text-xs gap-1",
                                      status === "PENDING" ? "bg-indigo-600 hover:bg-indigo-700 text-white" :
                                      status === "ACCEPTED" ? "bg-blue-600 hover:bg-blue-700 text-white" :
                                      status === "PREPARING" ? "bg-green-600 hover:bg-green-700 text-white" :
                                      "bg-gray-600 hover:bg-gray-700 text-white"
                                    )}
                                    onClick={() => advanceStatus(order.id)}
                                  >
                                    {status === "PREPARING" ? <CheckCircle2 className="w-3 h-3" /> : <Flame className="w-3 h-3" />}
                                    {NEXT_LABEL[status as OrderStatus]}
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* MENU MANAGEMENT TAB */}
      {tab === "menu" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">{menu.length} items · {menu.filter((m) => m.isAvailable).length} available</p>
            <Button onClick={() => setShowAddItem(true)} className="bg-forest-700 hover:bg-forest-800 text-white gap-2">
              <Plus className="w-4 h-4" /> Add Item
            </Button>
          </div>

          {/* Add Item Form */}
          <AnimatePresence>
            {showAddItem && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Card className="border-forest-300 dark:border-forest-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      Add New Menu Item
                      <button onClick={() => setShowAddItem(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide block mb-1">Item Name</label>
                        <Input placeholder="e.g. Butter Naan" value={newItem.name} onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide block mb-1">Category</label>
                        <Select value={newItem.category} onValueChange={(v) => setNewItem((p) => ({ ...p, category: v as MenuItem["category"] }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["BREAKFAST","LUNCH","DINNER","SNACKS","BEVERAGES","DESSERTS"].map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide block mb-1">Price (₹)</label>
                        <Input type="number" placeholder="150" value={newItem.price} onChange={(e) => setNewItem((p) => ({ ...p, price: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide block mb-1">Prep Time (min)</label>
                        <Input type="number" placeholder="15" value={newItem.preparationTime} onChange={(e) => setNewItem((p) => ({ ...p, preparationTime: e.target.value }))} />
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setNewItem((p) => ({ ...p, isVeg: !p.isVeg }))}
                          className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                            newItem.isVeg ? "bg-green-100 border-green-300 text-green-700 dark:bg-green-900/30" : "bg-red-100 border-red-300 text-red-700 dark:bg-red-900/30"
                          )}
                        >
                          {newItem.isVeg ? <Leaf className="w-3.5 h-3.5" /> : <Drumstick className="w-3.5 h-3.5" />}
                          {newItem.isVeg ? "Vegetarian" : "Non-Veg"}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <Button variant="outline" onClick={() => setShowAddItem(false)}>Cancel</Button>
                      <Button onClick={handleAddItem} disabled={!newItem.name || !newItem.price} className="bg-forest-700 hover:bg-forest-800 text-white">
                        <Save className="w-4 h-4 mr-1" /> Save Item
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Menu by Category */}
          {categories.map((cat) => {
            const catItems = menu.filter((m) => m.category === cat);
            return (
              <div key={cat}>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">{cat}</h3>
                <div className="space-y-2">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
                        item.isAvailable ? "bg-card border-border" : "bg-muted/50 border-dashed opacity-60"
                      )}
                    >
                      {item.isVeg
                        ? <Leaf className="w-4 h-4 text-green-500 flex-shrink-0" />
                        : <Drumstick className="w-4 h-4 text-red-500 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.preparationTime} min prep</p>
                      </div>
                      <span className="text-sm font-bold text-forest-700 dark:text-forest-400">
                        <IndianRupee className="w-3.5 h-3.5 inline" />{item.price}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleAvailability(item.id)}
                          title={item.isAvailable ? "Mark unavailable" : "Mark available"}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                            item.isAvailable
                              ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-muted text-muted-foreground hover:bg-muted/70"
                          )}
                        >
                          {item.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 flex items-center justify-center transition-all"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
