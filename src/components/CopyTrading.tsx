'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/ToastProvider';

interface TopTrader {
  id: string;
  username: string;
  avatar: string;
  pnl: number;
  pnlPercent: number;
  winRate: number;
  trades: number;
  followers: number;
  isCopying: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  avgPositionSize: number;
  topMarkets: string[];
}

const mockTraders: TopTrader[] = [
  { id: 't1', username: 'OracleX', avatar: 'from-amber-400 to-orange-500', pnl: 284500, pnlPercent: 342, winRate: 73.2, trades: 1247, followers: 4520, isCopying: false, riskLevel: 'medium', avgPositionSize: 450, topMarkets: ['NBA', 'Crypto', 'Politics'] },
  { id: 't2', username: 'DeepMind', avatar: 'from-purple-400 to-indigo-500', pnl: 198200, pnlPercent: 267, winRate: 68.5, trades: 892, followers: 3210, isCopying: true, riskLevel: 'low', avgPositionSize: 320, topMarkets: ['Soccer', 'Tennis', 'Science'] },
  { id: 't3', username: 'EdgeFinder', avatar: 'from-emerald-400 to-teal-500', pnl: 156800, pnlPercent: 198, winRate: 64.8, trades: 1563, followers: 2840, isCopying: false, riskLevel: 'high', avgPositionSize: 680, topMarkets: ['NFL', 'Esports', 'Weather'] },
  { id: 't4', username: 'SharpMoney', avatar: 'from-blue-400 to-cyan-500', pnl: 134500, pnlPercent: 178, winRate: 71.3, trades: 634, followers: 1980, isCopying: false, riskLevel: 'low', avgPositionSize: 280, topMarkets: ['Crypto', 'Politics'] },
  { id: 't5', username: 'AlphaWolf', avatar: 'from-rose-400 to-pink-500', pnl: 112300, pnlPercent: 156, winRate: 61.7, trades: 2104, followers: 5100, isCopying: true, riskLevel: 'high', avgPositionSize: 520, topMarkets: ['NBA', 'Entertainment', 'Crypto'] },
];

export default function CopyTrading() {
  const [traders, setTraders] = useState(mockTraders);
  const [filter, setFilter] = useState<'all' | 'copying'>('all');
  const { addToast } = useToast();

  const filteredTraders = filter === 'copying' ? traders.filter(t => t.isCopying) : traders;

  const toggleCopy = (id: string) => {
    setTraders(traders.map(t => {
      if (t.id === id) {
        const newState = !t.isCopying;
        addToast({
          type: newState ? 'success' : 'info',
          title: newState ? `已复制 ${t.username}` : `已取消复制 ${t.username}`,
          message: newState ? '他们的交易将自动复制到您的账户' : undefined,
        });
        return { ...t, isCopying: newState };
      }
      return t;
    }));
  };

  const riskColors = {
    low: 'bg-emerald-500/15 text-emerald-400',
    medium: 'bg-amber-500/15 text-amber-400',
    high: 'bg-red-500/15 text-red-400',
  };

  const riskLabels = { low: '低风险', medium: '中风险', high: '高风险' };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">跟单交易</h2>
          <p className="text-xs text-gray-500 mt-0.5">复制顶级交易者的策略</p>
        </div>
        <div className="flex gap-1 p-0.5 rounded-lg bg-gray-800/40">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('copying')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filter === 'copying' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            跟单中 ({traders.filter(t => t.isCopying).length})
          </button>
        </div>
      </div>

      {/* Trader cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTraders.map(trader => (
          <div key={trader.id} className={`bg-[#141720] border rounded-2xl p-5 transition-all ${
            trader.isCopying ? 'border-emerald-500/30' : 'border-gray-800/60 hover:border-gray-700/80'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${trader.avatar} flex items-center justify-center text-xs font-bold text-white`}>
                  {trader.username.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{trader.username}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${riskColors[trader.riskLevel]}`}>
                      {riskLabels[trader.riskLevel]}
                    </span>
                    <span className="text-[10px] text-gray-500">{trader.followers.toLocaleString()} 关注者</span>
                  </div>
                </div>
              </div>
              {trader.isCopying && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  跟单中
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2 rounded-lg bg-gray-800/30">
                <p className="text-[10px] text-gray-500">盈亏</p>
                <p className="text-xs font-bold text-emerald-400">+{(trader.pnl / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-gray-800/30">
                <p className="text-[10px] text-gray-500">胜率</p>
                <p className="text-xs font-bold text-white">{trader.winRate}%</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-gray-800/30">
                <p className="text-[10px] text-gray-500">交易数</p>
                <p className="text-xs font-bold text-white">{trader.trades.toLocaleString()}</p>
              </div>
            </div>

            {/* Top markets */}
            <div className="flex items-center gap-1 mb-3 flex-wrap">
              {trader.topMarkets.map(m => (
                <span key={m} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800/50 text-gray-400">{m}</span>
              ))}
            </div>

            {/* Action */}
            <button
              onClick={() => toggleCopy(trader.id)}
              className={`w-full h-9 rounded-xl text-xs font-semibold transition-all ${
                trader.isCopying
                  ? 'bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-gray-700/50'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 shadow-lg shadow-emerald-500/15'
              }`}
            >
              {trader.isCopying ? '取消跟单' : '开始跟单'}
            </button>
          </div>
        ))}
      </div>

      {filteredTraders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">暂无跟单中的交易者</p>
          <p className="text-xs mt-1">浏览全部交易者并开始跟单</p>
        </div>
      )}
    </div>
  );
}
