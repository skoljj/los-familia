"use client";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
];

export default function FamilyMemberPicker({
  members,
  selectedId,
  onSelect,
  showRole = false,
}) {
  function getInitials(name) {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="flex gap-3 flex-wrap">
      {members.map((m, i) => {
        const active = selectedId === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              active
                ? "ring-2 ring-primary bg-accent scale-105"
                : "hover:bg-accent/50"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-sm`}
            >
              {getInitials(m.name)}
            </div>
            <span className="text-xs font-medium">{m.name}</span>
            {showRole && (
              <span className="text-[10px] text-muted-foreground capitalize">
                {m.role}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
