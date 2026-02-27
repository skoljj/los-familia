"use client";

import { minutesToDisplay } from "@/lib/time-utils";

export default function LightsOutCard({ block }) {
  const isNow = block.phase === "now";
  const isPast = block.phase === "past";

  return (
    <div className="md:max-w-md md:mx-auto lg:max-w-lg">
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{ aspectRatio: "var(--lights-out-ratio, 9 / 16)" }}
      >
        <style>{`
          @media (min-width: 768px) {
            :root { --lights-out-ratio: 3 / 4; }
          }
          @media (min-width: 1024px) {
            :root { --lights-out-ratio: 4 / 3; }
          }
        `}</style>

        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900" />

        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: i % 3 === 0 ? 4 : 2,
                height: i % 3 === 0 ? 4 : 2,
                top: `${5 + (i * 37) % 55}%`,
                left: `${3 + (i * 53) % 94}%`,
                opacity: 0.3 + (i % 5) * 0.15,
                animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${(i * 0.4) % 3}s`,
              }}
            />
          ))}
        </div>

        {/* Moon */}
        <div className="absolute top-[8%] right-[12%]">
          <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
            <div className="absolute inset-0 rounded-full bg-amber-100 shadow-[0_0_40px_rgba(251,191,36,0.3)]" />
            <div className="absolute top-0.5 right-0 w-[83%] h-[83%] rounded-full bg-indigo-950/80" />
          </div>
        </div>

        {/* Hills */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%]">
          <svg viewBox="0 0 400 120" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
            <path d="M0,80 Q60,30 120,65 Q180,100 240,55 Q300,20 360,60 Q390,75 400,70 L400,120 L0,120 Z" fill="#1a1f3a" />
            <path d="M0,95 Q80,60 160,85 Q240,110 320,75 Q370,55 400,80 L400,120 L0,120 Z" fill="#151933" />
          </svg>
        </div>

        {/* House */}
        <div className="absolute bottom-[22%] left-[18%]">
          <div className="relative">
            <div className="w-8 h-6 bg-slate-700 rounded-sm" />
            <div
              className="absolute -top-3 left-[-2px] w-0 h-0"
              style={{
                borderLeft: "18px solid transparent",
                borderRight: "18px solid transparent",
                borderBottom: "14px solid #475569",
              }}
            />
            <div className="absolute bottom-1 left-2.5 w-3 h-3 bg-amber-300/60 rounded-sm" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 md:px-8 text-center">
          <div className="text-[60px] md:text-[70px] lg:text-[80px] leading-none mb-3 md:mb-4 drop-shadow-lg">
            😴
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1.5 md:mb-2 tracking-wide">
            Lights Out
          </h2>

          <p className="text-indigo-200 text-sm md:text-base mb-4 md:mb-6 leading-relaxed max-w-[220px]">
            Cozy in bed, lights off, sound machine on
          </p>

          {/* Sound machine */}
          <div className="flex items-center gap-1.5 mb-4 md:mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-indigo-400/60"
                style={{
                  height: 8 + Math.sin(i * 1.2) * 10 + 10,
                  animation: `soundWave ${1.5 + i * 0.2}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
            <span className="text-indigo-300 text-sm ml-2">♪ zzz</span>
          </div>

          {isNow && block.remainingMinutes != null && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/10">
              <p className="text-xl md:text-2xl font-bold text-white tabular-nums">
                {minutesToDisplay(block.remainingMinutes)}
              </p>
              <p className="text-[10px] text-indigo-300 uppercase tracking-widest">
                until dreamtime
              </p>
            </div>
          )}

          {isPast && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
              <p className="text-base md:text-lg text-indigo-200">Sweet dreams ✨</p>
            </div>
          )}

          <p className="absolute bottom-[6%] md:bottom-[8%] text-base md:text-lg text-indigo-300/80 font-medium">
            Goodnight! 💜
          </p>
        </div>
      </div>
    </div>
  );
}
