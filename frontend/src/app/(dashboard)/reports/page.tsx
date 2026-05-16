"use client";
import React, { useState, useMemo, useCallback } from "react";
import { BarChart3, Download, Calendar, TrendingUp, BedDouble, ShoppingBag, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { bookings, rooms, foodOrders, invoices } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ReportsPage() {
  const [period, setPeriod] = useState("THIS_MONTH");

  const totalRevenue    = invoices.filter((i) => i.paymentStatus === "PAID").reduce((s, i) => s + i.grandTotal, 0);
  const fbRevenue       = foodOrders.filter((o) => o.status === "DELIVERED").reduce((s, o) => s + o.grandTotal, 0);
  const roomRevenue     = totalRevenue - fbRevenue;
  const occupiedRooms   = rooms.filter((r) => (r.status as string) === "OCCUPIED").length;
  const occupancyRate   = Math.round((occupiedRooms / rooms.length) * 100);
  const confirmedBookings = bookings.filter((b) => ["CONFIRMED", "CHECKED_IN"].includes(b.status)).length;

  const SEEDS = [0.08,0.12,0.07,0.13,0.09,0.11,0.14,0.10,0.06,0.15,0.10,0.09];
  const OCC   = [55,62,58,70,65,72,80,75,60,68,74,71];
  const BKS   = [0.7,0.9,0.8,1.1,0.95,1.0,1.2,1.05,0.75,0.9,1.0,0.85];
  const monthlyData = useMemo(() => MONTHS.map((m, i) => ({
    month: m,
    revenue: Math.round(totalRevenue * SEEDS[i]),
    bookings: Math.round(confirmedBookings * BKS[i]),
    occupancy: OCC[i],
  })), [totalRevenue, confirmedBookings]);
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  const handleExportPDF = useCallback(() => {
    const w = window.open("", "_blank")!;
    const rows = monthlyData.map((d) => `<tr><td>${d.month}</td><td>₹${d.revenue.toLocaleString()}</td><td>${d.bookings}</td><td>${d.occupancy}%</td></tr>`).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>Village Trails – Report</title><style>body{font-family:sans-serif;padding:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:8px 12px;text-align:left}th{background:#f5f5f5}h2{margin-bottom:16px}@media print{button{display:none}}</style></head><body><h2>Village Trails Resort – ${period.replace("_"," ")} Report</h2><p>Total Revenue: ₹${totalRevenue.toLocaleString()} | Occupancy: ${occupancyRate}%</p><table><thead><tr><th>Month</th><th>Revenue</th><th>Bookings</th><th>Occupancy</th></tr></thead><tbody>${rows}</tbody></table><br/><button onclick="window.print()">Print / Save as PDF</button></body></html>`);
    w.document.close();
  }, [monthlyData, period, totalRevenue, occupancyRate]);

  const handleExportCSV = useCallback(() => {
    const header = "Month,Revenue,Bookings,Occupancy\n";
    const rows = monthlyData.map((d) => `${d.month},${d.revenue},${d.bookings},${d.occupancy}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "report.csv"; a.click();
  }, [monthlyData]);

  const roomCategoryData = rooms.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Business performance overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="THIS_MONTH">This Month</SelectItem>
              <SelectItem value="LAST_MONTH">Last Month</SelectItem>
              <SelectItem value="THIS_QUARTER">This Quarter</SelectItem>
              <SelectItem value="THIS_YEAR">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="w-4 h-4" /> CSV
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
            <Download className="w-4 h-4" /> PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: IndianRupee, color: "text-gold-600", bg: "bg-gold-50 dark:bg-gold-900/20" },
          { label: "Room Revenue",  value: formatCurrency(roomRevenue),  icon: BedDouble,  color: "text-forest-600", bg: "bg-forest-50 dark:bg-forest-900/20" },
          { label: "F&B Revenue",   value: formatCurrency(fbRevenue),    icon: ShoppingBag,color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
          { label: "Occupancy Rate",value: `${occupancyRate}%`,          icon: TrendingUp, color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-900/20" },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-lg font-bold tabular-nums">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart (simple bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-7 flex-shrink-0">{d.month}</span>
                  <div className="flex-1 bg-muted rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-forest-600 to-forest-500 rounded-full transition-all duration-500"
                      style={{ width: `${(d.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold tabular-nums w-20 text-right text-foreground">
                    {formatCurrency(d.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-muted-foreground" />
              Room Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(roomCategoryData).map(([cat, count]) => {
              const pct = Math.round((count / rooms.length) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{cat.replace(/_/g, " ")}</span>
                    <span className="font-semibold">{count} rooms ({pct}%)</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Occupancy Trend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Monthly Occupancy Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-28">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-500"
                  style={{ height: `${(d.occupancy / 100) * 96}px` }}
                />
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
