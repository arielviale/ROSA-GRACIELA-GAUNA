
import React, { useState, useEffect, useRef } from 'react';
import { Pill, Coffee, CheckCircle2, AlertCircle, ChevronRight, Plus } from 'lucide-react';
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
    if (selectedSymptoms.length > 0) {
      onSymptomAdd({
        date: new Date().toISOString().split('T')[0],
        symptoms: selectedSymptoms,
        notes: ''
      });
      setSelectedSymptoms([]);
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
                <span className="text-xs font-semibold opacity-70">ESPERA PARA DESAYUNAR</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={48} className="mb-2" />
                <span className="font-bold text-lg uppercase tracking-wider">¡Buen Provecho!</span>
              </>
            )}
          </div>
        </div>

        <div className="max-w-xs">
          {ritualState === RitualState.WAITING && (
            <p className="text-slate-500 text-sm">Toma tu levotiroxina en ayunas con agua pura para una absorción perfecta.</p>
          )}
          {ritualState === RitualState.TAKEN && (
            <p className="text-orange-600 font-medium text-sm">Tu cuerpo está absorbiendo la medicina. ¡Casi es hora de desayunar!</p>
          )}
          {ritualState === RitualState.READY_TO_EAT && (
            <div className="space-y-2">
              <p className="text-emerald-700 font-bold">¡Ritual completado!</p>
              <p className="text-slate-500 text-sm">Han pasado {BREAKFAST_WAIT_MINUTES} minutos. Ya puedes disfrutar de tu desayuno consciente.</p>
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
              <p className="text-xs text-yellow-800 opacity-70">¿Cómo te sientes en este momento?</p>
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
            <p className="text-xs text-slate-600">"Evita el café en los 30 min post-toma; bloquea la absorción."</p>
          </div>
        </div>
      </div>

      {/* Quick Log Modal Overlay */}
      {isQuickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">¿Algún síntoma hoy?</h3>
              <button onClick={() => setIsQuickLogOpen(false)} className="text-slate-400 hover:text-slate-600">
                Cerrar
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {SYMPTOMS_LIST.map(s => (
                <button
                  key={s}
                  onClick={() => handleSymptomToggle(s)}
                  className={`p-3 text-sm rounded-2xl border transition-all text-left flex items-center gap-2
                    ${selectedSymptoms.includes(s) 
                      ? 'border-orange-500 bg-orange-50 text-orange-700' 
                      : 'border-slate-100 bg-slate-50 text-slate-600'}`}
                >
                  <div className={`w-3 h-3 rounded-full ${selectedSymptoms.includes(s) ? 'bg-orange-500' : 'bg-slate-300'}`} />
                  {s}
                </button>
              ))}
            </div>

            <button 
              onClick={submitSymptoms}
              disabled={selectedSymptoms.length === 0}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              Guardar Registro
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
