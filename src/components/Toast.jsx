import React from "react";
import { motion } from "framer-motion";

export function Toast({ text }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-emerald-800 text-white px-4 py-2 rounded-full text-sm shadow-lg"
    >
      {text}
    </motion.div>
  );
}
