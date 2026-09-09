export type MessageRole = 'user' | 'assistant' | 'system';

export interface MessageAction {
  label: string;
  actionType: 'call' | 'whatsapp' | 'book' | 'location';
  payload?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  attachmentName?: string;
  actions?: MessageAction[];
}

export type ConversationState = 'idle' | 'typing' | 'streaming' | 'completed';

export interface SuggestedPromptItem {
  id: string;
  text: string;
  category?: string;
  description?: string;
  iconName?: 'scale' | 'building' | 'clock' | 'file-text' | 'help-circle' | 'map-pin' | 'shield' | 'briefcase';
}

export interface FirmService {
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  title?: string;
}

export interface FirmInfo {
  nameAr: string;
  nameEn: string;
  address: string;
  email: string;
  phones: string[];
  website: string;
  services: string[];
  team: TeamMember[];
  workingHours: {
    regular: string;
    weekend: string;
    emergency: string;
  };
}
