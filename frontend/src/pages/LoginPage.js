import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', username: '', full_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(form);
      } else {
        await login(form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: typeof val === 'string' ? val : val.target.value }));

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-slide">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-emerald-500 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-primary-400/20 mb-4">
            🍃
          </div>
          <h1 className="text-2xl font-bold text-gray-100">NourishTrack</h1>
          <p className="text-sm text-gray-500 mt-1 font-mono tracking-wider">AI-POWERED FOOD WASTE INTELLIGENCE</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-800 rounded-2xl p-8 border border-surface-100/10 shadow-2xl animate-fade-slide" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-bold text-gray-200 mb-6">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input type="text" value={form.full_name} onChange={set('full_name')} required
                    className="w-full px-3 py-2.5 rounded-lg border border-surface-100/10 bg-surface-950 text-gray-200 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
                  <input type="text" value={form.username} onChange={set('username')} required
                    className="w-full px-3 py-2.5 rounded-lg border border-surface-100/10 bg-surface-950 text-gray-200 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all" />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={set('email')} required placeholder="you@campus.edu"
                className="w-full px-3 py-2.5 rounded-lg border border-surface-100/10 bg-surface-950 text-gray-200 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all placeholder:text-gray-600" />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={set('password')} required placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg border border-surface-100/10 bg-surface-950 text-gray-200 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all placeholder:text-gray-600" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-400 to-emerald-500 text-gray-950 font-bold text-sm transition-all hover:brightness-110 disabled:opacity-50">
              {loading ? '...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-sm text-gray-500 hover:text-primary-400 transition-colors">
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>

          {!isRegister && (
            <div className="mt-4 p-3 rounded-xl bg-surface-950 border border-surface-100/10">
              <p className="text-[11px] text-gray-500 text-center">
                Demo: <span className="text-primary-400 font-mono">admin@campus.edu</span> / <span className="text-primary-400 font-mono">admin123</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
