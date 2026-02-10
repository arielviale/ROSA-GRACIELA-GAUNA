import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const PWAInstall: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            // Prevenir que el navegador muestre el prompt automático
            e.preventDefault();
            // Guardar el evento para dispararlo luego
            setDeferredPrompt(e);
            // Mostrar nuestro propio botón
            setShowInstallBtn(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Mostrar el prompt nativo
        deferredPrompt.prompt();

        // Esperar la respuesta del usuario
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // Limpiar el prompt guardado
        setDeferredPrompt(null);
        setShowInstallBtn(false);
    };

    if (!showInstallBtn) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 z-50 animate-bounce-subtle">
            <div className="bg-white/90 backdrop-blur-md border border-[#FF7043]/20 p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF7043]/10 rounded-xl flex items-center justify-center text-[#FF7043]">
                        <Download size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800">¡Instala la App!</h3>
                        <p className="text-xs text-slate-500">Accede más rápido y úsala sin internet.</p>
                    </div>
                </div>
                <button
                    onClick={handleInstallClick}
                    className="bg-[#FF7043] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#F4511E] transition-colors"
                >
                    Instalar
                </button>
            </div>
        </div>
    );
};

export default PWAInstall;
