import React from "react";
import { MOODS } from "../utils/constants";

export function MoodPicker({ value, onChange }) {
  const options = Object.values(MOODS);
  return (
    <div className="flex items-center gap-1 bg-emerald-50/50 dark:bg-gray-700/50 rounded-lg p-1">
      {options.map((mood) => (
        <button
          key={mood.key}
          onClick={() => onChange(mood.key)}
          className={`p-2 rounded-md text-sm transition-all ${
            value === mood.key 
              ? "ring-2 ring-emerald-400 bg-white dark:bg-gray-600 shadow-lg scale-110" 
              : "hover:bg-white/50 dark:hover:bg-gray-600/50 hover:scale-105"
          }`}
          title={mood.label}
        >
          <span aria-hidden role="img">
            {mood.emoji}
          </span>
        </button>
      ))}
    </div>
  );
}
