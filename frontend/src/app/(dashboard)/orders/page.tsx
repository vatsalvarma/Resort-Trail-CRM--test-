"use client";
import React, { useState } from "react";
import { ShoppingBag, Search, Filter, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { foodOrders } from "@/data/mockData";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING:   "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  ACCEPTED:  "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  PREPARING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  READY:     "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  DELIVERED: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function OrdersPage() {
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("ALL");

  const filtered = foodOrders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.guest.name.toLowerCase().includes(search.toLowerCase()) ||
      o.roomNumber.includes(search);
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = foodOrders
    .filter((o) => o.status === "DELIVERED")
    .reduce((s, o) => s + o.grandTotal, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Food Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">{foodOrders.length} total orders</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-xl border border-green-200 dark:border-green-800">
          <IndianRupee className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700 dark:text-green-400">
            {formatCurrency(totalRevenue)} F&B Revenue
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search orders, guests, rooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="sm:max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {(Object.keys(STATUS_STYLES) as OrderStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          {filtered.length} orders
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Placed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-semibold">
                      #{order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{order.guest.name}</p>
                        <p className="text-xs text-muted-foreground">#{order.booking.bookingNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">Room {order.roomNumber}</TableCell>
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        {order.items.slice(0, 2).map((item, i) => (
                          <p key={i} className="text-muted-foreground">
                            {item.quantity}× {item.menuItem.name}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-muted-foreground">+{order.items.length - 2} more</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-sm tabular-nums">
                      {formatCurrency(order.grandTotal)}
                    </TableCell>
                    <TableCell>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", STATUS_STYLES[order.status as OrderStatus])}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(order.placedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-14 text-muted-foreground">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
