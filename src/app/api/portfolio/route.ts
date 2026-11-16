import { NextResponse } from 'next/server';
import { defaultPortfolio } from '@/lib/data';

export async function GET() {
  // Simulate price changes
  const portfolio = {
    ...defaultPortfolio,
    positions: defaultPortfolio.positions.map(pos => {
      const change = (Math.random() - 0.48) * 3;
      const newPrice = Math.max(1, Math.min(99, pos.currentPrice + change));
      const newPnl = (newPrice - pos.avgPrice) * pos.shares / 100;
      return {
        ...pos,
        currentPrice: Math.round(newPrice * 10) / 10,
        pnl: Math.round(newPnl * 100) / 100,
      };
    }),
  };

  portfolio.totalPnl = portfolio.positions.reduce((sum, p) => sum + p.pnl, 0);

  return NextResponse.json(portfolio);
}
