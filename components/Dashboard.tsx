
import React, { useState } from 'react';
import { Pill, Coffee, CheckCircle2, AlertCircle, ChevronRight, Plus, Pencil, X, RotateCcw, Send, Sparkles, Loader2, Bot } from 'lucide-react';
import { UserProfile, RitualState, SymptomEntry } from '../types';
import { SYMPTOMS_LIST } from '../constants';
import { ModernLogo } from '../App';
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
  
  // AI States
  const [breakfastInput, setBreakfastInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState<{ minutes: number; reason: string } | null>(null);

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
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-20 h-20 bg-white rounded-3xl p-2 border border-slate-100 shadow-sm flex items-center justify-center transform -rotate-2 hover:rotate-0 transition-all">
          <ModernLogo size={60} />
        </div>
        <div className="text-center md:text-left space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Buenos días, {profile.name} <span className="text-orange-500">☀️</span>
          </h2>
          <p className="text-slate-500 font-medium">Cuidar tu tiroides es un acto de amor propio.</p>
        </div>
      </section>

      {/* Ritual Section with AI Assistant */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-sky-50 relative overflow-hidden">
        {ritualState === RitualState.WAITING && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-50 rounded-xl text-sky-600">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400">Asistente de Ritual</h3>
                <p className="text-slate-800 font-bold">¿Qué tienes pensado desayunar hoy?</p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-[2rem] p-2 border border-slate-100 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/5 transition-all">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={breakfastInput}
                  onChange={(e) => setBreakfastInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeBreakfast()}
                  placeholder="Ej: Avena con café, papaya y semillas..."
                  className="flex-1 bg-transparent px-5 py-4 outline-none font-medium text-slate-800 placeholder:text-slate-300"
                />
                <button 
                  onClick={handleAnalyzeBreakfast}
                  disabled={isAnalyzing || !breakfastInput.trim()}
                  className="bg-slate-900 text-white p-4 rounded-[1.5rem] shadow-lg hover:bg-orange-600 transition-all disabled:opacity-20 flex items-center justify-center min-w-[56px]"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
            </div>

            {aiResponse && (
              <div className="bg-orange-50/50 rounded-[2.5rem] p-6 border border-orange-100/50 animate-in zoom-in duration-300 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-500 text-white p-2 rounded-xl">
                    <Sparkles size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-800 font-bold text-lg leading-tight">{aiResponse.reason}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Tiempo Propuesto:</span>
                      <span className="bg-white px-3 py-1 rounded-full text-xs font-black text-slate-900 border border-orange-100">{aiResponse.minutes} minutos</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleStartRitual}
                  className="w-full bg-[#0F172A] text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Pill size={24} />
                  Iniciar Ritual Consciente
                </button>
              </div>
            )}
            
            {!aiResponse && !isAnalyzing && (
               <div className="flex flex-wrap gap-2 pt-2">
                 {['Solo café', 'Tostadas con huevo', 'Fruta y yogurt', 'Avena'].map(opt => (
                   <button 
                    key={opt}
                    onClick={() => { setBreakfastInput(opt); }}
                    className="px-4 py-2 rounded-full border border-slate-100 text-xs font-bold text-slate-400 hover:border-orange-200 hover:text-orange-500 transition-all"
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
               <div className="absolute inset-0 bg-orange-500/10 blur-[80px] rounded-full animate-pulse" />
               <div className="w-56 h-56 rounded-full border-[12px] border-slate-50 bg-white text-orange-600 flex flex-col items-center justify-center shadow-inner relative z-10">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white p-3 rounded-2xl shadow-xl">
                    <Coffee size={24} className="animate-bounce" />
                  </div>
                  <span className="text-6xl font-black tabular-nums tracking-tighter leading-none">{formatTime(timeLeft)}</span>
                  <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mt-2">Absorción en curso</span>
               </div>
            </div>
            <div className="max-w-xs space-y-2">
              <p className="text-slate-800 font-bold text-xl">Momento de Calma</p>
              <p className="text-slate-400 text-sm leading-relaxed">Tu cuerpo está asimilando la energía que necesita para el resto del día.</p>
            </div>
          </div>
        )}

        {ritualState === RitualState.READY_TO_EAT && (
          <div className="flex flex-col items-center justify-center text-center py-6 space-y-8 animate-in zoom-in duration-500">
            <div className="w-56 h-56 rounded-full bg-emerald-500 text-white flex flex-col items-center justify-center shadow-[0_20px_60px_rgba(16,185,129,0.3)]">
               <CheckCircle2 size={72} className="mb-2" />
               <span className="font-black text-3xl uppercase tracking-tighter">¡Listo!</span>
            </div>
            <div className="space-y-6 w-full max-w-xs">
              <div>
                <p className="text-slate-800 font-bold text-xl">Buen Provecho</p>
                <p className="text-slate-500 text-sm">Ya puedes disfrutar de tu desayuno consciente.</p>
              </div>
              <button 
                onClick={onResetRitual}
                className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                Finalizar Ritual
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Grid of Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => setIsQuickLogOpen(true)}
          className="bg-yellow-50/50 hover:bg-yellow-100 border border-yellow-100 p-6 rounded-[2rem] flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-5">
            <div className="p-4 bg-yellow-400 text-yellow-900 rounded-2xl shadow-xl shadow-yellow-400/20 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-slate-900">Diario de Hoy</h3>
              <p className="text-xs text-yellow-800 opacity-60">Registrar sensaciones</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-yellow-600 group-hover:translate-x-2 transition-transform" />
        </button>

        <div className="bg-sky-50/50 border border-sky-100 p-6 rounded-[2rem] flex items-center gap-5">
          <div className="p-4 bg-white text-sky-600 rounded-2xl shadow-sm">
            <AlertCircle size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-black text-slate-900">Nota Vital</h3>
            <p className="text-xs text-slate-500 leading-tight">Espera 4 horas para tomar suplementos de calcio o hierro.</p>
          </div>
        </div>
      </div>

      {/* Quick Log Modal */}
      {isQuickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-3xl font-black tracking-tighter">¿Cómo va todo?</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Check-in de Salud</p>
              </div>
              <button onClick={() => setIsQuickLogOpen(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900"><X size={24}/></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {SYMPTOMS_LIST.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                  className={`p-5 text-sm font-bold rounded-2xl border-2 transition-all text-left ${selectedSymptoms.includes(s) ? 'border-orange-500 bg-orange-50 text-orange-900' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button 
              onClick={submitSymptoms}
              className="w-full bg-[#0F172A] text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-slate-900/20 active:scale-95 transition-all"
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
