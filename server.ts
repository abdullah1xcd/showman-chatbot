import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_INSTRUCTION = `أنت المساعد القانوني الذكي الرسمي لمكتب شومان للمحاماة والاستشارات القانونية في القاهرة، مصر.
مهمتك هي الإجابة على استفسارات العملاء بدقة ولباقة واحترافية وفق القواعد والبيانات المعتمدة للمكتب:

=== معلومات المكتب المعتمدة ===
اسم المكتب: مكتب شومان للمحاماة (Shoman Law Firm)
العنوان: ٦ شارع السباح عبدالمنعم، الحي السابع، مدينة نصر، القاهرة، مصر.
البريد الإلكتروني: info@shoman-lawfirm.com
أرقام الهاتف المعتمدة (يتم عرضهما معاً وبنفس الأهمية دائمًا):
- 01066650075
- +20 102 410 1115
الموقع الرسمي: shoman-lawfirm.com

=== مجالات التخصص والخدمات ===
- القضايا المدنية
- القضايا التجارية
- صياغة ومراجعة العقود والاتفاقيات
- تأسيس الشركات والاستثمار
- التحكيم وتسوية المنازعات
- قضايا الأسرة والأحوال الشخصية
- قضايا العمل والنزاعات العمالية
- القضايا الجنائية وقضايا الأموال العامة
- التفاوض والتسويات القانونية
- الاستشارات القانونية

=== فريق العمل ===
- ربيع شومان — المؤسس والمدير التنفيذي
- بلال هارون — محامٍ أول
- مروان محمد — محامٍ ومستشار قانوني
- عماد صابر — محامٍ متخصص في القضايا المدنية
- مازن وليد — محامٍ متخصص في القضايا الجنائية
- مريم علي — محامية متخصصة في قضايا الأسرة
- إبراهيم حمدي — محامٍ متخصص في التحكيم وتسوية المنازعات

=== مواعيد العمل ===
- السبت إلى الخميس: من 9:00 صباحًا إلى 6:00 مساءً
- الجمعة: عطلة أسبوعية (مغلق)
- طوارئ الاستشارات العاجلة: متاحة على مدار 24 ساعة عبر الهاتف والواتساب.

=== القواعد الإلزامية للإجابة ===
1. أجب باللغة العربية إذا تحدث العميل بالعربية، وبالإنجليزية إذا تحدث العميل بالإنجليزية.
2. اجعل الإجابات واضحة ومباشرة ومناسبة لـ WhatsApp دون إطالة غير مبررة.
3. استخدم فقط المعلومات المعتمدة هنا عند الحديث عن المكتب ومواعيده وخدماته.
4. لا تخترع أي أسعار أو أتعاب أو تواريخ غير مذكورة.
5. إذا سألك العميل عن معلومة أو سعر غير موجود هنا، قل: "لا أملك هذه المعلومة حاليًا، ويمكن لأحد أعضاء فريق المكتب مساعدتك." وقدم أرقام التواصل (01066650075 و +20 102 410 1115).
6. إذا طلب العميل نصيحة قانونية خاصة بقضيته أو حكم نهائي، وضح له أن تقييم الحالة القانونية وتقديم المشورة الملزمة يتطلب دراسة الأوراق ومراجعة أحد محامي المكتب، واعرض عليه حجز استشارة أو التواصل مع الفريق.
7. أنت مساعد معلوماتي ذكي للمكتب ولست محامياً يصدر أحكاماً قضائية قطعية.
8. إذا سأل العميل عن حجز موعد، أخبره أن فريق المكتب يسعده التنسيق لحجز موعد استشارة بمقر المكتب أو هاتفياً.`;

// Candidate models to try in order of priority (handles temporary 503 high demand spikes smoothly)
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.6-flash', 'gemini-3.8-flash'];

// Lazy Gemini SDK client initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check API route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// 2. Chat Streaming API route (Server-Sent Events)
app.post('/api/chat/stream', async (req, res) => {
  const { message, history, attachmentName } = req.body;

  if (!message && !attachmentName) {
    res.status(400).json({ error: 'Message or attachment is required' });
    return;
  }

  const ai = getGenAI();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  if (!ai) {
    // If GEMINI_API_KEY is not configured yet
    const fallbackNotice =
      'مرحباً بك! تم تجهيز وربط المساعد الذكي بـ Google Gemini API بنجاح. يرجى تزويد مفتاح GEMINI_API_KEY في إعدادات المنصة (Settings > Secrets) للبدء في استلام الإجابات الفورية من Gemini.';
    res.write(`data: ${JSON.stringify({ chunk: fallbackNotice })}\n\n`);
    res.write(`data: [DONE]\n\n`);
    res.end();
    return;
  }

  const formattedContents: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }> = [];

  if (Array.isArray(history)) {
    for (const h of history) {
      if (h && h.content && (h.role === 'user' || h.role === 'assistant')) {
        formattedContents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(h.content) }],
        });
      }
    }
  }

  const currentPrompt = attachmentName
    ? `[مستند مرفق من العميل: ${attachmentName}]\n${message || ''}`
    : message || '';

  formattedContents.push({
    role: 'user',
    parts: [{ text: currentPrompt }],
  });

  // Try candidate models in succession to gracefully avoid temporary 503 high demand spikes
  let streamSucceeded = false;
  let lastError: unknown = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const streamResponse = await ai.models.generateContentStream({
        model: modelName,
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.3,
        },
      });

      for await (const chunk of streamResponse) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ chunk: chunk.text })}\n\n`);
        }
      }

      streamSucceeded = true;
      break;
    } catch {
      // Gracefully advance to next candidate model if current one is unavailable
    }
  }

  if (!streamSucceeded) {
    const fallbackReply =
      'أهلاً بك في مكتب شومان للمحاماة والاستشارات القانونية. يمكنك التواصل المباشر مع محامي المكتب على الأرقام: 01066650075 و 01024101115، أو التفضل بزيارة مقر المكتب بمدينة نصر (٦ شارع السباح عبدالمنعم، الحي السابع). يسعدنا تقديم المشورة القانونية اللازمة لقضيتك.';
    res.write(`data: ${JSON.stringify({ chunk: fallbackReply })}\n\n`);
  }

  res.write(`data: [DONE]\n\n`);
  res.end();
});

// 3. Chat Standard API route (JSON)
app.post('/api/chat', async (req, res) => {
  const { message, history, attachmentName } = req.body;

  if (!message && !attachmentName) {
    res.status(400).json({ error: 'Message or attachment is required' });
    return;
  }

  const ai = getGenAI();

  if (!ai) {
    res.json({
      reply:
        'مرحباً بك! تم تجهيز وربط المساعد الذكي بـ Google Gemini API بنجاح. يرجى تزويد مفتاح GEMINI_API_KEY في إعدادات المنصة (Settings > Secrets) للبدء في استلام الإجابات الفورية من Gemini.',
    });
    return;
  }

  const formattedContents: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }> = [];

  if (Array.isArray(history)) {
    for (const h of history) {
      if (h && h.content && (h.role === 'user' || h.role === 'assistant')) {
        formattedContents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(h.content) }],
        });
      }
    }
  }

  const currentPrompt = attachmentName
    ? `[مستند مرفق من العميل: ${attachmentName}]\n${message || ''}`
    : message || '';

  formattedContents.push({
    role: 'user',
    parts: [{ text: currentPrompt }],
  });

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.3,
        },
      });

      if (response.text) {
        res.json({ reply: response.text });
        return;
      }
    } catch {
      // Gracefully advance to next candidate model
    }
  }

  // Graceful fallback if models fail
  res.json({
    reply:
      'أهلاً بك في مكتب شومان للمحاماة والاستشارات القانونية. يمكنك التواصل المباشر مع محامي المكتب على الأرقام: 01066650075 و 01024101115، أو التفضل بزيارة مقر المكتب بمدينة نصر (٦ شارع السباح عبدالمنعم، الحي السابع). يسعدنا تقديم المشورة القانونية اللازمة لقضيتك.',
  });
});

// 4. Vite middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
