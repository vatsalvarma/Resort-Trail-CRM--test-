"use client";
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface DataPoint {
  label: string;
  value: number;
}

interface RevenueChartProps {
  data: DataPoint[];
  title?: string;
}

const W = 560;
const H = 160;
const PAD = { top: 12, right: 16, bottom: 28, left: 52 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

export function RevenueChart({ data, title = "Revenue Trend" }: RevenueChartProps) {
  const { points, pathD, areaD, yTicks, maxVal } = useMemo(() => {
    if (!data.length) return { points: [], pathD: "", areaD: "", yTicks: [], maxVal: 0 };

    const maxVal = Math.max(...data.map((d) => d.value));
    const step = INNER_W / (data.length - 1 || 1);

    const points = data.map((d, i) => ({
      x: PAD.left + i * step,
      y: PAD.top + INNER_H - (d.value / (maxVal || 1)) * INNER_H,
      label: d.label,
      value: d.value,
    }));

    const pathD = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");

    const areaD =
      pathD +
      ` L ${points[points.length - 1].x.toFixed(1)} ${(PAD.top + INNER_H).toFixed(1)}` +
      ` L ${points[0].x.toFixed(1)} ${(PAD.top + INNER_H).toFixed(1)} Z`;

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
      y: PAD.top + INNER_H - t * INNER_H,
      label:
        maxVal * t >= 1000
          ? `₹${((maxVal * t) / 1000).toFixed(0)}k`
          : `₹${(maxVal * t).toFixed(0)}`,
    }));

    return { points, pathD, areaD, yTicks, maxVal };
  }, [data]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-forest-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3 px-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: 160 }}
          aria-label={title}
        >
          <defs>
            <linearGradient id="revenue-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2d6a4f" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2d6a4f" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((t) => (
            <g key={t.y}>
              <line
                x1={PAD.left}
                y1={t.y}
                x2={PAD.left + INNER_W}
                y2={t.y}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 6}
                y={t.y + 4}
                textAnchor="end"
                fontSize="10"
                fill="currentColor"
                fillOpacity="0.45"
              >
                {t.label}
              </text>
            </g>
          ))}

          {/* Area fill */}
          {areaD && (
            <path d={areaD} fill="url(#revenue-grad)" />
          )}

          {/* Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#2d6a4f"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* X-axis labels + dots */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3.5" fill="#2d6a4f" />
              <circle cx={p.x} cy={p.y} r="6" fill="#2d6a4f" fillOpacity="0" className="hover:fill-opacity-10 cursor-pointer">
                <title>{`${p.label}: ₹${p.value.toLocaleString("en-IN")}`}</title>
              </circle>
              {i % Math.ceil(points.length / 7) === 0 && (
                <text
                  x={p.x}
                  y={PAD.top + INNER_H + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fill="currentColor"
                  fillOpacity="0.5"
                >
                  {p.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      </CardContent>
    </Card>
  );
}
