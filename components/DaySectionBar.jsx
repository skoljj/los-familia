"use client";

import { Progress } from "@/components/ui/progress";
import { formatTime, timeToMinutes } from "@/lib/time-utils";

const SECTION_ICONS = {
  morning: "\u2600\uFE0F",
  afternoon: "\u26C5",
  evening: "\uD83C\uDF19",
};

export default function DaySectionBar({ section, now = new Date() }) {
  if (!section) return null;

  const start = timeToMinutes(section.start_time);
  const end = timeToMinutes(section.end_time);
  const current = now.getHours() * 60 + now.getMinutes();
  const total = end - start;
  const elapsed = Math.min(Math.max(current - start, 0), total);
  const pct = total > 0 ? Math.round((elapsed / total) * 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold capitalize">
          {SECTION_ICONS[section.label]} {section.label}
        </span>
        <span className="text-muted-foreground">
          {formatTime(start)} &ndash; {formatTime(end)}
        </span>
      </div>
      <Progress value={pct} className="h-2" />
      <p className="text-xs text-muted-foreground text-right">
        {Math.max(0, end - current)} min remaining in section
      </p>
    </div>
  );
}
