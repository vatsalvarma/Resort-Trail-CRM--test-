"use client";
import React from "react";
import { Clock, CheckCircle2, ChefHat, Bell, Truck, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import type { FoodOrder, OrderStatus } from "@/types";

interface OrderBoardProps {
  orders: FoodOrder[];
  onStatusChange?: (order: FoodOrder, newStatus: OrderStatus) => void;
}

const COLUMNS: { status: OrderStatus; label: string; icon: React.ReactNode; color: string; next?: OrderStatus }[] = [
  { status: "PENDING",   label: "Pending",   icon: <Clock        className="w-4 h-4" />, color: "text-yellow-600", next: "ACCEPTED"  },
  { status: "ACCEPTED",  label: "Accepted",  icon: <CheckCircle2 className="w-4 h-4" />, color: "text-blue-600",   next: "PREPARING" },
  { status: "PREPARING", label: "Preparing", icon: <ChefHat      className="w-4 h-4" />, color: "text-orange-600", next: "READY"     },
  { status: "READY",     label: "Ready",     icon: <Bell         className="w-4 h-4" />, color: "text-green-600",  next: "DELIVERED" },
  { status: "DELIVERED", label: "Delivered", icon: <Truck        className="w-4 h-4" />, color: "text-gray-500"                      },
];

const STATUS_BG: Record<OrderStatus, string> = {
  PENDING:   "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800",
  ACCEPTED:  "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800",
  PREPARING: "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800",
  READY:     "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800",
  DELIVERED: "bg-gray-50 dark:bg-gray-900/10 border-gray-200 dark:border-gray-800",
  CANCELLED: "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800",
};

function timeSince(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

export function OrderBoard({ orders, onStatusChange }: OrderBoardProps) {
  const byStatus = (status: OrderStatus) => orders.filter((o) => o.status === status);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {COLUMNS.map((col) => {
        const colOrders = byStatus(col.status);
        return (
          <div key={col.status} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={cn("flex items-center gap-1.5 font-semibold text-sm", col.color)}>
                {col.icon}
                {col.label}
              </div>
              <Badge variant="secondary" className="text-xs h-5 px-1.5">
                {colOrders.length}
              </Badge>
            </div>

            <div className="space-y-2 min-h-[60px]">
              {colOrders.map((order) => (
                <Card key={order.id} className={cn("border", STATUS_BG[order.status])}>
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold">{order.orderNumber}</span>
                      <span className="text-xs text-muted-foreground">{timeSince(order.placedAt)}</span>
                    </div>

                    <div>
                      <p className="text-sm font-medium leading-tight">{order.guest.name}</p>
                      <p className="text-xs text-muted-foreground">Room {order.roomNumber}</p>
                    </div>

                    <div className="space-y-0.5">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex justify-between text-xs">
                          <span className="text-muted-foreground truncate max-w-[100px]">
                            {item.quantity}× {item.menuItem.name}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-xs text-muted-foreground">+{order.items.length - 3} more</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-border/50">
                      <span className="text-xs font-semibold tabular-nums">
                        {formatCurrency(order.grandTotal)}
                      </span>
                      {col.next && onStatusChange && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-xs px-2"
                          onClick={() => onStatusChange(order, col.next!)}
                        >
                          → {col.next.charAt(0) + col.next.slice(1).toLowerCase()}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {colOrders.length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground">No orders</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
