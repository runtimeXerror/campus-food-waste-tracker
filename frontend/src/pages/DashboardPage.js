import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardAPI, wasteLogAPI } from '../services/api';
import { StatCard, Card, Skeleton } from '../components/UI';

const COLORS = ['#22d3ee', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#ec4899', '#f97316', '#6366f1'];

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [halls, setHalls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [logs, setLogs] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [sumRes, hallRes, catRes, logRes] = await Promise.all([
          dashboardAPI.summary({ days }),
          dashboardAPI.halls({ days }),
          dashboardAPI.categories({ days }),
          wasteLogAPI.list({ page: 1, page_size: 12 }),
        ]);
        setSummary(sumRes.data);
        setHalls(hallRes.data);
        setCategories(catRes.data);
        setLogs(logRes.data.items);
      } catch (e) {
        console.error('Failed to load dashboard', e);
      }
      setLoading(false);
    }
    load();
  }, [days]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-100">Dashboard</h2>
          <p className="text-xs text-gray-500 mt-0.5">Campus food waste overview</p>
        </div>
        <div className="flex bg-surface-800 rounded-lg border border-surface-100/10 overflow-hidden">
          {[7, 30, 60].map(d => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-4 py-2 text-xs font-semibold transition-all ${days === d ? 'bg-primary-400 text-gray-950' : 'text-gray-500 hover:text-gray-300'}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Waste" value={`${Math.round(summary.total_waste_kg).toLocaleString()} kg`} icon="🗑️" color="text-red-400" subtitle={`Avg ${Math.round(summary.avg_daily_kg)} kg/day`} delay={0} />
          <StatCard label="CO₂ Emissions" value={`${Math.round(summary.total_co2_kg).toLocaleString()} kg`} icon="💨" color="text-yellow-400" subtitle="Carbon footprint" delay={0.05} />
          <StatCard label="Financial Loss" value={`$${Math.round(summary.total_cost_usd).toLocaleString()}`} icon="💰" color="text-primary-400" subtitle="Estimated cost" delay={0.1} />
          <StatCard label="Trend" value={`${summary.change_percent > 0 ? '+' : ''}${summary.change_percent}%`} icon={summary.change_percent <= 0 ? '📉' : '📈'} color={summary.change_percent <= 0 ? 'text-emerald-400' : 'text-red-400'} subtitle="vs previous period" delay={0.15} />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trend Chart */}
        <Card title="Daily Waste Trend" subtitle={`Last ${days} days`}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={summary?.daily_trend || []}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5e7698' }} tickFormatter={d => d.slice(5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#5e7698' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #1e3a5f', borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="total_kg" stroke="#22d3ee" strokeWidth={2} fill="url(#trendGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Hall Breakdown */}
        <Card title="Waste by Dining Hall">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={halls} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10, fill: '#5e7698' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="hall" tick={{ fontSize: 11, fill: '#94a3b8' }} width={100} axisLine={false} tickLine={false} tickFormatter={h => h.split(' ')[0]} />
              <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #1e3a5f', borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="total_kg" fill="#22d3ee" radius={[0, 6, 6, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Category + Table Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category Donut */}
        <Card title="Category Breakdown">
          <div className="flex justify-center mb-3">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={categories.slice(0, 6)} dataKey="total_kg" nameKey="category" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {categories.slice(0, 6).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #1e3a5f', borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {categories.slice(0, 5).map((cat, i) => (
              <div key={cat.category} className="flex items-center gap-2 text-[11px]">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORS[i] }} />
                <span className="text-gray-400 flex-1">{cat.category}</span>
                <span className="text-gray-500 font-mono">{Math.round(cat.total_kg)} kg</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Logs Table */}
        <Card title="Recent Entries" className="lg:col-span-2">
          <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 text-left border-b border-surface-100/10">
                  <th className="pb-2 pl-1 font-semibold">Date</th>
                  <th className="pb-2 font-semibold">Hall</th>
                  <th className="pb-2 font-semibold">Meal</th>
                  <th className="pb-2 font-semibold">Category</th>
                  <th className="pb-2 font-semibold text-right pr-1">Qty</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-surface-100/5 hover:bg-surface-900/50 transition-colors">
                    <td className="py-2 pl-1 text-gray-500 font-mono">{log.logged_at.slice(0, 10)}</td>
                    <td className="py-2 text-gray-400">{log.dining_hall.split(' ')[0]}</td>
                    <td className="py-2 text-gray-400">{log.meal_type}</td>
                    <td className="py-2 text-gray-400">{log.food_category}</td>
                    <td className="py-2 pr-1 text-right font-semibold text-gray-200">{log.quantity_kg} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
