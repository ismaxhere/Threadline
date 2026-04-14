import { MAX_THREAD_LENGTH, MAX_DEPTH } from "./constants";

// Validate thread text
export function validateThreadText(text) {
  if (!text || !text.trim()) {
    return { valid: false, error: "Thread cannot be empty" };
  }
  if (text.length > MAX_THREAD_LENGTH) {
    return { valid: false, error: `Thread is too long (max ${MAX_THREAD_LENGTH} characters)` };
  }
  return { valid: true };
}

// Validate depth
export function validateDepth(currentDepth) {
  if (currentDepth >= MAX_DEPTH) {
    return { valid: false, error: `Maximum nesting depth (${MAX_DEPTH}) reached` };
  }
  return { valid: true };
}

// Validate mood
export function validateMood(mood) {
  const validMoods = ["calm", "happy", "thoughtful"];
  if (!validMoods.includes(mood)) {
    return { valid: false, error: "Invalid mood" };
  }
  return { valid: true };
}
