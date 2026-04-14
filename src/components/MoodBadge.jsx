import React from "react";
import { MOODS } from "../utils/constants";

export function MoodBadge({ mood }) {
  const moodConfig = MOODS[mood] || MOODS.thoughtful;
  return (
    <div className={`text-xs font-medium px-2 py-1 rounded-full ${moodConfig.textColor} ${moodConfig.bgColor}`}>
      {moodConfig.label}
    </div>
  );
}
