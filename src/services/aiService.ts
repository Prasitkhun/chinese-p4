import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export class AIService {
  private static localFaq = [
    { q: "how to say hello", a: "You say 'Nǐ hǎo' (你好)." },
    { q: "where is the cinema", a: "You say 'Nàlǐ shì diànyǐngyuàn' (那里是电影院)." },
    { q: "is it raining", a: "Check Chapter 2! 'Xià yǔ' (下雨) means raining." },
  ];

  static async ask(question: string): Promise<string> {
    if (navigator.onLine && apiKey) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash-exp", // Using a stable model name from known list or similar
          contents: `You are a friendly Chinese teacher for primary school students. 
          Answer the following question simply and clearly in English and Chinese: ${question}`
        });
        
        return response.text || "I'm sorry, I couldn't process that.";
      } catch (e) {
        console.error("Gemini AI error, falling back to local:", e);
        return this.localFallback(question);
      }
    } else {
      return this.localFallback(question);
    }
  }

  private static localFallback(question: string): string {
    const q = question.toLowerCase();
    const match = this.localFaq.find(faq => q.includes(faq.q));
    if (match) return match.a + " (Offline Mode)";
    
    return "I am currently offline. I can answer basic questions like 'how to say hello' or questions about the lessons. (Offline Mode)";
  }
}
