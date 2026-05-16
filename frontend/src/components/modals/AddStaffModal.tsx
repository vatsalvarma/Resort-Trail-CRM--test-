"use client";
import React, { useState } from "react";
import { X, Shield, User, Lock, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

interface Props { open: boolean; onClose: () => void; }

const ROLES: Role[] = ["SUPER_ADMIN", "MANAGER", "RECEPTION", "KITCHEN_HEAD", "ACCOUNTANT"];

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN:  ["All Modules", "Staff Management", "Financial Reports", "System Settings", "Booking Management", "Kitchen Management"],
  MANAGER:      ["Dashboard", "Booking Management", "Room Management", "Staff View", "Reports", "Kitchen View"],
  RECEPTION:    ["Dashboard", "Booking Management", "Guest Management", "Check-in / Check-out", "Room View"],
  KITCHEN_HEAD: ["Dashboard", "Kitchen Orders", "Menu Management", "Food Reports"],
  ACCOUNTANT:   ["Dashboard", "Accounting", "Invoice Management", "Financial Reports", "Export Data"],
  KITCHEN_STAFF:["Kitchen Orders", "Menu View"],
};

const SHIFTS = ["MORNING", "EVENING", "NIGHT"];

const EMPTY = {
  name: "", email: "", phone: "", role: "RECEPTION" as Role,
  department: "", shift: "MORNING", salary: "",
};

export function AddStaffModal({ open, onClose }: Props) {
  const [form, setForm]           = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [customPerms, setCustomPerms] = useState<string[]>([]);
  const [useCustomPerms, setUseCustomPerms] = useState(false);

  if (!open) return null;

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const defaultPerms = ROLE_PERMISSIONS[form.role] ?? [];
  const activePerms  = useCustomPerms ? customPerms : defaultPerms;

  const ALL_PERMS = Array.from(new Set(Object.values(ROLE_PERMISSIONS).flat()));

  const togglePerm = (p: string) =>
    setCustomPerms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const valid = form.name && form.email && form.phone && form.role;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm(EMPTY); setCustomPerms([]); onClose(); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-forest-800 text-white">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <h2 className="text-lg font-bold">Add Staff Member</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-green-600" />
            </div>
            <p className="text-lg font-semibold">Staff Added!</p>
            <p className="text-sm text-muted-foreground mt-1">Credentials will be sent to {form.email}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Full Name</label>
                <Input placeholder="e.g. Priya Nair" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Email</label>
                <Input type="email" placeholder="staff@villagetrails.in" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Phone</label>
                <Input placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
            </div>

            {/* Role & Dept */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Role</label>
                <Select value={form.role} onValueChange={(v) => { set("role", v); setUseCustomPerms(false); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => <SelectItem key={r} value={r}>{r.replace(/_/g, " ")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Department</label>
                <Input placeholder="e.g. Front Office" value={form.department} onChange={(e) => set("department", e.target.value)} />
              </div>
            </div>

            {/* Shift & Salary */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Shift</label>
                <Select value={form.shift} onValueChange={(v) => set("shift", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SHIFTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Monthly Salary (₹)</label>
                <Input type="number" placeholder="25000" value={form.salary} onChange={(e) => set("salary", e.target.value)} />
              </div>
            </div>

            {/* Permissions */}
            <div className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Permissions</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setUseCustomPerms(!useCustomPerms); setCustomPerms([...defaultPerms]); }}
                  className="text-xs text-forest-600 hover:text-forest-700 dark:text-forest-400 font-medium"
                >
                  {useCustomPerms ? "Use Role Defaults" : "Customize"}
                </button>
              </div>

              {useCustomPerms ? (
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                  {ALL_PERMS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePerm(p)}
                      className={cn(
                        "flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg border text-left transition-all",
                        customPerms.includes(p)
                          ? "bg-forest-100 border-forest-300 text-forest-800 dark:bg-forest-900/30 dark:border-forest-700 dark:text-forest-300"
                          : "border-border text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {customPerms.includes(p)
                        ? <CheckSquare className="w-3 h-3 flex-shrink-0" />
                        : <Square className="w-3 h-3 flex-shrink-0" />}
                      {p}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {defaultPerms.map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded-full text-xs bg-forest-100 text-forest-800 dark:bg-forest-900/30 dark:text-forest-300 font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button
                type="submit"
                disabled={!valid}
                className="flex-1 bg-forest-700 hover:bg-forest-800 text-white"
              >
                Add Staff Member
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
