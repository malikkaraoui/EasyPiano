"use client";

// eslint-disable-next-line no-unused-vars -- motion.div used as JSX namespace
import { motion } from "framer-motion";

const WHITE_KEYS = 28;
const BLACK_KEY_PATTERN = [1, 1, 0, 1, 1, 1, 0]; // C#, D#, -, F#, G#, A#, -

function PianoKeys() {
  return (
    <div
      className="relative mx-auto h-24 w-full max-w-5xl select-none overflow-hidden sm:h-28"
      aria-hidden="true"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      {/* Touches blanches — vue de face, rectangles verticaux visibles */}
      <div className="absolute inset-0 flex justify-center">
        {Array.from({ length: WHITE_KEYS }).map((_, i) => (
          <div key={`w-${i}`} className="relative h-full w-[20px] sm:w-[26px]">
            {/* Corps de la touche blanche */}
            <div className="absolute inset-x-[1px] inset-y-0 rounded-b-[3px] bg-gradient-to-b from-[#2a2a2a] via-[#222] to-[#1a1a1a]" />
            {/* Reflet sur le bord gauche */}
            <div className="absolute left-[1px] top-0 h-full w-px bg-gradient-to-b from-white/[0.08] to-transparent" />
            {/* Ombre entre les touches */}
            <div className="absolute right-0 top-0 h-full w-px bg-black/40" />
            {/* Reflet bas de touche */}
            <div className="absolute inset-x-[2px] bottom-0 h-[3px] rounded-b-[2px] bg-gradient-to-t from-white/[0.06] to-transparent" />
          </div>
        ))}
      </div>

      {/* Touches noires — surélevées, plus courtes, plus sombres */}
      <div className="absolute inset-0 flex justify-center">
        {Array.from({ length: WHITE_KEYS }).map((_, i) => {
          if (i >= WHITE_KEYS - 1) return null;
          if (!BLACK_KEY_PATTERN[i % 7]) return null;

          const shouldAnimate = [2, 7, 11, 16, 22].includes(i);
          const delay = (i * 0.7) % 4;

          return (
            <motion.div
              key={`b-${i}`}
              className="absolute top-0 z-10 h-[58%] w-[13px] rounded-b-[2px] sm:w-[16px]"
              style={{
                left: `calc(50% + ${(i - WHITE_KEYS / 2 + 0.65) * 20}px)`,
              }}
              animate={
                shouldAnimate
                  ? {
                      height: ["58%", "52%", "58%"],
                    }
                  : {}
              }
              transition={
                shouldAnimate
                  ? {
                      duration: 0.35,
                      delay,
                      repeat: Infinity,
                      repeatDelay: 2.5 + delay,
                      ease: "easeInOut",
                    }
                  : {}
              }
            >
              {/* Corps touche noire */}
              <div className="h-full w-full rounded-b-[2px] bg-gradient-to-b from-[#111] via-[#0d0d0d] to-[#080808] shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
              {/* Reflet subtil sur le dessus */}
              <div className="absolute inset-x-[2px] top-0 h-px bg-white/[0.06]" />
              {/* Bords latéraux */}
              <div className="absolute left-0 top-0 h-full w-px bg-[#1a1a1a]" />
              <div className="absolute right-0 top-0 h-full w-px bg-black" />
            </motion.div>
          );
        })}
      </div>

      {/* Ligne de reflet en haut du clavier */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
  );
}

export { PianoKeys };
