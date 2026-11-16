'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  pnl: number;
  pnlPercent: number;
  trades: number;
  winRate: number;
  volume: number;
  streak: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'OracleX', avatar: 'from-amber-400 to-orange-500', pnl: 284500, pnlPercent: 342, trades: 1247, winRate: 73.2, volume: 2800000, streak: 12 },
  { rank: 2, username: 'DeepMind', avatar: 'from-purple-400 to-indigo-500', pnl: 198200, pnlPercent: 267, trades: 892, winRate: 68.5, volume: 1950000, streak: 8 },
  { rank: 3, username: 'EdgeFinder', avatar: 'from-emerald-400 to-teal-500', pnl: 156800, pnlPercent: 198, trades: 1563, winRate: 64.8, volume: 3200000, streak: 5 },
  { rank: 4, username: 'SharpMoney', avatar: 'from-blue-400 to-cyan-500', pnl: 134500, pnlPercent: 178, trades: 634, winRate: 71.3, volume: 1200000, streak: 3 },
  { rank: 5, username: 'AlphaWolf', avatar: 'from-rose-400 to-pink-500', pnl: 112300, pnlPercent: 156, trades: 2104, winRate: 61.7, volume: 4100000, streak: 7 },
  { rank: 6, username: 'MarketMaker', avatar: 'from-violet-400 to-purple-500', pnl: 98700, pnlPercent: 134, trades: 3210, winRate: 58.9, volume: 5600000, streak: 2 },
  { rank: 7, username: 'ProphetPicks', avatar: 'from-green-400 to-emerald-500', pnl: 87400, pnlPercent: 112, trades: 478, winRate: 76.4, volume: 890000, streak: 9 },
  { rank: 8, username: 'DataDriven', avatar: 'from-sky-400 to-blue-500', pnl: 76200, pnlPercent: 98, trades: 1089, winRate: 63.1, volume: 1800000, streak: 4 },
  { rank: 9, username: 'ContrarianKing', avatar: 'from-yellow-400 to-amber-500', pnl: 65800, pnlPercent: 87, trades: 567, winRate: 69.8, volume: 1100000, streak: 6 },
  { rank: 10, username: 'WhaleWatcher', avatar: 'from-red-400 to-rose-500', pnl: 54300, pnlPercent: 72, trades: 1876, winRate: 57.3, volume: 2400000, streak: 1 },
  { rank: 11, username: 'TrendSurfer', avatar: 'from-teal-400 to-cyan-500', pnl: 43200, pnlPercent: 58, trades: 743, winRate: 62.5, volume: 980000, streak: 3 },
  { rank: 12, username: 'ValueHunter', avatar: 'from-orange-400 to-red-500', pnl: 38900, pnlPercent: 49, trades: 921, winRate: 60.1, volume: 1350000, streak: 2 },
];

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | 'ALL'>('30D');
  const [entries, setEntries] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate loading with randomized variations
    const timer = setTimeout(() => {
      setEntries(mockLeaderboard.map(e => ({
        ...e,
        pnl: Math.round(e.pnl * (0.8 + Math.random() * 0.4)),
        winRate: Math.round((e.winRate + (Math.random() - 0.5) * 4) * 10) / 10,
      })));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [timeframe]);

  const formatMoney = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">🏆 排行榜</h1>
          <p className="text-gray-400 text-sm">顶级预测者的表现排名</p>
        </div>

        <div className="flex gap-1 p-1 rounded-xl bg-gray-800/50 w-fit">
          {(['7D', '30D', 'ALL'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                timeframe === tf
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tf === '7D' ? '7天' : tf === '30D' ? '30天' : '全部'}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {entries.slice(0, 3).map((entry, i) => (
          <div
            key={entry.rank}
            className={`relative overflow-hidden rounded-2xl p-5 border ${
              i === 0
                ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20'
                : i === 1
                ? 'bg-gradient-to-br from-gray-400/10 to-gray-500/5 border-gray-400/20'
                : 'bg-gradient-to-br from-amber-700/10 to-amber-800/5 border-amber-700/20'
            }`}
          >
            <div className="absolute top-3 right-3 text-2xl">
              {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${entry.avatar} flex items-center justify-center text-sm font-bold text-white`}>
                {entry.username.slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{entry.username}</p>
                <p className="text-xs text-gray-500">#{entry.rank} 排名</p>
              </div>
            </div>

            <p className="text-2xl font-bold text-emerald-400 mb-1">+{formatMoney(entry.pnl)}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{entry.trades} 交易</span>
              <span>·</span>
              <span>{entry.winRate}% 胜率</span>
              <span>·</span>
              <span>🔥 {entry.streak}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full table */}
      <div className="bg-[#141720] border border-gray-800/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800/60">
                <th className="text-left text-[11px] text-gray-500 font-medium uppercase tracking-wider px-5 py-3 w-16">#</th>
                <th className="text-left text-[11px] text-gray-500 font-medium uppercase tracking-wider px-5 py-3">交易者</th>
                <th className="text-right text-[11px] text-gray-500 font-medium uppercase tracking-wider px-5 py-3">盈亏</th>
                <th className="text-right text-[11px] text-gray-500 font-medium uppercase tracking-wider px-5 py-3 hidden sm:table-cell">收益率</th>
                <th className="text-right text-[11px] text-gray-500 font-medium uppercase tracking-wider px-5 py-3 hidden md:table-cell">交易数</th>
                <th className="text-right text-[11px] text-gray-500 font-medium uppercase tracking-wider px-5 py-3 hidden md:table-cell">胜率</th>
                <th className="text-right text-[11px] text-gray-500 font-medium uppercase tracking-wider px-5 py-3 hidden lg:table-cell">交易量</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-800/30 animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 w-6 bg-gray-800 rounded" /></td>
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-800 rounded-full" /><div className="h-4 w-20 bg-gray-800 rounded" /></div></td>
                    <td className="px-5 py-4"><div className="h-4 w-16 bg-gray-800 rounded ml-auto" /></td>
                    <td className="px-5 py-4 hidden sm:table-cell"><div className="h-4 w-12 bg-gray-800 rounded ml-auto" /></td>
                    <td className="px-5 py-4 hidden md:table-cell"><div className="h-4 w-10 bg-gray-800 rounded ml-auto" /></td>
                    <td className="px-5 py-4 hidden md:table-cell"><div className="h-4 w-10 bg-gray-800 rounded ml-auto" /></td>
                    <td className="px-5 py-4 hidden lg:table-cell"><div className="h-4 w-14 bg-gray-800 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : (
                entries.map(entry => (
                  <tr key={entry.rank} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors group cursor-pointer">
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-bold ${entry.rank <= 3 ? 'text-amber-400' : 'text-gray-500'}`}>
                        {entry.rank}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${entry.avatar} flex items-center justify-center text-[10px] font-bold text-white`}>
                          {entry.username.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">{entry.username}</p>
                          <p className="text-[10px] text-gray-500">🔥 {entry.streak}连胜</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm font-bold text-emerald-400 tabular-nums">+{formatMoney(entry.pnl)}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                      <span className="text-sm text-emerald-400 font-medium tabular-nums">+{entry.pnlPercent}%</span>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden md:table-cell">
                      <span className="text-sm text-gray-400 tabular-nums">{entry.trades.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden md:table-cell">
                      <span className={`text-sm font-medium tabular-nums ${entry.winRate >= 65 ? 'text-emerald-400' : entry.winRate >= 55 ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {entry.winRate}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden lg:table-cell">
                      <span className="text-sm text-gray-400 tabular-nums">{formatMoney(entry.volume)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
