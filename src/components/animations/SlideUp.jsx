"use client";

// eslint-disable-next-line no-unused-vars -- motion.div is used as JSX namespace
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function SlideUp({ children, className, delay = 0, duration = 0.5 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export { SlideUp };
