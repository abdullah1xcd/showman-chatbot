import { useState, useCallback, useRef } from 'react';
import { Message, ConversationState } from '../types';
import { sendMessage as sendAIMessage } from '../services/ai';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<ConversationState>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);

  const isTyping = state === 'typing';
  const isStreaming = state === 'streaming';
  const isLoading = isTyping || isStreaming;

  const sendMessage = useCallback(
    async (content: string, attachmentName?: string) => {
      const trimmed = content.trim();
      if (!trimmed && !attachmentName) return;
      if (isLoading) return;

      const displayContent = trimmed || `[تم إرفاق مستند: ${attachmentName}]`;

      // Create and append user message
      const userMessageId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const userMessage: Message = {
        id: userMessageId,
        role: 'user',
        content: displayContent,
        timestamp: new Date(),
        attachmentName: attachmentName
      };

      const updatedHistory = [...messages, userMessage];
      setMessages(updatedHistory);
      setState('typing');

      // Setup abort controller
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const aiMessageId = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      try {
        let hasStartedStreaming = false;

        const finalResult = await sendAIMessage(displayContent, updatedHistory, {
          signal: abortControllerRef.current.signal,
          attachmentName,
          onChunk: (accumulatedText) => {
            if (!hasStartedStreaming) {
              hasStartedStreaming = true;
              setState('streaming');

              // Create placeholder message
              setMessages((prev) => [
                ...prev,
                {
                  id: aiMessageId,
                  role: 'assistant',
                  content: accumulatedText,
                  timestamp: new Date(),
                  isStreaming: true
                }
              ]);
            } else {
              // Update stream
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? { ...msg, content: accumulatedText, isStreaming: true }
                    : msg
                )
              );
            }
          }
        });

        // Finalize message with actions
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content: finalResult.text,
                  actions: finalResult.actions,
                  isStreaming: false
                }
              : msg
          )
        );
        setState('completed');
      } catch {
        // In case of interruption or unexpected error
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: 'حدث خطأ غير متوقع أثناء معالجة الطلب. يرجى المحاولة مرة أخرى أو الاتصال بمكتب شومان مباشرة.',
            timestamp: new Date()
          }
        ]);
        setState('idle');
      }
    },
    [messages, isLoading]
  );

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setState('idle');
  }, []);

  return {
    messages,
    state,
    isTyping,
    isStreaming,
    isLoading,
    sendMessage,
    clearChat
  };
}
