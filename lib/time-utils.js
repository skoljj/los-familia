export function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToDisplay(totalMinutes) {
  if (totalMinutes <= 0) return "";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatTimeRange(startTime, endTime) {
  return `${formatTime(timeToMinutes(startTime))} – ${formatTime(timeToMinutes(endTime))}`;
}

/**
 * Determine which schedule block is currently active.
 */
export function getCurrentBlock(blocks, now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const block of blocks) {
    const start = timeToMinutes(block.start_time);
    const end = timeToMinutes(block.end_time);
    if (currentMinutes >= start && currentMinutes < end) {
      return block;
    }
  }
  return null;
}

/**
 * Classify each schedule block as past/now/next/later relative to current time.
 */
export function classifyBlocks(blocks, now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let foundCurrent = false;
  let foundNext = false;

  return blocks.map((block) => {
    const start = timeToMinutes(block.start_time);
    const end = timeToMinutes(block.end_time);

    let phase;
    if (currentMinutes >= end) {
      phase = "past";
    } else if (!foundCurrent && currentMinutes >= start && currentMinutes < end) {
      phase = "now";
      foundCurrent = true;
    } else if (foundCurrent && !foundNext) {
      phase = "next";
      foundNext = true;
    } else if (!foundCurrent) {
      phase = "past";
    } else {
      phase = "later";
    }

    const remainingMinutes = phase === "now" ? end - currentMinutes : null;

    return {
      ...block,
      phase,
      remainingMinutes,
    };
  });
}

/**
 * Get today's day name for template matching.
 */
export function getTodayDayType(now = new Date()) {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[now.getDay()];
}
