"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { BedDouble, Search, Filter, Plus, Wrench, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { rooms } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";
import type { RoomStatus } from "@/types";

const STATUS_CONFIG: Record<RoomStatus, { label: string; color: string; dot: string }> = {
  AVAILABLE:   { label: "Available",   color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",  dot: "bg-green-500"  },
  BOOKED:      { label: "Booked",      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",    dot: "bg-blue-500"   },
  MAINTENANCE: { label: "Maintenance", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-500"  },
  RESERVED:    { label: "Reserved",    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", dot: "bg-purple-500" },
  CHECKOUT:    { label: "Checkout",    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",    dot: "bg-cyan-500"   },
};

export default function RoomsPage() {
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("ALL");
  const [categoryFilter, setCategory] = useState("ALL");

  const filtered = rooms.filter((r) => {
    const matchSearch = r.roomNumber.toLowerCase().includes(search.toLowerCase())
      || r.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus   = statusFilter === "ALL" || r.status === statusFilter;
    const matchCategory = categoryFilter === "ALL" || r.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const counts = rooms.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Room Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{rooms.length} rooms across the resort</p>
        </div>
        <Button className="bg-forest-700 hover:bg-forest-800 text-white gap-2">
          <Plus className="w-4 h-4" /> Add Room
        </Button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
          <Card
            key={status}
            className={`cursor-pointer transition-all hover:shadow-card-hover ${statusFilter === status ? "ring-2 ring-forest-500" : ""}`}
            onClick={() => setStatus(statusFilter === status ? "ALL" : status)}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${cfg.dot}`} />
              <div>
                <p className="text-xs text-muted-foreground">{cfg.label}</p>
                <p className="text-xl font-bold">{counts[status] ?? 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="sm:w-64"
        />
        <Select value={statusFilter} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([s, c]) => (
              <SelectItem key={s} value={s}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="CAMPING_TENT">Camping Tent</SelectItem>
            <SelectItem value="AC_CONTAINER_SMALL">A/C Container (Small)</SelectItem>
            <SelectItem value="AC_CONTAINER_LARGE">A/C Container (Large)</SelectItem>
            <SelectItem value="RABBIT_HILL">Rabbit Hill</SelectItem>
            <SelectItem value="BOULDER_BAY">Boulder Bay</SelectItem>
            <SelectItem value="HONEY_BEE_HIVE">Honey Bee Hive</SelectItem>
            <SelectItem value="TEN_DOWN_STAY">10 Down Stay</SelectItem>
            <SelectItem value="TRIANGLE_HILLS">Triangle Hills</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          {filtered.length} rooms
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((room, i) => {
          const cfg = STATUS_CONFIG[room.status as RoomStatus];
          return (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Card className="hover:shadow-card-hover transition-all duration-200 cursor-pointer group overflow-hidden">
                <div className="relative h-36 bg-gradient-to-br from-forest-800 to-forest-900 overflow-hidden">
                  {room.imageUrl ? (
                    <img src={room.imageUrl} alt={room.roomNumber} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BedDouble className="w-12 h-12 text-forest-500" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    #{room.roomNumber}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {room.category.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Floor {room.floor} · {room.capacity} guests
                      </p>
                    </div>
                    <p className="text-sm font-bold text-forest-700 dark:text-forest-400 whitespace-nowrap">
                      {formatCurrency(room.pricePerNight)}<span className="text-xs font-normal text-muted-foreground">/night</span>
                    </p>
                  </div>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {room.amenities?.slice(0, 3).map((a) => (
                      <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {a}
                      </span>
                    ))}
                    {(room.amenities?.length ?? 0) > 3 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        +{(room.amenities?.length ?? 0) - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1 text-xs gap-1">
                      <Wrench className="w-3 h-3" /> Maintenance
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs gap-1">
                      <Sparkles className="w-3 h-3" /> Housekeeping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <BedDouble className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No rooms match your filters</p>
        </div>
      )}
    </div>
  );
}
