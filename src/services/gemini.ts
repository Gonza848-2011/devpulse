import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateProjectIdea(topic: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a creative and successful GitHub project idea related to: ${topic}. Provide a title, a short description, and 3 key features.`,
  });
  return response.text;
}
