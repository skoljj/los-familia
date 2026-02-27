"use client";

import { useState } from "react";
import { formatTimeRange, minutesToDisplay } from "@/lib/time-utils";
import TaskCard from "./TaskCard";

/* ═══════════════════════════════════════════════════════════════
   DESIGN SYSTEM
   ─────────────
   Each card has 4 visual states:   collapsed-portrait
                                     collapsed-landscape
                                     expanded-portrait
                                     expanded-landscape

   Every scene has 3 depth layers:   L1 sky / base gradient
                                     L2 midground SVG terrain + atmospheric effects
                                     L3 foreground props, characters, animated accents

   Collapsed = scene fills card, content centered, no tasks.
   Expanded  = scene is hero area; tasks appear below (portrait)
               or right (landscape ≥768px).

   Aspect ratios adapt:  portrait   → 5:4  collapsed, 4:3 expanded
                          landscape  → 16:9 collapsed, hero is 40% width expanded
   ═══════════════════════════════════════════════════════════════ */

/* ── Shared sub-components ─────────────────────────────────── */

function StatusPill({ block, hasTasks, completedCount, taskCount }) {
  const isNow = block.phase === "now";
  const isPast = block.phase === "past";
  const isNext = block.phase === "next";
  const isReview = block.phase === "review";

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Countdown timer — large enough to read from across the room */}
      {isNow && block.remainingMinutes != null && (
        <div className="bg-black/25 backdrop-blur-lg rounded-2xl px-6 py-3 md:px-8 md:py-4 lg:px-10 lg:py-5 border border-white/15 shadow-2xl">
          <p className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white tabular-nums tracking-tight leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
            {minutesToDisplay(block.remainingMinutes)}
          </p>
          <p className="text-[10px] md:text-xs lg:text-sm text-white/50 uppercase tracking-[0.2em] text-center mt-1">
            remaining
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap justify-center">
        {hasTasks && (
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/15 text-white tabular-nums">
            {completedCount} / {taskCount}
          </span>
        )}
        {isPast && (
          <span className="text-[11px] px-3 py-1 rounded-full bg-white/15 text-white/80 backdrop-blur-sm">
            Complete ✓
          </span>
        )}
        {isReview && hasTasks && (
          <span className="text-[11px] px-3 py-1 rounded-full bg-white/15 text-white/80 backdrop-blur-sm">
            {completedCount === taskCount ? "All done ✓" : `${completedCount} of ${taskCount}`}
          </span>
        )}
        {isNext && (
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-400/30 border border-amber-200/30 text-white backdrop-blur-sm animate-pulse">
            Up Next
          </span>
        )}
      </div>
    </div>
  );
}

function YotoMilestone({ prereqTasks, label }) {
  const list = prereqTasks || [];
  if (list.length === 0) return null;
  const allDone = list.every(
    (t) => t.status === "done" || t.status === "accepted"
  );
  if (allDone) {
    return (
      <div className="flex items-center gap-2 bg-green-500/25 border border-green-300/30 rounded-full px-4 py-1.5 mt-3 backdrop-blur-md shadow-lg animate-bounce-gentle">
        <span className="text-base">🎧</span>
        <span className="text-xs font-bold text-white tracking-wide">Yoto Unlocked!</span>
      </div>
    );
  }
  const remaining = list.filter(
    (t) => t.status !== "done" && t.status !== "accepted"
  ).length;
  return (
    <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-full px-4 py-1.5 mt-3 backdrop-blur-md">
      <span className="text-base opacity-40">🎧</span>
      <span className="text-[11px] text-white/60">{label} — {remaining} left</span>
    </div>
  );
}

/* ── Scene Components ──────────────────────────────────────── */

function WakeUpScene() {
  return (
    <>
      {/* L1: Dawn sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-amber-300 to-yellow-100" />

      {/* L1b: Sun glow */}
      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[60%] aspect-square rounded-full bg-yellow-200/50 blur-[60px]" />

      {/* L2: Rolling hills */}
      <svg className="absolute bottom-0 w-full h-[40%]" viewBox="0 0 800 200" preserveAspectRatio="none">
        <path d="M0,120 Q100,40 200,90 Q350,160 500,80 Q650,10 800,70 L800,200 L0,200Z" fill="#92400e" opacity="0.12" />
        <path d="M0,150 Q150,80 300,130 Q450,170 600,110 Q700,70 800,100 L800,200 L0,200Z" fill="#92400e" opacity="0.08" />
        <path d="M0,170 Q200,140 400,160 Q600,180 800,150 L800,200 L0,200Z" fill="#78350f" opacity="0.06" />
      </svg>

      {/* L2b: Rising sun disc */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-t from-orange-300 to-yellow-200 opacity-60 shadow-[0_0_60px_rgba(251,191,36,0.4)]" />

      {/* L3: Clouds & bird */}
      <div className="absolute top-[8%] left-[6%] text-3xl md:text-2xl animate-float-slow opacity-80">☁️</div>
      <div className="absolute top-[14%] right-[8%] text-xl md:text-lg animate-float-slower opacity-60">☁️</div>
      <div className="absolute top-[6%] right-[22%] text-sm animate-float-slow opacity-40">🐦</div>
      <div className="absolute top-[18%] left-[30%] text-xs animate-float-slower opacity-30">🐦</div>
    </>
  );
}

function BreakfastScene() {
  return (
    <>
      {/* L1: Warm kitchen light */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-amber-200 to-yellow-50" />

      {/* L1b: Window light */}
      <div className="absolute top-[5%] right-[5%] w-[30%] aspect-square rounded-2xl bg-yellow-100/40 blur-[40px]" />

      {/* L2: Table surface */}
      <svg className="absolute bottom-0 w-full h-[28%]" viewBox="0 0 800 120" preserveAspectRatio="none">
        <rect x="0" y="20" width="800" height="100" fill="#92400e" opacity="0.08" rx="0" />
        <line x1="0" y1="20" x2="800" y2="20" stroke="#92400e" strokeWidth="2" opacity="0.12" />
      </svg>

      {/* L2b: Window frame */}
      <svg className="absolute top-[5%] right-[8%] w-[18%] md:w-[14%]" viewBox="0 0 80 90">
        <rect x="5" y="5" width="70" height="80" rx="4" fill="none" stroke="#92400e" strokeWidth="3" opacity="0.15" />
        <line x1="40" y1="5" x2="40" y2="85" stroke="#92400e" strokeWidth="2" opacity="0.1" />
        <line x1="5" y1="45" x2="75" y2="45" stroke="#92400e" strokeWidth="2" opacity="0.1" />
        <rect x="8" y="8" width="29" height="34" rx="2" fill="#fef3c7" opacity="0.3" />
        <rect x="43" y="8" width="29" height="34" rx="2" fill="#fef3c7" opacity="0.3" />
      </svg>

      {/* L3: Food & steam */}
      <div className="absolute bottom-[12%] left-[12%] text-4xl md:text-3xl">🥞</div>
      <div className="absolute bottom-[12%] right-[12%] text-4xl md:text-3xl">🧃</div>
      <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2 text-3xl md:text-2xl">🍳</div>
      <div className="absolute bottom-[32%] left-[16%] text-lg animate-float-slow opacity-50">♨️</div>
      <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 text-sm animate-float-slower opacity-40">♨️</div>
    </>
  );
}

function TransitionToSchoolScene() {
  return (
    <>
      {/* L1: Morning sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-cyan-100" />

      {/* L2: Road + horizon */}
      <svg className="absolute bottom-0 w-full h-[35%]" viewBox="0 0 800 180" preserveAspectRatio="none">
        <rect x="0" y="0" width="800" height="180" fill="#e5e7eb" opacity="0.3" />
        <path d="M350,0 L300,180 L500,180 L450,0 Z" fill="#6b7280" opacity="0.25" />
        <line x1="400" y1="0" x2="400" y2="180" stroke="#fbbf24" strokeWidth="3" strokeDasharray="20,18" opacity="0.6" />
        <rect x="0" y="0" width="800" height="5" fill="#9ca3af" opacity="0.15" />
      </svg>

      {/* L2b: Houses on horizon */}
      <svg className="absolute bottom-[22%] left-[5%] w-[25%] md:w-[18%]" viewBox="0 0 100 50" opacity="0.15">
        <rect x="10" y="20" width="25" height="30" rx="2" fill="#475569" />
        <polygon points="22,8 5,25 40,25" fill="#475569" />
        <rect x="50" y="15" width="30" height="35" rx="2" fill="#475569" />
        <polygon points="65,5 45,20 85,20" fill="#475569" />
      </svg>

      {/* L3: Car + clock + clouds */}
      <div className="absolute bottom-[8%] right-[8%] text-5xl md:text-4xl drop-shadow-lg">🚗</div>
      <div className="absolute top-[6%] left-[8%] text-3xl md:text-2xl animate-float-slow opacity-80">☁️</div>
      <div className="absolute top-[12%] right-[10%] text-xl animate-float-slower opacity-50">☁️</div>
      <div className="absolute top-[5%] left-[38%] text-3xl md:text-2xl animate-bounce-gentle">⏰</div>
    </>
  );
}

function SchoolScene() {
  return (
    <>
      {/* L1: Blue sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-sky-300 to-blue-100" />

      {/* L2: Ground */}
      <svg className="absolute bottom-0 w-full h-[8%]" viewBox="0 0 800 30" preserveAspectRatio="none">
        <rect x="0" y="0" width="800" height="30" fill="#166534" opacity="0.1" />
      </svg>

      {/* L2: School building - detailed */}
      <svg className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[70%] md:w-[55%]" viewBox="0 0 300 150">
        {/* Main building */}
        <rect x="40" y="50" width="220" height="100" rx="3" fill="#1e3a5f" opacity="0.75" />
        {/* Roof */}
        <polygon points="150,10 20,55 280,55" fill="#1e3a5f" opacity="0.85" />
        {/* Bell tower */}
        <rect x="135" y="20" width="30" height="30" fill="#1e3a5f" opacity="0.9" />
        <polygon points="150,8 130,25 170,25" fill="#1e3a5f" opacity="0.95" />
        <circle cx="150" cy="32" r="5" fill="#fbbf24" opacity="0.6" />
        {/* Door */}
        <rect x="133" y="95" width="34" height="55" rx="17" fill="#92400e" opacity="0.4" />
        {/* Windows row 1 */}
        <rect x="60" y="70" width="22" height="18" rx="2" fill="#7dd3fc" opacity="0.5" />
        <rect x="95" y="70" width="22" height="18" rx="2" fill="#7dd3fc" opacity="0.5" />
        <rect x="183" y="70" width="22" height="18" rx="2" fill="#7dd3fc" opacity="0.5" />
        <rect x="218" y="70" width="22" height="18" rx="2" fill="#7dd3fc" opacity="0.5" />
        {/* Windows row 2 */}
        <rect x="60" y="100" width="22" height="18" rx="2" fill="#7dd3fc" opacity="0.35" />
        <rect x="95" y="100" width="22" height="18" rx="2" fill="#7dd3fc" opacity="0.35" />
        <rect x="183" y="100" width="22" height="18" rx="2" fill="#7dd3fc" opacity="0.35" />
        <rect x="218" y="100" width="22" height="18" rx="2" fill="#7dd3fc" opacity="0.35" />
        {/* Flag */}
        <line x1="265" y1="30" x2="265" y2="55" stroke="#475569" strokeWidth="2" opacity="0.4" />
        <rect x="267" y="30" width="18" height="12" rx="1" fill="#ef4444" opacity="0.4" />
      </svg>

      {/* L3: Clouds, birds, flag */}
      <div className="absolute top-[6%] left-[6%] text-2xl md:text-xl animate-float-slow opacity-70">☁️</div>
      <div className="absolute top-[10%] right-[8%] text-3xl md:text-2xl animate-float-slower opacity-60">☁️</div>
      <div className="absolute top-[4%] right-[28%] text-sm animate-float-slow opacity-35">🐦</div>
      <div className="absolute top-[8%] left-[35%] text-xs animate-float-slower opacity-25">🐦</div>
    </>
  );
}

function TransitionFromSchoolScene() {
  return (
    <>
      {/* L1: Sunset party sky */}
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500 via-pink-400 to-amber-300" />

      {/* L1b: Radial burst */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square rounded-full bg-yellow-200/20 blur-[80px]" />

      {/* L2: Confetti SVG ribbons */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
        {[
          "M50,0 Q60,100 40,200 Q30,300 60,400", "M120,0 Q130,80 110,180 Q100,280 130,380",
          "M200,0 Q190,90 210,190 Q220,290 190,400", "M280,0 Q270,110 290,200 Q300,300 270,400",
          "M350,0 Q340,70 360,170 Q370,270 340,380",
        ].map((d, i) => (
          <path key={i} d={d} fill="none" stroke={["#fbbf24","#f472b6","#a78bfa","#34d399","#60a5fa"][i]} strokeWidth="3" opacity="0.3" strokeDasharray="8,12" />
        ))}
      </svg>

      {/* L3: Flying emoji */}
      {["🎊","🍿","🎵","⭐","🎶","🥳","🍎","🎧","🎉","🌟","🎪","🎈"].map((e, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${4 + (i * 37) % 88}%`,
            top: `${8 + (i * 29) % 65}%`,
            animationDelay: `${i * 0.18}s`,
            fontSize: 16 + (i % 4) * 6,
          }}
        >
          {e}
        </div>
      ))}

      {/* L3: "Freedom" banner */}
      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2">
        <div className="bg-white/20 backdrop-blur-md rounded-full px-5 py-1.5 border border-white/20">
          <span className="text-sm font-black tracking-[0.2em] uppercase text-white drop-shadow-lg">Freedom!</span>
        </div>
      </div>
    </>
  );
}

function AcademicsScene() {
  return (
    <>
      {/* L1: Library green */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-600 via-emerald-400 to-cyan-200" />

      {/* L1b: Warm lamp glow */}
      <div className="absolute top-[8%] right-[15%] w-24 h-24 rounded-full bg-amber-200/25 blur-[40px]" />

      {/* L2: Desk */}
      <svg className="absolute bottom-0 w-full h-[30%]" viewBox="0 0 800 150" preserveAspectRatio="none">
        <rect x="0" y="10" width="800" height="140" fill="#134e4a" opacity="0.15" />
        <line x1="0" y1="10" x2="800" y2="10" stroke="#134e4a" strokeWidth="3" opacity="0.2" />
      </svg>

      {/* L2: Bookshelf */}
      <svg className="absolute bottom-[15%] left-[5%] w-[22%] md:w-[16%]" viewBox="0 0 80 100" opacity="0.4">
        <rect x="5" y="5" width="70" height="90" rx="3" fill="none" stroke="#134e4a" strokeWidth="3" />
        <line x1="5" y1="35" x2="75" y2="35" stroke="#134e4a" strokeWidth="2" />
        <line x1="5" y1="65" x2="75" y2="65" stroke="#134e4a" strokeWidth="2" />
        <rect x="12" y="10" width="8" height="22" rx="1" fill="#ef4444" opacity="0.5" />
        <rect x="23" y="12" width="7" height="20" rx="1" fill="#3b82f6" opacity="0.5" />
        <rect x="33" y="9" width="9" height="23" rx="1" fill="#22c55e" opacity="0.5" />
        <rect x="45" y="11" width="7" height="21" rx="1" fill="#eab308" opacity="0.5" />
        <rect x="12" y="40" width="10" height="22" rx="1" fill="#8b5cf6" opacity="0.5" />
        <rect x="25" y="42" width="8" height="20" rx="1" fill="#f97316" opacity="0.5" />
      </svg>

      {/* L3: Props */}
      <div className="absolute bottom-[8%] right-[10%] text-4xl md:text-3xl">✏️</div>
      <div className="absolute bottom-[8%] left-[35%] text-4xl md:text-3xl">📚</div>
      <div className="absolute top-[8%] right-[12%] text-2xl animate-float-slow opacity-80">💡</div>
      <div className="absolute top-[12%] left-[14%] text-xl animate-float-slower opacity-60">🔢</div>
      <div className="absolute top-[20%] left-[45%] text-sm animate-float-slow opacity-35">📐</div>
    </>
  );
}

function SnackScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-lime-400 via-green-300 to-emerald-100" />
      <div className="absolute top-[5%] right-[10%] w-20 h-20 rounded-full bg-yellow-200/40 blur-[30px]" />
      <svg className="absolute bottom-0 w-full h-[20%]" viewBox="0 0 800 80" preserveAspectRatio="none">
        <rect x="0" y="10" width="800" height="70" fill="#166534" opacity="0.06" />
      </svg>
      <div className="absolute bottom-[10%] left-[15%] text-4xl md:text-3xl">🍎</div>
      <div className="absolute bottom-[10%] right-[15%] text-4xl md:text-3xl">🧃</div>
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-3xl md:text-2xl">🍪</div>
      <div className="absolute top-[10%] left-[20%] text-xl animate-float-slow opacity-50">🌿</div>
    </>
  );
}

function PickUpScene() {
  return (
    <>
      {/* L1: Warm pink */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-400 via-rose-300 to-pink-100" />

      {/* L1b: Heart glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-pink-200/40 blur-[50px]" />

      {/* L2: Path */}
      <svg className="absolute bottom-0 w-full h-[15%]" viewBox="0 0 800 60" preserveAspectRatio="none">
        <path d="M0,30 Q200,10 400,25 Q600,40 800,20 L800,60 L0,60Z" fill="#9f1239" opacity="0.06" />
      </svg>

      {/* L3: Hearts */}
      {["💕","💗","💖","💝","🌸","🌷"].map((e, i) => (
        <div
          key={i}
          className="absolute animate-float-slow"
          style={{
            left: `${8 + (i * 17) % 80}%`,
            top: `${12 + (i * 23) % 50}%`,
            animationDelay: `${i * 0.5}s`,
            fontSize: 18 + (i % 3) * 8,
            opacity: 0.5 + (i % 3) * 0.15,
          }}
        >
          {e}
        </div>
      ))}
    </>
  );
}

function PutAwayScene() {
  return (
    <>
      {/* L1: Mudroom tones */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-400 via-stone-300 to-gray-100" />

      {/* L2: House interior wall + hooks */}
      <svg className="absolute bottom-0 w-full h-[45%]" viewBox="0 0 800 200" preserveAspectRatio="none">
        <rect x="0" y="0" width="800" height="200" fill="#78716c" opacity="0.06" />
        <line x1="0" y1="0" x2="800" y2="0" stroke="#78716c" strokeWidth="3" opacity="0.12" />
        {/* Hooks */}
        <circle cx="200" cy="25" r="5" fill="#78716c" opacity="0.2" />
        <circle cx="400" cy="25" r="5" fill="#78716c" opacity="0.2" />
        <circle cx="600" cy="25" r="5" fill="#78716c" opacity="0.2" />
        {/* Shelf */}
        <rect x="100" y="90" width="600" height="6" rx="3" fill="#78716c" opacity="0.12" />
      </svg>

      {/* L3: Items */}
      <div className="absolute bottom-[22%] left-[18%] text-4xl md:text-3xl">🎒</div>
      <div className="absolute bottom-[22%] right-[18%] text-4xl md:text-3xl">👟</div>
      <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 text-3xl md:text-2xl">🧥</div>
      <div className="absolute top-[10%] right-[15%] text-xl animate-float-slow opacity-50">✨</div>
    </>
  );
}

function ScreenTimeScene() {
  return (
    <>
      {/* L1: Digital twilight */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-500 to-indigo-400" />

      {/* L1b: Screen glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50%] aspect-square rounded-full bg-cyan-300/15 blur-[60px]" />

      {/* L2: Floating orbs */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float-slower"
          style={{
            width: 8 + i * 6,
            height: 8 + i * 6,
            left: `${5 + (i * 21) % 85}%`,
            top: `${10 + (i * 19) % 60}%`,
            animationDelay: `${i * 0.4}s`,
            background: `radial-gradient(circle, ${
              ["rgba(168,85,247,0.3)","rgba(59,130,246,0.3)","rgba(236,72,153,0.3)"][i % 3]
            }, transparent)`,
          }}
        />
      ))}

      {/* L2: Screen frame */}
      <svg className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[40%] md:w-[30%]" viewBox="0 0 120 80" opacity="0.3">
        <rect x="5" y="5" width="110" height="65" rx="6" fill="#1e1b4b" />
        <rect x="10" y="10" width="100" height="55" rx="4" fill="#312e81" />
        <rect x="45" y="72" width="30" height="4" rx="2" fill="#1e1b4b" />
      </svg>

      {/* L3: Props */}
      <div className="absolute bottom-[18%] left-[10%] text-4xl md:text-3xl drop-shadow-lg">🎮</div>
      <div className="absolute bottom-[18%] right-[10%] text-4xl md:text-3xl drop-shadow-lg">📱</div>
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 text-xl animate-float-slow opacity-60">✨</div>
    </>
  );
}

function PhysicalFunScene() {
  return (
    <>
      {/* L1: Bright outdoor green */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-green-300 to-lime-200" />

      {/* L1b: Sun */}
      <div className="absolute top-[4%] right-[8%] w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-300 opacity-70 shadow-[0_0_50px_rgba(250,204,21,0.4)]" />

      {/* L2: Ground with grass and path */}
      <svg className="absolute bottom-0 w-full h-[35%]" viewBox="0 0 800 180" preserveAspectRatio="none">
        <path d="M0,60 Q200,20 400,50 Q600,80 800,40 L800,180 L0,180Z" fill="#166534" opacity="0.15" />
        <path d="M0,90 Q150,60 350,80 Q550,100 800,70 L800,180 L0,180Z" fill="#15803d" opacity="0.1" />
        <path d="M300,100 Q400,85 500,95 L480,180 L320,180Z" fill="#a3a3a3" opacity="0.08" />
      </svg>

      {/* L2: Trees */}
      <svg className="absolute bottom-[15%] left-[4%] w-[12%] md:w-[8%]" viewBox="0 0 50 80">
        <rect x="22" y="50" width="6" height="30" fill="#92400e" opacity="0.3" />
        <circle cx="25" cy="35" r="20" fill="#166534" opacity="0.25" />
        <circle cx="18" cy="42" r="14" fill="#15803d" opacity="0.2" />
      </svg>
      <svg className="absolute bottom-[13%] right-[5%] w-[10%] md:w-[7%]" viewBox="0 0 50 80">
        <rect x="22" y="50" width="6" height="30" fill="#92400e" opacity="0.3" />
        <circle cx="25" cy="32" r="22" fill="#166534" opacity="0.2" />
      </svg>

      {/* L3: Sports props */}
      <div className="absolute bottom-[20%] left-[25%] text-3xl md:text-2xl animate-bounce-gentle">⚾</div>
      <div className="absolute bottom-[18%] right-[22%] text-3xl md:text-2xl animate-float-slow">🚴</div>
      <div className="absolute top-[15%] left-[15%] text-xl animate-float-slower opacity-60">🏃</div>
    </>
  );
}

function DailyChoreScene() {
  return (
    <>
      {/* L1: Energetic amber */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-400 via-yellow-300 to-orange-100" />

      {/* L1b: Sparkle zone */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-white/20 blur-[50px]" />

      {/* L2: Floor */}
      <svg className="absolute bottom-0 w-full h-[15%]" viewBox="0 0 800 60" preserveAspectRatio="none">
        <rect x="0" y="0" width="800" height="60" fill="#92400e" opacity="0.06" />
        <line x1="0" y1="0" x2="800" y2="0" stroke="#92400e" strokeWidth="2" opacity="0.1" />
      </svg>

      {/* L3: Hero + tools */}
      <div className="absolute bottom-[8%] left-[18%] text-4xl md:text-3xl">🧹</div>
      <div className="absolute bottom-[8%] right-[18%] text-4xl md:text-3xl">🧽</div>
      <div className="absolute top-[6%] left-1/2 -translate-x-1/2 text-5xl md:text-4xl">🦸</div>
      <div className="absolute top-[5%] right-[22%] text-2xl animate-bounce-gentle">💪</div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-float-slow text-lg"
          style={{
            left: `${10 + (i * 33) % 80}%`,
            top: `${25 + (i * 17) % 35}%`,
            animationDelay: `${i * 0.3}s`,
            opacity: 0.4,
          }}
        >
          ✨
        </div>
      ))}
    </>
  );
}

function KidsChoiceScene() {
  return (
    <>
      {/* L1: Rainbow gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-violet-400 to-cyan-300" />

      {/* L2: Rainbow arcs */}
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none" opacity="0.15">
        <path d="M-50,400 Q200,-50 450,400" fill="none" stroke="#ef4444" strokeWidth="8" />
        <path d="M-30,400 Q200,-20 430,400" fill="none" stroke="#f97316" strokeWidth="8" />
        <path d="M-10,400 Q200,10 410,400" fill="none" stroke="#eab308" strokeWidth="8" />
        <path d="M10,400 Q200,40 390,400" fill="none" stroke="#22c55e" strokeWidth="8" />
        <path d="M30,400 Q200,70 370,400" fill="none" stroke="#3b82f6" strokeWidth="8" />
        <path d="M50,400 Q200,100 350,400" fill="none" stroke="#8b5cf6" strokeWidth="8" />
      </svg>

      {/* L2b: Grass */}
      <svg className="absolute bottom-0 w-full h-[18%]" viewBox="0 0 800 80" preserveAspectRatio="none">
        <path d="M0,30 Q200,10 400,25 Q600,40 800,20 L800,80 L0,80Z" fill="#166534" opacity="0.1" />
      </svg>

      {/* L3: Activity options scattered */}
      {["📖","🌳","🎲","🧩","⚾","🎨","🚲","🎭","🪁"].map((e, i) => (
        <div
          key={i}
          className="absolute animate-float-slow"
          style={{
            left: `${6 + (i * 23) % 84}%`,
            top: `${15 + (i * 19) % 50}%`,
            animationDelay: `${i * 0.35}s`,
            fontSize: 22 + (i % 3) * 6,
            opacity: 0.7,
          }}
        >
          {e}
        </div>
      ))}

      <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2">
        <div className="bg-white/20 backdrop-blur-md rounded-full px-5 py-1.5 border border-white/20">
          <span className="text-sm font-black tracking-[0.15em] uppercase text-white drop-shadow-lg">Your Choice!</span>
        </div>
      </div>
    </>
  );
}

function DinnerScene() {
  return (
    <>
      {/* L1: Warm candlelit evening */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500 via-amber-400 to-orange-200" />

      {/* L1b: Candlelight glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-amber-200/30 blur-[50px]" />

      {/* L2: Table */}
      <svg className="absolute bottom-0 w-full h-[30%]" viewBox="0 0 800 150" preserveAspectRatio="none">
        <ellipse cx="400" cy="40" rx="350" ry="25" fill="#92400e" opacity="0.12" />
        <rect x="50" y="40" width="700" height="110" fill="#92400e" opacity="0.08" />
      </svg>

      {/* L2b: Candles */}
      <svg className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[10%]" viewBox="0 0 30 50">
        <rect x="12" y="20" width="6" height="25" rx="2" fill="#fef3c7" opacity="0.6" />
        <ellipse cx="15" cy="18" rx="4" ry="6" fill="#fbbf24" opacity="0.7" />
        <ellipse cx="15" cy="15" rx="2" ry="3" fill="#fff" opacity="0.5" />
      </svg>

      {/* L3: Food & family */}
      <div className="absolute bottom-[15%] left-[10%] text-4xl md:text-3xl">🥗</div>
      <div className="absolute bottom-[15%] right-[10%] text-4xl md:text-3xl">🍝</div>
      <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 text-3xl md:text-2xl">🥤</div>
      <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 text-sm text-white/50">👨‍👩‍👧‍👦</div>
      <div className="absolute top-[6%] left-[12%] text-xl animate-float-slow opacity-60">🕯️</div>
      <div className="absolute top-[8%] right-[14%] text-lg animate-float-slower opacity-50">♨️</div>
    </>
  );
}

function NightHygieneScene() {
  return (
    <>
      {/* L1: Spa waters */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500 via-sky-400 to-blue-200" />

      {/* L1b: Steam glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-48 h-32 rounded-full bg-white/15 blur-[40px]" />

      {/* L2: Tub */}
      <svg className="absolute bottom-0 w-full h-[35%]" viewBox="0 0 800 160" preserveAspectRatio="none">
        <ellipse cx="400" cy="30" rx="320" ry="30" fill="#e0f2fe" opacity="0.3" />
        <path d="M80,30 Q80,140 400,140 Q720,140 720,30 Z" fill="#bae6fd" opacity="0.2" />
        <path d="M120,30 Q120,120 400,120 Q680,120 680,30 Z" fill="#7dd3fc" opacity="0.15" />
      </svg>

      {/* L2b: Bubbles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border animate-bubble-up"
          style={{
            width: 8 + (i % 5) * 7,
            height: 8 + (i % 5) * 7,
            left: `${6 + (i * 19) % 86}%`,
            bottom: -5,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${2 + (i % 4) * 0.5}s`,
            borderColor: "rgba(186,230,253,0.4)",
            background: "rgba(186,230,253,0.1)",
          }}
        />
      ))}

      {/* L3: Props */}
      <div className="absolute top-[6%] right-[10%] text-3xl animate-float-slow">🫧</div>
      <div className="absolute top-[10%] left-[8%] text-2xl animate-float-slower opacity-70">✨</div>
      <div className="absolute bottom-[20%] left-[12%] text-4xl md:text-3xl">🧼</div>
      <div className="absolute bottom-[20%] right-[12%] text-4xl md:text-3xl">🪥</div>
      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-3xl md:text-2xl">🛁</div>
    </>
  );
}

function NightTransitionScene() {
  return (
    <>
      {/* L1: Deep evening */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-800 via-purple-600 to-violet-400" />

      {/* L2: Moon + stars */}
      <div className="absolute top-[6%] right-[10%]">
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          <div className="absolute inset-0 rounded-full bg-amber-100 shadow-[0_0_40px_rgba(251,191,36,0.3)]" />
          <div className="absolute top-0.5 right-0 w-[80%] h-[80%] rounded-full bg-indigo-800/80" />
        </div>
      </div>

      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle-star"
          style={{
            width: i % 4 === 0 ? 4 : 2,
            height: i % 4 === 0 ? 4 : 2,
            top: `${4 + (i * 11) % 50}%`,
            left: `${3 + (i * 17) % 90}%`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      {/* L2: Bedroom floor */}
      <svg className="absolute bottom-0 w-full h-[18%]" viewBox="0 0 800 70" preserveAspectRatio="none">
        <rect x="0" y="0" width="800" height="70" fill="#312e81" opacity="0.15" />
      </svg>

      {/* L3: Clothes */}
      <div className="absolute bottom-[10%] left-[18%] text-4xl md:text-3xl">👕</div>
      <div className="absolute bottom-[10%] right-[18%] text-4xl md:text-3xl">👖</div>
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-3xl md:text-2xl">🌙</div>
    </>
  );
}

function BedtimeStoryScene() {
  return (
    <>
      {/* L1: Warm lamplight */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-700 via-orange-500 to-yellow-300" />

      {/* L1b: Lamp glow */}
      <div className="absolute top-[3%] right-[8%] w-36 h-36 rounded-full bg-amber-200/35 blur-[50px]" />

      {/* L2: Bed headboard */}
      <svg className="absolute bottom-0 w-full h-[30%]" viewBox="0 0 800 140" preserveAspectRatio="none">
        <rect x="100" y="0" width="600" height="140" rx="12" fill="#92400e" opacity="0.12" />
        <rect x="120" y="40" width="560" height="100" rx="8" fill="#fef3c7" opacity="0.1" />
      </svg>

      {/* L2: Lamp */}
      <svg className="absolute top-[8%] right-[10%] w-[8%] md:w-[6%]" viewBox="0 0 30 60">
        <rect x="13" y="30" width="4" height="25" rx="1" fill="#92400e" opacity="0.3" />
        <path d="M5,30 Q15,10 25,30 Z" fill="#fbbf24" opacity="0.5" />
        <ellipse cx="15" cy="20" rx="6" ry="4" fill="#fff" opacity="0.3" />
      </svg>

      {/* L3: Books + sparkles */}
      <div className="absolute bottom-[15%] left-[10%] text-4xl md:text-3xl">📚</div>
      <div className="absolute bottom-[15%] right-[10%] text-4xl md:text-3xl">📖</div>
      <div className="absolute top-[18%] left-[10%] text-xl animate-float-slow opacity-70">✨</div>
      <div className="absolute top-[25%] left-[25%] text-sm animate-float-slower opacity-40">🌟</div>
      <div className="absolute top-[15%] left-[45%] text-lg animate-float-slow opacity-50">💫</div>
    </>
  );
}

function StayInBedScene() {
  return (
    <>
      {/* L1: Deep night */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-800" />

      {/* Stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle-star"
          style={{
            width: i % 4 === 0 ? 3 : 2,
            height: i % 4 === 0 ? 3 : 2,
            top: `${5 + (i * 13) % 55}%`,
            left: `${3 + (i * 19) % 92}%`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Moon */}
      <div className="absolute top-[8%] left-[12%]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full bg-amber-100/60 shadow-[0_0_30px_rgba(251,191,36,0.2)]" />
          <div className="absolute top-0.5 right-0 w-[80%] h-[80%] rounded-full bg-slate-900/80" />
        </div>
      </div>

      {/* Sleeping child */}
      <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 text-5xl md:text-4xl">😴</div>
      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-xs text-indigo-300/50 tracking-widest">z z z z z</div>

      {/* Blanket / bed */}
      <svg className="absolute bottom-0 w-full h-[25%]" viewBox="0 0 800 100" preserveAspectRatio="none">
        <path d="M0,40 Q200,10 400,30 Q600,50 800,25 L800,100 L0,100Z" fill="#312e81" opacity="0.3" />
      </svg>
    </>
  );
}

const SCENE_MAP = {
  "Wake Up Routine": WakeUpScene,
  Breakfast: BreakfastScene,
  "Transition to School": TransitionToSchoolScene,
  School: SchoolScene,
  "Transition From School": TransitionFromSchoolScene,
  Academics: AcademicsScene,
  Snack: SnackScene,
  "Pick up Isla": PickUpScene,
  "Transition / Put Things Away": PutAwayScene,
  "Screen Time": ScreenTimeScene,
  "Physical Fun": PhysicalFunScene,
  "Daily Chores": DailyChoreScene,
  "Kids Choice": KidsChoiceScene,
  Dinner: DinnerScene,
  "Night Hygiene": NightHygieneScene,
  "Night Transition": NightTransitionScene,
  "Bedtime Story": BedtimeStoryScene,
  "Stay in bed all night": StayInBedScene,
  "Independent success": StayInBedScene,
};

/* ═══════════════════════════════════════════════════════════════
   MAIN CARD COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function ImmersiveBlockCard({
  block,
  tasks,
  yotoPrereqs,
  isParent,
  onMarkDone,
  onUndo,
  onAccept,
  onUnaccept,
  onPicklistSelect,
  defaultExpanded = false,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasTasks = tasks && tasks.length > 0;
  const timeRange = formatTimeRange(block.start_time, block.end_time);
  const completedCount =
    tasks?.filter((t) => t.status === "done" || t.status === "accepted")
      .length || 0;

  const isPast = block.phase === "past";
  const isNow = block.phase === "now";
  const isNext = block.phase === "next";
  const isReview = block.phase === "review";

  const SceneComponent = SCENE_MAP[block.label];

  /* ── Scene hero ──────────────────────────────────────────── */
  function HeroContent({ className = "" }) {
    return (
      <button
        onClick={() => hasTasks && setExpanded(!expanded)}
        className={`relative w-full overflow-hidden text-left ${
          hasTasks ? "cursor-pointer active:brightness-95" : "cursor-default"
        } transition-all ${className}`}
      >
        {/* L1–L3 scene */}
        {SceneComponent ? <SceneComponent /> : (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-400 to-gray-200" />
        )}

        {/* Content overlay - always centered */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full py-10 px-6">
          <div className="text-[72px] md:text-[60px] lg:text-[68px] leading-none mb-2 drop-shadow-lg filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
            {block.emoji || "📅"}
          </div>

          <h3 className="text-2xl md:text-xl lg:text-2xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] leading-tight tracking-tight">
            {block.label}
          </h3>

          <p className="text-sm md:text-xs lg:text-sm text-white/70 mt-1 drop-shadow font-medium">
            {timeRange}
          </p>

          {block.description && (
            <p className="text-xs text-white/50 italic mt-2 max-w-[240px] leading-relaxed drop-shadow-sm">
              {block.description}
            </p>
          )}

          {yotoPrereqs && (
            <YotoMilestone
              prereqTasks={yotoPrereqs}
              label={block.label === "Breakfast" ? "Finish wake-up by 7:00" : "All done by 7:35"}
            />
          )}

          <div className="mt-3">
            <StatusPill
              block={block}
              hasTasks={hasTasks}
              completedCount={completedCount}
              taskCount={tasks?.length || 0}
            />
          </div>

          {hasTasks && (
            <div className={`mt-3 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
              <svg width="20" height="12" viewBox="0 0 20 12" className="text-white/40">
                <path d="M2 2 L10 10 L18 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
          )}
        </div>
      </button>
    );
  }

  /* ── Task list ───────────────────────────────────────────── */
  function TaskList({ className = "" }) {
    if (!expanded || !hasTasks) return null;
    return (
      <div className={`bg-white/95 backdrop-blur-sm space-y-1.5 ${className}`}>
        {tasks.map((task, i) => (
          <TaskCard
            key={task.id}
            task={task}
            index={i}
            isParent={isParent}
            onMarkDone={onMarkDone}
            onUndo={onUndo}
            onAccept={onAccept}
            onUnaccept={onUnaccept}
            onPicklistSelect={onPicklistSelect}
          />
        ))}
      </div>
    );
  }

  /* ── Phase ring styles ───────────────────────────────────── */
  const phaseRing = isPast
    ? "opacity-40"
    : isReview
      ? "shadow-md opacity-90"
      : isNow
        ? "ring-3 ring-blue-400/80 shadow-2xl shadow-blue-200/40"
        : isNext
          ? "ring-1 ring-amber-300/60 shadow-lg shadow-amber-100/20"
          : "shadow-md";

  return (
    <div className={`rounded-3xl overflow-hidden transition-all duration-300 ${phaseRing}`}>

      {/* ─── PORTRAIT (< 768px) ───────────────────────────── */}
      <div className="md:hidden">
        <HeroContent className={expanded && hasTasks ? "min-h-[180px]" : "min-h-[220px]"} />
        <TaskList className="p-3" />
      </div>

      {/* ─── LANDSCAPE (≥ 768px) ──────────────────────────── */}
      <div className="hidden md:block">
        {!expanded || !hasTasks ? (
          <>
            <HeroContent className="min-h-[160px] lg:min-h-[180px]" />
            {expanded && !hasTasks && block.block_type !== "passive" && (
              <div className="bg-white/90 p-3 text-center">
                <p className="text-xs text-muted-foreground italic">No tasks — free block</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex min-h-[200px] lg:min-h-[240px]">
            <div className="w-[42%] shrink-0">
              <HeroContent className="h-full min-h-0" />
            </div>
            <div className="w-[58%] bg-white/95 backdrop-blur-sm p-2.5 space-y-1 overflow-y-auto max-h-[420px]">
              {tasks.map((task, i) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={i}
                  isParent={isParent}
                  onMarkDone={onMarkDone}
                  onUndo={onUndo}
                  onAccept={onAccept}
                  onUnaccept={onUnaccept}
                  onPicklistSelect={onPicklistSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
