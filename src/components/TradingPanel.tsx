'use client';

import { useState } from 'react';
import { Market } from '@/types';
import { formatPrice, formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastProvider';
import { useAppStore } from '@/lib/store/appStore';

interface TradingPanelProps {
  market: Market;
  eventId: string;
  eventTitle: string;
}

export default function TradingPanel({ market, eventId, eventTitle }: TradingPanelProps) {
  const [selectedOutcome, setSelectedOutcome] = useState(market.outcomes[0]?.id || '');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [shares, setShares] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addToast } = useToast();
  const { addTrade, balance } = useAppStore();

  const outcome = market.outcomes.find(o => o.id === selectedOutcome);
  const price = outcome?.price || 0;
  const total = (price / 100) * shares;
  const fee = Math.max(total * 0.015, 0.01); // 1.5% fee
  const totalCost = side === 'buy' ? total + fee : total - fee;
  const potentialReturn = shares - total;

  const handleTrade = async () => {
    if (!outcome || shares <= 0) return;

    // Check balance
    if (side === 'buy' && totalCost > balance) {
      addToast({
        type: 'error',
        title: '余额不足',
        message: `需要 $${totalCost.toFixed(2)}，当前余额 $${balance.toFixed(2)}`,
      });
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          marketId: market.id,
          outcomeId: selectedOutcome,
          side,
          shares,
          price,
        }),
      });
      const data = await res.json();
      
      if (data.trade || data.trades) {
        // Record trade in global store
        const tradeRecord = {
          id: data.trade?.id || data.trades[0]?.id || `trade-${Date.now()}`,
          eventId,
          eventTitle,
          marketId: market.id,
          outcomeId: selectedOutcome,
          outcomeName: outcome.name,
          side,
          shares,
          price,
          fee: data.trade?.fee || data.totalFees || fee,
          total,
          timestamp: new Date().toISOString(),
        };
        
        addTrade(tradeRecord);

        addToast({
          type: 'success',
          title: `${side === 'buy' ? '买入' : '卖出'}成功!`,
          message: `${shares}份 ${outcome.name} @ ${Math.round(price)}¢ = $${total.toFixed(2)} (手续费: $${fee.toFixed(2)})`,
        });

        // Update platform revenue display
        if (data.revenue?.totalPlatformRevenue !== undefined) {
          useAppStore.getState().updatePlatformStats(
            data.revenue.totalPlatformRevenue,
            useAppStore.getState().platformTrades + 1
          );
        }
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: '交易失败',
        message: '网络错误，请重试',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
      <h3 className="text-base font-semibold text-white mb-1">{market.question}</h3>
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
        <span>交易量 {formatCurrency(market.volume)}</span>
        <span>·</span>
        <span>流动性 {formatCurrency(market.liquidity)}</span>
      </div>

      {/* Outcome selection */}
      <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${market.outcomes.length}, 1fr)` }}>
        {market.outcomes.map(o => (
          <button
            key={o.id}
            onClick={() => setSelectedOutcome(o.id)}
            className={`px-3 py-3 rounded-xl text-center transition-all border ${
              selectedOutcome === o.id
                ? side === 'buy'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/40 text-red-400'
                : 'bg-gray-800/40 border-gray-700/40 text-gray-300 hover:border-gray-600'
            }`}
          >
            <p className="text-xs font-medium truncate">{o.name}</p>
            <p className="text-lg font-bold mt-0.5 tabular-nums">{formatPrice(o.price)}</p>
            {o.change !== 0 && (
              <p className={`text-[10px] font-medium ${o.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {o.change > 0 ? '↑' : '↓'} {Math.abs(o.change).toFixed(1)}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Buy/Sell toggle */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-800/50 mb-4">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            side === 'buy'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          买入
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            side === 'sell'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          卖出
        </button>
      </div>

      {/* Shares input */}
      <div className="mb-4">
        <label className="text-xs text-gray-500 font-medium mb-1.5 block">份额数量</label>
        <div className="relative">
          <input
            type="number"
            value={shares}
            onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full h-11 px-4 rounded-xl bg-gray-800/60 border border-gray-700/50 text-white text-sm font-medium focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            {[10, 50, 100, 500].map(amt => (
              <button
                key={amt}
                onClick={() => setShares(amt)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                  shares === amt
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700'
                }`}
              >
                {amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2.5 p-3.5 rounded-xl bg-gray-800/30 border border-gray-700/30 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">单价</span>
          <span className="text-white font-medium tabular-nums">{formatPrice(price)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">总成本</span>
          <span className="text-white font-medium tabular-nums">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">手续费 (1.5%)</span>
          <span className="text-amber-400 font-medium tabular-nums">${fee.toFixed(2)}</span>
        </div>
        <div className="h-px bg-gray-700/40" />
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">{side === 'buy' ? '实际支付' : '实际收入'}</span>
          <span className="text-white font-semibold tabular-nums">${totalCost.toFixed(2)}</span>
        </div>
        {side === 'buy' && (
          <>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">潜在回报</span>
              <span className="text-emerald-400 font-semibold tabular-nums">+${potentialReturn.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">回报率</span>
              <span className="text-emerald-400 font-semibold tabular-nums">
                {price > 0 ? ((potentialReturn / totalCost) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </>
        )}
      </div>

      {/* Balance display */}
      <div className="flex justify-between items-center mb-3 text-xs">
        <span className="text-gray-500">可用余额</span>
        <span className={`font-semibold ${balance >= totalCost ? 'text-white' : 'text-red-400'}`}>
          ${balance.toFixed(2)}
        </span>
      </div>

      {/* Trade button */}
      <button
        onClick={handleTrade}
        disabled={!outcome || shares <= 0 || isProcessing || (side === 'buy' && totalCost > balance)}
        className={`w-full h-12 rounded-xl text-sm font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden ${
          side === 'buy'
            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-emerald-500/20 hover:shadow-emerald-500/40'
            : 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-red-500/20 hover:shadow-red-500/40'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>处理中...</span>
          </div>
        ) : (
          `${side === 'buy' ? '确认买入' : '确认卖出'} ${outcome?.name}`
        )}
      </button>
    </div>
  );
}
