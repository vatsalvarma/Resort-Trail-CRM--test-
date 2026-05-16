"use client";
import React, { useState } from "react";
import { Users, Search, Filter, Phone, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { staff } from "@/data/mockData";
import { AddStaffModal } from "@/components/modals/AddStaffModal";
import { formatDate, getInitials, cn } from "@/lib/utils";

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN:    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  MANAGER:        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  RECEPTION:      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  KITCHEN_HEAD:   "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  ACCOUNTANT:     "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  HOUSEKEEPING:   "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  MAINTENANCE:    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function StaffPage() {
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showAddStaff, setShowAddStaff] = useState(false);

  const filtered = staff.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search);
    const matchRole = roleFilter === "ALL" || s.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roles = Array.from(new Set(staff.map((s) => s.role)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{staff.length} team members</p>
        </div>
        <Button className="bg-forest-700 hover:bg-forest-800 text-white gap-2" onClick={() => setShowAddStaff(true)}>
          <Shield className="w-4 h-4" /> Add Staff
        </Button>
      </div>

      {/* Role Pills */}
      <div className="flex flex-wrap gap-2">
        {["ALL", ...roles].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
              roleFilter === r
                ? "bg-forest-700 text-white shadow"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {r === "ALL" ? "All Roles" : r.replace("_", " ")}
            <span className="ml-1.5 opacity-70">
              {r === "ALL" ? staff.length : staff.filter((s) => s.role === r).length}
            </span>
          </button>
        ))}
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
          {filtered.length} staff
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((member) => (
                  <TableRow key={member.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300 text-xs font-semibold">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", ROLE_COLORS[member.role] ?? "bg-muted text-muted-foreground")}>
                        {member.role.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {member.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {member.department ?? "—"}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-semibold",
                        member.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400"
                      )}>
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(member.joinDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-14 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No staff found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AddStaffModal open={showAddStaff} onClose={() => setShowAddStaff(false)} />
    </div>
  );
}
