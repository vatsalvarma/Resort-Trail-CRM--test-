"use client";
import React from "react";
import { FileText, Download, Eye } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { Invoice, PaymentStatus, InvoiceType } from "@/types";

interface InvoiceTableProps {
  invoices: Invoice[];
  onView?: (invoice: Invoice) => void;
  onDownload?: (invoice: Invoice) => void;
}

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  PAID:     "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  PENDING:  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PARTIAL:  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  REFUNDED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  FAILED:   "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const TYPE_STYLES: Record<InvoiceType, string> = {
  BOOKING:  "bg-forest-100 text-forest-800 dark:bg-forest-900/30 dark:text-forest-400",
  FOOD:     "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  COMBINED: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  REFUND:   "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function InvoiceTable({ invoices, onView, onDownload }: InvoiceTableProps) {
  if (!invoices.length) {
    return (
      <div className="text-center py-14 text-muted-foreground">
        <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p>No invoices found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Booking</TableHead>
            <TableHead>Issued</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Sub-Total</TableHead>
            <TableHead>GST</TableHead>
            <TableHead>Grand Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id} className="hover:bg-muted/30">
              <TableCell className="font-mono text-xs font-bold">{inv.invoiceNumber}</TableCell>
              <TableCell>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", TYPE_STYLES[inv.type])}>
                  {inv.type}
                </span>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{inv.guest.name}</p>
                  <p className="text-xs text-muted-foreground">{inv.guest.email}</p>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {inv.booking?.bookingNumber ?? "—"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(inv.issuedAt)}
              </TableCell>
              <TableCell className={cn("text-sm", inv.dueDate && !inv.paidAt ? "text-amber-600 font-medium" : "text-muted-foreground")}>
                {inv.dueDate ? formatDate(inv.dueDate) : "—"}
              </TableCell>
              <TableCell className="text-sm tabular-nums">{formatCurrency(inv.subTotal)}</TableCell>
              <TableCell className="text-sm tabular-nums text-muted-foreground">{formatCurrency(inv.totalGst)}</TableCell>
              <TableCell className="text-sm font-bold tabular-nums">{formatCurrency(inv.grandTotal)}</TableCell>
              <TableCell>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", PAYMENT_STYLES[inv.paymentStatus])}>
                  {inv.paymentStatus}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onView?.(inv)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onDownload?.(inv)}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
