"use client";
import { useEffect, useState } from "react";
import { formatRelativeTime, formatDate, formatDateTime } from "@/lib/utils";

interface Props {
  dateStr: string;
  mode?: "relative" | "date" | "datetime";
  className?: string;
}

export function ClientTime({ dateStr, mode = "relative", className }: Props) {
  const [display, setDisplay] = useState<string>(() => {
    if (mode === "date") return formatDate(dateStr);
    if (mode === "datetime") return formatDateTime(dateStr);
    return formatDate(dateStr);
  });

  useEffect(() => {
    if (mode === "relative") setDisplay(formatRelativeTime(dateStr));
    else if (mode === "datetime") setDisplay(formatDateTime(dateStr));
    else setDisplay(formatDate(dateStr));
  }, [dateStr, mode]);

  return <span suppressHydrationWarning className={className}>{display}</span>;
}
