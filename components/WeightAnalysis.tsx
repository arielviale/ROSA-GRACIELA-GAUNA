
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { Scale, Info, TrendingDown, TrendingUp, RefreshCw, Calculator } from 'lucide-react';
import { WeightEntry, UserProfile } from '../types';
import { CALC_MCG_PER_KG } from '../constants';

interface WeightAnalysisProps {
  weightHistory: WeightEntry[];
  currentProfile: UserProfile;
  onUpdateWeight: (weight: number) => void;
}

const WeightAnalysis: React.FC<WeightAnalysisProps> = ({ weightHistory, currentProfile, onUpdateWeight }) => {
  const [newWeight, setNewWeight] = useState(currentProfile.weight.toString());
  const [showCalc, setShowCalc] = useState(false);

  const suggestedDose = (currentProfile.weight * CALC_MCG_PER_KG).toFixed(0);
  
  const handleUpdate = () => {
    const val = parseFloat(newWeight);
    if (!isNaN(val) && val > 0) {
      onUpdateWeight(val);
    }
  };

  // Logic for smart alert
  const lastMonthWeights = weightHistory.slice(-5);
  const weightChange = lastMonthWeights.length > 1 
    ? lastMonthWeights[lastMonthWeights.length - 1].weight - lastMonthWeights[0].weight 
    : 0;
  const isDrasticChange = Math.abs(weightChange) >= 3;

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
      <section>
        <h2 className="text-2xl font-bold text-slate-900">Peso vs. Medicación</h2>
        <p className="text-slate-500 text-sm">Tu dosis ideal depende de tu peso corporal.</p>
      </section>

      {/* Calculator Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-orange-50 p-3 rounded-2xl text-orange-600">
              <Scale size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Peso Actual</span>
          </div>
          <div className="flex items-end gap-2">
            <input 
              type="number" 
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="text-4xl font-black text-slate-900 w-32 bg-transparent focus:outline-none border-b-2 border-slate-100 focus:border-orange-500"
            />
            <span className="text-xl font-bold text-slate-400 mb-1">kg</span>
          </div>
          <button 
            onClick={handleUpdate}
            className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw size={18} />
            Actualizar Peso
          </button>
        </div>

        <div className="bg-orange-500 p-6 rounded-[2rem] shadow-lg shadow-orange-500/20 text-white flex flex-col justify-between relative overflow-hidden">
          <Calculator className="absolute -right-4 -bottom-4 w-32 h-32 text-orange-400 opacity-20 rotate-12" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-white/20 p-3 rounded-2xl">
              <Info size={24} />
            </div>
            <span className="text-xs font-bold text-orange-100 uppercase tracking-widest">Dosis Sugerida</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black">{suggestedDose}</span>
              <span className="text-xl font-bold opacity-80 mb-1">mcg</span>
            </div>
            <p className="text-xs opacity-80 mt-2">Basado en el estándar de 1.6 mcg/kg</p>
          </div>
        </div>
      </div>

      {/* Smart Alert */}
      {isDrasticChange && (
        <div className="bg-yellow-100 border-2 border-yellow-200 p-5 rounded-[1.5rem] flex gap-4 animate-bounce">
          <div className="p-3 bg-yellow-400 rounded-xl text-yellow-900 h-fit">
            {weightChange > 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-yellow-900">Alerta de Cambio de Peso</h4>
            <p className="text-sm text-yellow-800 opacity-90">
              Tu peso ha cambiado {weightChange.toFixed(1)}kg recientemente. Tu requerimiento de levotiroxina podría ser diferente. Coméntaselo a tu médico.
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white p-6 rounded-[2rem] border border-sky-100 shadow-sm h-80">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp size={18} className="text-orange-500" />
          Evolución Histórica
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weightHistory}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" hide />
            <YAxis hide yAxisId="left" />
            <YAxis hide yAxisId="right" orientation="right" />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="weight" 
              name="Peso (kg)"
              stroke="#F97316" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#F97316' }}
              activeDot={{ r: 6 }} 
            />
            <Line 
              yAxisId="right"
              type="stepAfter" 
              dataKey="dose" 
              name="Dosis (mcg)"
              stroke="#0EA5E9" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightAnalysis;
