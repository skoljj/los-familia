"use client";

export default function DateNavigator({ selectedDate, onDateChange, isParent }) {
  const today = new Date().toISOString().split("T")[0];
  const isToday = selectedDate === today;

  const selected = new Date(selectedDate + "T12:00:00");
  const isPast = selectedDate < today;

  function shift(days) {
    const d = new Date(selected);
    d.setDate(d.getDate() + days);
    onDateChange(d.toISOString().split("T")[0]);
  }

  const dayLabel = selected.toLocaleDateString("en-US", { weekday: "short" });
  const dateLabel = selected.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="sticky top-14 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-center h-10 px-2 gap-1">
        {/* Back arrow */}
        <button
          onClick={() => shift(-1)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-base text-muted-foreground hover:bg-gray-100 active:scale-90 transition-all shrink-0"
          aria-label="Previous day"
        >
          ‹
        </button>

        {/* Day + Date pill */}
        <button
          onClick={() => {
            const input = document.createElement("input");
            input.type = "date";
            input.value = selectedDate;
            input.max = today;
            input.style.cssText = "position:fixed;opacity:0;pointer-events:none";
            document.body.appendChild(input);
            input.addEventListener("change", (e) => {
              if (e.target.value) onDateChange(e.target.value);
              input.remove();
            });
            input.addEventListener("blur", () => input.remove());
            input.showPicker?.();
            input.focus();
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            isToday
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span className="font-bold">{isToday ? "Today" : dayLabel}</span>
          {!isToday && <span className="text-[10px] opacity-70">{dateLabel}</span>}
        </button>

        {/* Past-day badge */}
        {isPast && (
          <span className="text-[9px] text-orange-500 font-semibold tracking-wide uppercase">
            {isParent ? "edit" : "view"}
          </span>
        )}

        {/* Forward arrow */}
        <button
          onClick={() => shift(1)}
          disabled={selectedDate >= today}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-base transition-all shrink-0 ${
            selectedDate >= today
              ? "text-gray-200 cursor-not-allowed"
              : "text-muted-foreground hover:bg-gray-100 active:scale-90"
          }`}
          aria-label="Next day"
        >
          ›
        </button>

        {/* Today shortcut */}
        {!isToday && (
          <button
            onClick={() => onDateChange(today)}
            className="ml-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
          >
            Today
          </button>
        )}
      </div>
    </div>
  );
}
