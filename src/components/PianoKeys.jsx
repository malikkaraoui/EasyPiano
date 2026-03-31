"use client";

// eslint-disable-next-line no-unused-vars -- motion.div used as JSX namespace
import { motion } from "framer-motion";

const WHITE_KEYS = 52;
const BLACK_KEY_PATTERN = [1, 1, 0, 1, 1, 1, 0]; // C#, D#, -, F#, G#, A#, -

function PianoKeys() {
  return (
    <div
      className="relative h-20 w-full select-none overflow-hidden sm:h-24"
      aria-hidden="true"
    >
      {/* Touches blanches — face avant vue du bas */}
      <div className="absolute inset-0 flex justify-center">
        {Array.from({ length: WHITE_KEYS }).map((_, i) => (
          <div
            key={`w-${i}`}
            className="relative h-full"
            style={{ width: `${100 / WHITE_KEYS}%` }}
          >
            {/* Face avant de la touche (le gros rectangle visible) */}
            <div className="absolute inset-x-px bottom-0 top-[30%] rounded-b-sm bg-gradient-to-b from-[#1e1e1e] to-[#151515]" />
            {/* Surface du dessus (la partie plate, en perspective = fine bande) */}
            <div className="absolute inset-x-px top-[22%] h-[8%] bg-gradient-to-b from-[#252525] to-[#1e1e1e]" />
            {/* Ligne sombre entre les touches */}
            <div className="absolute right-0 bottom-0 top-[22%] w-px bg-[#0a0a0a]" />
            {/* Léger reflet sur le bord gauche */}
            <div className="absolute left-px bottom-0 top-[30%] w-px bg-white/[0.03]" />
          </div>
        ))}
      </div>

      {/* Touches noires — dépassent au-dessus */}
      <div className="absolute inset-0 flex justify-center">
        {Array.from({ length: WHITE_KEYS }).map((_, i) => {
          if (i >= WHITE_KEYS - 1) return null;
          if (!BLACK_KEY_PATTERN[i % 7]) return null;

          const shouldAnimate = [3, 8, 14, 19, 25, 31, 38, 44].includes(i);
          const delay = (i * 0.6) % 5;
          const keyWidth = 100 / WHITE_KEYS;

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
              {/* Face avant touche noire */}
              <div className="absolute inset-x-0 bottom-0 top-[35%] rounded-b-sm bg-gradient-to-b from-[#0e0e0e] to-[#080808]" />
              {/* Surface du dessus */}
              <div className="absolute inset-x-0 top-[25%] h-[10%] bg-[#111]" />
              {/* Sommet arrondi */}
              <div className="absolute inset-x-0 top-0 h-[25%] rounded-t-sm bg-gradient-to-b from-[#141414] to-[#111]" />
              {/* Reflets latéraux */}
              <div className="absolute left-0 bottom-0 top-[25%] w-px bg-[#1a1a1a]" />
              <div className="absolute right-0 bottom-0 top-[25%] w-px bg-[#050505]" />
            </motion.div>
          );
        })}
      </div>

      {/* Barre sombre au-dessus du clavier (corps du piano) */}
      <div className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]" />
    </div>
  );
}

export { PianoKeys };
