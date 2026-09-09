import React, { useState } from 'react';
import { ChatHeader } from './components/Layout/ChatHeader';
import { WelcomeScreen } from './components/Chat/WelcomeScreen';
import { ChatWindow } from './components/Chat/ChatWindow';
import { MessageComposer } from './components/Chat/MessageComposer';
import { FirmModal } from './components/UI/FirmModal';
import { BookingModal } from './components/UI/BookingModal';
import { useChat } from './hooks/useChat';

export default function App() {
  const {
    messages,
    isTyping,
    isLoading,
    sendMessage,
    clearChat
  } = useChat();

  const [isFirmModalOpen, setIsFirmModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const hasMessages = messages.length > 0;

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0d1117] text-[#e6edf3] flex flex-col relative overflow-hidden selection:bg-[#c5a059]/25 selection:text-[#ffffff]">
      {/* Navigation & Accreditation Header */}
      <div className="flex-shrink-0 z-30">
        <ChatHeader
          onNewChat={clearChat}
          hasMessages={hasMessages}
          onOpenFirmInfo={() => setIsFirmModalOpen(true)}
          onOpenBooking={() => setIsBookingModalOpen(true)}
        />
      </div>

      {/* Main Experience Viewport - Scrollable Body */}
      <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col relative z-10 w-full">
        {!hasMessages ? (
          <div className="flex-1 flex items-center justify-center p-3 sm:p-4 md:p-6 my-auto">
            <WelcomeScreen
              onSelectPrompt={sendMessage}
              onOpenBooking={() => setIsBookingModalOpen(true)}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            <ChatWindow
              messages={messages}
              isTyping={isTyping}
              onOpenBooking={() => setIsBookingModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Floating Bottom Composer & Legal Disclaimer */}
      <div className="flex-shrink-0 relative z-20 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/95 to-transparent pt-2">
        <MessageComposer
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>

      {/* Firm Quick Facts / Directory Modal */}
      <FirmModal
        isOpen={isFirmModalOpen}
        onClose={() => setIsFirmModalOpen(false)}
      />

      {/* Direct Legal Consultation Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
