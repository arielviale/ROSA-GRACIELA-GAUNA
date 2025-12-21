
import React, { useState } from 'react';
import { Sparkles, ArrowRight, Heart, ImageOff, RefreshCw } from 'lucide-react';

interface WelcomeProps {
  onComplete: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const retryLoad = () => {
    setImgStatus('loading');
    // Forzamos recarga con un query param para evitar caché
    const timestamp = Date.now();
    const testImg = new Image();
    testImg.onload = () => setImgStatus('loaded');
    testImg.onerror = () => setImgStatus('error');
    testImg.src = `./logo.png?t=${timestamp}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-orange-50 via-white to-sky-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-yellow-200 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-40" />
      
      <div className="relative max-w-lg w-full space-y-6 animate-in fade-in zoom-in duration-1000">
        {/* Logo Principal */}
        <div className="relative inline-block group min-h-[18rem] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-300 to-yellow-300 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          
          {imgStatus !== 'error' ? (
            <img 
              src="./logo.png" 
              alt="Hipotiroidismo Consciente Logo" 
              className={`relative w-72 h-72 md:w-96 md:h-96 mx-auto object-contain drop-shadow-2xl transform transition-all duration-700 ${imgStatus === 'loading' ? 'opacity-0 scale-95' : 'opacity-100 scale-100 group-hover:scale-105'}`}
              onLoad={() => setImgStatus('loaded')}
              onError={() => setImgStatus('error')}
            />
          ) : (
            <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-[3rem] border-4 border-dashed border-orange-200 p-8 shadow-inner">
              <ImageOff size={48} className="text-orange-300 mb-4" />
              <p className="text-orange-600 font-bold text-sm mb-4 leading-tight">
                El archivo <span className="bg-orange-100 px-2 py-0.5 rounded text-xs font-mono">logo.png</span><br/>está presente pero no carga.
              </p>
              <button 
                onClick={retryLoad}
                className="flex items-center gap-2 text-xs font-bold text-orange-500 hover:text-orange-700 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100"
              >
                <RefreshCw size={14} /> Reintentar Carga
              </button>
            </div>
          )}

          {imgStatus === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-center gap-2 text-orange-500 font-bold uppercase tracking-[0.2em] text-xs">
            <Heart size={14} fill="currentColor" />
            <span>Bienestar Holístico</span>
            <Heart size={14} fill="currentColor" />
          </div>

          <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto font-medium">
            "Tu camino hacia una vida vibrante comienza aquí. Sintoniza con tu cuerpo y recupera tu energía."
          </p>
        </div>

        <button
          onClick={onComplete}
          className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-12 rounded-[2rem] shadow-xl shadow-orange-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <span className="text-lg">Entrar a mi Ritual</span>
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
          Salud • Conciencia • Vitalidad
        </p>
      </div>
    </div>
  );
};

export default Welcome;
