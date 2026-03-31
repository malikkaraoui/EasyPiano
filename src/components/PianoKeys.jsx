"use client";

// eslint-disable-next-line no-unused-vars -- motion.div used as JSX namespace
import { motion } from "framer-motion";

const WHITE_KEYS = 52;
const BLACK_KEY_PATTERN = [1, 1, 0, 1, 1, 1, 0]; // C#, D#, -, F#, G#, A#, -

// Touches blanches qui s'enfoncent (indices parmi 0-51)
const WHITE_ANIMATED = [4, 10, 17, 23, 28, 35, 41, 47];
// Touches noires qui s'enfoncent
const BLACK_ANIMATED = [3, 8, 14, 19, 25, 31, 38, 44];

function PianoKeys() {
  const keyWidth = 100 / WHITE_KEYS;

  return (
    <div
      className="relative h-12 w-full select-none overflow-hidden sm:h-14"
      aria-hidden="true"
    >
      {/* Touches blanches — face avant vue du bas */}
      <div className="absolute inset-0 flex justify-center">
        {Array.from({ length: WHITE_KEYS }).map((_, i) => {
          const shouldAnimate = WHITE_ANIMATED.includes(i);
          const delay = (i * 0.8) % 6;

          return (
            <motion.div
              key={`w-${i}`}
              className="relative h-full"
              style={{ width: `${keyWidth}%` }}
              animate={shouldAnimate ? { y: [0, 2, 0] } : {}}
              transition={
                shouldAnimate
                  ? {
                      duration: 0.25,
                      delay: delay + 0.5,
                      repeat: Infinity,
                      repeatDelay: 3 + delay * 0.4,
                      ease: "easeInOut",
                    }
                  : {}
              }
            >
              {/* Face avant de la touche */}
              <div className="absolute inset-x-px bottom-0 top-[30%] rounded-b-sm bg-gradient-to-b from-[#161616] to-[#111]" />
              {/* Surface du dessus */}
              <div className="absolute inset-x-px top-[22%] h-[8%] bg-gradient-to-b from-[#1a1a1a] to-[#161616]" />
              {/* Ligne sombre entre les touches */}
              <div className="absolute right-0 bottom-0 top-[22%] w-px bg-[#0a0a0a]" />
              {/* Léger reflet sur le bord gauche */}
              <div className="absolute left-px bottom-0 top-[30%] w-px bg-white/[0.03]" />
            </motion.div>
          );
        })}
      </div>

      {/* Touches noires — dépassent au-dessus */}
      <div className="absolute inset-0 flex justify-center">
        {Array.from({ length: WHITE_KEYS }).map((_, i) => {
          if (i >= WHITE_KEYS - 1) return null;
          if (!BLACK_KEY_PATTERN[i % 7]) return null;

          const shouldAnimate = BLACK_ANIMATED.includes(i);
          const delay = (i * 0.6) % 5;

          return (
            <motion.div
              key={`b-${i}`}
              className="absolute top-0 z-10"
              style={{
                left: `${(i + 0.62) * keyWidth}%`,
                width: `${keyWidth * 0.65}%`,
                height: "45%",
              }}
              animate={shouldAnimate ? { height: ["45%", "40%", "45%"] } : {}}
              transition={
                shouldAnimate
                  ? {
                      duration: 0.3,
                      delay,
                      repeat: Infinity,
                      repeatDelay: 2.5 + delay * 0.5,
                      ease: "easeInOut",
                    }
                  : {}
              }
            >
              <div className="absolute inset-x-0 bottom-0 top-[35%] rounded-b-sm bg-gradient-to-b from-[#0e0e0e] to-[#080808]" />
              <div className="absolute inset-x-0 top-[25%] h-[10%] bg-[#111]" />
              <div className="absolute inset-x-0 top-0 h-[25%] rounded-t-sm bg-gradient-to-b from-[#141414] to-[#111]" />
              <div className="absolute left-0 bottom-0 top-[25%] w-px bg-[#1a1a1a]" />
              <div className="absolute right-0 bottom-0 top-[25%] w-px bg-[#050505]" />
            </motion.div>
          );
        })}
      </div>

      {/* Barre sombre au-dessus du clavier */}
      <div className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]" />
    </div>
  );
}

export { PianoKeys };
