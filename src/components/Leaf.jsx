import React from "react";
import { motion } from "framer-motion";
import { MOODS } from "../utils/constants";

export function Leaf({ mood = "thoughtful", size = 18, grown = false }) {
  const color = MOODS[mood]?.color || MOODS.thoughtful.color;
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0.9 }}
      animate={{ scale: grown ? 1.15 : 1, rotate: grown ? 6 : 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="flex-shrink-0"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <path
          d="M3 12c4-6 10-7 14-7-1 6-4 10-8 12C7 18 4 14 3 12z"
          fill={color}
          fillOpacity="0.14"
        />
        <path
          d="M6 9.5c2-1 4.5-1.2 7-0.5"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </svg>
    </motion.div>
  );
}
