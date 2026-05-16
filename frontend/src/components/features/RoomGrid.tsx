"use client";
import React from "react";
import { BedDouble, Wifi, Wind, Sparkles, Wrench, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import type { Room, RoomStatus } from "@/types";

interface RoomGridProps {
  rooms: Room[];
  onRoomClick?: (room: Room) => void;
}

const STATUS_CONFIG: Record<RoomStatus, { label: string; dot: string; card: string }> = {
  AVAILABLE:   { label: "Available",   dot: "bg-green-500",  card: "border-green-200 dark:border-green-800" },
  BOOKED:      { label: "Booked",      dot: "bg-blue-500",   card: "border-blue-200  dark:border-blue-800"  },
  MAINTENANCE: { label: "Maintenance", dot: "bg-amber-500",  card: "border-amber-200 dark:border-amber-800" },
  RESERVED:    { label: "Reserved",    dot: "bg-purple-500", card: "border-purple-200 dark:border-purple-800"},
  CHECKOUT:    { label: "Checkout",    dot: "bg-cyan-500",   card: "border-cyan-200  dark:border-cyan-800"  },
};

const STATUS_ICON: Record<RoomStatus, React.ReactNode> = {
  AVAILABLE:   <Sparkles className="w-4 h-4 text-green-600"  />,
  BOOKED:      <BedDouble className="w-4 h-4 text-blue-600"  />,
  MAINTENANCE: <Wrench    className="w-4 h-4 text-amber-600" />,
  RESERVED:    <Lock      className="w-4 h-4 text-purple-600"/>,
  CHECKOUT:    <Wind      className="w-4 h-4 text-cyan-600"  />,
};

export function RoomGrid({ rooms, onRoomClick }: RoomGridProps) {
  if (!rooms.length) {
    return (
      <div className="text-center py-14 text-muted-foreground">
        <BedDouble className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p>No rooms found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {rooms.map((room) => {
        const cfg = STATUS_CONFIG[room.status] ?? STATUS_CONFIG.AVAILABLE;
        return (
          <Card
            key={room.id}
            onClick={() => onRoomClick?.(room)}
            className={cn(
              "border-2 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5",
              cfg.card
            )}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold">{room.roomNumber}</span>
                <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", cfg.dot)} />
              </div>

              <div className="flex items-center gap-1 mb-2">
                {STATUS_ICON[room.status]}
                <span className="text-xs text-muted-foreground">{cfg.label}</span>
              </div>

              <p className="text-xs text-muted-foreground mb-1">
                {room.category.replace(/_/g, " ")} · Floor {room.floor}
              </p>

              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <BedDouble className="w-3 h-3" />
                <span>{room.capacity} guests</span>
              </div>

              {room.amenities && room.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {room.amenities.slice(0, 3).map((a) => (
                    <span
                      key={a}
                      className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
                    >
                      {a}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      +{room.amenities.length - 3}
                    </span>
                  )}
                </div>
              )}

              <p className="text-sm font-semibold tabular-nums text-foreground">
                {formatCurrency(room.pricePerNight)}<span className="text-xs font-normal text-muted-foreground">/night</span>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
