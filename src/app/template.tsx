"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      // Slide only: starting at opacity 0 hid every page until JavaScript loaded,
      // which delayed first paint (LCP) on phones.
      initial={{ y: 12 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex-grow pt-24"
    >
      {children}
    </motion.main>
  );
}
