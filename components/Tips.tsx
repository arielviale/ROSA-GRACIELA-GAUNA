
import React from 'react';
import { Lightbulb, Apple, Brain, Info, Sparkles, Heart, Coffee } from 'lucide-react';
import { SymptomEntry, Tip } from '../types';

interface TipsProps {
  symptoms: SymptomEntry[];
}

const STATIC_TIPS: Tip[] = [
  { 
    category: 'Alimentación', 
    content: 'Prioriza alimentos ricos en selenio como las nueces de Brasil para apoyar la función tiroidea.', 
    icon: 'apple' 
  },
  { 
    category: 'Mente', 
    content: 'El estrés bloquea la conversión de T4 a T3. Dedica 5 minutos a meditación consciente hoy.', 
    icon: 'brain' 
  },
  { 
    category: 'Información', 
    content: 'Recuerda esperar al menos 30-60 minutos después de tu dosis para ingerir café o alimentos.', 
    icon: 'info' 
  },
  {
    category: 'Alimentación',
    content: 'El exceso de soja cruda o crucíferas en grandes cantidades puede interferir con la absorción de yodo.',
    icon: 'apple'
  }
];

const Tips: React.FC<TipsProps> = () => {
  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'alimentación': return <Apple className="text-emerald-500" />;
      case 'mente': return <Brain className="text-sky-500" />;
      case 'información': return <Info className="text-yellow-600" />;
      default: return <Sparkles className="text-orange-500" />;
    }
  };

  const getBg = (category: string) => {
    switch (category.toLowerCase()) {
      case 'alimentación': return 'bg-emerald-50 border-emerald-100';
      case 'mente': return 'bg-sky-50 border-sky-100';
      case 'información': return 'bg-yellow-50 border-yellow-100';
      default: return 'bg-orange-50 border-orange-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <section className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Vida Consciente</h2>
          <p className="text-slate-500 text-sm italic">Sintonía diaria con tu bienestar</p>
        </div>
        <div className="bg-orange-100 p-2 rounded-xl">
           <Heart size={20} className="text-orange-600" fill="currentColor" />
        </div>
      </section>

      <div className="grid gap-4">
        {STATIC_TIPS.map((tip, idx) => (
          <div 
            key={idx} 
            className={`group p-6 rounded-[2.2rem] border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${getBg(tip.category)}`}
          >
            <div className="flex items-start gap-5">
              <div className="bg-white p-4 rounded-2xl shadow-sm transition-transform group-hover:rotate-6">
                {getIcon(tip.category)}
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {tip.category}
                </span>
                <p className="text-slate-800 font-bold leading-relaxed text-lg">
                  {tip.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden mt-8 shadow-2xl">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-orange-500 rounded-full blur-[80px] opacity-20" />
        <Lightbulb className="absolute top-6 right-6 text-orange-400 opacity-20 w-16 h-16 rotate-12" />
        
        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
          <Sparkles className="text-orange-400" size={20} />
          ¿Por qué es importante?
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-lg">
          Vivir con hipotiroidismo requiere un enfoque integral. Tu medicación es la base, pero el estilo de vida consciente potencia su eficacia. Pequeños ajustes en tu nutrición y manejo del estrés marcan la diferencia en cómo te sientes cada día.
        </p>
        <div className="flex flex-wrap gap-2">
          {['#Absorción', '#T3Activa', '#RitualConsciente', '#Vitalidad'].map(tag => (
            <span key={tag} className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Tips;
