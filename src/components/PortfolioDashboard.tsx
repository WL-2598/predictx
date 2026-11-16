'use client';

import { useAppStore } from '@/lib/store/appStore';
import { formatCurrency, formatPrice } from '@/lib/utils';

export default function PortfolioDashboard() {
  const { balance, positions, trades, totalPnl } = useAppStore();

  const totalInvested = positions.reduce((sum, p) => sum + (p.avgPrice / 100) * p.shares, 0);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
          <p className="text-xs text-gray-500 font-medium mb-1">可用余额</p>
          <p className="text-2xl font-bold text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
          <p className="text-xs text-gray-500 font-medium mb-1">总投入</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalInvested)}</p>
        </div>
        <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
          <p className="text-xs text-gray-500 font-medium mb-1">总盈亏</p>
          <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}
          </p>
        </div>
        <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
          <p className="text-xs text-gray-500 font-medium mb-1">持仓数</p>
          <p className="text-2xl font-bold text-white">{positions.length}</p>
        </div>
      </div>

      {/* Positions */}
      <div className="bg-[#141720] border border-gray-800/60 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800/60">
          <h2 className="text-base font-semibold text-white">当前持仓</h2>
        </div>
        {positions.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-gray-500 text-sm">暂无持仓</p>
            <p className="text-gray-600 text-xs mt-1">前往市场页面开始交易</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800/60">
                  <th className="text-left text-[11px] text-gray-500 font-medium uppercase tracking-wider px-5 py-3">赛事</th>
                  <th className="text-left text-[11px] text-gray-500 font-medium uppercase tracking-wider px-5 py-3">结果</th>
                  <th className="text-right text-[11px] text-gray-500 font-medium uppercase tracking-wider px-5 py-3">份额</th>
                  <th className="text-right text-[11px] text-gray-500 font-medium uppercase tracking-wider px-5 py-3">均价</th>
                  <th className="text-right text-[11px] text-gray-500 font-medium uppercase tracking-wider px-5 py-3">现价</th>
                  <th className="text-right text-[11px] text-gray-500 font-medium uppercase tracking-wider px-5 py-3">盈亏</th>
                </tr>
              </thead>
              <tbody>
                {positions.map(pos => (
                  <tr key={pos.id} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-white">{pos.eventTitle}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                        {pos.outcomeName}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm text-white font-medium tabular-nums">{pos.shares}</td>
                    <td className="px-5 py-3.5 text-right text-sm text-gray-400 font-medium tabular-nums">{formatPrice(pos.avgPrice)}</td>
                    <td className="px-5 py-3.5 text-right text-sm text-white font-medium tabular-nums">{formatPrice(pos.currentPrice)}</td>
                    <td className={`px-5 py-3.5 text-right text-sm font-bold tabular-nums ${pos.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Trades */}
      <div className="bg-[#141720] border border-gray-800/60 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800/60">
          <h2 className="text-base font-semibold text-white">最近交易</h2>
        </div>
        {trades.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-gray-500 text-sm">暂无交易记录</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800/30">
            {trades.slice(0, 20).map(trade => (
              <div key={trade.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-800/20 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    trade.side === 'buy' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                  }`}>
                    {trade.side === 'buy' ? '买' : '卖'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{trade.eventTitle}</p>
                    <p className="text-xs text-gray-500">{trade.outcomeName} · {trade.shares}份</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">${trade.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{formatPrice(trade.price)} · 手续费 ${trade.fee.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
