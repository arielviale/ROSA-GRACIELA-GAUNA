
import React, { useState, useEffect } from 'react';
import { Pill, CheckCircle2, ChevronRight, Plus, X, RotateCcw, Send, Sparkles, Loader2, Bot, Zap, Smartphone } from 'lucide-react';
import { UserProfile, RitualState, SymptomEntry } from '../types';
import { SYMPTOMS_LIST } from '../constants';
import { ThyroidFriendLogo } from '../App';
import { getBreakfastRecommendation } from '../services/geminiService';

interface DashboardProps {
  profile: UserProfile;
  onSymptomAdd: (entry: Omit<SymptomEntry, 'id'>) => void;
  ritualState: RitualState;
  timeLeft: number;
  onTakePill: (minutes: number) => void;
  onResetRitual: () => void;
  deferredPrompt?: any;
  onInstallRequest?: () => void;
  isInstalled?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  profile,
  onSymptomAdd,
  ritualState,
  timeLeft,
  onTakePill,
  onResetRitual,
  deferredPrompt,
  onInstallRequest,
  isInstalled
}) => {
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherSymptom, setOtherSymptom] = useState('');
  const [mascotMessage, setMascotMessage] = useState("¡Hola! ¿Ya tomaste tu energía de hoy?");

  // AI States
  const [breakfastInput, setBreakfastInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState<{ minutes: number; reason: string } | null>(null);

  useEffect(() => {
    switch (ritualState) {
      case RitualState.TAKEN:
        setMascotMessage("¡Mira cómo corro! Estoy ayudando a que la hormona se absorba perfecto. 🏃‍♂️💨");
        break;
      case RitualState.READY_TO_EAT:
        setMascotMessage("¡Yuhuuu! Ya estoy listo para el desayuno. ¡Buen provecho! 🍎🥞");
        break;
      default:
        setMascotMessage(`¡Hola, ${profile.name}! ¿Qué desayunaremos hoy? Cuéntamelo y te diré cuánto esperar.`);
    }
  }, [ritualState, profile.name]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnalyzeBreakfast = async () => {
    if (!breakfastInput.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await getBreakfastRecommendation(breakfastInput);
      setAiResponse(result);
      setMascotMessage("¡Hecho! He analizado tu desayuno. Mira mi sugerencia abajo. 👇");
    } catch (e) {
      setAiResponse({ minutes: 30, reason: "30 minutos es el estándar seguro por defecto." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartRitual = () => {
    if (aiResponse) {
      onTakePill(aiResponse.minutes);
    } else {
      onTakePill(30);
    }
  };

  const submitSymptoms = () => {
    const finalSymptoms = [...selectedSymptoms].filter(s => s !== 'Otro');
    if (selectedSymptoms.includes('Otro') && otherSymptom.trim()) {
      finalSymptoms.push(otherSymptom.trim());
    }
    if (finalSymptoms.length > 0) {
      onSymptomAdd({
        date: new Date().toISOString().split('T')[0],
        symptoms: finalSymptoms,
        notes: ''
      });
      setSelectedSymptoms([]);
      setOtherSymptom('');
      setIsQuickLogOpen(false);
      setMascotMessage("¡Anotado! Gracias por contarme cómo te sientes hoy. 📝🧡");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {!isInstalled && (
        <div className="bg-slate-900 text-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-2 border-[#1A1A1A] shadow-[6px_6px_0px_#FF7043] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl shrink-0">
              <Smartphone size={24} className="text-[#FFB84D]" />
            </div>
            <div>
              <p className="text-sm md:text-base font-black leading-tight">Usa "Hipotiroidismo Consciente" como una App</p>
              <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Funciona sin internet y es más rápido</p>
            </div>
          </div>

          {deferredPrompt ? (
            <button
              onClick={onInstallRequest}
              className="w-full sm:w-auto bg-[#FF7043] text-white px-6 py-3 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] active:translate-y-1 active:shadow-none transition-all"
            >
              Instalar Ahora
            </button>
          ) : (
            <div className="text-[10px] md:text-xs font-bold text-orange-200 border border-orange-200/30 px-4 py-2 rounded-xl bg-orange-200/10 italic text-center sm:text-left">
              Para instalar: Toca el botón <strong>"Compartir"</strong> o los <strong>tres puntos ⋮</strong> y busca <strong>"Añadir a pantalla de inicio"</strong>.
            </div>
          )}
        </div>
      )}

      {/* Mascot Section with Interaction */}
      <section className="flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-4 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] md:shadow-[8px_8px_0px_#1A1A1A]">
        <div className="relative shrink-0">
          <ThyroidFriendLogo size={100} className="md:w-[140px] md:h-[140px]" isRunning={ritualState === RitualState.TAKEN} />
          {ritualState === RitualState.TAKEN && (
            <div className="absolute -top-1 -right-1 bg-orange-500 text-white p-1.5 rounded-full border-2 border-[#1A1A1A] animate-bounce">
              <Zap size={14} />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-4">
          <div className="relative bg-orange-50 p-6 rounded-[2rem] border-3 border-[#1A1A1A] after:content-[''] after:absolute after:top-1/2 after:-left-3 after:-translate-y-1/2 after:border-y-[12px] after:border-y-transparent after:border-r-[12px] after:border-r-[#1A1A1A] hidden md:block">
            <p className="text-slate-900 font-black text-xl leading-tight">
              {mascotMessage}
            </p>
          </div>
          <div className="md:hidden text-center">
            <p className="text-slate-900 font-black text-base md:text-lg leading-tight italic">"{mascotMessage}"</p>
          </div>
        </div>
      </section>

      {/* Ritual Section with AI Assistant */}
      <section className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border-4 border-[#1A1A1A] shadow-[6px_6px_0px_#FFB84D] md:shadow-[8px_8px_0px_#FFB84D] relative overflow-hidden">
        {ritualState === RitualState.WAITING && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-orange-50 rounded-2xl border-2 border-[#1A1A1A] text-[#FF7043]">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-widest text-[9px] md:text-[11px] text-[#FF7043] opacity-60">Asistente AI</h3>
                <p className="text-slate-800 font-black text-lg md:text-xl leading-tight">Analizador de Alimentos</p>
              </div>
            </div>

            <div className="bg-[#FFFBF2] rounded-2xl md:rounded-[2rem] p-2 border-3 border-[#1A1A1A] focus-within:ring-4 focus-within:ring-orange-500/5 transition-all">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={breakfastInput}
                  onChange={(e) => setBreakfastInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeBreakfast()}
                  placeholder="Ej: Avena con leche de soja..."
                  className="flex-1 bg-transparent px-3 py-2 md:px-5 md:py-3 outline-none font-black text-slate-800 placeholder:text-slate-300 text-base md:text-lg min-w-0"
                />
                <button
                  onClick={handleAnalyzeBreakfast}
                  disabled={isAnalyzing || !breakfastInput.trim()}
                  className="bg-[#FF7043] text-white p-4 md:p-5 rounded-xl md:rounded-[1.5rem] border-3 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-20 flex items-center justify-center min-w-[50px] md:min-w-[64px]"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="md:w-[24px] md:h-[24px]" />}
                </button>
              </div>
            </div>

            {aiResponse && (
              <div className="bg-[#FFFBF2] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border-3 border-[#1A1A1A] animate-in zoom-in duration-300 space-y-6 md:space-y-8">
                <div className="flex items-start gap-4 md:gap-5">
                  <div className="bg-white border-2 border-[#1A1A1A] p-2 md:p-3 rounded-xl md:rounded-2xl shadow-[3px_3px_0px_#1A1A1A]">
                    <Sparkles size={20} className="text-[#FF7043] md:w-[24px] md:h-[24px]" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-800 font-black text-lg md:text-xl leading-snug">{aiResponse.reason}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black text-white bg-[#1A1A1A] px-3 py-1 rounded-full uppercase tracking-widest">Espera: {aiResponse.minutes} min</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStartRitual}
                  className="w-full bg-[#1A1A1A] text-white py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl flex items-center justify-center gap-3 shadow-[6px_6px_0px_#FF7043] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <Pill size={24} className="md:w-[28px] md:h-[28px]" />
                  Tomar Mi Energía
                </button>
              </div>
            )}

            {!aiResponse && !isAnalyzing && (
              <div className="flex flex-wrap gap-2 pt-1">
                {['Solo café ☕', 'Fruta 🍎', 'Lácteos 🥛', 'Pan integral 🍞'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setBreakfastInput(opt.split(' ')[0]); }}
                    className="px-4 py-2 rounded-full border-2 border-[#1A1A1A] text-[11px] md:text-sm font-black text-slate-800 hover:bg-orange-50 transition-all bg-white"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {ritualState === RitualState.TAKEN && (
          <div className="flex flex-col items-center justify-center text-center py-6 space-y-8 animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-64 h-64 rounded-full border-[12px] border-[#1A1A1A] bg-white text-[#FF7043] flex flex-col items-center justify-center shadow-[8px_8px_0px_#4DB8FF] relative z-10">
                <span className="text-7xl font-black tabular-nums tracking-tighter leading-none mb-1">{formatTime(timeLeft)}</span>
                <span className="text-[11px] font-black text-[#1A1A1A] opacity-40 uppercase tracking-[0.3em]">Procesando Vida</span>
              </div>
            </div>
            <div className="max-w-xs space-y-3">
              <p className="text-slate-900 font-black text-2xl">¡Casi listo!</p>
              <p className="text-slate-500 font-medium leading-relaxed">Mientras espero, estoy asegurándome de que cada miligramo sea aprovechado.</p>
            </div>
          </div>
        )}

        {ritualState === RitualState.READY_TO_EAT && (
          <div className="flex flex-col items-center justify-center text-center py-6 space-y-8 animate-in zoom-in duration-500">
            <div className="w-64 h-64 rounded-full bg-[#10B981] border-8 border-[#1A1A1A] text-white flex flex-col items-center justify-center shadow-[10px_10px_0px_#1A1A1A] relative">
              <CheckCircle2 size={84} className="mb-2" />
              <span className="font-black text-4xl uppercase tracking-tighter">¡LISTO!</span>
            </div>
            <div className="space-y-6 w-full max-w-sm">
              <button
                onClick={onResetRitual}
                className="w-full bg-[#1A1A1A] text-white py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-[#FF7043] transition-all flex items-center justify-center gap-3"
              >
                <RotateCcw size={20} />
                Terminar Ritual
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <button
          onClick={() => setIsQuickLogOpen(true)}
          className="bg-[#FFF9C4] border-4 border-[#1A1A1A] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] flex items-center justify-between group transition-all shadow-[6px_6px_0px_#1A1A1A] md:shadow-[8px_8px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          <div className="flex items-center gap-4 md:gap-6">
            <div className="p-3 md:p-5 bg-white border-2 border-[#1A1A1A] text-slate-900 rounded-[1.2rem] md:rounded-[1.8rem] shadow-[3px_3px_0px_#1A1A1A]">
              <Plus size={24} className="md:w-[28px] md:h-[28px]" />
            </div>
            <div className="text-left">
              <h3 className="font-black text-lg md:text-xl text-slate-900">¿Cómo te sientes?</h3>
              <p className="text-[10px] text-[#E64A19] font-bold opacity-60 uppercase tracking-widest">Registrar diario</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#1A1A1A] md:w-[24px] md:h-[24px]" />
        </button>

        <div className="bg-[#E0F2FE] border-4 border-[#1A1A1A] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] flex items-center gap-4 md:gap-6 shadow-[6px_6px_0px_#1A1A1A] md:shadow-[8px_8px_0px_#1A1A1A]">
          <div className="p-3 md:p-5 bg-white border-2 border-[#1A1A1A] text-sky-600 rounded-[1.2rem] md:rounded-[1.8rem] shadow-[3px_3px_0px_#1A1A1A]">
            <Bot size={24} className="md:w-[28px] md:h-[28px]" />
          </div>
          <div className="text-left">
            <h3 className="font-black text-lg md:text-xl text-slate-900">Dato Curioso</h3>
            <p className="text-[11px] text-sky-700 font-bold leading-tight opacity-70 italic">"El café inhibe la absorción hasta un 30%."</p>
          </div>
        </div>
      </div>

      {isQuickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-2xl max-h-[90vh] overflow-y-auto border-8 border-[#1A1A1A]">
            <div className="flex justify-between items-center mb-6 md:mb-10">
              <div className="flex items-center gap-3 md:gap-4">
                <ThyroidFriendLogo size={48} className="md:w-[60px] md:h-[60px]" />
                <div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tighter leading-none">Chequeo Vital</h3>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#FF7043] mt-0.5 md:mt-1">¿Cómo va todo?</p>
                </div>
              </div>
              <button onClick={() => setIsQuickLogOpen(false)} className="p-2 md:p-4 bg-[#FFFBF2] border-2 border-[#1A1A1A] rounded-xl md:rounded-[1.5rem] text-[#1A1A1A] hover:bg-red-50 transition-colors"><X size={24} className="md:w-[28px] md:h-[28px]" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
              {SYMPTOMS_LIST.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                  className={`p-4 md:p-5 text-[13px] md:text-sm font-black rounded-xl md:rounded-[1.5rem] border-3 transition-all text-left ${selectedSymptoms.includes(s) ? 'border-[#1A1A1A] bg-[#FFB84D] text-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]' : 'border-orange-50 bg-[#FFFBF2] text-slate-400 hover:border-[#1A1A1A]'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={submitSymptoms}
              className="w-full bg-[#1A1A1A] text-white font-black py-5 md:py-7 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[6px_6px_0px_#FF7043] md:shadow-[8px_8px_0px_#FF7043] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-lg md:text-xl"
            >
              Guardar en mi Diario
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
