
import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, User, Scale, Pill, Heart, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { ThyroidFriendLogo } from '../components/Logo';

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
      <div className="fixed inset-0 z-[100] bg-[#FFFBF2] flex flex-col items-center justify-center p-6 text-center overflow-hidden font-['Outfit']">
        <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[100px]" />
        
        <div className="relative max-w-2xl w-full flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-1000">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white text-[#1A1A1A] rounded-full text-[11px] font-black uppercase tracking-[0.3em] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
              <Sparkles size={14} className="text-[#FF7043]" />
              <span>GESTIÓN VITAL CONSCIENTE</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#1A1A1A] tracking-tighter leading-[0.85] uppercase">
              Hipotiroidismo<br/><span className="text-[#FF7043] drop-shadow-[4px_4px_0px_#1A1A1A]">Consciente</span>
            </h1>
          </div>

          <div className="relative">
             <div className="relative bg-white p-6 rounded-full shadow-[10px_10px_0px_#1A1A1A] border-8 border-[#1A1A1A] transform rotate-2">
                <ThyroidFriendLogo size={240} />
             </div>
          </div>

          <p className="text-[#1A1A1A] text-xl md:text-2xl font-black max-w-md leading-relaxed">
            Tu viaje diario hacia el equilibrio, la energía y el bienestar profundo.
          </p>

          <button
            onClick={() => setStep('form')}
            className="group w-full max-w-sm bg-[#1A1A1A] text-white font-black py-8 rounded-[3rem] shadow-[10px_10px_0px_#FFB84D] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex items-center justify-center gap-5"
          >
            <span className="text-2xl uppercase tracking-widest">¡VAMOS ALLÁ!</span>
            <ArrowRight size={32} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#FFFBF2] flex items-center justify-center p-6 font-['Outfit'] overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-[4rem] shadow-[15px_15px_0px_#1A1A1A] p-12 space-y-10 animate-in slide-in-from-bottom-12 duration-700 border-8 border-[#1A1A1A]">
        <div className="text-center space-y-3">
          <ThyroidFriendLogo size={120} />
          <h2 className="text-4xl font-black tracking-tighter text-[#1A1A1A]">Cuéntame de ti</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Personaliza tu experiencia consciente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7043] ml-6 flex items-center gap-2">
              <User size={12} /> ¿Cuál es tu nombre?
            </label>
            <input 
              required
              type="text" 
              placeholder="Ej. Sofía"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-[#FFFBF2] border-4 border-[#1A1A1A] px-8 py-6 rounded-[2rem] outline-none transition-all font-black text-xl text-slate-800 focus:bg-orange-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7043] ml-6 flex items-center gap-2">
                <Scale size={12} /> Peso (kg)
              </label>
              <input required type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} className="w-full bg-[#FFFBF2] border-4 border-[#1A1A1A] px-8 py-6 rounded-[2rem] outline-none transition-all font-black text-xl text-slate-800 focus:bg-orange-50"/>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7043] ml-6 flex items-center gap-2">
                <Pill size={12} /> Dosis (mcg)
              </label>
              <input required type="number" value={formData.currentDose} onChange={e => setFormData({...formData, currentDose: parseFloat(e.target.value)})} className="w-full bg-[#FFFBF2] border-4 border-[#1A1A1A] px-8 py-6 rounded-[2rem] outline-none transition-all font-black text-xl text-slate-800 focus:bg-orange-50"/>
            </div>
          </div>
          
          <div className="bg-[#FFF9C4] p-6 rounded-[2.5rem] flex gap-4 items-center border-4 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
             <ShieldCheck size={28} className="text-[#1A1A1A] shrink-0" />
             <p className="text-xs text-[#1A1A1A] leading-relaxed font-black uppercase tracking-tight">
               Tus datos son privados y viven solo en este dispositivo.
             </p>
          </div>

          <button type="submit" className="w-full bg-[#FF7043] text-white font-black py-7 rounded-[2.5rem] shadow-[8px_8px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-2xl tracking-tighter">
            ¡Todo Listo!
          </button>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
