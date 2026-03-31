"use client";

// eslint-disable-next-line no-unused-vars -- motion.div used as JSX namespace
import { motion } from "framer-motion";
import { FloatingNotes } from "./FloatingNotes";

function HeroReveal({ children }) {
  return (
    <div className="relative">
      <FloatingNotes />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function HeroSearchReveal({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      className="mt-16 flex flex-col items-center gap-2 text-muted"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      <motion.div
        className="flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M8 4v16M2 14l6 6 6-6" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function CursorGlow() {
  return null; // Placeholder — cursor glow requires useEffect, added later if needed
}

export { HeroReveal, HeroSearchReveal, ScrollIndicator, CursorGlow };
