
import React from 'react';
import { FileText, Printer, Download, User, Info, Calendar } from 'lucide-react';
import { UserProfile, SymptomEntry, WeightEntry } from '../types';

interface MedicalReportProps {
  profile: UserProfile;
  symptoms: SymptomEntry[];
  weights: WeightEntry[];
}

const MedicalReport: React.FC<MedicalReportProps> = ({ profile, symptoms, weights }) => {
  const handlePrint = () => {
    window.print();
  };

  // Group symptoms by frequency
  const symptomFreq: Record<string, number> = {};
  symptoms.forEach(s => s.symptoms.forEach(symp => {
    symptomFreq[symp] = (symptomFreq[symp] || 0) + 1;
  }));
  const topSymptoms = Object.entries(symptomFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
      <section className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reporte Médico</h2>
          <p className="text-slate-500 text-sm">Compila tus datos para tu próxima consulta.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
        >
          <Printer size={20} />
          Imprimir / PDF
        </button>
      </section>

      {/* The Actual Report Content */}
      <div className="bg-white rounded-[2rem] border border-sky-100 shadow-xl p-8 md:p-12 space-y-10 print:shadow-none print:border-none print:p-0">
        <header className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-100 pb-8 gap-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-slate-900">Resumen de Salud Tiroidea</h1>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1 rounded-lg">
                <User size={16} />
                <span className="text-sm font-medium">{profile.name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1 rounded-lg">
                <Calendar size={16} />
                <span className="text-sm font-medium">Fecha: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 text-center min-w-[200px]">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">Dosis Actual</span>
            <span className="text-4xl font-black text-slate-900">{profile.currentDose}</span>
            <span className="text-lg font-bold text-slate-400 ml-1">mcg</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
              <Info className="text-sky-500" />
              Estado de Síntomas
            </h3>
            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
              {topSymptoms.length > 0 ? (
                <>
                  <p className="text-sm text-slate-600">Síntomas más recurrentes:</p>
                  <div className="space-y-2">
                    {topSymptoms.map(([name, count]) => (
                      <div key={name} className="flex justify-between items-center bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                        <span className="font-medium text-slate-700">{name}</span>
                        <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded-md">{count} veces</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-400 italic">No hay suficientes datos registrados.</p>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
              <FileText className="text-orange-500" />
              Resumen de Peso
            </h3>
            <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Peso Inicial:</span>
                <span className="font-bold">{weights[0]?.weight || profile.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Peso Actual:</span>
                <span className="font-bold">{profile.weight} kg</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3">
                <span className="text-slate-600">Variación:</span>
                <span className={`font-bold ${(profile.weight - (weights[0]?.weight || 0)) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {(profile.weight - (weights[0]?.weight || profile.weight)).toFixed(1)} kg
                </span>
              </div>
            </div>
          </section>
        </div>

        <section className="space-y-4">
          <h3 className="font-bold text-lg text-slate-800">Historial de Registros</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase rounded-l-xl">Fecha</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Peso</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Dosis</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase rounded-r-xl">Síntomas Principales</th>
                </tr>
              </thead>
              <tbody>
                {symptoms.slice(0, 10).map((s, idx) => (
                  <tr key={idx} className="border-b border-slate-50">
                    <td className="px-4 py-4 text-sm font-medium">{s.date}</td>
                    <td className="px-4 py-4 text-sm">-</td>
                    <td className="px-4 py-4 text-sm">{profile.currentDose} mcg</td>
                    <td className="px-4 py-4 text-sm italic text-slate-500">{s.symptoms.slice(0, 2).join(', ')}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="pt-12 border-t-2 border-dashed border-slate-200 grid grid-cols-2 gap-12">
           <div className="space-y-4">
              <div className="h-1 bg-slate-100 w-full" />
              <p className="text-xs text-slate-400 text-center uppercase tracking-widest font-bold">Firma del Médico</p>
           </div>
           <div className="space-y-4">
              <div className="h-1 bg-slate-100 w-full" />
              <p className="text-xs text-slate-400 text-center uppercase tracking-widest font-bold">Notas de la Consulta</p>
           </div>
        </footer>
      </div>
      
      <p className="text-center text-slate-400 text-xs mt-8 print:block hidden">
        Reporte generado por Hipotiroidismo Consciente - Gestiona tu salud con conciencia.
      </p>
    </div>
  );
};

export default MedicalReport;
