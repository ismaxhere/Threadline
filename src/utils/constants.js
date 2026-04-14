// Mood configurations
export const MOODS = {
  calm: {
    key: "calm",
    label: "Calm",
    emoji: "🌿",
    textColor: "text-emerald-600/90",
    bgColor: "bg-emerald-50",
    color: "#0f766e",
  },
  happy: {
    key: "happy",
    label: "Happy",
    emoji: "☀️",
    textColor: "text-amber-600/90",
    bgColor: "bg-amber-50",
    color: "#b45309",
  },
  thoughtful: {
    key: "thoughtful",
    label: "Thoughtful",
    emoji: "💭",
    textColor: "text-sky-600/90",
    bgColor: "bg-sky-50",
    color: "#0369a1",
  },
};

// Toast duration in milliseconds
export const TOAST_DURATION = 1600;

// Max characters for thread/reply
export const MAX_THREAD_LENGTH = 500;

// Max nesting depth
export const MAX_DEPTH = 8;

// Storage keys
export const STORAGE_KEYS = {
  THREADS: "threadline_threads",
  THEME: "threadline_theme",
};

// Default initial thread
export const DEFAULT_WELCOME_THREAD = {
  text: "Welcome to Threadline 🌿",
  mood: "calm",
  replies: [],
};

// Theme options
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};
