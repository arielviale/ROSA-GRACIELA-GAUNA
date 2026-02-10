import React, { useState, useEffect } from 'react';
import { Download, Smartphone } from 'lucide-react';

interface PWAInstallProps {
    deferredPrompt: any;
    onInstall: () => void;
}

const PWAInstall: React.FC<PWAInstallProps> = ({ deferredPrompt, onInstall }) => {
    if (!deferredPrompt) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-slate-900 text-white p-5 rounded-[2rem] border-2 border-[#1A1A1A] shadow-[6px_6px_0px_#FF7043] flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl text-[#FFB84D]">
                        <Smartphone size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-black leading-tight">¡Instalar App!</p>
                        <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Uso offline disponible</p>
                    </div>
                </div>
                <button
                    onClick={onInstall}
                    className="bg-[#FF7043] text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]"
                >
                    Instalar
                </button>
            </div>
        </div>
    );
};

export default PWAInstall;
