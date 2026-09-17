import { Message, MessageAction } from '../types';
import { FIRM_DATA, FIRM_SYSTEM_INSTRUCTIONS } from '../data/firmData';

const SYSTEM_PROMPT =
  FIRM_SYSTEM_INSTRUCTIONS ||
  'You are the AI assistant for Shoman Law Firm. Answer accurately and professionally in Arabic or English.';

const MAPS_URL = 'https://maps.app.goo.gl/6aSsi3wwGNeM3bWX9';
const WHATSAPP_URL = 'https://wa.me/201066650075';

export interface AIResponseResult {
  text: string;
  actions?: MessageAction[];
}

export interface SendMessageOptions {
  signal?: AbortSignal;
  attachmentName?: string;
}

function normalizeText(text: string): string {
  return text.trim().toLowerCase();
}

function isEnglishQuery(text: string): boolean {
  const englishChars = text.match(/[a-z]/gi);
  const arabicChars = text.match(/[\u0600-\u06ff]/g);
  return (englishChars?.length || 0) > (arabicChars?.length || 0);
}

function resolveMockResponse(message: string): AIResponseResult {
  const query = normalizeText(message);
  const english = isEnglishQuery(message);

  if (query.includes('where') || query.includes('location') || query.includes('address') || query.includes('فين') || query.includes('عنوان') || query.includes('مكان')) {
    return english
      ? { text: `📍 Shoman Law Firm address:\n\n${FIRM_DATA.address}`, actions: [{ label: '📍 Open in Google Maps', actionType: 'location', payload: MAPS_URL }, { label: '📞 Call Office', actionType: 'call', payload: '01066650075' }, { label: '💬 WhatsApp', actionType: 'whatsapp', payload: WHATSAPP_URL }] }
      : { text: `📍 عنوان مكتب شومان للمحاماة:\n\n${FIRM_DATA.address}`, actions: [{ label: '📍 فتح الموقع على الخريطة', actionType: 'location', payload: MAPS_URL }, { label: '📞 الاتصال بالمكتب', actionType: 'call', payload: '01066650075' }, { label: '💬 واتساب', actionType: 'whatsapp', payload: WHATSAPP_URL }] };
  }

  if (query.includes('phone') || query.includes('telephone') || query.includes('call') || query.includes('رقم') || query.includes('تليفون') || query.includes('اتصل')) {
    return english
      ? { text: '📞 You can contact Shoman Law Firm at:\n\n01066650075\n+20 102 410 1115', actions: [{ label: '📞 Call Office', actionType: 'call', payload: '01066650075' }, { label: '💬 WhatsApp', actionType: 'whatsapp', payload: WHATSAPP_URL }] }
      : { text: '📞 يمكنك التواصل مع مكتب شومان للمحاماة على:\n\n01066650075\n+20 102 410 1115', actions: [{ label: '📞 الاتصال بالمكتب', actionType: 'call', payload: '01066650075' }, { label: '💬 واتساب', actionType: 'whatsapp', payload: WHATSAPP_URL }] };
  }

  if (query.includes('whatsapp') || query.includes('واتساب') || query.includes('واتس')) {
    return { text: english ? '💬 You can contact Shoman Law Firm directly through WhatsApp.' : '💬 يمكنك التواصل مباشرةً مع مكتب شومان للمحاماة عبر واتساب.', actions: [{ label: english ? '💬 Open WhatsApp' : '💬 فتح واتساب', actionType: 'whatsapp', payload: WHATSAPP_URL }] };
  }

  if (query.includes('email') || query.includes('mail') || query.includes('ايميل') || query.includes('إيميل') || query.includes('بريد')) {
    return { text: english ? `✉️ You can contact the firm by email at ${FIRM_DATA.email}.` : `✉️ يمكنك التواصل مع المكتب عبر البريد الإلكتروني:\n\n${FIRM_DATA.email}`, actions: [{ label: english ? '✉️ Send Email' : '✉️ إرسال بريد إلكتروني', actionType: 'email', payload: FIRM_DATA.email }] };
  }

  if (query.includes('website') || query.includes('site') || query.includes('موقع المكتب') || query.includes('الموقع')) {
    return { text: english ? '🌐 You can visit the official Shoman Law Firm website for more information.' : '🌐 يمكنك زيارة الموقع الرسمي لمكتب شومان للمحاماة لمزيد من المعلومات.', actions: [{ label: english ? '🌐 Open Website' : '🌐 فتح الموقع', actionType: 'link', payload: FIRM_DATA.website }] };
  }

  if (query.includes('hours') || query.includes('working hours') || query.includes('open') || query.includes('مواعيد') || query.includes('مواعيد العمل') || query.includes('شغال')) {
    return { text: english ? '🕐 Shoman Law Firm is open Saturday through Thursday, from 9:00 AM to 6:00 PM. The office is closed on Friday. Urgent consultations are available 24/7 by phone and WhatsApp.' : '🕐 مواعيد العمل الرسمية لمكتب شومان للمحاماة: من السبت إلى الخميس، من الساعة 9:00 صباحًا حتى 6:00 مساءً. المكتب مغلق يوم الجمعة. والاستشارات العاجلة متاحة على مدار 24 ساعة عبر الهاتف والواتساب.', actions: [{ label: english ? '📞 Contact Office' : '📞 التواصل مع المكتب', actionType: 'call', payload: '01066650075' }, { label: english ? '💬 WhatsApp' : '💬 واتساب', actionType: 'whatsapp', payload: WHATSAPP_URL }] };
  }

  if (query.includes('service') || query.includes('services') || query.includes('what does this chatbot do') || query.includes('what can you do') || query.includes('خدمات') || query.includes('بتقدموا ايه') || query.includes('بتقدموا اي') || query.includes('ماذا تقدم') || query.includes('بتعمل ايه') || query.includes('بتعمل اي')) {
    return { text: english ? '⚖️ I am the official AI assistant for Shoman Law Firm.\n\nI can help you with:\n• Information about the firm and its legal services\n• General legal information\n• Office address, contact details, and working hours\n• Guidance on requesting a legal consultation\n\nFor a specific legal matter, a lawyer should review the relevant facts and documents before professional advice is provided.' : '⚖️ أنا المساعد الذكي الرسمي لمكتب شومان للمحاماة.\n\nيمكنني مساعدتك في:\n• التعرف على خدمات المكتب وتخصصاته\n• تقديم معلومات قانونية عامة\n• توضيح العنوان وأرقام التواصل ومواعيد العمل\n• إرشادك إلى طريقة طلب الاستشارة القانونية\n\nأما القضايا الخاصة، فتحتاج إلى مراجعة الوقائع والمستندات بواسطة محامٍ قبل تقديم المشورة المهنية.' };
  }

  if (query.includes('price') || query.includes('prices') || query.includes('cost') || query.includes('fee') || query.includes('fees') || query.includes('سعر') || query.includes('اسعار') || query.includes('أسعار') || query.includes('تكلفة') || query.includes('أتعاب') || query.includes('اتعاب')) {
    return { text: english ? 'Fees depend on the type and complexity of the legal matter. Please contact the office to discuss your case and receive the appropriate information regarding legal fees.' : 'تختلف أتعاب المحاماة حسب نوع المسألة القانونية ومدى تعقيدها. يرجى التواصل مع المكتب لمناقشة حالتك ومعرفة التفاصيل الخاصة بأتعاب الخدمة القانونية.', actions: [{ label: english ? '📞 Contact Office' : '📞 التواصل مع المكتب', actionType: 'call', payload: '01066650075' }, { label: english ? '💬 WhatsApp' : '💬 واتساب', actionType: 'whatsapp', payload: WHATSAPP_URL }] };
  }

  if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('مرحبا') || query.includes('مرحب') || query.includes('اهلا') || query.includes('أهلا') || query.includes('السلام عليكم')) {
    return { text: english ? '👋 Hello and welcome to Shoman Law Firm. How may I assist you today? ⚖️' : '👋 أهلًا وسهلًا بك في مكتب شومان للمحاماة.\nكيف يمكنني مساعدتك اليوم؟ ⚖️' };
  }

  return { text: english ? '⚖️ I would be pleased to assist you. Please provide more details about your legal inquiry or tell me what you would like to know about Shoman Law Firm.' : '⚖️ يسعدني مساعدتك. من فضلك أخبرني بمزيد من التفاصيل عن استفسارك القانوني أو ما تود معرفته عن مكتب شومان للمحاماة.' };
}

export async function sendMessage(message: string, history: Message[] = [], options?: SendMessageOptions): Promise<AIResponseResult> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: history.map((item) => ({ role: item.role, content: item.content })), attachmentName: options?.attachmentName, systemPrompt: SYSTEM_PROMPT }),
      signal: options?.signal,
    });

    let data: { reply?: string; error?: string };
    try {
      data = await response.json();
    } catch {
      throw new Error(`Invalid response from server (HTTP ${response.status})`);
    }

    if (!response.ok) throw new Error(data.error || `Gemini request failed (HTTP ${response.status})`);
    if (!data.reply) throw new Error('Gemini returned an empty response');

    return { text: data.reply.trim() };
  } catch (error) {
    if (options?.signal?.aborted) throw error;
    console.error('AI request failed:', error);

    const fallback = resolveMockResponse(message);

    return {
      text: fallback.text,
      actions: fallback.actions,
    };
  }
}
