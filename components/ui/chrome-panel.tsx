/**
 * Chrome Panel UI Component
 * Liquid metal gradients with RGB edge glow and CRT scanlines
 * Xbox/PS1/Opium aesthetic
 */

'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ChromePanelProps {
  children: ReactNode;
  variant?: 'solid' | 'liquid' | 'glass';
  glow?: boolean;
  scanlines?: boolean;
  className?: string;
}

export function ChromePanel({ 
  children, 
  variant = 'liquid', 
  glow = true,
  scanlines = true,
  className = ''
}: ChromePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        relative rounded-lg overflow-hidden backdrop-blur-sm
        ${variant === 'liquid' ? 'chrome-liquid-bg' : ''}
        ${variant === 'glass' ? 'chrome-glass-bg' : ''}
        ${variant === 'solid' ? 'chrome-solid-bg' : ''}
        ${className}
      `}
    >
      {/* Liquid metal gradient background */}
      {variant === 'liquid' && (
        <div className="absolute inset-0 chrome-gradient animate-liquid-flow pointer-events-none" />
      )}
      
      {/* Glass effect */}
      {variant === 'glass' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/1 pointer-events-none" />
      )}
      
      {/* RGB edge glow */}
      {glow && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 chrome-border-glow rounded-lg" />
        </div>
      )}
      
      {/* CRT scanlines */}
      {scanlines && (
        <div className="absolute inset-0 pointer-events-none scanlines opacity-20" />
      )}
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes liquid-flow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .chrome-gradient {
          background: linear-gradient(
            135deg,
            #d6d8df 0%,
            #f5f6fb 25%,
            #ffc0cb 50%,
            #00f0ff 75%,
            #d6d8df 100%
          );
          background-size: 400% 400%;
        }

        .animate-liquid-flow {
          animation: liquid-flow 8s ease infinite;
        }

        .chrome-liquid-bg {
          background: rgba(10, 10, 10, 0.8);
        }

        .chrome-glass-bg {
          background: rgba(20, 20, 30, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chrome-solid-bg {
          background: linear-gradient(
            135deg,
            rgba(30, 30, 40, 0.95),
            rgba(20, 20, 30, 0.95)
          );
        }

        .chrome-border-glow {
          box-shadow: 
            inset 0 0 20px rgba(255, 0, 50, 0.3),
            inset 0 0 40px rgba(0, 240, 255, 0.2),
            0 0 20px rgba(255, 0, 50, 0.2),
            0 0 40px rgba(123, 0, 255, 0.15);
          border: 1px solid transparent;
          background: 
            linear-gradient(rgba(10, 10, 10, 0), rgba(10, 10, 10, 0)) padding-box,
            linear-gradient(90deg, #ff0032, #00f0ff, #7b00ff, #ff0032) border-box;
        }

        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
        }
      `}</style>
    </motion.div>
  );
}

/**
 * Chrome Header - Orbitron/Eurostile style headers
 */
interface ChromeHeaderProps {
  children: ReactNode;
  color?: 'red' | 'purple' | 'blue' | 'green' | 'pink';
  size?: 'sm' | 'md' | 'lg';
}

export function ChromeHeader({ 
  children, 
  color = 'red',
  size = 'md' 
}: ChromeHeaderProps) {
  const colors = {
    red: '#ff0032',      // Opium red
    purple: '#7b00ff',   // Carti purple
    blue: '#00f0ff',     // Toxic teal
    green: '#10b981',    // DeFi green
    pink: '#ec4899'      // Social pink
  };

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <h2 
      className={`
        ${sizes[size]} 
        font-bold uppercase tracking-wider
        bg-gradient-to-r from-white to-gray-300
        bg-clip-text text-transparent
        mb-4
      `}
      style={{
        textShadow: `0 0 20px ${colors[color]}, 0 0 40px ${colors[color]}40`,
        fontFamily: "'Orbitron', 'Arial Black', sans-serif"
      }}
    >
      {children}
    </h2>
  );
}

/**
 * Chrome Stat - Display stat with label
 */
interface ChromeStatProps {
  label: string;
  value: string | number;
  color?: 'red' | 'purple' | 'blue' | 'green' | 'pink';
}

export function ChromeStat({ label, value, color = 'blue' }: ChromeStatProps) {
  const colors = {
    red: '#ff0032',
    purple: '#7b00ff',
    blue: '#00f0ff',
    green: '#10b981',
    pink: '#ec4899'
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-gray-400 font-mono">
        {label}
      </span>
      <span 
        className="text-2xl font-bold"
        style={{
          color: colors[color],
          textShadow: `0 0 10px ${colors[color]}80`
        }}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Chrome Button - Opium red glowing button
 */
interface ChromeButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
}

export function ChromeButton({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false,
  className = ''
}: ChromeButtonProps) {
  const baseClasses = `
    px-6 py-3 rounded-lg font-bold uppercase tracking-wider
    transition-all duration-200 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-red-600 to-red-500
      hover:from-red-500 hover:to-red-400
      text-white
      shadow-[0_0_20px_rgba(255,0,50,0.5)]
      hover:shadow-[0_0_30px_rgba(255,0,50,0.8)]
    `,
    secondary: `
      bg-gradient-to-r from-purple-600 to-purple-500
      hover:from-purple-500 hover:to-purple-400
      text-white
      shadow-[0_0_20px_rgba(123,0,255,0.5)]
      hover:shadow-[0_0_30px_rgba(123,0,255,0.8)]
    `,
    ghost: `
      bg-transparent border-2 border-cyan-400
      hover:bg-cyan-400/10
      text-cyan-400
      shadow-[0_0_10px_rgba(0,240,255,0.3)]
      hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]
    `
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
}
