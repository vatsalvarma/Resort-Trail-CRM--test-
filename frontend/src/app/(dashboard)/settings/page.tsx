"use client";
import React, { useState } from "react";
import { Settings, User, Bell, Shield, Palette, Database, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState({
    newBooking: true,
    checkIn: true,
    checkOut: true,
    newOrder: false,
    paymentReceived: true,
    lowStock: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="profile" className="gap-1.5 text-xs">
            <User className="w-3.5 h-3.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-xs">
            <Bell className="w-3.5 h-3.5" /> Alerts
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs">
            <Shield className="w-3.5 h-3.5" /> Security
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-1.5 text-xs">
            <Database className="w-3.5 h-3.5" /> System
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Profile Information</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue={user?.phone ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue={user?.role ?? ""} disabled className="opacity-60" />
                </div>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <Label htmlFor="bio">Department</Label>
                <Input id="bio" defaultValue={user?.department ?? ""} />
              </div>
              <Button onClick={handleSave} className={cn("gap-2", saved ? "bg-green-600 hover:bg-green-700" : "bg-forest-700 hover:bg-forest-800")}>
                <Save className="w-4 h-4" />
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "newBooking",       label: "New Booking",         desc: "Get notified when a new booking is made" },
                { key: "checkIn",          label: "Check-in Alert",      desc: "Alert when guests check in" },
                { key: "checkOut",         label: "Check-out Alert",     desc: "Alert when guests check out" },
                { key: "newOrder",         label: "New Food Order",      desc: "Get notified on kitchen orders" },
                { key: "paymentReceived",  label: "Payment Received",    desc: "Notify when payment is confirmed" },
                { key: "lowStock",         label: "Low Stock Warning",   desc: "Kitchen inventory alerts" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({ ...prev, [item.key]: v }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Change Password</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="current-pass">Current Password</Label>
                <Input id="current-pass" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-pass">New Password</Label>
                <Input id="new-pass" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-pass">Confirm New Password</Label>
                <Input id="confirm-pass" type="password" placeholder="••••••••" />
              </div>
              <Button className="bg-forest-700 hover:bg-forest-800 gap-2">
                <Shield className="w-4 h-4" /> Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="text-base">System Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Resort Name</Label>
                  <Input defaultValue="Village Trails Resort" />
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Input defaultValue="INR (₹)" />
                </div>
                <div className="space-y-1.5">
                  <Label>GST Number</Label>
                  <Input defaultValue="27AABCU9603R1ZJ" />
                </div>
                <div className="space-y-1.5">
                  <Label>Time Zone</Label>
                  <Input defaultValue="Asia/Kolkata (IST)" />
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-medium">Tax Configuration</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>CGST Rate (%)</Label>
                    <Input defaultValue="6" type="number" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>SGST Rate (%)</Label>
                    <Input defaultValue="6" type="number" />
                  </div>
                </div>
              </div>
              <Button onClick={handleSave} className={cn("gap-2", saved ? "bg-green-600 hover:bg-green-700" : "bg-forest-700 hover:bg-forest-800")}>
                <Save className="w-4 h-4" />
                {saved ? "Saved!" : "Save Configuration"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
