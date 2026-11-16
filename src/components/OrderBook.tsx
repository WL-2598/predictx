'use client';

import { useMemo } from 'react';

interface OrderBookProps {
  outcomes: { id: string; name: string; price: number }[];
}

interface OrderLevel {
  price: number;
  size: number;
  total: number;
  percentage: number;
}

function generateOrderLevels(centerPrice: number, side: 'buy' | 'sell'): OrderLevel[] {
  const levels: OrderLevel[] = [];
  let total = 0;

  for (let i = 0; i < 8; i++) {
    const offset = (i + 1) * (0.5 + Math.random() * 1.5);
    const price = side === 'buy'
      ? Math.max(1, Math.round((centerPrice - offset) * 10) / 10)
      : Math.min(99, Math.round((centerPrice + offset) * 10) / 10);
    const size = Math.floor(200 + Math.random() * 2000);
    total += size;
    levels.push({ price, size, total, percentage: 0 });
  }

  const maxTotal = total;
  levels.forEach(l => { l.percentage = (l.total / maxTotal) * 100; });

  return levels;
}

export default function OrderBook({ outcomes }: OrderBookProps) {
  const orderData = useMemo(() => {
    return outcomes.map(outcome => ({
      outcome,
      bids: generateOrderLevels(outcome.price, 'buy'),
      asks: generateOrderLevels(outcome.price, 'sell').reverse(),
    }));
  }, [outcomes]);

  const selected = orderData[0];
  if (!selected) return null;

  const spread = selected.asks.length > 0 && selected.bids.length > 0
    ? selected.asks[0].price - selected.bids[0].price
    : 0;

  return (
    <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">订单簿</h3>
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <span>价差</span>
          <span className="text-amber-400 font-semibold">{spread.toFixed(1)}¢</span>
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-2 px-1">
        <span>价格</span>
        <span className="text-right">数量</span>
        <span className="text-right">累计</span>
      </div>

      {/* Asks (Sell orders) - reversed so highest price is on top */}
      <div className="space-y-0.5 mb-2">
        {selected.asks.map((level, i) => (
          <div key={`ask-${i}`} className="relative grid grid-cols-3 gap-2 text-xs py-1 px-1 rounded">
            <div
              className="absolute inset-0 bg-red-500/8 rounded"
              style={{ width: `${level.percentage}%`, right: 0, left: 'auto' }}
            />
            <span className="relative text-red-400 font-medium tabular-nums">{level.price.toFixed(1)}¢</span>
            <span className="relative text-right text-gray-300 tabular-nums">{level.size.toLocaleString()}</span>
            <span className="relative text-right text-gray-500 tabular-nums">{level.total.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Spread indicator */}
      <div className="flex items-center justify-center py-2 border-y border-gray-800/40">
        <span className="text-sm font-bold text-white tabular-nums">
          {selected.outcome.price.toFixed(1)}¢
        </span>
        <span className="text-[10px] text-gray-500 ml-2">
          ${ (selected.outcome.price / 100).toFixed(4) }
        </span>
      </div>

      {/* Bids (Buy orders) */}
      <div className="space-y-0.5 mt-2">
        {selected.bids.map((level, i) => (
          <div key={`bid-${i}`} className="relative grid grid-cols-3 gap-2 text-xs py-1 px-1 rounded">
            <div
              className="absolute inset-0 bg-emerald-500/8 rounded"
              style={{ width: `${level.percentage}%`, right: 0, left: 'auto' }}
            />
            <span className="relative text-emerald-400 font-medium tabular-nums">{level.price.toFixed(1)}¢</span>
            <span className="relative text-right text-gray-300 tabular-nums">{level.size.toLocaleString()}</span>
            <span className="relative text-right text-gray-500 tabular-nums">{level.total.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
