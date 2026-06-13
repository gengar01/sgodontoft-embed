'use client';

import { useState, useEffect } from 'react';

// URL del GAS webapp — igual que ahora, sin cambios
const GAS_URL =
  'https://script.google.com/macros/s/AKfycbwExFzCMHdKlpqqvy5hP5r07vATa9BP0ZZB_4ylOkeA6oLCjhkR_CgNM5VCpIAVIavn/exec';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function DashboardEmbed() {
  const [loading, setLoading]               = useState(true);
  const [installPrompt, setInstallPrompt]   = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled]           = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches;
  });
  const [showInstallBanner, setShowInstall] = useState(false);

  useEffect(() => {
    // Capturar el evento del navegador para instalar la PWA
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Mostrar banner solo si no está instalada aún
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
      setShowInstall(false);
    }
    setInstallPrompt(null);
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0F2D3D]">

      {/* ── Loader mientras el iframe carga ───────────────────── */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0F2D3D]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white text-sm opacity-80">
              Cargando sistema clínico...
            </span>
          </div>
        </div>
      )}

      {/* ── Banner de instalación PWA ─────────────────────────── */}
      {showInstallBanner && !installed && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: 'linear-gradient(135deg, #0A1F2E, #1C5F7B)',
            borderTop: '1px solid rgba(46,134,171,.4)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 -4px 24px rgba(0,0,0,.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Ícono diente */}
            <div style={{
              width: 40, height: 40,
              background: 'rgba(46,134,171,.3)',
              border: '1px solid rgba(46,134,171,.5)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', flexShrink: 0,
            }}>🦷</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '.9rem', lineHeight: 1.2 }}>
                Instalar ArcoDent
              </div>
              <div style={{ color: 'rgba(255,255,255,.55)', fontSize: '.75rem', marginTop: 2 }}>
                Acceso rápido desde tu pantalla de inicio
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => setShowInstall(false)}
              style={{
                padding: '8px 14px', borderRadius: 8,
                background: 'rgba(255,255,255,.08)',
                border: '1px solid rgba(255,255,255,.15)',
                color: 'rgba(255,255,255,.6)',
                fontSize: '.82rem', fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Ahora no
            </button>
            <button
              onClick={handleInstall}
              style={{
                padding: '8px 18px', borderRadius: 8,
                background: 'linear-gradient(135deg, #1C5F7B, #2E86AB)',
                border: 'none',
                color: '#fff',
                fontSize: '.82rem', fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(46,134,171,.4)',
              }}
            >
              ⬇ Instalar
            </button>
          </div>
        </div>
      )}

      {/* ── IFRAME — GAS App (sin cambios) ───────────────────── */}
      <iframe
        src="https://script.google.com/macros/s/AKfycbzkHTsyBR9lIB80QEpnuKsWGX87aNPQIM5PjBS3DqqCaUadQuB-324WcgRBjTy2lwU7/exec"
        className="w-full h-full border-0"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 10,
          background: '#0F2D3D',
        }}
        onLoad={() => setLoading(false)}
        title="ArcoDent — Sistema Odontológico"
        allow="camera; microphone; geolocation"
      />
    </main>
  );
}
