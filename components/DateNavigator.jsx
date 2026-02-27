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

  const displayLabel = isToday
    ? "Today"
    : selected.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => shift(-1)}
        className="w-10 h-10 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:bg-gray-100 active:scale-90 transition-all"
        aria-label="Previous day"
      >
        ‹
      </button>

      <button
        onClick={() => {
          const input = document.createElement("input");
          input.type = "date";
          input.value = selectedDate;
          input.max = today;
          input.style.position = "fixed";
          input.style.opacity = "0";
          document.body.appendChild(input);
          input.addEventListener("change", (e) => {
            if (e.target.value) onDateChange(e.target.value);
            input.remove();
          });
          input.addEventListener("blur", () => input.remove());
          input.showPicker?.();
          input.focus();
        }}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
          isToday
            ? "bg-blue-500 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {displayLabel}
      </button>

      {isPast && (
        <span className="text-[10px] text-orange-500 font-medium">
          {isParent ? "Editing" : "View only"}
        </span>
      )}

      <button
        onClick={() => shift(1)}
        disabled={selectedDate >= today}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
          selectedDate >= today
            ? "text-gray-200 cursor-not-allowed"
            : "text-muted-foreground hover:bg-gray-100 active:scale-90"
        }`}
        aria-label="Next day"
      >
        ›
      </button>

      {!isToday && (
        <button
          onClick={() => onDateChange(today)}
          className="ml-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
        >
          Today
        </button>
      )}
    </div>
  );
}
