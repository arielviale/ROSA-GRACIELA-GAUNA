
import React, { useState, useEffect } from 'react';
import { Lightbulb, Apple, Brain, Info, Sparkles, RefreshCw } from 'lucide-react';
import { getPersonalizedTip } from '../services/geminiService';
import { SymptomEntry, Tip } from '../types';

interface TipsProps {
  symptoms: SymptomEntry[];
}

const Tips: React.FC<TipsProps> = ({ symptoms }) => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTips = async () => {
    setLoading(true);
    const data = await getPersonalizedTip(symptoms);
    setTips(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTips();
  }, []);

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
          <p className="text-slate-500 text-sm">Consejos personalizados impulsados por IA</p>
        </div>
        <button 
          onClick={fetchTips}
          className="p-2 text-sky-600 hover:bg-sky-100 rounded-full transition-colors"
          title="Actualizar consejos"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </section>

      {loading ? (
        <div className="grid gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-sky-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {tips.map((tip, idx) => (
            <div key={idx} className={`p-6 rounded-[2rem] border-2 transition-all hover:scale-[1.01] ${getBg(tip.category)}`}>
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm">
                  {getIcon(tip.category)}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60 block mb-1">
                    {tip.category}
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {tip.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden mt-8">
        <Lightbulb className="absolute top-4 right-4 text-white opacity-10 w-24 h-24 rotate-12" />
        <h3 className="text-xl font-bold mb-4">¿Por qué es importante?</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          El hipotiroidismo no solo se trata con medicación; el estilo de vida, la gestión del estrés y los micronutrientes como el selenio y el zinc juegan un papel crucial en la conversión de T4 a T3 activa.
        </p>
        <div className="flex flex-wrap gap-3">
          <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">#Absorcion</span>
          <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">#T3Activa</span>
          <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">#Energia</span>
        </div>
      </section>
    </div>
  );
};

export default Tips;
