
import React, { useState, useEffect } from 'react';
import { Pill, Coffee, CheckCircle2, AlertCircle, ChevronRight, Plus, Pencil, X } from 'lucide-react';
import { UserProfile, RitualState, SymptomEntry } from '../types';
import { BREAKFAST_WAIT_MINUTES, SYMPTOMS_LIST } from '../constants';

interface DashboardProps {
  profile: UserProfile;
  onSymptomAdd: (entry: Omit<SymptomEntry, 'id'>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, onSymptomAdd }) => {
  const [ritualState, setRitualState] = useState<RitualState>(RitualState.WAITING);
  const [timeLeft, setTimeLeft] = useState(BREAKFAST_WAIT_MINUTES * 60);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherSymptom, setOtherSymptom] = useState('');
  const [ritualStartTime, setRitualStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: any;
    if (ritualState === RitualState.TAKEN && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setRitualState(RitualState.READY_TO_EAT);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [ritualState, timeLeft]);

  const handleTakePill = () => {
    setRitualState(RitualState.TAKEN);
    setRitualStartTime(Date.now());
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const submitSymptoms = () => {
    const finalSymptoms = [...selectedSymptoms].filter(s => s !== 'Otro');
    
    // Si se seleccionó "Otro", añadir el texto personalizado
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
      <section className="text-center md:text-left space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Hola, {profile.name} <span className="text-orange-500">☀️</span>
        </h2>
        <p className="text-slate-500">Tu ritual de hoy está listo. Vamos paso a paso.</p>
      </section>

      {/* Ritual Section */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-sky-100 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
        {ritualState === RitualState.READY_TO_EAT && (
          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none animate-pulse" />
        )}
        
        <div className="relative">
          <div className={`w-48 h-48 md:w-56 md:h-56 rounded-full border-8 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer active:scale-95 shadow-xl
            ${ritualState === RitualState.WAITING ? 'border-orange-100 bg-orange-500 text-white' : 
              ritualState === RitualState.TAKEN ? 'border-orange-500 bg-white text-orange-600' : 
              'border-emerald-500 bg-emerald-50 text-emerald-600'}`}
            onClick={ritualState === RitualState.WAITING ? handleTakePill : undefined}
          >
            {ritualState === RitualState.WAITING ? (
              <>
                <Pill size={48} className="mb-2" />
                <span className="font-bold text-lg uppercase tracking-wider">Tomar Pastilla</span>
              </>
            ) : ritualState === RitualState.TAKEN ? (
              <>
                <Coffee size={40} className="mb-1 animate-bounce" />
                <span className="text-4xl font-black mb-1">{formatTime(timeLeft)}</span>
                <span className="text-xs font-semibold opacity-70 uppercase tracking-widest">Espera...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={48} className="mb-2" />
                <span className="font-bold text-lg uppercase tracking-wider">¡Listo!</span>
              </>
            )}
          </div>
        </div>

        <div className="max-w-xs">
          {ritualState === RitualState.WAITING && (
            <p className="text-slate-500 text-sm">Toma tu levotiroxina en ayunas con agua pura.</p>
          )}
          {ritualState === RitualState.TAKEN && (
            <p className="text-orange-600 font-medium text-sm">Casi es hora de desayunar. Tu cuerpo está absorbiendo la medicina.</p>
          )}
          {ritualState === RitualState.READY_TO_EAT && (
            <div className="space-y-2">
              <p className="text-emerald-700 font-bold">¡Ritual completado!</p>
              <p className="text-slate-500 text-sm">Ya puedes disfrutar de tu desayuno consciente.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => setIsQuickLogOpen(true)}
          className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 p-6 rounded-3xl flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400 text-yellow-900 rounded-2xl shadow-sm">
              <Plus size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-900">Registrar Síntomas</h3>
              <p className="text-xs text-yellow-800 opacity-70">¿Cómo te sientes ahora?</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-yellow-600 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="bg-sky-100 border border-sky-200 p-6 rounded-3xl flex items-center gap-4">
          <div className="p-3 bg-white text-sky-600 rounded-2xl shadow-sm">
            <AlertCircle size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-900">Tip de Hoy</h3>
            <p className="text-xs text-slate-600">"El café inhibe la absorción. Espera al menos 30 min."</p>
          </div>
        </div>
      </div>

      {/* Quick Log Modal */}
      {isQuickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-500 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Registrar Síntomas</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Selecciona lo que sientas hoy</p>
              </div>
              <button 
                onClick={() => { setIsQuickLogOpen(false); setOtherSymptom(''); setSelectedSymptoms([]); }} 
                className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[...SYMPTOMS_LIST, "Otro"].map(s => (
                <button
                  key={s}
                  onClick={() => handleSymptomToggle(s)}
                  className={`p-4 text-sm font-bold rounded-2xl border-2 transition-all text-left flex items-center gap-3
                    ${selectedSymptoms.includes(s) 
                      ? 'border-orange-500 bg-orange-50 text-orange-700' 
                      : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                    ${selectedSymptoms.includes(s) ? 'border-orange-500 bg-orange-500' : 'border-slate-200 bg-white'}`}>
                    {selectedSymptoms.includes(s) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className="truncate">{s}</span>
                </button>
              ))}
            </div>

            {selectedSymptoms.includes('Otro') && (
              <div className="mb-8 space-y-3 animate-in zoom-in-95 duration-200">
                <label className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                  <Pencil size={12} /> Describir síntoma personalizado
                </label>
                <textarea
                  placeholder="Escribe aquí brevemente cómo te sientes..."
                  value={otherSymptom}
                  onChange={(e) => setOtherSymptom(e.target.value.slice(0, 140))}
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-500 focus:bg-white px-5 py-4 rounded-2xl outline-none transition-all font-medium text-slate-800 placeholder:text-slate-300 resize-none h-24"
                  autoFocus
                />
                <p className="text-[10px] text-right text-slate-400 font-bold">{otherSymptom.length}/140</p>
              </div>
            )}

            <button 
              onClick={submitSymptoms}
              disabled={selectedSymptoms.length === 0 || (selectedSymptoms.includes('Otro') && !otherSymptom.trim())}
              className="w-full bg-[#0F172A] hover:bg-orange-600 disabled:opacity-30 disabled:hover:bg-[#0F172A] text-white font-black py-5 rounded-[2rem] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <CheckCircle2 size={20} />
              <span>Guardar Registro</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
