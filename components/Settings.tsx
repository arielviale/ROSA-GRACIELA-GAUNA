
import React, { useState } from 'react';
import { User, Scale, Pill, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [showSaved, setShowSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const resetOnboarding = () => {
    if (confirm("¿Quieres reiniciar la aplicación? Esto borrará tus datos guardados.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <section>
        <h2 className="text-2xl font-bold text-slate-900">Configuración de Perfil</h2>
        <p className="text-slate-500 text-sm">Gestiona tus datos personales y clínicos.</p>
      </section>

      <div className="bg-white rounded-[2.5rem] border border-sky-100 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                <User size={12} />
                Nombre Completo
              </label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-slate-800"
                placeholder="Ej. María García"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                <Scale size={12} />
                Peso Actual (kg)
              </label>
              <input 
                type="number" 
                step="0.1"
                value={formData.weight}
                onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-slate-800"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                <Pill size={12} />
                Dosis de Levotiroxina (mcg)
              </label>
              <input 
                type="number" 
                value={formData.currentDose}
                onChange={e => setFormData({...formData, currentDose: parseFloat(e.target.value)})}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row gap-4">
            <button 
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {showSaved ? <CheckCircle2 size={20} /> : <Save size={20} />}
              {showSaved ? "¡Cambios Guardados!" : "Guardar Cambios"}
            </button>
            
            <button 
              type="button"
              onClick={resetOnboarding}
              className="px-6 py-4 text-slate-400 font-bold hover:text-red-500 transition-colors flex items-center justify-center gap-2 border-2 border-transparent hover:border-red-100 rounded-2xl"
            >
              <RotateCcw size={18} />
              Reiniciar App
            </button>
          </div>
        </form>
      </div>

      <div className="bg-sky-50 border border-sky-100 p-6 rounded-3xl flex gap-4 items-start">
        <div className="p-3 bg-white rounded-xl shadow-sm text-sky-600">
          <User size={24} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">Privacidad y Datos</h4>
          <p className="text-sm text-slate-600 leading-relaxed mt-1">
            Todos los datos clínicos y personales se almacenan exclusivamente en este dispositivo de forma local. No se envían a servidores externos, garantizando tu privacidad total.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
