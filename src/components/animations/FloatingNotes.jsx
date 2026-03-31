"use client";

// eslint-disable-next-line no-unused-vars -- motion.span used as JSX namespace
import { motion } from "framer-motion";

const notes = ["\u266A", "\u266B", "\u2669", "\u266C", "\u266D", "\u266E"];

function FloatingNotes() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {notes.map((note, i) => (
        <motion.span
          key={i}
          className="absolute select-none text-2xl text-accent/[0.07]"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.04, 0.08, 0.04],
          }}
          transition={{
            duration: 5 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        >
          {note}
        </motion.span>
      ))}
    </div>
  );
}

export { FloatingNotes };
