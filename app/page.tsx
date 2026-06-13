'use client';

import { useState, useEffect } from 'react';

// ── GAS Webapp URL ─────────────────────────────────────────────
// Única fuente de verdad — cambiar aquí al redesplegar GAS
const GAS_URL =
  'https://script.google.com/macros/s/AKfycbzkHTsyBR9lIB80QEpnuKsWGX87aNPQIM5PjBS3DqqCaUadQuB-324WcgRBjTy2lwU7/exec';

// ── TypeScript: tipo para el evento de instalación PWA ────────
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function DashboardEmbed() {
  const [loading, setLoading]             = useState(true);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner]       = useState(false);

  useEffect(() => {
    // ── Detectar si ya está instalada como PWA ──────────────
    // Si está en modo standalone, no mostrar el banner
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // ── Capturar el evento de instalación del navegador ────
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setShowBanner(false);
    setInstallPrompt(null);
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0F2D3D]">

      {/* ── Splash loader ─────────────────────────────────────
          Se muestra solo el tiempo que tarda el iframe en cargar.
          La sesión ya está guardada en localStorage del GAS → el
          formulario de login NO aparece si el token es válido (30 días).
      ── */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#060D14]">
          <div className="flex flex-col items-center gap-4">
            <div style={{
              width: 64, height: 64,
              background: 'linear-gradient(135deg, rgba(46,134,171,.2), rgba(28,95,123,.15))',
              border: '1px solid rgba(46,134,171,.35)',
              borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem',
            }}>🦷</div>
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
            <span style={{ color: 'rgba(255,255,255,.35)', fontSize: '.78rem', letterSpacing: '.8px' }}>
              ARCODENT
            </span>
          </div>
        </div>
      )}

      {/* ── Banner de instalación PWA ─────────────────────────
          Solo aparece en Chrome/Edge cuando el navegador considera
          que la app cumple los criterios de instalación.
          En iOS: el usuario instala manualmente (Safari → Compartir → Añadir a inicio).
      ── */}
      {showBanner && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
          background: 'linear-gradient(135deg, #0A1F2E, #1C5F7B)',
          borderTop: '1px solid rgba(46,134,171,.4)',
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 -6px 32px rgba(0,0,0,.5)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 42, height: 42,
              background: 'rgba(46,134,171,.25)',
              border: '1px solid rgba(46,134,171,.45)',
              borderRadius: 11,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', flexShrink: 0,
            }}>🦷</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '.88rem', lineHeight: 1.2 }}>
                Instalar ArcoDent
              </div>
              <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '.73rem', marginTop: 3 }}>
                Acceso directo · Sin abrir el navegador
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => setShowBanner(false)}
              style={{
                padding: '8px 13px', borderRadius: 8,
                background: 'rgba(255,255,255,.07)',
                border: '1px solid rgba(255,255,255,.12)',
                color: 'rgba(255,255,255,.55)',
                fontSize: '.8rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Ahora no
            </button>
            <button
              onClick={handleInstall}
              style={{
                padding: '8px 18px', borderRadius: 8,
                background: 'linear-gradient(135deg, #1C5F7B, #2E86AB)',
                border: 'none', color: '#fff',
                fontSize: '.82rem', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(46,134,171,.4)',
              }}
            >
              ⬇ Instalar
            </button>
          </div>
        </div>
      )}

      {/* ── IFRAME — GAS App ─────────────────────────────────── */}
      <iframe
        src={GAS_URL}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          border: 'none', zIndex: 10,
          background: '#060D14',
        }}
        onLoad={() => setLoading(false)}
        title="ArcoDent — Sistema Odontológico"
        allow="camera; microphone; geolocation"
      />
    </main>
  );
}