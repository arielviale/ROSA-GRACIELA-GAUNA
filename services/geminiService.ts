
import { GoogleGenAI, Type } from "@google/genai";
import { SymptomEntry, Tip } from "../types";

const aiInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getPersonalizedTip(symptoms: SymptomEntry[]): Promise<Tip[]> {
  const ai = aiInstance();
  const recentSymptoms = symptoms.slice(0, 5).map(s => s.symptoms.join(', ')).join('; ');
  
  const prompt = `Actúa como un experto en salud tiroidea. Basado en síntomas: "${recentSymptoms || 'ninguno'}". Proporciona 3 consejos breves y empáticos sobre Alimentación, Mente e Información. Responde solo en JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              content: { type: Type.STRING }
            },
            required: ['category', 'content']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [
      { category: 'Alimentación', content: 'Prioriza alimentos con selenio para apoyar tu tiroides.' },
      { category: 'Mente', content: 'Dedica 5 minutos hoy a la respiración consciente.' },
      { category: 'Información', content: 'La consistencia en la hora de tu dosis es clave.' }
    ];
  }
}

/**
 * Determina el tiempo de espera basado en el desayuno planeado usando Gemini.
 */
export async function getBreakfastRecommendation(foodInput: string): Promise<{ minutes: number; reason: string }> {
  const ai = aiInstance();
  const prompt = `Como experto médico endocrinólogo, analiza este desayuno: "${foodInput}". 
  Calcula el tiempo de espera óptimo tras tomar LEVOTIROXINA.
  Criterios:
  - 60 min si incluye: Café, Té, Leche, Queso, Calcio, Hierro, Soja, Fibra alta, Papaya o Comida muy pesada.
  - 30 min si es: Ligero, sin inhibidores conocidos (ej. solo fruta ligera como manzana, tostada sencilla, agua).
  Responde con un JSON que tenga 'minutes' (number) y 'reason' (string, una explicación breve, experta y amable).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            minutes: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          },
          required: ['minutes', 'reason']
        }
      }
    });
    return JSON.parse(response.text || '{"minutes": 30, "reason": "30 minutos es el tiempo recomendado estándar."}');
  } catch (error) {
    console.error("AI Error:", error);
    return { minutes: 30, reason: "No pude analizarlo, pero 30 minutos es el estándar seguro." };
  }
}
