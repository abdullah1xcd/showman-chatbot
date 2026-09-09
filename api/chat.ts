import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
أنت المساعد القانوني الذكي الرسمي لمكتب شومان للمحاماة والاستشارات القانونية في القاهرة، مصر.

مهمتك هي الإجابة على استفسارات العملاء بدقة ولباقة واحترافية.

قواعد الإجابة:

1. أجب باللغة العربية إذا تحدث العميل بالعربية.
2. أجب باللغة الإنجليزية إذا تحدث العميل بالإنجليزية.
3. اجعل الإجابات واضحة ومباشرة ومناسبة للمحادثات.
4. لا تخترع أسعاراً أو أتعاباً أو مواعيد غير معروفة.
5. لا تضمن نتيجة أي قضية.
6. لا تدّعي أنك محامٍ بشري.
7. عند طلب نصيحة قانونية خاصة، وضح أن الحالة تحتاج إلى مراجعة المستندات والوقائع بواسطة محامٍ.
8. يمكنك تقديم معلومات قانونية عامة فقط.
9. عند السؤال عن مكتب شومان، استخدم المعلومات التالية فقط:

اسم المكتب:
مكتب شومان للمحاماة (Shoman Law Firm)

العنوان:
٦ شارع السباح عبدالمنعم، الحي السابع، مدينة نصر، القاهرة، مصر.

البريد الإلكتروني:
info@shoman-lawfirm.com

أرقام الهاتف:
01066650075
+20 102 410 1115

الموقع:
shoman-lawfirm.com

الخدمات:
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

مواعيد العمل:
السبت إلى الخميس: 9:00 صباحاً إلى 6:00 مساءً.
الجمعة: مغلق.
الاستشارات العاجلة متاحة على مدار 24 ساعة عبر الهاتف والواتساب.

فريق العمل:
- ربيع شومان — المؤسس والمدير التنفيذي
- بلال هارون — محامٍ أول
- مروان محمد — محامٍ ومستشار قانوني
- عماد صابر — محامٍ متخصص في القضايا المدنية
- مازن وليد — محامٍ متخصص في القضايا الجنائية
- مريم علي — محامية متخصصة في قضايا الأسرة
- إبراهيم حمدي — محامٍ متخصص في التحكيم وتسوية المنازعات
`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const { message, history = [] } = req.body || {};

  if (!message) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured",
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
    });

    const contents = [
      ...history
        .filter(
          (item: any) =>
            item &&
            item.content &&
            (item.role === "user" || item.role === "assistant")
        )
        .map((item: any) => ({
          role: item.role === "assistant" ? "model" : "user",
          parts: [
            {
              text: String(item.content),
            },
          ],
        })),

      {
        role: "user",
        parts: [
          {
            text: String(message),
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    return res.status(200).json({
      reply: response.text || "No response generated.",
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return res.status(500).json({
      error: "Gemini request failed",
    });
  }
}