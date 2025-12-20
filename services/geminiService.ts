
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { SymptomEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getPersonalizedTip(symptoms: SymptomEntry[]) {
  const recentSymptoms = symptoms.slice(0, 5).map(s => s.symptoms.join(', ')).join('; ');
  
  const prompt = `Actúa como un experto en salud tiroidea y bienestar holístico. 
  Basado en estos síntomas recientes de un paciente con hipotiroidismo: "${recentSymptoms || 'ninguno registrado'}".
  Proporciona 3 consejos breves y empáticos categorizados como "Alimentación", "Mente" e "Información".
  No uses jerga médica compleja. Sé alentador.
  Formato JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              content: { type: Type.STRING },
              icon: { type: Type.STRING }
            },
            required: ['category', 'content']
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error fetching Gemini tips:", error);
    return [
      { category: 'Alimentación', content: 'Consume nueces de Brasil (2 al día) para obtener selenio natural.', icon: 'nuts' },
      { category: 'Mente', content: 'Practica la respiración de caja por 2 minutos para reducir el cortisol.', icon: 'wind' },
      { category: 'Información', content: 'La absorción es óptima con el estómago vacío y solo agua.', icon: 'droplet' }
    ];
  }
}
