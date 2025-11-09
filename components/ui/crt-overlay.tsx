/**
 * CRT Overlay Effect
 * Scanlines, chromatic aberration, vignette, barrel distortion
 * PS1/retro aesthetic
 */

'use client';

import { useEffect, useState } from 'react';

interface CRTOverlayProps {
  intensity?: number;  // 0-1, default 0.5
  enabled?: boolean;
}

export function CRTOverlay({ intensity = 0.5, enabled = true }: CRTOverlayProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    
    const interval = setInterval(() => {
      setTime(t => t + 0.1);
    }, 50);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Scanlines */}
      <div 
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, ${0.15 * intensity}),
            rgba(0, 0, 0, ${0.15 * intensity}) 1px,
            transparent 1px,
            transparent 2px
          )`,
          opacity: 0.8
        }}
      />

      {/* Horizontal scanline sweep */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            transparent 0%,
            rgba(255, 255, 255, ${0.02 * intensity}) 50%,
            transparent 100%
          )`,
          animation: 'scanline-sweep 8s linear infinite',
          height: '100%'
        }}
      />

      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 40%,
            rgba(0, 0, 0, ${0.3 * intensity}) 80%,
            rgba(0, 0, 0, ${0.6 * intensity}) 100%
          )`
        }}
      />

      {/* CRT curvature simulation (dark edges) */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            circle at 50% 50%,
            transparent 60%,
            rgba(0, 0, 0, ${0.2 * intensity}) 100%
          )`
        }}
      />

      {/* VHS noise/grain */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          animation: 'grain 0.5s steps(10) infinite'
        }}
      />

      {/* RGB chromatic aberration glow on edges */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(90deg, 
              rgba(255, 0, 0, ${0.1 * intensity}) 0%, 
              transparent 5%, 
              transparent 95%, 
              rgba(0, 255, 255, ${0.1 * intensity}) 100%
            ),
            linear-gradient(0deg, 
              rgba(0, 0, 255, ${0.1 * intensity}) 0%, 
              transparent 5%, 
              transparent 95%, 
              rgba(255, 255, 0, ${0.1 * intensity}) 100%
            )
          `
        }}
      />

      {/* Flicker effect (subtle) */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          opacity: Math.sin(time * 2) * 0.5 + 0.5,
          animation: 'flicker 0.15s infinite'
        }}
      />

      <style jsx>{`
        @keyframes scanline-sweep {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }

        @keyframes flicker {
          0% { opacity: 0.98; }
          50% { opacity: 1; }
          100% { opacity: 0.98; }
        }
      `}</style>
    </div>
  );
}

/**
 * CRT Toggle Button
 */
interface CRTToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function CRTToggle({ enabled, onChange }: CRTToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`
        px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider
        transition-all duration-200
        ${enabled 
          ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]' 
          : 'bg-white/5 text-gray-400 border-2 border-gray-600 hover:border-gray-500'
        }
      `}
    >
      CRT: {enabled ? 'ON' : 'OFF'}
    </button>
  );
}
