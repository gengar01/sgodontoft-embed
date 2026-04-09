'use client';

import { useState } from 'react';

export default function DashboardEmbed() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0F2D3D]">
      
      {/* Loader elegante */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0F2D3D]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-white text-sm opacity-80">
              Cargando sistema clínico...
            </span>
          </div>
        </div>
      )}

      {/* IFRAME FULL APP */}
      <iframe
        src="https://script.google.com/macros/s/AKfycbwExFzCMHdKlpqqvy5hP5r07vATa9BP0ZZB_4ylOkeA6oLCjhkR_CgNM5VCpIAVIavn/exec"
        className="w-full h-full border-0"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 10,
          background: '#0F2D3D'
        }}
        allow="camera; microphone; fullscreen; clipboard-read; clipboard-write"
        loading="eager"
        referrerPolicy="no-referrer"
        onLoad={() => setLoading(false)}
      />
    </main>
  );
}