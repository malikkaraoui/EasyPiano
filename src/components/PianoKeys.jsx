"use client";

// eslint-disable-next-line no-unused-vars -- motion.div used as JSX namespace
import { motion } from "framer-motion";

const WHITE_KEYS = 28;
const BLACK_KEY_PATTERN = [1, 1, 0, 1, 1, 1, 0]; // C#, D#, -, F#, G#, A#, -

function PianoKeys() {
  const blackKeys = [];
  for (let i = 0; i < WHITE_KEYS - 1; i++) {
    if (BLACK_KEY_PATTERN[i % 7]) {
      blackKeys.push(i);
    }
  }

  return (
    <div
      className="relative mx-auto flex h-16 w-full max-w-5xl select-none justify-center overflow-hidden"
      aria-hidden="true"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      {/* Touches blanches */}
      <div className="flex h-full">
        {Array.from({ length: WHITE_KEYS }).map((_, i) => (
          <div
            key={`w-${i}`}
            className="h-full w-[22px] border-x border-foreground/[0.04] bg-gradient-to-b from-foreground/[0.06] to-foreground/[0.02] sm:w-[28px]"
          />
        ))}
      </div>

      {/* Touches noires avec animation d'enfoncement */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: WHITE_KEYS - 1 }).map((_, i) => {
          if (!BLACK_KEY_PATTERN[i % 7]) return null;

          const shouldAnimate = [2, 7, 11, 16, 22].includes(i);
          const delay = (i * 0.7) % 4;

          return (
            <motion.div
              key={`b-${i}`}
              className="absolute top-0 h-[60%] w-[14px] rounded-b-sm bg-gradient-to-b from-[#1a1a1a] via-[#111] to-[#0a0a0a] shadow-md sm:w-[18px]"
              style={{
                left: `calc(${((i + 0.65) / WHITE_KEYS) * 100}%)`,
              }}
              animate={
                shouldAnimate
                  ? {
                      height: ["60%", "55%", "60%"],
                      opacity: [1, 0.85, 1],
                    }
                  : {}
              }
              transition={
                shouldAnimate
                  ? {
                      duration: 0.4,
                      delay,
                      repeat: Infinity,
                      repeatDelay: 3 + delay,
                      ease: "easeInOut",
                    }
                  : {}
              }
            />
          );
        })}
      </div>

      {/* Reflet subtil sur le dessus */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
    </div>
  );
}

export { PianoKeys };
