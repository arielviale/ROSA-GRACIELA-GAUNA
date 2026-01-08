
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  Home, 
  LineChart as ChartIcon, 
  Calendar, 
  Lightbulb, 
  FileText, 
  User as UserIcon,
  Zap,
  Smartphone,
  Download
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import History from './components/History';
import WeightAnalysis from './components/WeightAnalysis';
import Tips from './components/Tips';
import MedicalReport from './components/MedicalReport';
import Welcome from './components/Welcome';
import Settings from './components/Settings';
import { UserProfile, SymptomEntry, WeightEntry, RitualState } from './types';
import { ThyroidFriendLogo } from './components/Logo';

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState<boolean>(() => !localStorage.getItem('hc_welcome_seen'));
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hc_profile');
    return saved ? JSON.parse(saved) : { name: '', weight: 70, currentDose: 100 };
  });

  const [symptomHistory, setSymptomHistory] = useState<SymptomEntry[]>(() => {
    const saved = localStorage.getItem('hc_symptoms');
    return saved ? JSON.parse(saved) : [];
  });

  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem('hc_weights');
    return saved ? JSON.parse(saved) : [];
  });

  const [ritualState, setRitualState] = useState<RitualState>(() => {
    const saved = localStorage.getItem('hc_ritual_state');
    return (saved as RitualState) || RitualState.WAITING;
  });

  const [ritualStartTime, setRitualStartTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('hc_ritual_start');
    return saved ? parseInt(saved) : null;
  });

  const [customWaitMinutes, setCustomWaitMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('hc_wait_minutes');
    return saved ? parseInt(saved) : 30;
  });

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const alarmTriggeredRef = useRef(false);

  useEffect(() => {
    // Detect if already installed or in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const playAlarm = useCallback(() => {
    if (alarmTriggeredRef.current) return;
    alarmTriggeredRef.current = true;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + start + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      [523.25, 659.25, 783.99].forEach((freq, i) => playTone(freq, i * 0.2, 0.6));
    } catch (e) {}
  }, []);

  useEffect(() => {
    let interval: any;
    if (ritualState === RitualState.TAKEN && ritualStartTime) {
      const updateTimer = () => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - ritualStartTime) / 1000);
        const totalSeconds = customWaitMinutes * 60;
        const remaining = totalSeconds - elapsedSeconds;
        
        if (remaining <= 0) {
          setRitualState(RitualState.READY_TO_EAT);
          localStorage.setItem('hc_ritual_state', RitualState.READY_TO_EAT);
          setTimeLeft(0);
          playAlarm();
          if (interval) clearInterval(interval);
        } else {
          setTimeLeft(remaining);
        }
      };
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setTimeLeft(customWaitMinutes * 60);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [ritualState, ritualStartTime, customWaitMinutes, playAlarm]);

  const handleTakePill = (waitMinutes: number) => {
    const now = Date.now();
    setCustomWaitMinutes(waitMinutes);
    setRitualStartTime(now);
    setRitualState(RitualState.TAKEN);
    alarmTriggeredRef.current = false;
    localStorage.setItem('hc_wait_minutes', waitMinutes.toString());
    localStorage.setItem('hc_ritual_start', now.toString());
    localStorage.setItem('hc_ritual_state', RitualState.TAKEN);
  };

  const handleResetRitual = () => {
    setRitualState(RitualState.WAITING);
    setRitualStartTime(null);
    setCustomWaitMinutes(30);
    alarmTriggeredRef.current = false;
    localStorage.removeItem('hc_ritual_start');
    localStorage.removeItem('hc_wait_minutes');
    localStorage.setItem('hc_ritual_state', RitualState.WAITING);
  };

  useEffect(() => {
    localStorage.setItem('hc_profile', JSON.stringify(profile));
    localStorage.setItem('hc_symptoms', JSON.stringify(symptomHistory));
    localStorage.setItem('hc_weights', JSON.stringify(weightHistory));
  }, [profile, symptomHistory, weightHistory]);

  const handleWelcomeComplete = (initialProfile: UserProfile) => {
    setProfile(initialProfile);
    const today = new Date().toISOString().split('T')[0];
    setWeightHistory([{ date: today, weight: initialProfile.weight, dose: initialProfile.currentDose }]);
    localStorage.setItem('hc_welcome_seen', 'true');
    setShowWelcome(false);
  };

  const addSymptomEntry = (entry: Omit<SymptomEntry, 'id'>) => {
    setSymptomHistory(prev => [{ ...entry, id: Date.now().toString() }, ...prev]);
  };

  const updateWeight = (newWeight: number) => {
    setProfile(prev => ({ ...prev, weight: newWeight }));
    const today = new Date().toISOString().split('T')[0];
    setWeightHistory(prev => [...prev, { date: today, weight: newWeight, dose: profile.currentDose }]);
  };

  const updateProfile = (updatedProfile: UserProfile) => { setProfile(updatedProfile); };

  if (showWelcome) { return <Welcome onComplete={handleWelcomeComplete} />; }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#FFFBF2] pb-20 md:pb-0 md:pl-64 animate-in fade-in duration-500 font-['Outfit']">
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#1A1A1A]/10 h-screen fixed left-0 top-0 z-20 shadow-sm">
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="p-1 bg-white rounded-full shadow-lg border-2 border-[#1A1A1A] transform hover:scale-105 transition-transform duration-500 cursor-pointer">
                <ThyroidFriendLogo size={80} isRunning={ritualState === RitualState.TAKEN} />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-[10px] font-black text-[#FF7043] uppercase tracking-tighter leading-none">Hipotiroidismo</h1>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest text-center">Consciente</h2>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
            <NavItem to="/" icon={<Home />} label="Mi Ritual" />
            <NavItem to="/history" icon={<Calendar />} label="Mi Diario" />
            <NavItem to="/analysis" icon={<ChartIcon />} label="Peso y Dosis" />
            <NavItem to="/tips" icon={<Lightbulb />} label="Vida Consciente" />
            <NavItem to="/report" icon={<FileText />} label="Mi Reporte" />
            <NavItem to="/settings" icon={<UserIcon />} label="Mi Perfil" />
          </nav>
          
          {deferredPrompt && !isInstalled && (
            <div className="px-4 mb-4">
              <button 
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-3 p-4 bg-slate-900 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-[4px_4px_0px_#FF7043]"
              >
                <Smartphone size={16} /> Instalar App
              </button>
            </div>
          )}

          {ritualState === RitualState.TAKEN && (
            <div className="mx-4 mb-4 p-5 bg-[#FF7043] border-2 border-[#1A1A1A] rounded-[2rem] text-white shadow-xl animate-in zoom-in duration-500">
               <div className="flex items-center gap-3 mb-2">
                 <Zap size={14} className="animate-pulse" />
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Absorbiendo Energía</p>
               </div>
               <p className="text-3xl font-black tabular-nums">
                 {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
               </p>
            </div>
          )}
        </aside>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-[#1A1A1A]/10 flex justify-around py-3 px-2 z-50 pb-safe">
          <MobileNavItem to="/" icon={<Home />} />
          <MobileNavItem to="/history" icon={<Calendar />} />
          <MobileNavItem to="/analysis" icon={<ChartIcon />} />
          <MobileNavItem to="/report" icon={<FileText />} />
          <MobileNavItem to="/settings" icon={<UserIcon />} />
        </nav>

        <header className="md:hidden bg-white/80 backdrop-blur-md px-5 py-4 border-b-2 border-[#1A1A1A]/10 flex justify-between items-center sticky top-0 z-40 pt-safe">
           <div className="flex items-center gap-3">
             <ThyroidFriendLogo size={44} isRunning={ritualState === RitualState.TAKEN} />
             <h1 className="text-xs font-black text-[#FF7043] uppercase tracking-tighter">H. Consciente</h1>
           </div>
           {ritualState === RitualState.TAKEN && (
             <div className="bg-[#FF7043] border-2 border-[#1A1A1A] text-white px-4 py-1.5 rounded-full text-sm font-black tabular-nums shadow-lg">
               {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
             </div>
           )}
        </header>

        <main className="flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard profile={profile} onSymptomAdd={addSymptomEntry} ritualState={ritualState} timeLeft={timeLeft} onTakePill={handleTakePill} onResetRitual={handleResetRitual} deferredPrompt={deferredPrompt} onInstallRequest={handleInstallClick} isInstalled={isInstalled} />} />
            <Route path="/history" element={<History symptoms={symptomHistory} />} />
            <Route path="/analysis" element={<WeightAnalysis weightHistory={weightHistory} currentProfile={profile} onUpdateWeight={updateWeight} />} />
            <Route path="/tips" element={<Tips symptoms={symptomHistory} isInstalled={isInstalled} />} />
            <Route path="/report" element={<MedicalReport profile={profile} symptoms={symptomHistory} weights={weightHistory} />} />
            <Route path="/settings" element={<Settings profile={profile} onUpdate={updateProfile} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink to={to} className={({ isActive }) => `flex items-center gap-3 px-5 py-4 rounded-[1.5rem] transition-all duration-300 ${isActive ? 'bg-[#FF7043] border-2 border-[#1A1A1A] text-white font-bold shadow-lg scale-[1.02]' : 'text-slate-500 hover:bg-orange-50'}`}>
    {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 20 })}
    <span className="text-sm tracking-tight">{label}</span>
  </NavLink>
);

const MobileNavItem = ({ to, icon }: { to: string; icon: React.ReactNode }) => (
  <NavLink to={to} className={({ isActive }) => `p-4 rounded-[1.2rem] transition-all duration-300 ${isActive ? 'bg-[#FF7043] border-2 border-[#1A1A1A] text-white scale-110 shadow-lg' : 'text-slate-400'}`}>
    {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 24 })}
  </NavLink>
);

export default App;
