"use client";

import { Badge } from "@/components/ui/badge";

export default function StarCounter({ count, size = "default" }) {
  const sizeClasses =
    size === "lg"
      ? "text-2xl px-4 py-2 gap-2"
      : "text-sm px-2 py-1 gap-1";

  return (
    <Badge variant="secondary" className={`inline-flex items-center ${sizeClasses}`}>
      <span className="text-amber-500">&#9733;</span>
      <span className="font-bold">{count}</span>
    </Badge>
  );
}
