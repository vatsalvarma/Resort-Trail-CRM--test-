"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble } from "lucide-react";

interface OccupancyChartProps {
  occupied: number;
  available: number;
  maintenance: number;
  reserved: number;
  cleaning: number;
}

const SEGMENTS = [
  { key: "occupied",    label: "Occupied",    color: "#3b82f6" },
  { key: "reserved",    label: "Reserved",    color: "#8b5cf6" },
  { key: "cleaning",    label: "Cleaning",    color: "#06b6d4" },
  { key: "maintenance", label: "Maintenance", color: "#f59e0b" },
  { key: "available",   label: "Available",   color: "#22c55e" },
] as const;

const CX = 80;
const CY = 80;
const R_OUTER = 68;
const R_INNER = 44;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSlice(cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number) {
  if (endAngle - startAngle >= 360) endAngle = startAngle + 359.99;
  const outerStart = polarToCartesian(cx, cy, rOuter, endAngle);
  const outerEnd   = polarToCartesian(cx, cy, rOuter, startAngle);
  const innerStart = polarToCartesian(cx, cy, rInner, endAngle);
  const innerEnd   = polarToCartesian(cx, cy, rInner, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${outerStart.x.toFixed(2)} ${outerStart.y.toFixed(2)}`,
    `A ${rOuter} ${rOuter} 0 ${large} 0 ${outerEnd.x.toFixed(2)} ${outerEnd.y.toFixed(2)}`,
    `L ${innerEnd.x.toFixed(2)} ${innerEnd.y.toFixed(2)}`,
    `A ${rInner} ${rInner} 0 ${large} 1 ${innerStart.x.toFixed(2)} ${innerStart.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

export function OccupancyChart({ occupied, available, maintenance, reserved, cleaning }: OccupancyChartProps) {
  const total = occupied + available + maintenance + reserved + cleaning;
  const values: Record<string, number> = { occupied, available, maintenance, reserved, cleaning };
  const occupancyPct = total > 0 ? Math.round((occupied / total) * 100) : 0;

  let cursor = 0;
  const slices = SEGMENTS.map((seg) => {
    const pct = total > 0 ? values[seg.key] / total : 0;
    const angle = pct * 360;
    const start = cursor;
    cursor += angle;
    return { ...seg, count: values[seg.key], start, angle };
  }).filter((s) => s.angle > 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <BedDouble className="w-4 h-4 text-forest-600" />
          Room Occupancy
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center gap-5">
          {/* Donut */}
          <svg viewBox="0 0 160 160" className="flex-shrink-0" style={{ width: 130, height: 130 }}>
            {slices.map((s) => (
              <path
                key={s.key}
                d={donutSlice(CX, CY, R_OUTER, R_INNER, s.start, s.start + s.angle)}
                fill={s.color}
                opacity="0.9"
              >
                <title>{`${s.label}: ${s.count} rooms`}</title>
              </path>
            ))}
            {/* Centre label */}
            <text x={CX} y={CY - 8} textAnchor="middle" fontSize="22" fontWeight="700" fill="currentColor">
              {occupancyPct}%
            </text>
            <text x={CX} y={CY + 10} textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.5">
              occupied
            </text>
          </svg>

          {/* Legend */}
          <div className="space-y-1.5 flex-1">
            {SEGMENTS.map((seg) => {
              const count = values[seg.key];
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={seg.key} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                    <span className="text-xs text-muted-foreground">{seg.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tabular-nums">{count}</span>
                    <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">({pct}%)</span>
                  </div>
                </div>
              );
            })}
            <div className="pt-1 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-xs font-bold">{total} rooms</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
