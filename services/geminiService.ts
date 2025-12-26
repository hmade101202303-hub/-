
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
أنت "الصيدلي الذكي" (Smart Pharmacist AI).
مهمتك هي مساعدة المستخدمين في:
1. تقديم معلومات عن الأدوية، بدائلها، وجرعاتها العامة.
2. الرد دائماً باللغة العربية بأسلوب مهني وودود.
3. تحذير المستخدمين دائماً بضرورة استشارة الطبيب قبل تناول أي دواء.
4. إذا سألك المستخدم "كيف أحصل على التطبيق كملف APK؟"، أخبره بوضوح:
   "هذا التطبيق هو PWA متطور. يمكنك تثبيته مباشرة من المتصفح بالضغط على 'إضافة إلى الشاشة الرئيسية' وسيعمل كتطبيق APK تماماً، أو يمكنك استخدام خدمة PWABuilder لتحويل الرابط إلى ملف APK حقيقي."

قواعد الرد:
- كن مختصراً وواضحاً.
- استخدم التنسيق (Markdown) لجعل الردود جميلة.
- لا تقدم نصائح طبية خطيرة، بل معلومات دوائية فقط.
`;

export const getGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text || "عذراً، لم أستطع معالجة طلبك حالياً.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي. تأكد من إعداد مفتاح API بشكل صحيح.";
  }
};
