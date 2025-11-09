/**
 * Xbox Blade Navigation
 * Slide-in panels from left edge with metallic green accents
 * OG Xbox menu aesthetic
 */

'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export type BladeSection = 'inventory' | 'map' | 'social' | 'settings' | null;

interface XboxBladeNavProps {
  activeSection: BladeSection;
  onClose: () => void;
  children: ReactNode;
}

export function XboxBladeNav({ activeSection, onClose, children }: XboxBladeNavProps) {
  return (
    <AnimatePresence>
      {activeSection && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Blade Panel */}
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed left-0 top-0 h-full w-96 bg-gradient-to-r from-black/95 to-black/90 z-50 overflow-y-auto"
            style={{
              boxShadow: '0 0 40px rgba(0, 240, 255, 0.3), inset 0 0 60px rgba(0, 240, 255, 0.1)'
            }}
          >
            {/* Green accent strip (Xbox signature) */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-1"
              style={{
                background: 'linear-gradient(180deg, #00f0ff 0%, #10b981 50%, #00f0ff 100%)',
                boxShadow: '0 0 20px #00f0ff'
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-cyan-400" />
            </button>

            {/* Content */}
            <div className="p-6 pt-16">
              {children}
            </div>

            {/* Scanlines overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                background: `repeating-linear-gradient(
                  0deg,
                  rgba(0, 240, 255, 0.03),
                  rgba(0, 240, 255, 0.03) 1px,
                  transparent 1px,
                  transparent 2px
                )`
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Blade Menu Item
 */
interface BladeMenuItemProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

export function BladeMenuItem({ icon, label, onClick, active = false }: BladeMenuItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 p-4 rounded-lg
        transition-all duration-200
        ${active 
          ? 'bg-cyan-500/20 border-l-4 border-cyan-400' 
          : 'bg-white/5 hover:bg-white/10 border-l-4 border-transparent hover:border-cyan-400/50'
        }
      `}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`${active ? 'text-cyan-400' : 'text-gray-400'}`}>
        {icon}
      </div>
      <span className={`text-lg font-bold uppercase tracking-wide ${active ? 'text-cyan-400' : 'text-gray-300'}`}>
        {label}
      </span>
      
      {/* Glow effect for active item */}
      {active && (
        <div 
          className="absolute right-0 h-full w-1"
          style={{
            background: '#00f0ff',
            boxShadow: '0 0 20px #00f0ff'
          }}
        />
      )}
    </motion.button>
  );
}

/**
 * Blade Section Header
 */
interface BladeSectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function BladeSectionHeader({ title, subtitle }: BladeSectionHeaderProps) {
  return (
    <div className="mb-6 pb-4 border-b border-cyan-400/30">
      <h2 
        className="text-3xl font-bold uppercase tracking-wider text-white mb-1"
        style={{
          textShadow: '0 0 20px rgba(0, 240, 255, 0.6)',
          fontFamily: "'Orbitron', 'Arial Black', sans-serif"
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-400 uppercase tracking-wide font-mono">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * Blade Stat Card
 */
interface BladeStatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: 'cyan' | 'green' | 'red' | 'purple';
}

export function BladeStatCard({ label, value, icon, color = 'cyan' }: BladeStatCardProps) {
  const colors = {
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-400/30', text: 'text-cyan-400', glow: '#00f0ff' },
    green: { bg: 'bg-green-500/10', border: 'border-green-400/30', text: 'text-green-400', glow: '#10b981' },
    red: { bg: 'bg-red-500/10', border: 'border-red-400/30', text: 'text-red-400', glow: '#ff0032' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-400/30', text: 'text-purple-400', glow: '#7b00ff' }
  };

  const colorScheme = colors[color];

  return (
    <div 
      className={`${colorScheme.bg} ${colorScheme.border} border rounded-lg p-4`}
      style={{
        boxShadow: `0 0 20px ${colorScheme.glow}20`
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wide text-gray-400 font-mono">
          {label}
        </span>
        {icon && (
          <div className={colorScheme.text}>
            {icon}
          </div>
        )}
      </div>
      <div 
        className={`text-2xl font-bold ${colorScheme.text}`}
        style={{
          textShadow: `0 0 10px ${colorScheme.glow}80`
        }}
      >
        {value}
      </div>
    </div>
  );
}

/**
 * Blade List Item
 */
interface BladeListItemProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onClick?: () => void;
  rightContent?: ReactNode;
}

export function BladeListItem({ title, subtitle, icon, onClick, rightContent }: BladeListItemProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`
        flex items-center gap-3 p-3 rounded-lg
        bg-white/5 border border-white/10
        ${onClick ? 'hover:bg-white/10 cursor-pointer' : ''}
        transition-colors
      `}
      whileHover={onClick ? { x: 4 } : {}}
    >
      {icon && (
        <div className="text-cyan-400">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <div className="text-white font-semibold">{title}</div>
        {subtitle && (
          <div className="text-xs text-gray-400 uppercase tracking-wide font-mono">{subtitle}</div>
        )}
      </div>
      {rightContent && (
        <div className="text-cyan-400">
          {rightContent}
        </div>
      )}
    </motion.div>
  );
}
