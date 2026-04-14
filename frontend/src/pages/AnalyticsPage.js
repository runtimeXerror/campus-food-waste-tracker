import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsAPI } from '../services/api';
import { Card, Skeleton } from '../components/UI';

const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const HALLS = ['Main Dining Hall', 'North Cafeteria', 'South Commons', 'West Bistro'];

export default function AnalyticsPage() {
  const [trends, setTrends] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [tRes, hRes, rRes] = await Promise.all([
          analyticsAPI.trends({ days }),
          analyticsAPI.heatmap({ days }),
          analyticsAPI.reasons({ days }),
        ]);
        setTrends(tRes.data);
        setHeatmap(hRes.data);
        setReasons(rRes.data);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, [days]);

  // Build heatmap lookup
  const heatLookup = {};
  let maxHeat = 1;
  heatmap.forEach(h => {
    const key = `${h.meal_type}|${h.dining_hall}`;
    heatLookup[key] = h.total_kg;
    if (h.total_kg > maxHeat) maxHeat = h.total_kg;
  });

  const maxReason = reasons[0]?.total_kg || 1;

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-72" /><Skeleton className="h-72" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-100">Analytics</h2>
          <p className="text-xs text-gray-500 mt-0.5">Deep dive into waste patterns</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trend Line */}
        <Card title="Daily Waste Trend" subtitle={`Last ${days} days`}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5e7698' }} tickFormatter={d => d.slice(5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#5e7698' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #1e3a5f', borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="total_kg" stroke="#22d3ee" strokeWidth={2} fill="url(#aGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Heatmap */}
        <Card title="Waste Heatmap" subtitle="Meal × Dining Hall">
          <div className="overflow-x-auto">
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `80px repeat(${HALLS.length}, 1fr)` }}>
              <div />
              {HALLS.map(h => (
                <div key={h} className="text-[10px] font-semibold text-gray-500 text-center py-1 truncate">{h.split(' ')[0]}</div>
              ))}
              {MEALS.map(meal => (
                <React.Fragment key={meal}>
                  <div className="text-[11px] font-semibold text-gray-500 flex items-center">{meal}</div>
                  {HALLS.map(hall => {
                    const val = heatLookup[`${meal}|${hall}`] || 0;
                    const intensity = val / maxHeat;
                    return (
                      <div key={`${meal}-${hall}`}
                        className="rounded-lg p-2 text-center font-mono text-[11px] font-semibold transition-all"
                        style={{
                          background: `rgba(239, 68, 68, ${0.08 + intensity * 0.65})`,
                          color: intensity > 0.45 ? '#fff' : '#94a3b8',
                        }}>
                        {Math.round(val)}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Reason Breakdown */}
      <Card title="Waste Reasons Analysis" subtitle="What's driving food waste">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {reasons.map((r, i) => (
            <div key={r.reason} className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-600 w-6 text-right">#{i + 1}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-400">{r.reason}</span>
                  <span className="text-[11px] font-mono text-gray-500">{Math.round(r.total_kg)} kg</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-950 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(r.total_kg / maxReason) * 100}%`,
                      background: i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#22d3ee',
                    }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
