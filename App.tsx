
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  Home, 
  LineChart as ChartIcon, 
  Calendar, 
  Lightbulb, 
  FileText, 
  Settings,
  Pill,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import History from './components/History';
import WeightAnalysis from './components/WeightAnalysis';
import Tips from './components/Tips';
import MedicalReport from './components/MedicalReport';
import Welcome from './components/Welcome';
import { UserProfile, SymptomEntry, WeightEntry } from './types';

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    const seen = localStorage.getItem('hc_welcome_seen');
    return !seen;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hc_profile');
    return saved ? JSON.parse(saved) : { name: 'Invitado', weight: 70, currentDose: 100 };
  });

  const [symptomHistory, setSymptomHistory] = useState<SymptomEntry[]>(() => {
    const saved = localStorage.getItem('hc_symptoms');
    return saved ? JSON.parse(saved) : [];
  });

  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem('hc_weights');
    return saved ? JSON.parse(saved) : [
      { date: '2024-05-01', weight: 72, dose: 100 },
      { date: '2024-05-08', weight: 71.5, dose: 100 },
      { date: '2024-05-15', weight: 71, dose: 100 },
      { date: '2024-05-22', weight: 70.8, dose: 100 },
      { date: '2024-05-29', weight: profile.weight, dose: profile.currentDose },
    ];
  });

  useEffect(() => {
    localStorage.setItem('hc_profile', JSON.stringify(profile));
    localStorage.setItem('hc_symptoms', JSON.stringify(symptomHistory));
    localStorage.setItem('hc_weights', JSON.stringify(weightHistory));
  }, [profile, symptomHistory, weightHistory]);

  const handleWelcomeComplete = () => {
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

  if (showWelcome) {
    return <Welcome onComplete={handleWelcomeComplete} />;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-sky-50 pb-20 md:pb-0 md:pl-64 animate-in fade-in duration-500">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-sky-100 h-screen fixed left-0 top-0 z-20 shadow-sm">
          <div className="p-6 text-center">
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="w-24 h-24 p-2 flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain drop-shadow-sm" 
                />
              </div>
              <h1 className="text-sm font-black text-orange-600 leading-tight uppercase tracking-tighter">
                Hipotiroidismo<br/>Consciente
              </h1>
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            <NavItem to="/" icon={<Home />} label="Ritual" />
            <NavItem to="/history" icon={<Calendar />} label="Diario" />
            <NavItem to="/analysis" icon={<ChartIcon />} label="Peso y Dosis" />
            <NavItem to="/tips" icon={<Lightbulb />} label="Vida Consciente" />
            <NavItem to="/report" icon={<FileText />} label="Reporte Médico" />
          </nav>
          <div className="p-4 border-t border-sky-100 bg-sky-50/50">
            <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white transition-all cursor-pointer group shadow-sm">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold group-hover:rotate-12 transition-transform">
                {profile.name[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{profile.name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">{profile.currentDose} mcg / día</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navbar (Bottom) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-sky-100 flex justify-around py-3 px-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <MobileNavItem to="/" icon={<Home />} />
          <MobileNavItem to="/history" icon={<Calendar />} />
          <MobileNavItem to="/analysis" icon={<ChartIcon />} />
          <MobileNavItem to="/tips" icon={<Lightbulb />} />
          <MobileNavItem to="/report" icon={<FileText />} />
        </nav>

        {/* Header (Mobile) */}
        <header className="md:hidden bg-white/80 backdrop-blur-md px-4 py-3 border-b border-sky-100 flex justify-between items-center sticky top-0 z-40">
           <div className="flex items-center gap-2">
             <img 
               src="/logo.png" 
               alt="Logo" 
               className="w-8 h-8 object-contain" 
             />
             <h1 className="text-sm font-black text-orange-600 uppercase tracking-tighter">H. Consciente</h1>
           </div>
           <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs shadow-sm">
              {profile.name[0]}
           </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard profile={profile} onSymptomAdd={addSymptomEntry} />} />
            <Route path="/history" element={<History symptoms={symptomHistory} />} />
            <Route path="/analysis" element={<WeightAnalysis weightHistory={weightHistory} currentProfile={profile} onUpdateWeight={updateWeight} />} />
            <Route path="/tips" element={<Tips symptoms={symptomHistory} />} />
            <Route path="/report" element={<MedicalReport profile={profile} symptoms={symptomHistory} weights={weightHistory} />} />
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
      `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
        isActive ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20' : 'text-slate-600 hover:bg-sky-50'
      }`
    }
  >
    {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 18 })}
    <span className="text-sm">{label}</span>
  </NavLink>
);

const MobileNavItem = ({ to, icon }: { to: string; icon: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `p-3 rounded-2xl transition-all ${
        isActive ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/20' : 'text-slate-400'
      }`
    }
  >
    {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 22 })}
  </NavLink>
);

export default App;
