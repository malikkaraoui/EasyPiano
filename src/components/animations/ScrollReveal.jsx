"use client";

// eslint-disable-next-line no-unused-vars -- motion.div is used as JSX namespace
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function ScrollReveal({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export { ScrollReveal };
