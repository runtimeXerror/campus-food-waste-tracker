import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/log', label: 'Log Waste', icon: '📝' },
  { path: '/analytics', label: 'Analytics', icon: '🔬' },
  { path: '/insights', label: 'AI Insights', icon: '🤖' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-surface-950">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? 'w-[68px]' : 'w-[220px]'} bg-surface-900 border-r border-surface-100/10 flex flex-col transition-all duration-300 shrink-0`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-surface-100/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-emerald-500 flex items-center justify-center text-lg shrink-0 shadow-lg shadow-primary-400/20">
            🍃
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-gray-100 leading-tight">NourishTrack</h1>
              <p className="text-[9px] text-gray-500 font-mono tracking-wider">FOOD WASTE AI</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-400/10 text-primary-400 border border-primary-400/20'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-surface-800 border border-transparent'
                }`
              }
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User & Collapse */}
        <div className="p-3 border-t border-surface-100/10 space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-1.5 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <span className="text-xs">{collapsed ? '▶' : '◀'}</span>
          </button>
          {user && !collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-400/20 flex items-center justify-center text-xs font-bold text-primary-400 shrink-0">
                {user.full_name?.[0] || user.username?.[0] || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-300 truncate">{user.full_name || user.username}</p>
                <button onClick={handleLogout} className="text-[10px] text-gray-500 hover:text-red-400 transition-colors">
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
