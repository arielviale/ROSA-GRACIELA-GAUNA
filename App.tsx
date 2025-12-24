
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  Home, 
  LineChart as ChartIcon, 
  Calendar, 
  Lightbulb, 
  FileText, 
  User as UserIcon,
  Settings as SettingsIcon,
  Pill,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Heart
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import History from './components/History';
import WeightAnalysis from './components/WeightAnalysis';
import Tips from './components/Tips';
import MedicalReport from './components/MedicalReport';
import Welcome from './components/Welcome';
import Settings from './components/Settings';
import { UserProfile, SymptomEntry, WeightEntry } from './types';

// Componente de Logo Inteligente: Mariposa (Símbolo de la Tiroides)
export const AppLogo = ({ className = "w-12 h-12", width, height }: { className?: string; width?: number; height?: number }) => {
  const [imgError, setImgError] = useState(false);
  const logoPath = "assets/logo.png";

  // Intentamos cargar el PNG si el usuario lo subió, de lo contrario usamos el SVG de la mariposa
  if (!imgError && logoPath === "assets/logo.png" && false) { // Forzamos SVG para esta actualización estética
    return (
      <img 
        src={logoPath} 
        alt="Logo Hipotiroidismo Consciente" 
        className={`${className} object-contain`}
        style={{ width: width ? `${width}px` : undefined, height: height ? `${height}px` : undefined }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className} 
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logo Mariposa Hipotiroidismo"
    >
      <defs>
        <linearGradient id="butterflyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#F97316', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#EA580C', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Cuerpo de la Mariposa */}
      <rect x="96" y="70" width="8" height="60" rx="4" fill="#1E293B" />
      
      {/* Ala Izquierda Superior */}
      <path 
        d="M95,100 C95,100 70,50 35,50 C15,50 15,85 45,105 C15,125 15,165 45,165 C75,165 95,125 95,125" 
        fill="url(#butterflyGrad)" 
        filter="url(#shadow)"
      />
      
      {/* Ala Derecha Superior */}
      <path 
        d="M105,100 C105,100 130,50 165,50 C185,50 185,85 155,105 C185,125 185,165 155,165 C125,165 105,125 105,125" 
        fill="url(#butterflyGrad)" 
        filter="url(#shadow)"
      />

      {/* Detalles de las Antenas */}
      <path d="M98,72 Q90,55 80,55" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      <path d="M102,72 Q110,55 120,55" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      
      {/* Círculos decorativos en las alas para un toque moderno */}
      <circle cx="60" cy="80" r="8" fill="white" opacity="0.3" />
      <circle cx="140" cy="80" r="8" fill="white" opacity="0.3" />
    </svg>
  );
};

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    const seen = localStorage.getItem('hc_welcome_seen');
    return !seen;
  });

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

  const updateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  if (showWelcome) {
    return <Welcome onComplete={handleWelcomeComplete} />;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-sky-50 pb-20 md:pb-0 md:pl-64 animate-in fade-in duration-500 font-['Outfit']">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-sky-100 h-screen fixed left-0 top-0 z-20 shadow-sm">
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="p-1 bg-orange-50 rounded-3xl shadow-sm border border-orange-100/50">
                <AppLogo className="w-20 h-20" />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-sm font-black text-orange-600 uppercase tracking-tighter leading-none">
                  Hipotiroidismo
                </h1>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Consciente
                </h2>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <NavItem to="/" icon={<Home />} label="Ritual" />
            <NavItem to="/history" icon={<Calendar />} label="Diario" />
            <NavItem to="/analysis" icon={<ChartIcon />} label="Peso y Dosis" />
            <NavItem to="/tips" icon={<Lightbulb />} label="Vida Consciente" />
            <NavItem to="/report" icon={<FileText />} label="Reporte Médico" />
            <NavItem to="/settings" icon={<UserIcon />} label="Mi Perfil" />
          </nav>
          <div className="p-4 mt-auto border-t border-sky-100 bg-sky-50/50">
            <NavLink to="/settings" className="flex items-center gap-3 p-3 rounded-2xl bg-white shadow-sm border border-sky-100 hover:border-orange-200 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                {profile.name[0] || '?'}
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-sm font-bold truncate">{profile.name || 'Usuario'}</p>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{profile.currentDose} MCG</p>
              </div>
            </NavLink>
          </div>
        </aside>

        {/* Mobile Navbar (Bottom) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-sky-100 flex justify-around py-3 px-2 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
          <MobileNavItem to="/" icon={<Home />} />
          <MobileNavItem to="/history" icon={<Calendar />} />
          <MobileNavItem to="/analysis" icon={<ChartIcon />} />
          <MobileNavItem to="/report" icon={<FileText />} />
          <MobileNavItem to="/settings" icon={<UserIcon />} />
        </nav>

        {/* Header (Mobile) */}
        <header className="md:hidden bg-white/80 backdrop-blur-md px-5 py-4 border-b border-sky-100 flex justify-between items-center sticky top-0 z-40">
           <div className="flex items-center gap-3">
             <AppLogo className="w-12 h-12" />
             <h1 className="text-sm font-black text-orange-600 uppercase tracking-tighter leading-none">H. Consciente</h1>
           </div>
           <NavLink to="/settings" className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
              {profile.name[0] || '?'}
           </NavLink>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard profile={profile} onSymptomAdd={addSymptomEntry} />} />
            <Route path="/history" element={<History symptoms={symptomHistory} />} />
            <Route path="/analysis" element={<WeightAnalysis weightHistory={weightHistory} currentProfile={profile} onUpdateWeight={updateWeight} />} />
            <Route path="/tips" element={<Tips symptoms={symptomHistory} />} />
            <Route path="/report" element={<MedicalReport profile={profile} symptoms={symptomHistory} weights={weightHistory} />} />
            <Route path="/settings" element={<Settings profile={profile} onUpdate={updateProfile} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${
        isActive 
          ? 'bg-orange-500 text-white font-bold shadow-xl shadow-orange-500/25 scale-[1.02]' 
          : 'text-slate-500 hover:bg-sky-50'
      }`
    }
  >
    {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 20 })}
    <span className="text-sm tracking-tight">{label}</span>
  </NavLink>
);

const MobileNavItem = ({ to, icon }: { to: string; icon: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `p-4 rounded-2xl transition-all duration-300 ${
        isActive ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/20' : 'text-slate-400'
      }`
    }
  >
    {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 24 })}
  </NavLink>
);

export default App;
