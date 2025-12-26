
import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, User, Scale, Pill, Heart } from 'lucide-react';
import { UserProfile } from '../types';
import { ModernLogo } from '../App';

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
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center overflow-hidden font-['Outfit']">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-[100px]" />
        
        <div className="relative max-w-2xl w-full flex flex-col items-center gap-12 animate-in fade-in zoom-in duration-1000">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-orange-100">
              <Heart size={12} fill="currentColor" />
              <span>Cuidado Inteligente</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
              Hipotiroidismo<br/><span className="text-orange-500">Consciente</span>
            </h1>
          </div>

          <div className="relative">
             <div className="absolute inset-0 bg-orange-500/20 blur-[80px] rounded-full scale-125" />
             <div className="relative bg-white p-16 rounded-[6rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-50">
                <ModernLogo size={200} />
             </div>
          </div>

          <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-md leading-relaxed">
            Un ritual diario diseñado para transformar tu bienestar tiroideo a través de la consciencia e IA.
          </p>

          <button
            onClick={() => setStep('form')}
            className="group w-full max-w-sm bg-[#0F172A] text-white font-black py-7 rounded-[3rem] shadow-2xl transition-all hover:bg-orange-600 hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-4"
          >
            <span className="text-xl uppercase tracking-widest">Empezar el Viaje</span>
            <ArrowRight size={28} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center p-6 font-['Outfit'] overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl p-12 space-y-12 animate-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-2">
          <ModernLogo size={80} className="mx-auto mb-6" />
          <h2 className="text-4xl font-black tracking-tighter">Tu Perfil Vital</h2>
          <p className="text-slate-400 font-medium">Personaliza tu acompañamiento diario.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-6 flex items-center gap-2">
              <User size={12} /> Nombre Completo
            </label>
            <input 
              required
              type="text" 
              placeholder="¿Cómo te llamas?"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 px-8 py-5 rounded-[2rem] outline-none transition-all font-bold text-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-6 flex items-center gap-2">
                <Scale size={12} /> Peso (kg)
              </label>
              <input required type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 px-8 py-5 rounded-[2rem] outline-none transition-all font-bold text-lg"/>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-6 flex items-center gap-2">
                <Pill size={12} /> Dosis (mcg)
              </label>
              <input required type="number" value={formData.currentDose} onChange={e => setFormData({...formData, currentDose: parseFloat(e.target.value)})} className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 px-8 py-5 rounded-[2rem] outline-none transition-all font-bold text-lg"/>
            </div>
          </div>
          
          <div className="bg-sky-50 p-6 rounded-[2rem] flex gap-4 items-center border border-sky-100">
             <ShieldCheck size={24} className="text-sky-600 shrink-0" />
             <p className="text-xs text-sky-700 leading-relaxed font-medium">
               Tus datos se guardan localmente. Privacidad total garantizada.
             </p>
          </div>

          <button type="submit" className="w-full bg-orange-500 text-white font-black py-6 rounded-[2.5rem] shadow-xl hover:bg-orange-600 transition-all active:scale-95 text-xl tracking-tight">
            Finalizar Configuración
          </button>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
