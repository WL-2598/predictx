'use client';

import { useState, useEffect } from 'react';

interface PnlDataPoint {
  date: string;
  pnl: number;
  cumulative: number;
  balance: number;
}

interface PortfolioAnalyticsProps {
  currentBalance: number;
  totalPnl: number;
  totalInvested: number;
}

function generatePnlHistory(): PnlDataPoint[] {
  const points: PnlDataPoint[] = [];
  let balance = 8000;
  let cumulative = 0;

  for (let i = 30; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const dailyPnl = (Math.random() - 0.42) * 400;
    cumulative += dailyPnl;
    balance += dailyPnl;
    points.push({
      date: date.toISOString(),
      pnl: Math.round(dailyPnl * 100) / 100,
      cumulative: Math.round(cumulative * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }
  return points;
}

export default function PortfolioAnalytics({ currentBalance, totalPnl, totalInvested }: PortfolioAnalyticsProps) {
  const [pnlHistory] = useState<PnlDataPoint[]>(generatePnlHistory);
  const [timeframe, setTimeframe] = useState<'7D' | '30D'>('30D');

  const filteredData = timeframe === '7D' ? pnlHistory.slice(-7) : pnlHistory;
  const maxBalance = Math.max(...filteredData.map(d => d.balance));
  const minBalance = Math.min(...filteredData.map(d => d.balance));
  const range = maxBalance - minBalance || 1;

  // Allocation data
  const allocations = [
    { name: '体育', percent: 45, color: 'bg-emerald-500' },
    { name: '加密货币', percent: 25, color: 'bg-cyan-500' },
    { name: '政治', percent: 15, color: 'bg-purple-500' },
    { name: '娱乐', percent: 10, color: 'bg-amber-500' },
    { name: '科技', percent: 5, color: 'bg-pink-500' },
  ];

  // Performance stats
  const bestDay = Math.max(...pnlHistory.map(d => d.pnl));
  const worstDay = Math.min(...pnlHistory.map(d => d.pnl));
  const avgDaily = pnlHistory.reduce((s, d) => s + d.pnl, 0) / pnlHistory.length;
  const winDays = pnlHistory.filter(d => d.pnl > 0).length;
  const winRate = (winDays / pnlHistory.length * 100).toFixed(0);

  return (
    <div className="space-y-4">
      {/* P&L Chart */}
      <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">盈亏走势</h3>
            <p className={`text-lg font-bold ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-1 p-0.5 rounded-lg bg-gray-800/40">
            {(['7D', '30D'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all ${
                  timeframe === tf ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tf === '7D' ? '7天' : '30天'}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative h-40">
          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            {/* Grid */}
            {[0, 10, 20, 30, 40].map(y => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
            ))}

            {/* Area fill */}
            <defs>
              <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M0,40 ${filteredData.map((d, i) => {
                const x = (i / (filteredData.length - 1)) * 100;
                const y = 40 - ((d.balance - minBalance) / range) * 38;
                return `L${x},${y}`;
              }).join(' ')} L100,40 Z`}
              fill="url(#pnlGrad)"
            />
            {/* Line */}
            <path
              d={`M${filteredData.map((d, i) => {
                const x = (i / (filteredData.length - 1)) * 100;
                const y = 40 - ((d.balance - minBalance) / range) * 38;
                return `${x},${y}`;
              }).join(' L')}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Min/Max labels */}
          <div className="absolute top-1 right-1 text-[9px] text-gray-500">${maxBalance.toFixed(0)}</div>
          <div className="absolute bottom-1 right-1 text-[9px] text-gray-500">${minBalance.toFixed(0)}</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#141720] border border-gray-800/60 rounded-xl p-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">最佳单日</p>
          <p className="text-sm font-bold text-emerald-400">+${bestDay.toFixed(0)}</p>
        </div>
        <div className="bg-[#141720] border border-gray-800/60 rounded-xl p-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">最差单日</p>
          <p className="text-sm font-bold text-red-400">${worstDay.toFixed(0)}</p>
        </div>
        <div className="bg-[#141720] border border-gray-800/60 rounded-xl p-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">日均盈亏</p>
          <p className={`text-sm font-bold ${avgDaily >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {avgDaily >= 0 ? '+' : ''}${avgDaily.toFixed(0)}
          </p>
        </div>
        <div className="bg-[#141720] border border-gray-800/60 rounded-xl p-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">日胜率</p>
          <p className="text-sm font-bold text-white">{winRate}%</p>
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">资产配置</h3>
        <div className="space-y-3">
          {allocations.map(a => (
            <div key={a.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">{a.name}</span>
                <span className="text-xs font-semibold text-white">{a.percent}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-800/60 overflow-hidden">
                <div className={`h-full rounded-full ${a.color}`} style={{ width: `${a.percent}%`, transition: 'width 0.5s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
