import React, { useState, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { Card, Skeleton, Button } from '../components/UI';

export default function AIInsightsPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await aiAPI.insights({ days: 7 });
      setInsights(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!insights) return null;

  const env = insights.environmental_impact || {};
  const borderColors = ['border-l-red-500', 'border-l-yellow-500', 'border-l-primary-400', 'border-l-emerald-500', 'border-l-purple-500'];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-surface-800 to-primary-400/5 rounded-2xl p-6 border border-primary-400/10 animate-fade-slide">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <div>
              <h2 className="text-xl font-bold text-gray-100">AI Analysis Engine</h2>
              <p className="text-xs text-gray-500 font-mono">PATTERN RECOGNITION • PREDICTIVE MODELING • RECOMMENDATIONS</p>
            </div>
          </div>
          <Button onClick={load} variant="secondary" className="text-xs">
            🔄 Re-analyze
          </Button>
        </div>

        {/* Prediction Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-surface-800 rounded-xl p-4 border border-surface-100/10">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Predicted Next Week</p>
            <p className="mt-1.5 text-2xl font-bold font-mono text-yellow-400">{Math.round(insights.predicted_next_week).toLocaleString()} kg</p>
          </div>
          <div className="bg-surface-800 rounded-xl p-4 border border-surface-100/10">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Peak Waste Meal</p>
            <p className="mt-1.5 text-2xl font-bold font-mono text-red-400">{insights.peak_meal?.name || '—'}</p>
          </div>
          <div className="bg-surface-800 rounded-xl p-4 border border-surface-100/10">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Top Waste Reason</p>
            <p className="mt-1.5 text-lg font-bold font-mono text-primary-400">{insights.top_reason?.name || '—'}</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <Card title="🎯 AI Recommendations">
        <div className="space-y-3">
          {insights.recommendations.map((rec, i) => (
            <div key={i}
              className={`p-4 rounded-xl bg-surface-950 border border-surface-100/10 border-l-[3px] ${borderColors[i % borderColors.length]} text-sm text-gray-400 leading-relaxed animate-fade-slide`}
              style={{ animationDelay: `${i * 0.08}s` }}>
              {rec}
            </div>
          ))}
        </div>
      </Card>

      {/* Environmental Impact */}
      <Card title="Environmental Impact Potential" subtitle="If top waste issue is resolved">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
          {[
            { icon: '🌍', label: 'CO₂ Saveable', value: `${env.co2_saveable_kg?.toLocaleString()} kg`, color: 'text-emerald-400' },
            { icon: '💧', label: 'Water Saveable', value: `${env.water_saveable_l?.toLocaleString()} L`, color: 'text-primary-400' },
            { icon: '🍽️', label: 'Meals Recoverable', value: env.meals_recoverable?.toLocaleString(), color: 'text-yellow-400' },
            { icon: '💵', label: 'Cost Saveable', value: `$${env.cost_saveable_usd?.toLocaleString()}`, color: 'text-emerald-400' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-surface-950 border border-surface-100/10 animate-fade-slide" style={{ animationDelay: `${0.3 + i * 0.06}s` }}>
              <span className="text-2xl">{item.icon}</span>
              <p className={`mt-2 text-xl font-bold font-mono ${item.color}`}>{item.value}</p>
              <p className="text-[10px] text-gray-500 font-semibold mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-800 rounded-xl p-4 border border-surface-100/10 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Weekly Total</p>
          <p className="text-lg font-bold font-mono text-gray-200 mt-1">{Math.round(insights.weekly_total).toLocaleString()} kg</p>
        </div>
        <div className="bg-surface-800 rounded-xl p-4 border border-surface-100/10 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Change</p>
          <p className={`text-lg font-bold font-mono mt-1 ${insights.change_percent <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {insights.change_percent > 0 ? '+' : ''}{insights.change_percent}%
          </p>
        </div>
        <div className="bg-surface-800 rounded-xl p-4 border border-surface-100/10 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">CO₂ Total</p>
          <p className="text-lg font-bold font-mono text-yellow-400 mt-1">{insights.co2_total?.toLocaleString()} kg</p>
        </div>
        <div className="bg-surface-800 rounded-xl p-4 border border-surface-100/10 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Cost Total</p>
          <p className="text-lg font-bold font-mono text-primary-400 mt-1">${insights.cost_total?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
