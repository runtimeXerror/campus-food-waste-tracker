import React from 'react';

// ─── KPI Stat Card ──────────────────────────────────
export function StatCard({ label, value, icon, color, subtitle, delay = 0 }) {
  return (
    <div
      className="animate-fade-slide bg-surface-800 rounded-2xl p-5 border border-surface-100/10 hover:border-primary-400/30 transition-all duration-300"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
          <p className={`mt-2 text-2xl font-bold font-mono ${color || 'text-primary-400'}`}>{value}</p>
          {subtitle && <p className="mt-1 text-[11px] text-gray-500">{subtitle}</p>}
        </div>
        <span className="text-2xl opacity-60">{icon}</span>
      </div>
    </div>
  );
}

// ─── Section Card ───────────────────────────────────
export function Card({ title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-surface-800 rounded-2xl p-5 border border-surface-100/10 ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
          {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Loading Skeleton ───────────────────────────────
export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-surface-800 rounded-xl ${className}`} />
  );
}

// ─── Badge ──────────────────────────────────────────
export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-primary-400/15 text-primary-400',
    success: 'bg-emerald-500/15 text-emerald-400',
    warning: 'bg-yellow-500/15 text-yellow-400',
    danger: 'bg-red-500/15 text-red-400',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}

// ─── Select Input ───────────────────────────────────
export function Select({ label, value, onChange, options, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border border-surface-100/10 bg-surface-950 text-gray-200 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Text Input ─────────────────────────────────────
export function Input({ label, type = 'text', value, onChange, placeholder, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg border border-surface-100/10 bg-surface-950 text-gray-200 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all placeholder:text-gray-600"
      />
    </div>
  );
}

// ─── Button ─────────────────────────────────────────
export function Button({ children, onClick, disabled, variant = 'primary', className = '', type = 'button' }) {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-400 to-emerald-500 text-gray-950 font-bold hover:brightness-110',
    secondary: 'bg-surface-800 text-gray-300 border border-surface-100/10 hover:border-primary-400/30',
    ghost: 'text-gray-400 hover:text-primary-400 hover:bg-surface-800',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Empty State ────────────────────────────────────
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
