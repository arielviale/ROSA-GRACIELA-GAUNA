
import React from 'react';
import { SymptomEntry } from '../types';
import { Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react';

interface HistoryProps {
  symptoms: SymptomEntry[];
}

const History: React.FC<HistoryProps> = ({ symptoms }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <section className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Diario de Síntomas</h2>
          <p className="text-slate-500 text-sm">Tus sensaciones de los últimos 6 meses</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-sky-100 flex items-center gap-2 shadow-sm">
          <CalendarIcon size={18} className="text-sky-600" />
          <span className="text-sm font-medium">Filtro: Todo</span>
        </div>
      </section>

      {symptoms.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 text-center border border-sky-100 border-dashed">
          <div className="bg-sky-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="text-sky-400" />
          </div>
          <h3 className="font-bold text-slate-800">Sin registros aún</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">Empieza a registrar cómo te sientes en el Dashboard para ver tu historial aquí.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {symptoms.map((entry) => (
            <div key={entry.id} className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-sky-50 text-sky-700 text-xs font-bold px-3 py-1 rounded-full border border-sky-100">
                  {new Date(entry.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {entry.symptoms.map(s => (
                  <span key={s} className="bg-orange-50 text-orange-600 text-xs font-medium px-2 py-1 rounded-lg border border-orange-100">
                    {s}
                  </span>
                ))}
              </div>

              {entry.notes && (
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                  "{entry.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
