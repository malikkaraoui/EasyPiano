"use client";

// eslint-disable-next-line no-unused-vars -- motion.div used as JSX namespace
import { motion, useReducedMotion, useTime, useTransform } from "framer-motion";

const WHITE_KEYS = 52;
const BLACK_KEY_PATTERN = [1, 1, 0, 1, 1, 1, 0]; // C#, D#, -, F#, G#, A#, -
const PIANO_SYNC_ORIGIN_MS = Date.now();
const PIANO_CYCLE_MS = 21_000;

const PHRASE_LIBRARY = [
  [
    { hand: "left", startMs: 0, durationMs: 1_620, whiteKeys: [6, 13] },
    {
      hand: "right",
      startMs: 140,
      durationMs: 1_280,
      whiteKeys: [30, 34],
      blackKeys: [31],
    },
    { hand: "left", startMs: 2_180, durationMs: 1_540, whiteKeys: [8, 15] },
    {
      hand: "right",
      startMs: 2_360,
      durationMs: 1_220,
      whiteKeys: [33, 37],
    },
    {
      hand: "right",
      startMs: 4_020,
      durationMs: 980,
      whiteKeys: [35, 39],
      blackKeys: [36],
    },
    {
      hand: "left",
      startMs: 5_260,
      durationMs: 1_580,
      whiteKeys: [10, 17],
      blackKeys: [11],
    },
    {
      hand: "right",
      startMs: 5_440,
      durationMs: 1_320,
      whiteKeys: [36, 40],
    },
    { hand: "left", startMs: 7_860, durationMs: 1_500, whiteKeys: [7, 14] },
    {
      hand: "right",
      startMs: 8_020,
      durationMs: 1_380,
      whiteKeys: [31, 35, 38],
    },
    {
      hand: "left",
      startMs: 10_520,
      durationMs: 1_620,
      whiteKeys: [9, 16],
      blackKeys: [8],
    },
    {
      hand: "right",
      startMs: 10_700,
      durationMs: 1_220,
      whiteKeys: [34, 37],
    },
    { hand: "left", startMs: 13_260, durationMs: 1_560, whiteKeys: [11, 18] },
    {
      hand: "right",
      startMs: 13_420,
      durationMs: 1_320,
      whiteKeys: [38, 42],
      blackKeys: [39],
    },
    { hand: "left", startMs: 16_000, durationMs: 1_620, whiteKeys: [5, 12] },
    {
      hand: "right",
      startMs: 16_180,
      durationMs: 1_420,
      whiteKeys: [30, 35, 39],
      blackKeys: [31],
    },
    {
      hand: "right",
      startMs: 18_860,
      durationMs: 980,
      whiteKeys: [33, 37],
      blackKeys: [34],
    },
  ],
  [
    { hand: "left", startMs: 0, durationMs: 1_640, whiteKeys: [4, 11] },
    {
      hand: "right",
      startMs: 180,
      durationMs: 1_260,
      whiteKeys: [29, 33],
      blackKeys: [31],
    },
    {
      hand: "left",
      startMs: 2_420,
      durationMs: 1_520,
      whiteKeys: [7, 14],
      blackKeys: [6],
    },
    {
      hand: "right",
      startMs: 2_600,
      durationMs: 1_180,
      whiteKeys: [32, 36],
    },
    {
      hand: "right",
      startMs: 4_360,
      durationMs: 1_060,
      whiteKeys: [34, 37, 41],
      blackKeys: [36],
    },
    { hand: "left", startMs: 6_020, durationMs: 1_560, whiteKeys: [9, 16] },
    {
      hand: "right",
      startMs: 6_200,
      durationMs: 1_280,
      whiteKeys: [35, 39],
    },
    { hand: "left", startMs: 8_720, durationMs: 1_540, whiteKeys: [6, 13] },
    {
      hand: "right",
      startMs: 8_900,
      durationMs: 1_380,
      whiteKeys: [30, 34, 37],
    },
    {
      hand: "left",
      startMs: 11_320,
      durationMs: 1_620,
      whiteKeys: [8, 15],
      blackKeys: [8],
    },
    {
      hand: "right",
      startMs: 11_500,
      durationMs: 1_220,
      whiteKeys: [33, 36],
      blackKeys: [34],
    },
    {
      hand: "right",
      startMs: 13_980,
      durationMs: 980,
      whiteKeys: [37, 41],
      blackKeys: [39],
    },
    { hand: "left", startMs: 14_860, durationMs: 1_580, whiteKeys: [10, 17] },
    {
      hand: "right",
      startMs: 15_040,
      durationMs: 1_300,
      whiteKeys: [36, 40],
    },
    { hand: "left", startMs: 17_640, durationMs: 1_620, whiteKeys: [5, 12] },
    {
      hand: "right",
      startMs: 17_820,
      durationMs: 1_420,
      whiteKeys: [29, 33, 36],
      blackKeys: [31],
    },
  ],
  [
    { hand: "left", startMs: 0, durationMs: 1_620, whiteKeys: [5, 12] },
    {
      hand: "right",
      startMs: 160,
      durationMs: 1_220,
      whiteKeys: [31, 35],
    },
    {
      hand: "right",
      startMs: 1_960,
      durationMs: 1_020,
      whiteKeys: [34, 38],
      blackKeys: [36],
    },
    { hand: "left", startMs: 2_560, durationMs: 1_540, whiteKeys: [8, 15] },
    {
      hand: "right",
      startMs: 2_760,
      durationMs: 1_360,
      whiteKeys: [33, 37, 40],
    },
    {
      hand: "left",
      startMs: 5_340,
      durationMs: 1_560,
      whiteKeys: [10, 17],
      blackKeys: [11],
    },
    {
      hand: "right",
      startMs: 5_520,
      durationMs: 1_240,
      whiteKeys: [36, 39],
    },
    { hand: "left", startMs: 7_820, durationMs: 1_500, whiteKeys: [6, 13] },
    {
      hand: "right",
      startMs: 8_000,
      durationMs: 1_280,
      whiteKeys: [30, 34],
      blackKeys: [31],
    },
    {
      hand: "right",
      startMs: 10_360,
      durationMs: 1_120,
      whiteKeys: [35, 39, 42],
      blackKeys: [36],
    },
    { hand: "left", startMs: 11_140, durationMs: 1_600, whiteKeys: [9, 16] },
    {
      hand: "right",
      startMs: 11_320,
      durationMs: 1_200,
      whiteKeys: [34, 37],
    },
    {
      hand: "left",
      startMs: 14_040,
      durationMs: 1_560,
      whiteKeys: [7, 14],
      blackKeys: [8],
    },
    {
      hand: "right",
      startMs: 14_220,
      durationMs: 1_340,
      whiteKeys: [32, 36, 39],
    },
    { hand: "left", startMs: 16_980, durationMs: 1_580, whiteKeys: [11, 18] },
    {
      hand: "right",
      startMs: 17_160,
      durationMs: 1_300,
      whiteKeys: [37, 41],
      blackKeys: [39],
    },
    {
      hand: "right",
      startMs: 19_520,
      durationMs: 980,
      whiteKeys: [34, 38],
    },
  ],
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(value) {
  return 1 - (1 - value) ** 3;
}

function easeInOutSine(value) {
  return -(Math.cos(Math.PI * value) - 1) / 2;
}

function getDeterministicNoise(seed) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43_758.5453;

  return value - Math.floor(value);
}

function getPressEnvelope(progress, attackRatio = 0.26) {
  const safeProgress = clamp(progress, 0, 1);

  if (safeProgress <= 0 || safeProgress >= 1) {
    return 0;
  }

  if (safeProgress < attackRatio) {
    return easeOutCubic(safeProgress / attackRatio);
  }

  return 1 - easeInOutSine((safeProgress - attackRatio) / (1 - attackRatio));
}

function getPhraseIndex(cycleIndex) {
  const noise = getDeterministicNoise(cycleIndex + 1);

  return Math.floor(noise * PHRASE_LIBRARY.length) % PHRASE_LIBRARY.length;
}

function getCycleTime(globalTimeMs) {
  return ((globalTimeMs % PIANO_CYCLE_MS) + PIANO_CYCLE_MS) % PIANO_CYCLE_MS;
}

function getCurrentPhrase(globalTimeMs) {
  const cycleIndex = Math.floor(globalTimeMs / PIANO_CYCLE_MS);

  return PHRASE_LIBRARY[getPhraseIndex(cycleIndex)];
}

function getKeyAccent(event, index, isBlackKey) {
  const seed =
    event.startMs +
    index * 29 +
    (isBlackKey ? 17 : 0) +
    (event.hand === "left" ? 7 : 13);
  const handBase = event.hand === "left" ? 0.92 : 0.88;

  return handBase + getDeterministicNoise(seed) * 0.16;
}

function getKeyLagMs(event, index, isBlackKey) {
  const spread = event.hand === "left" ? 74 : 58;
  const seed = event.startMs * 0.01 + index * 0.37 + (isBlackKey ? 0.19 : 0);

  return getDeterministicNoise(seed) * spread;
}

function isKeyInEvent(event, index, isBlackKey) {
  const keys = isBlackKey ? (event.blackKeys ?? []) : (event.whiteKeys ?? []);

  return keys.includes(index);
}

function getEventKeyStrength(cycleTimeMs, event, index, isBlackKey) {
  if (!isKeyInEvent(event, index, isBlackKey)) {
    return 0;
  }

  const lagMs = getKeyLagMs(event, index, isBlackKey);
  const phase = cycleTimeMs - event.startMs - lagMs;

  if (phase <= 0 || phase >= event.durationMs) {
    return 0;
  }

  const attackRatio = event.hand === "left" ? 0.3 : 0.24;

  return (
    getPressEnvelope(phase / event.durationMs, attackRatio) *
    getKeyAccent(event, index, isBlackKey)
  );
}

function getKeyPressStrength(globalTimeMs, index, isBlackKey) {
  const cycleTimeMs = getCycleTime(globalTimeMs);
  const phrase = getCurrentPhrase(globalTimeMs);

  return phrase.reduce(
    (maxStrength, event) =>
      Math.max(
        maxStrength,
        getEventKeyStrength(cycleTimeMs, event, index, isBlackKey),
      ),
    0,
  );
}

function getPressedKeysAtTime(globalTimeMs, threshold = 0.12) {
  const cycleTimeMs = getCycleTime(globalTimeMs);
  const phrase = getCurrentPhrase(globalTimeMs);
  const pressedWhiteKeys = new Set();
  const pressedBlackKeys = new Set();
  let leftHandCount = 0;
  let rightHandCount = 0;

  phrase.forEach((event) => {
    const whiteCount = (event.whiteKeys ?? []).filter(
      (index) =>
        getEventKeyStrength(cycleTimeMs, event, index, false) > threshold,
    ).length;
    const blackCount = (event.blackKeys ?? []).filter(
      (index) =>
        getEventKeyStrength(cycleTimeMs, event, index, true) > threshold,
    ).length;

    (event.whiteKeys ?? []).forEach((index) => {
      if (getEventKeyStrength(cycleTimeMs, event, index, false) > threshold) {
        pressedWhiteKeys.add(index);
      }
    });

    (event.blackKeys ?? []).forEach((index) => {
      if (getEventKeyStrength(cycleTimeMs, event, index, true) > threshold) {
        pressedBlackKeys.add(index);
      }
    });

    if (event.hand === "left") {
      leftHandCount += whiteCount + blackCount;
    } else {
      rightHandCount += whiteCount + blackCount;
    }
  });

  return {
    leftHandCount,
    rightHandCount,
    pressedWhiteKeys: Array.from(pressedWhiteKeys),
    pressedBlackKeys: Array.from(pressedBlackKeys),
  };
}

function getWhiteMotionConfig(index) {
  return {
    travelY: 8 + (index % 5) * 1.2,
    opacityDrop: 0.12 + (index % 4) * 0.03,
  };
}

function getBlackMotionConfig(index) {
  return {
    heightDrop: 6 + (index % 3) * 1.5,
    opacityDrop: 0.15 + (index % 2) * 0.04,
  };
}

function WhiteKey({ index, keyWidth, shouldReduceMotion, time }) {
  const config = getWhiteMotionConfig(index);

  const y = useTransform(time, (latest) => {
    if (shouldReduceMotion) {
      return 0;
    }

    return getKeyPressStrength(latest, index, false) * config.travelY;
  });

  const opacity = useTransform(time, (latest) => {
    if (shouldReduceMotion) {
      return 1;
    }

    return 1 - getKeyPressStrength(latest, index, false) * config.opacityDrop;
  });

  return (
    <motion.div
      className="relative h-full"
      style={{ width: `${keyWidth}%`, y, opacity }}
    >
      {/* Face avant de la touche */}
      <div className="absolute inset-x-px bottom-0 top-[30%] rounded-b-sm bg-linear-to-b from-[#161616] to-[#111]" />
      {/* Surface du dessus */}
      <div className="absolute inset-x-px top-[22%] h-[8%] bg-linear-to-b from-[#1a1a1a] to-[#161616]" />
      {/* Ligne sombre entre les touches */}
      <div className="absolute right-0 bottom-0 top-[22%] w-px bg-[#0a0a0a]" />
      {/* Léger reflet sur le bord gauche */}
      <div className="absolute left-px bottom-0 top-[30%] w-px bg-white/3" />
    </motion.div>
  );
}

function BlackKey({ index, keyWidth, shouldReduceMotion, time }) {
  const config = getBlackMotionConfig(index);

  const y = useTransform(time, (latest) => {
    if (shouldReduceMotion) {
      return 0;
    }

    return getKeyPressStrength(latest, index, true) * config.heightDrop;
  });

  const opacity = useTransform(time, (latest) => {
    if (shouldReduceMotion) {
      return 1;
    }

    return 1 - getKeyPressStrength(latest, index, true) * config.opacityDrop;
  });

  return (
    <motion.div
      className="absolute top-0 z-10"
      style={{
        left: `${(index + 0.62) * keyWidth}%`,
        width: `${keyWidth * 0.65}%`,
        height: "45%",
        y,
        opacity,
      }}
    >
      <div className="absolute inset-x-0 bottom-0 top-[35%] rounded-b-sm bg-linear-to-b from-[#0e0e0e] to-[#080808]" />
      <div className="absolute inset-x-0 top-[25%] h-[10%] bg-[#111]" />
      <div className="absolute inset-x-0 top-0 h-[25%] rounded-t-sm bg-linear-to-b from-[#141414] to-[#111]" />
      <div className="absolute left-0 bottom-0 top-[25%] w-px bg-[#1a1a1a]" />
      <div className="absolute right-0 bottom-0 top-[25%] w-px bg-[#050505]" />
    </motion.div>
  );
}

function PianoKeys() {
  const keyWidth = 100 / WHITE_KEYS;
  const shouldReduceMotion = useReducedMotion();
  const time = useTime();
  const globalTime = useTransform(
    time,
    () => Date.now() - PIANO_SYNC_ORIGIN_MS,
  );

  return (
    <div
      className="relative h-16 w-full select-none overflow-hidden sm:h-20"
      aria-hidden="true"
    >
      {/* Touches blanches — face avant vue du bas */}
      <div className="absolute inset-0 flex justify-center">
        {Array.from({ length: WHITE_KEYS }).map((_, i) => (
          <WhiteKey
            key={`w-${i}`}
            index={i}
            keyWidth={keyWidth}
            shouldReduceMotion={shouldReduceMotion}
            time={globalTime}
          />
        ))}
      </div>

      {/* Touches noires — dépassent au-dessus */}
      <div className="absolute inset-0 flex justify-center">
        {Array.from({ length: WHITE_KEYS }).map((_, i) => {
          if (i >= WHITE_KEYS - 1) return null;
          if (!BLACK_KEY_PATTERN[i % 7]) return null;

          return (
            <BlackKey
              key={`b-${i}`}
              index={i}
              keyWidth={keyWidth}
              shouldReduceMotion={shouldReduceMotion}
              time={globalTime}
            />
          );
        })}
      </div>

      {/* Barre sombre au-dessus du clavier */}
      <div className="absolute inset-x-0 top-0 h-[18%] bg-linear-to-b from-[#0a0a0a] to-[#0f0f0f]" />
    </div>
  );
}

const __pianoMotion = {
  getPhraseIndex,
  getPressedKeysAtTime,
  getKeyPressStrength,
  PIANO_CYCLE_MS,
};

export { PianoKeys, __pianoMotion };
