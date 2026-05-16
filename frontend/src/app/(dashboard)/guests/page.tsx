"use client";
import React, { useState } from "react";
import { Users, Search, Eye, Phone, Mail, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { guests } from "@/data/mockData";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";

export default function GuestsPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "grid">("table");

  const filtered = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.phone.includes(search)
  );

  const vipGuests = guests.filter((g) => g.totalBookings >= 3).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Guest Directory</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {guests.length} registered guests · {vipGuests} VIP
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("table")}
            className={view === "table" ? "bg-forest-700 text-white" : ""}
          >
            Table
          </Button>
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("grid")}
            className={view === "grid" ? "bg-forest-700 text-white" : ""}
          >
            Cards
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="sm:max-w-xs"
        />
        <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          {filtered.length} guests
        </div>
      </div>

      {view === "table" ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Total Bookings</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Member Since</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((guest) => (
                    <TableRow key={guest.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300 text-xs font-semibold">
                              {getInitials(guest.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium">{guest.name}</p>
                              {guest.totalBookings >= 3 && (
                                <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{guest.idType}: {guest.idNumber}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{guest.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{guest.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{guest.nationality ?? "—"}</TableCell>
                      <TableCell className="text-sm tabular-nums">{guest.totalBookings}</TableCell>
                      <TableCell className="text-sm font-semibold tabular-nums">
                        {formatCurrency(guest.totalSpent)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {guest.lastVisit ? formatDate(guest.lastVisit) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(guest.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon-sm" className="h-7 w-7 ml-auto flex">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-14 text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No guests found</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((guest) => (
            <Card key={guest.id} className="hover:shadow-card-hover transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300 text-sm font-semibold">
                      {getInitials(guest.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm truncate">{guest.name}</p>
                      {guest.totalBookings >= 3 && <Star className="w-3 h-3 fill-gold-400 text-gold-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{guest.email}</p>
                    <p className="text-xs text-muted-foreground">{guest.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Bookings</p>
                    <p className="text-sm font-bold">{guest.totalBookings}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                    <p className="text-sm font-bold">{formatCurrency(guest.totalSpent)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
