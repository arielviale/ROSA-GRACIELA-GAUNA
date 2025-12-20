
export interface UserProfile {
  name: string;
  weight: number;
  currentDose: number; // in mcg
  age?: number;
}

export interface SymptomEntry {
  id: string;
  date: string;
  symptoms: string[];
  notes: string;
}

export interface WeightEntry {
  date: string;
  weight: number;
  dose: number;
}

export interface Tip {
  category: 'Alimentación' | 'Mente' | 'Información';
  content: string;
  icon?: string;
}

export enum RitualState {
  WAITING = 'WAITING',
  TAKEN = 'TAKEN',
  READY_TO_EAT = 'READY_TO_EAT'
}
