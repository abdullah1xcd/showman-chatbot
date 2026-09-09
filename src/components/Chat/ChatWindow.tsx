import React, { useEffect, useRef } from 'react';
import { Message } from '../../types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  onOpenBooking?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isTyping, onOpenBooking }) => {
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    bottomAnchorRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isTyping]);

  return (
    <div
      id="chat-window-container"
      className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 space-y-2 overflow-y-auto"
      role="log"
      aria-live="polite"
      aria-label="سجل المحادثة القانونية"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} onOpenBooking={onOpenBooking} />
      ))}

      {isTyping && (
        <div className="flex w-full items-start gap-3 my-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-[#0c2233] border border-[#cfa23b]/50 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#cfa23b] animate-ping" />
          </div>
          <TypingIndicator />
        </div>
      )}

      <div ref={bottomAnchorRef} className="h-4" aria-hidden="true" />
    </div>
  );
};
