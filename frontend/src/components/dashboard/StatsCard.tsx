"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  index?: number;
}

export function StatsCard({
  title, value, subtitle, change, changeLabel,
  icon: Icon, iconColor = "text-forest-600", iconBg = "bg-forest-50 dark:bg-forest-900/20",
  index = 0,
}: StatsCardProps) {
  const isPositive = (change ?? 0) > 0;
  const isNeutral  = change === 0 || change === undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="hover:shadow-card-hover transition-all duration-200 group cursor-default">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {title}
              </p>
              <p className="text-2xl font-bold text-foreground mt-1.5 tabular-nums">
                {value}
              </p>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
              )}
              {change !== undefined && (
                <div className="flex items-center gap-1 mt-2">
                  {isNeutral ? (
                    <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    isNeutral ? "text-muted-foreground" : isPositive ? "text-green-600" : "text-red-500"
                  )}>
                    {isNeutral ? "No change" : `${isPositive ? "+" : ""}${change}%`}
                  </span>
                  {changeLabel && (
                    <span className="text-xs text-muted-foreground">{changeLabel}</span>
                  )}
                </div>
              )}
            </div>
            <div className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
              iconBg
            )}>
              <Icon className={cn("w-5 h-5", iconColor)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
