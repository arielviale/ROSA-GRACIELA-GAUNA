import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const aiInstance = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });

app.post('/api/breakfast', async (req, res) => {
  const { foodInput } = req.body || {};
  const prompt = `Como experto médico endocrinólogo, analiza este desayuno: "${foodInput}". 
  Calcula el tiempo de espera óptimo tras tomar LEVOTIROXINA.
  Criterios:
  - 60 min si incluye: Café, Té, Leche, Queso, Calcio, Hierro, Soja, Fibra alta, Papaya o Comida muy pesada.
  - 30 min si es: Ligero, sin inhibidores conocidos (ej. solo fruta ligera como manzana, tostada sencilla, agua).
  Responde con un JSON que tenga 'minutes' (number) y 'reason' (string, una explicación breve, experta y amable).`;

  try {
    const response = await aiInstance().models.generateContent({
      model: 'gemini-3-flash-preview',
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
    const parsed = JSON.parse(response.text || '{"minutes":30,"reason":"30 minutos es el tiempo recomendado estándar."}');
    res.json(parsed);
  } catch (error) {
    console.error('Gemini breakfast error:', error);
    res.json({ minutes: 30, reason: 'No pude analizarlo, 30 minutos es el estándar seguro.' });
  }
});

app.post('/api/tips', async (req, res) => {
  const { symptoms } = req.body || {};
  const recentSymptoms = (Array.isArray(symptoms) ? symptoms.slice(0, 5).map(s => (Array.isArray(s) ? s.join(', ') : s)).join('; ') : 'ninguno');
  const prompt = `Actúa como un experto en salud tiroidea. Basado en síntomas: "${recentSymptoms || 'ninguno'}". Proporciona 3 consejos breves y empáticos sobre Alimentación, Mente e Información. Responde solo en JSON.`;

  try {
    const response = await aiInstance().models.generateContent({
      model: 'gemini-3-flash-preview',
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
    const parsed = JSON.parse(response.text || '[]');
    res.json(parsed);
  } catch (error) {
    console.error('Gemini tips error:', error);
    res.json([
      { category: 'Alimentación', content: 'Prioriza alimentos con selenio para apoyar tu tiroides.' },
      { category: 'Mente', content: 'Dedica 5 minutos hoy a la respiración consciente.' },
      { category: 'Información', content: 'La consistencia en la hora de tu dosis es clave.' }
    ]);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Gemini proxy listening on http://localhost:${port}`));
