
import React, { useState, useEffect } from 'react';
// Add Zap to the imports from lucide-react
import { Pill, Coffee, CheckCircle2, AlertCircle, ChevronRight, Plus, X, RotateCcw, Send, Sparkles, Loader2, Bot, MessageSquare, Zap } from 'lucide-react';
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
}

const Dashboard: React.FC<DashboardProps> = ({ 
  profile, 
  onSymptomAdd, 
  ritualState, 
  timeLeft, 
  onTakePill,
  onResetRitual 
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
    switch(ritualState) {
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
      {/* Mascot Section with Interaction */}
      <section className="flex flex-col md:flex-row items-center gap-6 bg-white p-8 rounded-[3rem] border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A]">
        <div className="relative">
          <ThyroidFriendLogo size={140} isRunning={ritualState === RitualState.TAKEN} />
          {ritualState === RitualState.TAKEN && (
            <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-2 rounded-full border-2 border-[#1A1A1A] animate-bounce">
              <Zap size={16} />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-4">
          <div className="relative bg-orange-50 p-6 rounded-[2rem] border-3 border-[#1A1A1A] after:content-[''] after:absolute after:top-1/2 after:-left-3 after:-translate-y-1/2 after:border-y-[12px] after:border-y-transparent after:border-r-[12px] after:border-r-[#1A1A1A] hidden md:block">
            <p className="text-slate-900 font-black text-xl leading-tight">
              {mascotMessage}
            </p>
          </div>
          {/* Mobile version of speech bubble */}
          <div className="md:hidden text-center">
             <p className="text-slate-900 font-black text-lg leading-tight italic">"{mascotMessage}"</p>
          </div>
        </div>
      </section>

      {/* Ritual Section with AI Assistant */}
      <section className="bg-white rounded-[3rem] p-10 border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#FFB84D] relative overflow-hidden">
        {ritualState === RitualState.WAITING && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-[1.5rem] border-2 border-[#1A1A1A] text-[#FF7043]">
                <Bot size={28} />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-widest text-[11px] text-[#FF7043] opacity-60">Asistente AI</h3>
                <p className="text-slate-800 font-black text-xl leading-tight">Analizador de Alimentos</p>
              </div>
            </div>
            
            <div className="bg-[#FFFBF2] rounded-[2rem] p-3 border-3 border-[#1A1A1A] focus-within:ring-8 focus-within:ring-orange-500/5 transition-all">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={breakfastInput}
                  onChange={(e) => setBreakfastInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeBreakfast()}
                  placeholder="Ej: Avena con leche de soja..."
                  className="flex-1 bg-transparent px-5 py-3 outline-none font-black text-slate-800 placeholder:text-slate-300 text-lg"
                />
                <button 
                  onClick={handleAnalyzeBreakfast}
                  disabled={isAnalyzing || !breakfastInput.trim()}
                  className="bg-[#FF7043] text-white p-5 rounded-[1.5rem] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-20 flex items-center justify-center min-w-[64px]"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" /> : <Send size={24} />}
                </button>
              </div>
            </div>

            {aiResponse && (
              <div className="bg-[#FFFBF2] rounded-[2.5rem] p-8 border-3 border-[#1A1A1A] animate-in zoom-in duration-300 space-y-8">
                <div className="flex items-start gap-5">
                  <div className="bg-white border-2 border-[#1A1A1A] p-3 rounded-2xl shadow-[4px_4px_0px_#1A1A1A]">
                    <Sparkles size={24} className="text-[#FF7043]" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-800 font-black text-xl leading-snug">{aiResponse.reason}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-white bg-[#1A1A1A] px-4 py-1.5 rounded-full uppercase tracking-widest">Espera: {aiResponse.minutes} min</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleStartRitual}
                  className="w-full bg-[#1A1A1A] text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 shadow-[8px_8px_0px_#FF7043] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <Pill size={28} />
                  Tomar Mi Energía
                </button>
              </div>
            )}
            
            {!aiResponse && !isAnalyzing && (
               <div className="flex flex-wrap gap-3 pt-2">
                 {['Solo café ☕', 'Fruta 🍎', 'Lácteos 🥛', 'Pan integral 🍞'].map(opt => (
                   <button 
                    key={opt}
                    onClick={() => { setBreakfastInput(opt.split(' ')[0]); }}
                    className="px-6 py-3 rounded-full border-2 border-[#1A1A1A] text-sm font-black text-slate-800 hover:bg-orange-50 transition-all bg-white"
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

      {/* Grid of Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => setIsQuickLogOpen(true)}
          className="bg-[#FFF9C4] border-4 border-[#1A1A1A] p-8 rounded-[3rem] flex items-center justify-between group transition-all shadow-[8px_8px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          <div className="flex items-center gap-6">
            <div className="p-5 bg-white border-2 border-[#1A1A1A] text-slate-900 rounded-[1.8rem] shadow-[4px_4px_0px_#1A1A1A]">
              <Plus size={28} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-xl text-slate-900">¿Cómo te sientes?</h3>
              <p className="text-xs text-[#E64A19] font-bold opacity-60 uppercase tracking-widest">Registrar diario</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-[#1A1A1A]" />
        </button>

        <div className="bg-[#E0F2FE] border-4 border-[#1A1A1A] p-8 rounded-[3rem] flex items-center gap-6 shadow-[8px_8px_0px_#1A1A1A]">
          <div className="p-5 bg-white border-2 border-[#1A1A1A] text-sky-600 rounded-[1.8rem] shadow-[4px_4px_0px_#1A1A1A]">
            <Bot size={28} />
          </div>
          <div className="text-left">
            <h3 className="font-black text-xl text-slate-900">Dato Curioso</h3>
            <p className="text-xs text-sky-700 font-bold leading-tight opacity-70 italic">"El café inhibe la absorción hasta un 30%."</p>
          </div>
        </div>
      </div>

      {/* Quick Log Modal */}
      {isQuickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl max-h-[90vh] overflow-y-auto border-8 border-[#1A1A1A]">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <ThyroidFriendLogo size={60} />
                <div>
                  <h3 className="text-3xl font-black tracking-tighter">Chequeo Vital</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF7043] mt-1">¿Cómo va todo?</p>
                </div>
              </div>
              <button onClick={() => setIsQuickLogOpen(false)} className="p-4 bg-[#FFFBF2] border-2 border-[#1A1A1A] rounded-[1.5rem] text-[#1A1A1A] hover:bg-red-50 transition-colors"><X size={28}/></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {SYMPTOMS_LIST.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                  className={`p-5 text-sm font-black rounded-[1.5rem] border-3 transition-all text-left ${selectedSymptoms.includes(s) ? 'border-[#1A1A1A] bg-[#FFB84D] text-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]' : 'border-orange-50 bg-[#FFFBF2] text-slate-400 hover:border-[#1A1A1A]'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button 
              onClick={submitSymptoms}
              className="w-full bg-[#1A1A1A] text-white font-black py-7 rounded-[2.5rem] shadow-[8px_8px_0px_#FF7043] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-xl"
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
