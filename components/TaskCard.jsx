"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from "./CountdownTimer";
import { minutesToDisplay } from "@/lib/time-utils";

const PHASE_STYLES = {
  done: "border-l-4 border-l-emerald-400 opacity-70",
  now: "border-l-4 border-l-blue-500 ring-2 ring-blue-200",
  next: "border-l-4 border-l-amber-400",
  later: "border-l-4 border-l-muted",
};

const PHASE_LABELS = {
  done: "Done",
  now: "Now",
  next: "Next",
  later: "Later",
};

export default function TaskCard({
  task,
  phase,
  remainingMs,
  isParent,
  onMarkDone,
  onAccept,
}) {
  const stars = Array(task.star_value).fill("\u2B50");

  return (
    <Card className={`transition-all ${PHASE_STYLES[phase] || ""}`}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant={phase === "now" ? "default" : "outline"}
              className="text-xs shrink-0"
            >
              {PHASE_LABELS[phase] || phase}
            </Badge>
            <span className="font-medium truncate">{task.title}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{minutesToDisplay(task.time_allowed_minutes)}</span>
            <span>{stars.join("")}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {phase === "now" && remainingMs != null && (
            <CountdownTimer remainingMs={remainingMs} />
          )}

          {phase === "now" && task.status === "pending" && !isParent && (
            <Button
              size="sm"
              variant="outline"
              className="min-w-[4rem] h-12 text-base"
              onClick={() => onMarkDone?.(task.id)}
            >
              Done!
            </Button>
          )}

          {task.status === "done" && isParent && (
            <Button
              size="sm"
              className="min-w-[5rem] h-12 text-base bg-emerald-600 hover:bg-emerald-700"
              onClick={() => onAccept?.(task.id)}
            >
              Accept
            </Button>
          )}

          {task.status === "accepted" && (
            <span className="text-emerald-600 font-bold text-lg">&#10003;</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
