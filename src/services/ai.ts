```ts
import { Message, MessageAction } from '../types';
import { FIRM_DATA, FIRM_SYSTEM_INSTRUCTIONS } from '../data/firmData';

/**
 * SHOMAN AI service
 *
 * Gemini is called through the server-side /api/chat endpoint.
 * If Gemini is unavailable, the verified local fallback responses are used.
 */

export const SYSTEM_PROMPT = FIRM_SYSTEM_INSTRUCTIONS;

export interface AIResponseResult {
  text: string;
  actions?: MessageAction[];
}

interface SendMessageOptions {
  onChunk?: (streamedText: string) => void;
  signal?: AbortSignal;
}

export interface SendMessageOptionsWithAttachment
  extends SendMessageOptions {
  attachmentName?: string;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[؟?.,!،]/g, ' ')
    .trim();
}

function isEnglishQuery(text: string): boolean {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;

  return latinChars > arabicChars;
}

/**
 * Local fallback responses.
 * These are used only when Gemini cannot respond.
 */
export function resolveMockResponse(
  userMessage: string
): AIResponseResult {
  const norm = normalizeText(userMessage);
  const isEnglish = isEnglishQuery(userMessage);

  const contactActions: MessageAction[] = [
    {
      label: 'اتصال: 01066650075',
      actionType: 'call',
      payload: '01066650075',
    },
    {
      label: 'اتصال: +20 102 410 1115',
      actionType: 'call',
      payload: '+201024101115',
    },
    {
      label: 'واتساب المستشار',
      actionType: 'whatsapp',
      payload: 'https://wa.me/201066650075',
    },
    {
      label: 'حجز موعد استشارة',
      actionType: 'book',
    },
  ];

  const locationActions: MessageAction[] = [
    {
      label: 'موقع المكتب على خرائط Google',
      actionType: 'location',
      payload: 'https://maps.google.com/?q=مدينة+نصر+القاهرة',
    },
    {
      label: 'اتصال هاتفي',
      actionType: 'call',
      payload: '01066650075',
    },
  ];

  /*
   * =========================
   * ENGLISH
   * =========================
   */

  if (isEnglish) {
    if (
      norm.includes('address') ||
      norm.includes('location') ||
      norm.includes('where') ||
      norm.includes('place')
    ) {
      return {
        text: `Shoman Law Firm address:
${FIRM_DATA.address}.`,
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

    if (norm.includes('friday')) {
      return {
        text: `The office is closed on Friday.
Working hours are Saturday to Thursday, from 9:00 AM to 6:00 PM.
Emergency consultations are available 24/7.`,
        actions: [
          {
            label: 'Book Appointment',
            actionType: 'book',
          },
          {
            label: 'WhatsApp Concierge',
            actionType: 'whatsapp',
            payload: 'https://wa.me/201066650075',
          },
        ],
      };
    }

    if (
      norm.includes('hour') ||
      norm.includes('time') ||
      norm.includes('open') ||
      norm.includes('schedule') ||
      norm.includes('work')
    ) {
      return {
        text: `Shoman Law Firm working hours:
Saturday to Thursday: 9:00 AM to 6:00 PM.
Friday: Closed.
Emergency consultations: Available 24 hours.`,
        actions: [
          {
            label: 'Call 01066650075',
            actionType: 'call',
            payload: '01066650075',
          },
        ],
      };
    }

    if (
      norm.includes('book') ||
      norm.includes('consult') ||
      norm.includes('appointment') ||
      norm.includes('phone') ||
      norm.includes('contact') ||
      norm.includes('number') ||
      norm.includes('call') ||
      norm.includes('email')
    ) {
      return {
        text: `Our office team can assist you with booking procedures.

Phone numbers:
- 01066650075
- +20 102 410 1115

Email: ${FIRM_DATA.email}`,
        actions: contactActions,
      };
    }

    if (
      norm.includes('my case') ||
      norm.includes('advice') ||
      norm.includes('sue') ||
      norm.includes('what should i do') ||
      norm.includes('legal opinion')
    ) {
      return {
        text: `I can provide general information about the firm's services, but evaluating your case and providing legal advice requires review by one of our firm's lawyers. I can help you connect with our team.`,
        actions: [
          {
            label: 'Connect with Lawyer',
            actionType: 'book',
          },
          {
            label: 'Chat on WhatsApp',
            actionType: 'whatsapp',
            payload: 'https://wa.me/201066650075',
          },
        ],
      };
    }

    if (
      norm.includes('cost') ||
      norm.includes('price') ||
      norm.includes('fee') ||
      norm.includes('rate') ||
      norm.includes('how much')
    ) {
      return {
        text: `I do not have this information currently, but a member of the firm's team will be able to assist you.`,
        actions: [
          {
            label: 'Contact Firm Team',
            actionType: 'call',
            payload: '01066650075',
          },
          {
            label: 'WhatsApp Inquiry',
            actionType: 'whatsapp',
            payload: 'https://wa.me/201066650075',
          },
        ],
      };
    }

    if (
      norm.includes('service') ||
      norm.includes('practice') ||
      norm.includes('what do you do') ||
      norm.includes('field')
    ) {
      return {
        text: `Shoman Law Firm provides legal services in:
- Civil Law
- Commercial Law
- Contract Drafting & Review
- Company Formation & Investment
- Arbitration & Dispute Resolution
- Family Law
- Labor Law
- Criminal Law & Public Funds
- Legal Negotiation & Settlement
- Legal Consultations`,
        actions: [
          {
            label: 'Request Consultation',
            actionType: 'book',
          },
          {
            label: 'WhatsApp',
            actionType: 'whatsapp',
            payload: 'https://wa.me/201066650075',
          },
        ],
      };
    }

    if (
      norm.includes('team') ||
      norm.includes('lawyer') ||
      norm.includes('founder') ||
      norm.includes('rabie') ||
      norm.includes('who are')
    ) {
      return {
        text: `Shoman Law Firm Team:
- Rabie Shoman — Founder & Managing Director
- Belal Haroon — Senior Associate
- Marwan Mohamed — Lawyer & Legal Consultant
- Emad Saber — Civil Law Specialist
- Mazen Walid — Criminal Law Specialist
- Maryam Ali — Family Law Specialist
- Ibrahim Hamdy — Arbitration & Dispute Resolution Specialist`,
      };
    }

    if (
      norm.includes('hello') ||
      norm.includes('hi') ||
      norm.includes('hey') ||
      norm.includes('good morning') ||
      norm.includes('good afternoon')
    ) {
      return {
        text: `Hello! Welcome to Shoman Law Firm's official legal assistant. How can I assist you today?`,
        actions: [
          {
            label: 'View Services',
            actionType: 'book',
          },
          {
            label: 'Contact Lawyers',
            actionType: 'call',
            payload: '01066650075',
          },
        ],
      };
    }

    return {
      text: `I do not have this information currently, but a member of the firm's team will be able to assist you.`,
      actions: [
        {
          label: 'Contact Office',
          actionType: 'call',
          payload: '01066650075',
        },
        {
          label: 'Chat on WhatsApp',
          actionType: 'whatsapp',
          payload: 'https://wa.me/201066650075',
        },
      ],
    };
  }

  /*
   * =========================
   * ARABIC
   * =========================
   */

  if (
    norm.includes('اسري') ||
    norm.includes('اسره') ||
    norm.includes('طلاق') ||
    norm.includes('نفقه') ||
    norm.includes('احوال شخصي') ||
    norm.includes('حضانه')
  ) {
    return {
      text: `نعم، مكتب شومان للمحاماة يقدم خدمات قانونية متخصصة في قضايا الأسرة والأحوال الشخصية، وتتولى هذا الاختصاص الأستاذة مريم علي (محامية متخصصة في قضايا الأسرة).`,
      actions: [
        {
          label: 'حجز موعد مع الأستاذة مريم علي',
          actionType: 'book',
        },
        {
          label: 'واتساب المكتب',
          actionType: 'whatsapp',
          payload: 'https://wa.me/201066650075',
        },
      ],
    };
  }

  if (
    norm.includes('عنوان') ||
    norm.includes('فين') ||
    norm.includes('اين') ||
    norm.includes('موقع') ||
    norm.includes('مكان') ||
    norm.includes('مدينه نصر')
  ) {
    return {
      text: `عنوان مكتب شومان:
٦ شارع السباح عبدالمنعم، الحي السابع، مدينة نصر، القاهرة، مصر.`,
      actions: locationActions,
    };
  }

  if (
    norm.includes('الجمعه') ||
    norm.includes('جمعه')
  ) {
    return {
      text: `المكتب مغلق يوم الجمعة.
مواعيد العمل من السبت إلى الخميس، من 9:00 صباحًا إلى 6:00 مساءً.`,
      actions: [
        {
          label: 'حجز موعد بمقر المكتب',
          actionType: 'book',
        },
        {
          label: 'طوارئ الاستشارات 24 ساعة',
          actionType: 'call',
          payload: '01066650075',
        },
      ],
    };
  }

  if (
    norm.includes('مواعيد') ||
    norm.includes('ساعات') ||
    norm.includes('دوام') ||
    norm.includes('وقت العمل') ||
    norm.includes('مفتوح') ||
    norm.includes('شغالين')
  ) {
    return {
      text: `مواعيد العمل في مكتب شومان:
السبت إلى الخميس: من 9:00 صباحًا إلى 6:00 مساءً.
الجمعة: مغلق.
الاستشارات الطارئة: متاحة على مدار 24 ساعة.`,
      actions: [
        {
          label: 'حجز موعد مقابلة',
          actionType: 'book',
        },
        {
          label: 'اتصال هاتفي',
          actionType: 'call',
          payload: '01066650075',
        },
      ],
    };
  }

  if (
    norm.includes('عندي قضيه') ||
    norm.includes('اعمل ايه') ||
    norm.includes('رايك ايه') ||
    norm.includes('موقفي ايه') ||
    norm.includes('انصحني') ||
    norm.includes('مشوره') ||
    norm.includes('حكم ايه') ||
    norm.includes('تكسب القضيه')
  ) {
    return {
      text: `يمكنني مساعدتك بالمعلومات العامة عن خدمات المكتب، لكن تقييم حالتك وتقديم المشورة القانونية يحتاج إلى مراجعة أحد محامي المكتب. يمكنني مساعدتك في التواصل مع فريق المكتب.`,
      actions: [
        {
          label: 'طلب حجز دراسة قضية',
          actionType: 'book',
        },
        {
          label: 'محادثة المحامي عبر واتساب',
          actionType: 'whatsapp',
          payload: 'https://wa.me/201066650075',
        },
        {
          label: 'اتصال مباشر بالمكتب',
          actionType: 'call',
          payload: '01066650075',
        },
      ],
    };
  }

  if (
    norm.includes('سعر') ||
    norm.includes('اسعار') ||
    norm.includes('تكلف') ||
    norm.includes('اتعاب') ||
    norm.includes('بكام') ||
    norm.includes('كام بتكلف') ||
    norm.includes('رسوم')
  ) {
    return {
      text: `لا أملك هذه المعلومة حاليًا، ويمكن لأحد أعضاء فريق المكتب مساعدتك.`,
      actions: [
        {
          label: 'التواصل مع فريق المكتب',
          actionType: 'call',
          payload: '01066650075',
        },
        {
          label: 'استفسار عبر واتساب',
          actionType: 'whatsapp',
          payload: 'https://wa.me/201066650075',
        },
      ],
    };
  }

  if (
    norm.includes('حجز') ||
    norm.includes('استشاره') ||
    norm.includes('موعد') ||
    norm.includes('تواصل') ||
    norm.includes('اتصال') ||
    norm.includes('تليفون') ||
    norm.includes('هاتف') ||
    norm.includes('رقم') ||
    norm.includes('ارقام') ||
    norm.includes('ايميل') ||
    norm.includes('بريد')
  ) {
    return {
      text: `يسعدنا تواصلك. يمكن لفريق المكتب مساعدتك في إجراءات حجز الاستشارة عبر:
أرقام الهاتف:
- 01066650075
- +20 102 410 1115
البريد الإلكتروني: ${FIRM_DATA.email}
الموقع الرسمي: ${FIRM_DATA.website}`,
      actions: contactActions,
    };
  }

  if (
    norm.includes('جنائ') ||
    norm.includes('جنح') ||
    norm.includes('جنايات') ||
    norm.includes('اموال عامه')
  ) {
    return {
      text: `نعم، يقدم مكتب شومان للمحاماة خدمات في القضايا الجنائية وقضايا الأموال العامة، بإشراف الأستاذ مازن وليد (محامٍ متخصص في القضايا الجنائية).`,
      actions: [
        {
          label: 'حجز استشارة جنائية عاجلة',
          actionType: 'book',
        },
        {
          label: 'اتصال طوارئ 24 ساعة',
          actionType: 'call',
          payload: '01066650075',
        },
      ],
    };
  }

  if (
    norm.includes('مدن') ||
    norm.includes('تعويض') ||
    norm.includes('ايجار')
  ) {
    return {
      text: `نعم، يقدم مكتب شومان خدمات في القضايا المدنية، بإشراف الأستاذ عماد صابر (محامٍ متخصص في القضايا المدنية).`,
      actions: [
        {
          label: 'حجز استشارة في القضايا المدنية',
          actionType: 'book',
        },
      ],
    };
  }

  if (
    norm.includes('شركات') ||
    norm.includes('تاسيس') ||
    norm.includes('استثمار') ||
    norm.includes('سجل تجار')
  ) {
    return {
      text: `نعم، يقدم مكتب شومان خدمات متكاملة في تأسيس الشركات والاستثمار، واستخراج التراخيص الاستثمارية بمصر.`,
      actions: [
        {
          label: 'طلب تأسيس شركة أو استشارة',
          actionType: 'book',
        },
        {
          label: 'واتساب المكتب',
          actionType: 'whatsapp',
          payload: 'https://wa.me/201066650075',
        },
      ],
    };
  }

  if (
    norm.includes('عقد') ||
    norm.includes('عقود') ||
    norm.includes('صياغ') ||
    norm.includes('اتفاقي')
  ) {
    return {
      text: `نعم، يقدم مكتب شومان خدمات صياغة ومراجعة العقود والاتفاقيات التجارية والمدنية بدقة قانونية محكمة.`,
      actions: [
        {
          label: 'طلب مراجعة أو صياغة عقد',
          actionType: 'book',
        },
      ],
    };
  }

  if (
    norm.includes('تحكيم') ||
    norm.includes('منازع') ||
    norm.includes('تسوي')
  ) {
    return {
      text: `نعم، يقدم مكتب شومان خدمات التحكيم وتسوية المنازعات والتفاوض القانوني، بإشراف الأستاذ إبراهيم حمدي (محامٍ متخصص في التحكيم).`,
      actions: [
        {
          label: 'حجز جلسة تحكيم أو تسوية',
          actionType: 'book',
        },
      ],
    };
  }

  if (
    norm.includes('عمل') ||
    norm.includes('عمال') ||
    norm.includes('موظف') ||
    norm.includes('فصل')
  ) {
    return {
      text: `نعم، يقدم مكتب شومان خدمات قانونية متخصصة في قضايا العمل والنزاعات العمالية.`,
      actions: [
        {
          label: 'حجز استشارة قضايا العمل',
          actionType: 'book',
        },
      ],
    };
  }

  if (
    norm.includes('خدمات') ||
    norm.includes('خدمه') ||
    norm.includes('مجالات') ||
    norm.includes('تخصص') ||
    norm.includes('بتعملوا ايه')
  ) {
    return {
      text: `يقدم مكتب شومان للمحاماة خدمات في المجالات التالية:
- القضايا المدنية
- القضايا التجارية
- صياغة ومراجعة العقود والاتفاقيات
- تأسيس الشركات والاستثمار
- التحكيم وتسوية المنازعات
- قضايا الأسرة
- قضايا العمل
- القضايا الجنائية
- قضايا الأموال العامة
- التفاوض والتسويات القانونية
- الاستشارات القانونية`,
      actions: [
        {
          label: 'طلب استشارة قانونية',
          actionType: 'book',
        },
        {
          label: 'واتساب المكتب',
          actionType: 'whatsapp',
          payload: 'https://wa.me/201066650075',
        },
      ],
    };
  }

  if (
    norm.includes('فريق') ||
    norm.includes('محامين') ||
    norm.includes('المؤسس') ||
    norm.includes('شومان') ||
    norm.includes('مين في المكتب')
  ) {
    return {
      text: `فريق العمل في مكتب شومان للمحاماة:
- ربيع شومان — المؤسس والمدير التنفيذي
- بلال هارون — محامٍ أول
- مروان محمد — محامٍ ومستشار قانوني
- عماد صابر — محامٍ متخصص في القضايا المدنية
- مازن وليد — محامٍ متخصص في القضايا الجنائية
- مريم علي — محامية متخصصة في قضايا الأسرة
- إبراهيم حمدي — محامٍ متخصص في التحكيم وتسوية المنازعات`,
      actions: [
        {
          label: 'حجز موعد مقابلة مع المحامي',
          actionType: 'book',
        },
      ],
    };
  }

  if (
    norm.includes('سلام') ||
    norm.includes('مرحبا') ||
    norm.includes('صباح') ||
    norm.includes('مساء') ||
    norm.includes('اهلا')
  ) {
    return {
      text: `وعليكم السلام ورحمة الله وبركاته 🌷
مرحبًا بك في مكتب شومان للمحاماة والاستشارات القانونية.
كيف يمكنني مساعدتك اليوم بخصوص خدمات المكتب أو بيانات التواصل؟`,
      actions: [
        {
          label: 'استعراض الخدمات',
          actionType: 'book',
        },
        {
          label: 'أرقام التواصل وحجز موعد',
          actionType: 'call',
          payload: '01066650075',
        },
      ],
    };
  }

  return {
    text: `لا أملك هذه المعلومة حاليًا، ويمكن لأحد أعضاء فريق المكتب مساعدتك.`,
    actions: [
      {
        label: 'اتصال بفريق المكتب: 01066650075',
        actionType: 'call',
        payload: '01066650075',
      },
      {
        label: 'استفسار عبر واتساب',
        actionType: 'whatsapp',
        payload: 'https://wa.me/201066650075',
      },
    ],
  };
}

/**
 * Sends the user's message to the server-side Gemini endpoint.
 */
export async function sendMessage(
  message: string,
  history: Message[],
  options?: SendMessageOptionsWithAttachment
): Promise<AIResponseResult> {
  const fallback = resolveMockResponse(message);

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
      }),
      signal: options?.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error || 'Gemini request failed'
      );
    }

    if (
      typeof data?.reply !== 'string' ||
      !data.reply.trim()
    ) {
      throw new Error(
        'Gemini returned an empty response'
      );
    }

    replyText = data.reply.trim();
  } catch (error: unknown) {
    if (options?.signal?.aborted) {
      throw error;
    }

    console.warn(
      'Gemini chat failed. Using local fallback.',
      error
    );
  }

  if (!replyText) {
    replyText = fallback.text;
  }

  /*
   * Simulate streaming on the client so the UI
   * still displays the response smoothly.
   */
  const chunks = replyText.split(/(\s+)/);
  let accumulated = '';

  for (const chunk of chunks) {
    if (options?.signal?.aborted) {
      break;
    }

    accumulated += chunk;

    if (options?.onChunk) {
      options.onChunk(accumulated);
    }

    const delay = chunk.includes('\n') ? 16 : 6;

    await new Promise<void>((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  return {
    text: replyText,
    actions: fallback.actions,
  };
}
```
