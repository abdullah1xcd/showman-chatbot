```ts
import { Message, MessageAction } from '../types';
import { FIRM_DATA, FIRM_SYSTEM_INSTRUCTIONS } from '../constants';

const SYSTEM_PROMPT =
  FIRM_SYSTEM_INSTRUCTIONS ||
  'You are the AI assistant for Shoman Law Firm. Answer accurately and professionally in Arabic or English.';

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

  if (
    query.includes('where') ||
    query.includes('location') ||
    query.includes('address') ||
    query.includes('فين') ||
    query.includes('عنوان') ||
    query.includes('مكان')
  ) {
    if (english) {
      return {
        text:
          'Shoman Law Firm address:\n' +
          FIRM_DATA.address +
          '.',
        actions: [
          {
            label: 'Open in Google Maps',
            actionType: 'location',
            payload: 'https://maps.google.com/?q=مدينة+نصر+القاهرة',
          },
          {
            label: 'Call Office',
            actionType: 'call',
            payload: '01066650075',
          },
        ],
      };
    }

    return {
      text:
        'عنوان مكتب شومان للمحاماة:\n' +
        FIRM_DATA.address +
        '.',
      actions: [
        {
          label: 'فتح الموقع على الخريطة',
          actionType: 'location',
          payload: 'https://maps.google.com/?q=مدينة+نصر+القاهرة',
        },
        {
          label: 'الاتصال بالمكتب',
          actionType: 'call',
          payload: '01066650075',
        },
      ],
    };
  }

  if (
    query.includes('phone') ||
    query.includes('telephone') ||
    query.includes('call') ||
    query.includes('رقم') ||
    query.includes('تليفون') ||
    query.includes('اتصل')
  ) {
    if (english) {
      return {
        text:
          'You can contact Shoman Law Firm at 01066650075 or +20 102 410 1115.',
        actions: [
          {
            label: 'Call Office',
            actionType: 'call',
            payload: '01066650075',
          },
          {
            label: 'WhatsApp',
            actionType: 'whatsapp',
            payload: 'https://wa.me/201066650075',
          },
        ],
      };
    }

    return {
      text:
        'يمكنك التواصل مع مكتب شومان للمحاماة على:\n' +
        '01066650075\n' +
        '+20 102 410 1115',
      actions: [
        {
          label: 'الاتصال بالمكتب',
          actionType: 'call',
          payload: '01066650075',
        },
        {
          label: 'واتساب',
          actionType: 'whatsapp',
          payload: 'https://wa.me/201066650075',
        },
      ],
    };
  }

  if (
    query.includes('whatsapp') ||
    query.includes('واتساب') ||
    query.includes('واتس')
  ) {
    return {
      text: english
        ? 'You can contact Shoman Law Firm through WhatsApp.'
        : 'يمكنك التواصل مع مكتب شومان للمحاماة من خلال واتساب.',
      actions: [
        {
          label: english ? 'Open WhatsApp' : 'فتح واتساب',
          actionType: 'whatsapp',
          payload: 'https://wa.me/201066650075',
        },
      ],
    };
  }

  if (
    query.includes('email') ||
    query.includes('mail') ||
    query.includes('ايميل') ||
    query.includes('إيميل') ||
    query.includes('بريد')
  ) {
    return {
      text: english
        ? 'You can contact the firm by email at ' + FIRM_DATA.email + '.'
        : 'يمكنك التواصل مع المكتب عبر البريد الإلكتروني: ' +
          FIRM_DATA.email +
          '.',
      actions: [
        {
          label: english ? 'Send Email' : 'إرسال بريد إلكتروني',
          actionType: 'email',
          payload: FIRM_DATA.email,
        },
      ],
    };
  }

  if (
    query.includes('website') ||
    query.includes('site') ||
    query.includes('موقع المكتب') ||
    query.includes('الموقع')
  ) {
    return {
      text: english
        ? 'You can visit the official Shoman Law Firm website.'
        : 'يمكنك زيارة الموقع الرسمي لمكتب شومان للمحاماة.',
      actions: [
        {
          label: english ? 'Open Website' : 'فتح الموقع',
          actionType: 'link',
          payload: FIRM_DATA.website,
        },
      ],
    };
  }

  if (
    query.includes('hours') ||
    query.includes('working hours') ||
    query.includes('open') ||
    query.includes('مواعيد') ||
    query.includes('مواعيد العمل') ||
    query.includes('شغال')
  ) {
    return {
      text: english
        ? 'Please contact the office directly to confirm the current working hours and appointment availability.'
        : 'يرجى التواصل مع المكتب مباشرة للتأكد من مواعيد العمل الحالية وتوافر المواعيد.',
      actions: [
        {
          label: english ? 'Call Office' : 'الاتصال بالمكتب',
          actionType: 'call',
          payload: '01066650075',
        },
      ],
    };
  }

  if (
    query.includes('service') ||
    query.includes('services') ||
    query.includes('خدمات') ||
    query.includes('بتقدموا ايه') ||
    query.includes('بتقدموا اي') ||
    query.includes('ماذا تقدم')
  ) {
    return {
      text: english
        ? 'Shoman Law Firm provides legal services including litigation, contracts, corporate matters, civil and criminal cases, family matters, labor matters, and legal consultations.'
        : 'يقدم مكتب شومان للمحاماة خدمات قانونية متعددة، منها التقاضي، وصياغة ومراجعة العقود، والشؤون التجارية والشركات، والقضايا المدنية والجنائية، وقضايا الأسرة والعمل، والاستشارات القانونية.',
    };
  }

  if (
    query.includes('price') ||
    query.includes('prices') ||
    query.includes('cost') ||
    query.includes('fee') ||
    query.includes('fees') ||
    query.includes('سعر') ||
    query.includes('اسعار') ||
    query.includes('أسعار') ||
    query.includes('تكلفة') ||
    query.includes('أتعاب') ||
    query.includes('اتعاب')
  ) {
    return {
      text: english
        ? 'Legal fees depend on the type and complexity of the case. Please contact the office for an accurate quotation after discussing your case.'
        : 'تختلف أتعاب المحاماة حسب نوع القضية ومدى تعقيدها. يرجى التواصل مع المكتب للحصول على عرض سعر مناسب بعد معرفة تفاصيل الحالة.',
      actions: [
        {
          label: english ? 'Contact Office' : 'التواصل مع المكتب',
          actionType: 'call',
          payload: '01066650075',
        },
      ],
    };
  }

  if (
    query.includes('hello') ||
    query.includes('hi') ||
    query.includes('hey') ||
    query.includes('مرحبا') ||
    query.includes('مرحب') ||
    query.includes('اهلا') ||
    query.includes('أهلا') ||
    query.includes('السلام عليكم')
  ) {
    return {
      text: english
        ? 'Hello! Welcome to Shoman Law Firm. How can I help you today?'
        : 'أهلاً وسهلاً بك في مكتب شومان للمحاماة. كيف يمكنني مساعدتك اليوم؟',
    };
  }

  return {
    text: english
      ? 'I do not have enough information to answer this question. You can describe your legal issue in more detail, and our team can assist you.'
      : 'لا أملك معلومات كافية للإجابة على هذا السؤال. يمكنك توضيح مشكلتك القانونية بمزيد من التفاصيل، ويمكن لفريق المكتب مساعدتك.',
  };
}

export async function sendMessage(
  message: string,
  history: Message[] = [],
  options?: SendMessageOptions
): Promise<AIResponseResult> {
  let replyText = '';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: history.map((item) => ({
          role: item.role,
          content: item.content,
        })),
        attachmentName: options?.attachmentName,
        systemPrompt: SYSTEM_PROMPT,
      }),
      signal: options?.signal,
    });

    let data: {
      reply?: string;
      error?: string;
    };

    try {
      data = await response.json();
    } catch {
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Gemini request failed');
    }

    if (!data.reply) {
      throw new Error('Gemini returned an empty response');
    }

    replyText = data.reply.trim();
  } catch (error) {
    if (options?.signal?.aborted) {
      throw error;
    }

    console.error('AI request failed:', error);

    const fallback = resolveMockResponse(message);

    return {
      text: fallback.text,
      actions: fallback.actions,
    };
  }

  return {
    text: replyText,
  };
}
```
