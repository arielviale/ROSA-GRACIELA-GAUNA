
import { SymptomEntry, Tip } from "../types";

export async function getPersonalizedTip(symptoms: SymptomEntry[]): Promise<Tip[]> {
  try {
    const resp = await fetch('/api/tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms: symptoms.map(s => s.symptoms) })
    });
    if (!resp.ok) throw new Error('Network error');
    return await resp.json();
  } catch (error) {
    return [
      { category: 'Alimentación', content: 'Prioriza alimentos con selenio para apoyar tu tiroides.' },
      { category: 'Mente', content: 'Dedica 5 minutos hoy a la respiración consciente.' },
      { category: 'Información', content: 'La consistencia en la hora de tu dosis es clave.' }
    ];
  }
}

/**
 * Determina el tiempo de espera basado en el desayuno planeado usando el proxy server.
 */
export async function getBreakfastRecommendation(foodInput: string): Promise<{ minutes: number; reason: string }> {
  try {
    const resp = await fetch('/api/breakfast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodInput })
    });
    if (!resp.ok) throw new Error('Network error');
    return await resp.json();
  } catch (error) {
    console.error('Breakfast recommendation error:', error);
    return { minutes: 30, reason: 'No pude analizarlo, 30 minutos es el estándar seguro.' };
  }
}
