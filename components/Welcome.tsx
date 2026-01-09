
import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, User, Scale, Pill, Heart, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { ThyroidFriendLogo } from '../App';

interface WelcomeProps {
  onComplete: (profile: UserProfile) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'splash' | 'form'>('splash');
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    weight: 70,
    currentDose: 100
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.weight > 0 && formData.currentDose > 0) {
      onComplete(formData);
    }
  };

  if (step === 'splash') {
    return (
      <div className="fixed inset-0 z-[100] bg-[#FFFBF2] flex flex-col items-center justify-center p-4 md:p-6 text-center overflow-hidden font-['Outfit']">
        <div className="absolute top-[-5%] right-[-5%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-orange-200/20 rounded-full blur-[80px] md:blur-[100px]" />

        <div className="relative max-w-2xl w-full flex flex-col items-center gap-6 md:gap-10 animate-in fade-in zoom-in duration-1000">
          <div className="space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-2.5 bg-white text-[#1A1A1A] rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] border-3 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] md:shadow-[4px_4px_0px_#1A1A1A]">
              <Sparkles size={12} className="text-[#FF7043]" />
              <span>GESTIÓN VITAL CONSCIENTE</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-[#1A1A1A] tracking-tighter leading-[0.85] uppercase">
              Hipotiroidismo<br /><span className="text-[#FF7043] drop-shadow-[3px_3px_0px_#1A1A1A] md:drop-shadow-[4px_4px_0px_#1A1A1A]">Consciente</span>
            </h1>
          </div>

          <div className="relative">
            <div className="relative bg-white p-4 md:p-6 rounded-full shadow-[8px_8px_0px_#1A1A1A] md:shadow-[10px_10px_0px_#1A1A1A] border-4 md:border-8 border-[#1A1A1A] transform rotate-2">
              <ThyroidFriendLogo size={160} className="md:w-[240px] md:h-[240px]" />
            </div>
          </div>

          <p className="text-[#1A1A1A] text-lg md:text-2xl font-black max-w-xs md:max-w-md leading-tight md:leading-relaxed">
            Tu viaje diario hacia el equilibrio y la energía profunda.
          </p>

          <button
            onClick={() => setStep('form')}
            className="group w-full max-w-sm bg-[#1A1A1A] text-white font-black py-5 md:py-8 rounded-[2rem] md:rounded-[3rem] shadow-[6px_6px_0px_#FFB84D] md:shadow-[10px_10px_0px_#FFB84D] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex items-center justify-center gap-3 md:gap-5"
          >
            <span className="text-xl md:text-2xl uppercase tracking-widest">¡VAMOS ALLÁ!</span>
            <ArrowRight size={24} className="md:w-[32px] md:h-[32px]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#FFFBF2] flex items-center justify-center p-4 md:p-6 font-['Outfit'] overflow-y-auto pt-10">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[4rem] shadow-[8px_8px_0px_#1A1A1A] md:shadow-[15px_15px_0px_#1A1A1A] p-6 md:p-12 space-y-6 md:space-y-10 animate-in slide-in-from-bottom-12 duration-700 border-4 md:border-8 border-[#1A1A1A] my-auto">
        <div className="text-center space-y-2 md:space-y-3">
          <ThyroidFriendLogo size={80} className="md:w-[120px] md:h-[120px]" />
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1A1A1A]">Cuéntame de ti</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Personaliza tu experiencia consciente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          <div className="space-y-2 md:space-y-4">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7043] ml-4 md:ml-6 flex items-center gap-2">
              <User size={12} /> ¿Cuál es tu nombre?
            </label>
            <input
              required
              type="text"
              placeholder="Ej. Sofía"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#FFFBF2] border-3 md:border-4 border-[#1A1A1A] px-5 py-4 md:px-8 md:py-6 rounded-2xl md:rounded-[2rem] outline-none transition-all font-black text-lg md:text-xl text-slate-800 focus:bg-orange-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2 md:space-y-4">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7043] ml-4 md:ml-6 flex items-center gap-2">
                <Scale size={12} /> Peso (kg)
              </label>
              <input required type="number" step="0.1" value={formData.weight} onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) })} className="w-full bg-[#FFFBF2] border-3 md:border-4 border-[#1A1A1A] px-5 py-4 md:px-8 md:py-6 rounded-2xl md:rounded-[2rem] outline-none transition-all font-black text-lg md:text-xl text-slate-800 focus:bg-orange-50" />
            </div>
            <div className="space-y-2 md:space-y-4">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7043] ml-4 md:ml-6 flex items-center gap-2">
                <Pill size={12} /> Dosis (mcg)
              </label>
              <input required type="number" value={formData.currentDose} onChange={e => setFormData({ ...formData, currentDose: parseFloat(e.target.value) })} className="w-full bg-[#FFFBF2] border-3 md:border-4 border-[#1A1A1A] px-5 py-4 md:px-8 md:py-6 rounded-2xl md:rounded-[2rem] outline-none transition-all font-black text-lg md:text-xl text-slate-800 focus:bg-orange-50" />
            </div>
          </div>

          <div className="bg-[#FFF9C4] p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] flex gap-3 md:gap-4 items-center border-3 md:border-4 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] md:shadow-[4px_4px_0px_#1A1A1A]">
            <ShieldCheck size={24} className="text-[#1A1A1A] shrink-0" />
            <p className="text-[10px] md:text-xs text-[#1A1A1A] leading-tight md:leading-relaxed font-black uppercase tracking-tight">
              Tus datos son privados y viven solo en este dispositivo.
            </p>
          </div>

          <button type="submit" className="w-full bg-[#FF7043] text-white font-black py-5 md:py-7 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[6px_6px_0px_#1A1A1A] md:shadow-[8px_8px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-xl md:text-2xl tracking-tighter">
            ¡Todo Listo!
          </button>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
