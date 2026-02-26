/**
 * Determine which day section is currently active based on the configured
 * section boundaries and the current local time.
 */
export function getCurrentSection(sections, now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const section of sections) {
    const start = timeToMinutes(section.start_time);
    const end = timeToMinutes(section.end_time);
    if (currentMinutes >= start && currentMinutes < end) {
      return section;
    }
  }
  return null;
}

export function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToDisplay(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Given a list of tasks ordered by sort_order and a section start time,
 * compute the scheduled start/end for each task and identify which task
 * is "now", "next", etc.
 */
export function buildTimeline(tasks, sectionStartTime, now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let cursor = timeToMinutes(sectionStartTime);
  let foundCurrent = false;

  return tasks.map((task) => {
    const taskStart = cursor;
    const taskEnd = cursor + (task.time_allowed_minutes || 0);
    cursor = taskEnd;

    let phase = "later";
    if (task.status === "accepted" || task.status === "done") {
      phase = "done";
    } else if (!foundCurrent && currentMinutes < taskEnd) {
      phase = "now";
      foundCurrent = true;
    } else if (!foundCurrent) {
      phase = "done";
    }

    const remainingMs =
      phase === "now"
        ? Math.max(0, (taskEnd - currentMinutes) * 60 * 1000)
        : null;

    return {
      ...task,
      scheduledStart: taskStart,
      scheduledEnd: taskEnd,
      phase,
      remainingMs,
    };
  });
}

export function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
}
