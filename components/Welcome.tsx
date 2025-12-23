
import React, { useState } from 'react';
import { ArrowRight, Heart, Sparkles, ShieldCheck, Zap, User, Scale, Pill } from 'lucide-react';
import { AppLogo } from '../App';
import { UserProfile } from '../types';

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

  const handleStartForm = () => setStep('form');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.weight > 0 && formData.currentDose > 0) {
      onComplete(formData);
    }
  };

  if (step === 'splash') {
    return (
      <div className="fixed inset-0 z-[100] bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center overflow-hidden font-['Outfit']">
        <div className="absolute top-[-15%] right-[-15%] w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-15%] w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-[120px]" />
        
        <div className="relative max-w-xl w-full flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-1000">
          <div className="relative group">
            <div className="absolute inset-0 bg-orange-200/40 rounded-full blur-3xl animate-pulse scale-150" />
            <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white rounded-full shadow-[0_40px_80px_rgba(249,115,22,0.15)] flex items-center justify-center p-12 border border-white transition-transform duration-700 group-hover:scale-105">
              <AppLogo className="w-full h-full drop-shadow-2xl" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-orange-200">
              <Zap size={12} fill="currentColor" />
              <span>Ritual Diario de Bienestar</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
                Hipotiroidismo
              </h1>
              <h2 className="text-5xl md:text-6xl font-black text-orange-500 tracking-tighter">
                Consciente
              </h2>
            </div>

            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-sm mx-auto">
              Escucha a tu cuerpo, gestiona tu energía y vive en armonía con tu tiroides.
            </p>
          </div>

          <div className="w-full max-w-xs pt-4">
            <button
              onClick={handleStartForm}
              className="group relative w-full inline-flex items-center justify-center gap-4 bg-[#0F172A] hover:bg-orange-600 text-white font-bold py-5 rounded-[2.5rem] shadow-[0_25px_50px_rgba(15,23,42,0.25)] transition-all duration-500 hover:scale-[1.05] active:scale-95"
            >
              <span className="text-xl">Comenzar</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-sky-50 flex items-center justify-center p-6 font-['Outfit'] overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 md:p-10 space-y-8 animate-in slide-in-from-bottom-12 duration-700">
        <div className="text-center space-y-2">
          <div className="bg-orange-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-orange-100">
            <AppLogo className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Crea tu Perfil</h2>
          <p className="text-slate-500 text-sm">Necesitamos estos datos para personalizar tu ritual.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Tu Nombre</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                required
                type="text" 
                placeholder="Ej. María García"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white px-14 py-4 rounded-[1.5rem] outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Peso (kg)</label>
              <div className="relative">
                <Scale className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required
                  type="number" 
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white px-12 py-4 rounded-[1.5rem] outline-none transition-all font-bold text-slate-800"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Dosis (mcg)</label>
              <div className="relative">
                <Pill className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required
                  type="number" 
                  value={formData.currentDose}
                  onChange={e => setFormData({...formData, currentDose: parseFloat(e.target.value)})}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white px-12 py-4 rounded-[1.5rem] outline-none transition-all font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="bg-sky-50 p-4 rounded-2xl flex gap-3 items-start border border-sky-100">
             <ShieldCheck size={20} className="text-sky-600 mt-1 shrink-0" />
             <p className="text-[11px] text-sky-700 leading-relaxed font-medium">
               Tus datos se guardan localmente en tu dispositivo. Tu privacidad es fundamental para un bienestar consciente.
             </p>
          </div>

          <button 
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-orange-500/25 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <span>Ver mi Dashboard</span>
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
