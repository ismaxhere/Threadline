import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { makeId, calculateDepth } from "../utils/helpers";
import { validateThreadText, validateDepth, validateMood } from "../utils/validators";
import { STORAGE_KEYS, DEFAULT_WELCOME_THREAD } from "../utils/constants";

export function useThreads() {
  const [threads, setThreads] = useLocalStorage(STORAGE_KEYS.THREADS, [
    { id: makeId(), ...DEFAULT_WELCOME_THREAD },
  ]);

  const addThread = useCallback(
    (text, mood = "thoughtful") => {
      const validation = validateThreadText(text);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const validation_mood = validateMood(mood);
      if (!validation_mood.valid) {
        return { success: false, error: validation_mood.error };
      }

      setThreads((prev) => [
        ...prev,
        { id: makeId(), text: text.trim(), mood, replies: [] },
      ]);

      return { success: true };
    },
    [setThreads]
  );

  const addReply = useCallback(
    (targetId, replyText, mood = "thoughtful") => {
      const validation = validateThreadText(replyText);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const validation_mood = validateMood(mood);
      if (!validation_mood.valid) {
        return { success: false, error: validation_mood.error };
      }

      let depthValid = true;

      const nodeToAdd = { id: makeId(), text: replyText.trim(), mood, replies: [] };

      const addToTree = (node) => {
        if (node.id === targetId) {
          const newDepth = calculateDepth(node) + 1;
          const depthCheck = validateDepth(newDepth);
          if (!depthCheck.valid) {
            depthValid = false;
            return node;
          }
          return {
            ...node,
            replies: [...(node.replies || []), nodeToAdd],
          };
        }
        if (node.replies && node.replies.length) {
          return {
            ...node,
            replies: node.replies.map(addToTree),
          };
        }
        return node;
      };

      if (!depthValid) {
        return { success: false, error: "Maximum nesting depth reached" };
      }

      setThreads((prev) => prev.map(addToTree));
      return { success: true };
    },
    [setThreads]
  );

  const editThread = useCallback(
    (threadId, newText) => {
      const validation = validateThreadText(newText);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const editInTree = (node) => {
        if (node.id === threadId) {
          return { ...node, text: newText.trim() };
        }
        if (node.replies && node.replies.length) {
          return {
            ...node,
            replies: node.replies.map(editInTree),
          };
        }
        return node;
      };

      setThreads((prev) => prev.map(editInTree));
      return { success: true };
    },
    [setThreads]
  );

  const deleteThread = useCallback(
    (threadId) => {
      const deleteFromTree = (nodes) => {
        return nodes
          .filter((node) => node.id !== threadId)
          .map((node) => ({
            ...node,
            replies: node.replies ? deleteFromTree(node.replies) : [],
          }));
      };

      setThreads((prev) => deleteFromTree(prev));
      return { success: true };
    },
    [setThreads]
  );

  const clearAllThreads = useCallback(() => {
    setThreads([{ id: makeId(), ...DEFAULT_WELCOME_THREAD }]);
    return { success: true };
  }, [setThreads]);

  return {
    threads,
    setThreads,
    addThread,
    addReply,
    editThread,
    deleteThread,
    clearAllThreads,
  };
}
