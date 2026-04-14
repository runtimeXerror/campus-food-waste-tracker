import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';
import { Card, Skeleton } from '../components/UI';

const BADGES = ['🏆', '🥈', '🥉', '⭐', '⭐'];

const ACHIEVEMENT_BADGES = [
  { icon: '🌱', name: 'First Logger', desc: 'Log your first entry' },
  { icon: '🔥', name: 'Week Warrior', desc: '7-day logging streak' },
  { icon: '📉', name: 'Trend Setter', desc: '10% weekly reduction' },
  { icon: '🌍', name: 'Eco Champion', desc: 'Save 100kg CO₂' },
  { icon: '👑', name: 'Zero Hero', desc: 'Zero waste day' },
  { icon: '🎓', name: 'Campus Legend', desc: '#1 for a month' },
];

export default function LeaderboardPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await leaderboardAPI.get();
        setTeams(res.data);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-16 w-48 mx-auto" />
        {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-20" />)}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-slide">
        <span className="text-5xl">🏆</span>
        <h2 className="text-2xl font-bold text-gray-100 mt-3">Campus Leaderboard</h2>
        <p className="text-sm text-gray-500 mt-1">Teams competing to reduce food waste</p>
      </div>

      {/* Rankings */}
      <div className="space-y-3 mb-8">
        {teams.map((team, i) => (
          <div key={i}
            className={`flex items-center gap-4 rounded-2xl p-5 border transition-all duration-200 hover:scale-[1.01] animate-fade-slide ${
              i === 0
                ? 'bg-gradient-to-r from-surface-800 to-yellow-500/5 border-yellow-500/20'
                : 'bg-surface-800 border-surface-100/10'
            }`}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <span className="text-2xl w-10 text-center shrink-0">{BADGES[i] || '⭐'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-gray-100">{team.team_name}</p>
              <p className="text-xs text-gray-500">{team.dining_hall}</p>
            </div>
            <div className="text-center px-4">
              <p className="text-xl font-bold font-mono text-emerald-400">-{team.reduction_percent}%</p>
              <p className="text-[10px] text-gray-500">reduction</p>
            </div>
            <div className="bg-primary-400/10 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-primary-400 shrink-0">
              🔥 {team.streak_days}d streak
            </div>
            <div className="text-xs text-gray-500 font-mono shrink-0 w-16 text-right">
              {team.total_logs} logs
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Badges */}
      <Card title="Available Badges" subtitle="Earn badges by contributing to waste reduction">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
          {ACHIEVEMENT_BADGES.map((badge, i) => (
            <div key={i}
              className="text-center p-4 rounded-xl bg-surface-950 border border-surface-100/10 hover:border-primary-400/20 transition-all animate-fade-slide"
              style={{ animationDelay: `${0.3 + i * 0.05}s` }}
            >
              <span className="text-2xl">{badge.icon}</span>
              <p className="text-xs font-bold text-gray-200 mt-2">{badge.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{badge.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
