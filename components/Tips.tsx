
import React from 'react';
import { Lightbulb, Apple, Brain, Info, Sparkles, Heart, Smartphone, Share } from 'lucide-react';
import { SymptomEntry, Tip } from '../types';

interface TipsProps {
  symptoms: SymptomEntry[];
  isInstalled?: boolean;
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

const Tips: React.FC<TipsProps> = ({ isInstalled }) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

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
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <section className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Vida Consciente</h2>
          <p className="text-slate-500 text-sm italic">Sintonía diaria con tu bienestar</p>
        </div>
        <div className="bg-orange-100 p-2 rounded-xl">
           <Heart size={20} className="text-orange-600" fill="currentColor" />
        </div>
      </section>

      {!isInstalled && (
        <section className="bg-slate-900 border-4 border-[#1A1A1A] p-8 rounded-[3rem] text-white shadow-[8px_8px_0px_#FF7043] animate-in zoom-in duration-500">
           <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-white/10 rounded-2xl">
               <Smartphone size={24} className="text-orange-400" />
             </div>
             <h3 className="font-black text-xl">Lleva tu app contigo</h3>
           </div>
           
           {isIOS ? (
             <div className="space-y-4">
               <p className="text-slate-300 font-bold leading-relaxed">Instala en tu iPhone para acceso sin internet:</p>
               <ol className="space-y-3 text-sm font-medium">
                 <li className="flex gap-3 items-center">
                   <div className="bg-white/20 px-2 py-0.5 rounded-lg font-black">1</div>
                   <span>Toca el icono <strong>Compartir</strong> <Share className="inline-block mx-1" size={16}/> abajo en Safari.</span>
                 </li>
                 <li className="flex gap-3 items-center">
                   <div className="bg-white/20 px-2 py-0.5 rounded-lg font-black">2</div>
                   <span>Busca la opción <strong>"Añadir a pantalla de inicio"</strong>.</span>
                 </li>
                 <li className="flex gap-3 items-center">
                   <div className="bg-white/20 px-2 py-0.5 rounded-lg font-black">3</div>
                   <span>Toca <strong>Añadir</strong> y ¡listo!</span>
                 </li>
               </ol>
             </div>
           ) : (
             <p className="text-slate-300 font-bold leading-relaxed">
               Usa el menú de tu navegador (los tres puntos ⋮) y selecciona <strong>"Instalar aplicación"</strong> para usarla como una app nativa.
             </p>
           )}
        </section>
      )}

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

      <section className="bg-white rounded-[2.5rem] p-8 border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] relative overflow-hidden mt-8">
        <Lightbulb className="absolute top-6 right-6 text-orange-400 opacity-20 w-16 h-16 rotate-12" />
        
        <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-slate-900">
          <Sparkles className="text-orange-400" size={20} />
          ¿Por qué es importante?
        </h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 max-w-lg">
          Vivir con hipotiroidismo requiere un enfoque integral. Tu medicación es la base, pero el estilo de vida consciente potencia su eficacia. Pequeños ajustes en tu nutrición y manejo del estrés marcan la diferencia en cómo te sientes cada día.
        </p>
        <div className="flex flex-wrap gap-2">
          {['#Absorción', '#T3Activa', '#RitualConsciente', '#Vitalidad'].map(tag => (
            <span key={tag} className="bg-slate-100 border-2 border-slate-200 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
              {tag}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Tips;
