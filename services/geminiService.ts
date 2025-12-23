
import { GoogleGenAI, Type } from "@google/genai";
import { SymptomEntry, Tip } from "../types";

/**
 * Servicio para obtener consejos personalizados utilizando Gemini API.
 * Se ha optimizado para evitar errores de permisos y asegurar compatibilidad.
 */
export async function getPersonalizedTip(symptoms: SymptomEntry[]): Promise<Tip[]> {
  // Crear la instancia dentro de la función para asegurar que usa la clave API inyectada en el momento.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const recentSymptoms = symptoms.slice(0, 5).map(s => s.symptoms.join(', ')).join('; ');
  
  const prompt = `Actúa como un experto en salud tiroidea y bienestar holístico. 
  Basado en estos síntomas recientes de un paciente con hipotiroidismo: "${recentSymptoms || 'ninguno registrado'}".
  Proporciona 3 consejos breves y empáticos categorizados estrictamente como "Alimentación", "Mente" e "Información".
  No uses jerga médica compleja. Sé alentador y directo.
  Responde ÚNICAMENTE en formato JSON.`;

  try {
    // Usamos 'gemini-flash-latest' que ofrece una compatibilidad de permisos más amplia y estable.
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { 
                type: Type.STRING,
                description: 'La categoría del consejo: Alimentación, Mente o Información.'
              },
              content: { 
                type: Type.STRING,
                description: 'El contenido del consejo práctico.'
              },
              icon: { 
                type: Type.STRING,
                description: 'Un identificador corto para el icono (opcional).'
              }
            },
            required: ['category', 'content']
          }
        }
      }
    });

    // Acceso directo a .text según las directrices de @google/genai
    const responseText = response.text;
    if (!responseText) throw new Error("Respuesta vacía de la API");
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error al obtener consejos de Gemini:", error);
    
    // Fallback robusto en caso de error de API (incluyendo el 403)
    return [
      { 
        category: 'Alimentación', 
        content: 'Prioriza alimentos ricos en selenio como las nueces de Brasil para apoyar la función tiroidea.', 
        icon: 'apple' 
      },
      { 
        category: 'Mente', 
        content: 'El estrés bloquea la conversión de T4 a T3. Dedica 5 minutos a meditación guiada hoy.', 
        icon: 'brain' 
      },
      { 
        category: 'Información', 
        content: 'Recuerda esperar al menos 30-60 minutos después de tu dosis para ingerir cualquier alimento o café.', 
        icon: 'info' 
      }
    ];
  }
}
