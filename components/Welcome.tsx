
import React from 'react';
import { ArrowRight, Heart, Sparkles, ShieldCheck } from 'lucide-react';

interface WelcomeProps {
  onComplete: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Fondos degradados suaves para dar profundidad */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-50 rounded-full blur-[100px] opacity-60" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-50 rounded-full blur-[100px] opacity-60" />
      
      <div className="relative max-w-lg w-full flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-1000">
        
        {/* Contenedor del Logo - Limpio y sin recortes */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center transition-transform duration-700 hover:scale-105">
          <img 
            src="/logo.png" 
            alt="Hipotiroidismo Consciente" 
            className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
            loading="eager"
            onLoad={(e) => (e.currentTarget.style.opacity = '1')}
            style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }}
          />
        </div>

        {/* Textos de Identidad */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-orange-500 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
            <Sparkles size={14} className="animate-pulse" />
            <span>Bienestar Consciente</span>
            <Sparkles size={14} className="animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter">
            Hipotiroidismo<br/>
            <span className="text-orange-600">Consciente</span>
          </h1>

          <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-xs mx-auto font-medium italic">
            "Sintoniza con tu cuerpo y recupera tu energía vital."
          </p>
        </div>

        {/* Botón de Acción Principal */}
        <div className="w-full max-w-xs pt-4">
          <button
            onClick={onComplete}
            className="group relative w-full inline-flex items-center justify-center gap-3 bg-[#0F172A] hover:bg-orange-600 text-white font-bold py-5 rounded-[2rem] shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            <span className="text-xl">Empezar mi Ritual</span>
            <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>

        {/* Valores de Marca */}
        <div className="flex items-center gap-6 pt-6 opacity-40">
          <div className="flex flex-col items-center gap-1">
             <Heart size={16} className="text-orange-500" fill="currentColor" />
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Salud</span>
          </div>
          <div className="w-px h-6 bg-slate-300" />
          <div className="flex flex-col items-center gap-1">
             <ShieldCheck size={16} className="text-sky-600" />
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Confianza</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
