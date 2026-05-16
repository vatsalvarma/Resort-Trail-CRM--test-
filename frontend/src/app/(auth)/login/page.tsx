"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TreePine, Eye, EyeOff, Lock, Mail, AlertCircle, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";

const demoCredentials = [
  { role: "Super Admin",   email: "rajesh@villagetrails.in",  password: "admin123"   },
  { role: "Manager",       email: "meera@villagetrails.in",   password: "manager123" },
  { role: "Kitchen Head",  email: "suresh@villagetrails.in",  password: "kitchen123" },
  { role: "Reception",     email: "kavya@villagetrails.in",   password: "recep123"   },
  { role: "Accountant",    email: "lakshmi@villagetrails.in", password: "acct123"    },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const ok = await login(email, password);
    if (ok) {
      toast.success("Welcome back! Redirecting...");
      router.replace("/dashboard");
    }
  };

  const fillDemo = (cred: { email: string; password: string }) => {
    clearError();
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800">
      {/* Left Panel — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gold-500/5 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-forest-600/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center shadow-gold">
              <TreePine className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white font-display font-bold text-xl leading-tight">Village Trails</h1>
              <p className="text-gold-400 text-sm font-medium">Resort Management CRM</p>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-display font-bold text-white leading-tight">
              Premium Resort<br />
              <span className="text-gold-400">Operations</span> Hub
            </h2>
            <p className="mt-4 text-forest-300 text-base leading-relaxed max-w-sm">
              Manage every aspect of your resort — from bookings and rooms to kitchen operations
              and accounting — all from a single, elegant dashboard.
            </p>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-3">
            {[
              "Real-time Booking", "Room Visualization",
              "Kitchen Monitor", "Smart Accounting",
              "PDF Reports", "Role-based Access",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                <span className="text-sm text-forest-300">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-forest-500 text-sm">
            © {new Date().getFullYear()} Village Trails Resort, Coorg, Karnataka
          </p>
        </div>
      </motion.div>

      {/* Right Panel — Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Village Trails CRM</h1>
              <p className="text-xs text-muted-foreground">Resort Management System</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Sign in</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@villagetrails.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="hover:text-foreground transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full bg-forest-700 hover:bg-forest-800 text-white mt-2"
              loading={isLoading}
            >
              {!isLoading && <LogIn className="w-4 h-4" />}
              Sign In
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Demo Credentials
            </p>
            <div className="space-y-2">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => fillDemo(cred)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left group"
                >
                  <div>
                    <p className="text-xs font-semibold text-foreground">{cred.role}</p>
                    <p className="text-xs text-muted-foreground">{cred.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {cred.password}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
