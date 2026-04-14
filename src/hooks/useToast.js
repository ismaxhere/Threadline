import { useState, useCallback } from "react";
import { TOAST_DURATION } from "../utils/constants";

export function useToast() {
  const [toast, setToast] = useState(null);

  const flashToast = useCallback((text, duration = TOAST_DURATION) => {
    setToast(text);
    const timer = setTimeout(() => setToast(null), duration);
    return () => clearTimeout(timer);
  }, []);

  return { toast, flashToast };
}
