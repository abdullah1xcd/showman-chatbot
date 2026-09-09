import { useEffect, useRef } from 'react';

export function useAutoResizeTextarea(value: string, maxHeight = 160) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate true scrollHeight
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${Math.max(newHeight, 44)}px`;
  }, [value, maxHeight]);

  return textareaRef;
}
