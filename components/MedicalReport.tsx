
import React, { useRef, useState } from 'react';
import { User, Info, Calendar, Shield, Loader2, Download } from 'lucide-react';
import { UserProfile, SymptomEntry, WeightEntry } from '../types';
// Fix: Use ModernLogo instead of non-existent ButterflyLogo
import { ModernLogo } from '../App';

interface MedicalReportProps {
  profile: UserProfile;
  symptoms: SymptomEntry[];
  weights: WeightEntry[];
}

const MedicalReport: React.FC<MedicalReportProps> = ({ profile, symptoms, weights }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    
    const html2pdf = (window as any).html2pdf;
    
    if (!html2pdf) {
      alert("La librería de PDF no se cargó correctamente. Intentando usar la función de impresión del sistema.");
      window.print();
      return;
    }

    setIsGenerating(true);
    
    const element = reportRef.current;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Reporte_Tiroides_${profile.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: '#FFFFFF',
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Hubo un problema generando el PDF. Se abrirá el diálogo de impresión.");
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const symptomFreq: Record<string, number> = {};
  symptoms.forEach(s => s.symptoms.forEach(symp => {
    symptomFreq[symp] = (symptomFreq[symp] || 0) + 1;
  }));
  const topSymptoms = Object.entries(symptomFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12 font-['Outfit']">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reporte Médico</h2>
          <p className="text-slate-500 text-sm italic">Genera un documento PDF para tu especialista.</p>
        </div>
        <button 
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="w-full md:w-auto bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl disabled:opacity-70 active:scale-95"
        >
          {isGenerating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Generando archivo...
            </>
          ) : (
            <>
              <Download size={20} />
              Descargar Reporte PDF
            </>
          )}
        </button>
      </section>

      <div 
        ref={reportRef}
        className="bg-white rounded-[2.5rem] border border-sky-100 shadow-xl p-8 md:p-12 space-y-12 overflow-hidden"
      >
        <header className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-50 pb-10 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="p-2 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-center">
                 {/* Fix: Replaced ButterflyLogo with ModernLogo */}
                 <ModernLogo size={56} />
               </div>
               <div>
                 <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Reporte de Evolución</h1>
                 <p className="text-orange-600 text-xs font-black tracking-widest uppercase mt-1">Hipotiroidismo Consciente</p>
               </div>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <User size={14} className="text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-tight">{profile.name || 'Usuario'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-xs font-bold">Fecha: {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 text-center min-w-[200px] shadow-inner">
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] block mb-2">Dosis Actual</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-black text-slate-900">{profile.currentDose}</span>
              <span className="text-lg font-bold text-slate-400">mcg</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-3 text-slate-800">
              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                <Shield size={16} className="text-sky-600" />
              </div>
              Sintomatología Recurrente
            </h3>
            <div className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
              {topSymptoms.length > 0 ? (
                <div className="space-y-3">
                  {topSymptoms.map(([name, count]) => (                    <div key={name} className="flex justify-between items-center bg-white px-4 py-3 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-700 text-sm">{name}</span>
                      <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase">
                        {count} {count === 1 ? 'vez' : 'veces'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic py-4 text-center">Sin datos de síntomas suficientes.</p>
              )}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-3 text-slate-800">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <Info size={16} className="text-orange-600" />
              </div>
              Resumen de Peso
            </h3>
            <div className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Peso Registro Inicial:</span>
                <span className="font-black text-slate-800">{weights[0]?.weight || profile.weight} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Peso Registro Actual:</span>
                <span className="font-black text-slate-800">{profile.weight} kg</span>
              </div>
              <div className="pt-2 border-t border-white flex justify-between items-center">
                <span className="text-slate-500 text-sm">Variación Neta:</span>
                <span className={`font-black text-sm px-3 py-1 rounded-full ${
                  (profile.weight - (weights[0]?.weight || profile.weight)) > 0 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {(profile.weight - (weights[0]?.weight || profile.weight)).toFixed(1)} kg
                </span>
              </div>
            </div>
          </section>
        </div>

        <section className="space-y-4 pt-4">
          <h3 className="font-bold text-lg text-slate-800 border-l-4 border-orange-500 pl-4">Historial de Registros</h3>
          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Peso</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Dosis</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Síntomas Reportados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {symptoms.length > 0 ? (
                  symptoms.slice(0, 10).map((s, idx) => (
                    <tr key={idx}>
                      <td className="px-5 py-3 text-xs font-bold text-slate-700">{s.date}</td>
                      <td className="px-5 py-3 text-xs text-slate-400">-</td>
                      <td className="px-5 py-3 text-xs font-bold text-orange-600">{profile.currentDose} mcg</td>
                      <td className="px-5 py-3 text-xs text-slate-500">
                        {s.symptoms.length > 0 ? s.symptoms.join(', ') : 'Ninguno'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-xs text-slate-400 italic">No hay registros detallados disponibles.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="pt-20 border-t-2 border-dashed border-slate-100 grid grid-cols-2 gap-20">
           <div className="space-y-3 text-center">
              <div className="h-px bg-slate-200 w-full" />
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Firma Profesional</p>
           </div>
           <div className="space-y-3 text-center">
              <div className="h-px bg-slate-200 w-full" />
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Notas de Consulta</p>
           </div>
        </footer>
        
        <div className="text-center pt-10">
           <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em]">Documento generado vía Hipotiroidismo Consciente App</p>
        </div>
      </div>
    </div>
  );
};

export default MedicalReport;
