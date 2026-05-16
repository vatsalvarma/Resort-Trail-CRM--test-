"use client";
import React, { useState, useCallback } from "react";
import { Receipt, Search, Filter, Download, IndianRupee, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { invoices } from "@/data/mockData";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { PaymentStatus } from "@/types";

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  PAID:     "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  PENDING:  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PARTIAL:  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  REFUNDED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  FAILED:   "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function AccountingPage() {
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("ALL");

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.guest.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || inv.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue  = invoices.filter((i) => i.paymentStatus === "PAID").reduce((s, i) => s + i.grandTotal, 0);
  const pendingAmount = invoices.filter((i) => i.paymentStatus === "PENDING").reduce((s, i) => s + i.grandTotal, 0);
  const partialAmount = invoices.filter((i) => i.paymentStatus === "PARTIAL").reduce((s, i) => s + i.grandTotal, 0);

  const handleExportCSV = useCallback(() => {
    const header = "Invoice#,Guest,Type,SubTotal,GST,GrandTotal,Status,Issued\n";
    const rows = filtered.map((inv) =>
      `${inv.invoiceNumber},"${inv.guest.name}",${inv.type},${inv.subTotal},${inv.totalGst},${inv.grandTotal},${inv.paymentStatus},${inv.issuedAt}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "invoices.csv"; a.click();
  }, [filtered]);

  const handleExportPDF = useCallback(() => {
    const w = window.open("", "_blank")!;
    const rows = filtered.map((inv) =>
      `<tr><td>${inv.invoiceNumber}</td><td>${inv.guest.name}</td><td>${inv.type}</td><td>₹${inv.subTotal.toLocaleString()}</td><td>₹${inv.totalGst.toLocaleString()}</td><td><b>₹${inv.grandTotal.toLocaleString()}</b></td><td>${inv.paymentStatus}</td></tr>`
    ).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>Village Trails – Invoices</title><style>body{font-family:sans-serif;padding:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:6px 10px;text-align:left}th{background:#f5f5f5}@media print{button{display:none}}</style></head><body><h2>Village Trails Resort – Invoice Report</h2><p>Collected: ₹${totalRevenue.toLocaleString()} &nbsp;|&nbsp; Pending: ₹${pendingAmount.toLocaleString()}</p><table><thead><tr><th>Invoice#</th><th>Guest</th><th>Type</th><th>Sub Total</th><th>GST</th><th>Grand Total</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table><br/><button onclick="window.print()">Print / Save as PDF</button></body></html>`);
    w.document.close();
  }, [filtered, totalRevenue, pendingAmount]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Accounting</h1>
          <p className="text-muted-foreground text-sm mt-1">{invoices.length} invoices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="w-4 h-4" /> CSV
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
            <Download className="w-4 h-4" /> PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Collected</p>
              <p className="text-xl font-bold tabular-nums">{formatCurrency(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-bold tabular-nums">{formatCurrency(pendingAmount)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Partial</p>
              <p className="text-xl font-bold tabular-nums">{formatCurrency(partialAmount)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search invoice, guest..."
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
            {(Object.keys(PAYMENT_STYLES) as PaymentStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          {filtered.length} invoices
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sub Total</TableHead>
                  <TableHead>GST</TableHead>
                  <TableHead>Grand Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-semibold">
                      {inv.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{inv.guest.name}</p>
                        <p className="text-xs text-muted-foreground">{inv.guest.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                        {inv.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">{formatCurrency(inv.subTotal)}</TableCell>
                    <TableCell className="text-sm tabular-nums text-muted-foreground">
                      {formatCurrency(inv.totalGst)}
                    </TableCell>
                    <TableCell className="text-sm font-bold tabular-nums">
                      {formatCurrency(inv.grandTotal)}
                    </TableCell>
                    <TableCell>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", PAYMENT_STYLES[inv.paymentStatus as PaymentStatus])}>
                        {inv.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(inv.issuedAt)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {inv.dueDate ? formatDate(inv.dueDate) : "—"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon-sm" className="h-7 w-7 ml-auto flex">
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-14 text-muted-foreground">
              <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No invoices found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
