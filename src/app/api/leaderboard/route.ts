import { NextResponse } from 'next/server';

const leaderboardData = [
  { rank: 1, username: 'OracleX', pnl: 284500, pnlPercent: 342, trades: 1247, winRate: 73.2, volume: 2800000, streak: 12 },
  { rank: 2, username: 'DeepMind', pnl: 198200, pnlPercent: 267, trades: 892, winRate: 68.5, volume: 1950000, streak: 8 },
  { rank: 3, username: 'EdgeFinder', pnl: 156800, pnlPercent: 198, trades: 1563, winRate: 64.8, volume: 3200000, streak: 5 },
  { rank: 4, username: 'SharpMoney', pnl: 134500, pnlPercent: 178, trades: 634, winRate: 71.3, volume: 1200000, streak: 3 },
  { rank: 5, username: 'AlphaWolf', pnl: 112300, pnlPercent: 156, trades: 2104, winRate: 61.7, volume: 4100000, streak: 7 },
  { rank: 6, username: 'MarketMaker', pnl: 98700, pnlPercent: 134, trades: 3210, winRate: 58.9, volume: 5600000, streak: 2 },
  { rank: 7, username: 'ProphetPicks', pnl: 87400, pnlPercent: 112, trades: 478, winRate: 76.4, volume: 890000, streak: 9 },
  { rank: 8, username: 'DataDriven', pnl: 76200, pnlPercent: 98, trades: 1089, winRate: 63.1, volume: 1800000, streak: 4 },
  { rank: 9, username: 'ContrarianKing', pnl: 65800, pnlPercent: 87, trades: 567, winRate: 69.8, volume: 1100000, streak: 6 },
  { rank: 10, username: 'WhaleWatcher', pnl: 54300, pnlPercent: 72, trades: 1876, winRate: 57.3, volume: 2400000, streak: 1 },
];

export async function GET() {
  // Simulate slight variations
  const data = leaderboardData.map(entry => ({
    ...entry,
    pnl: Math.round(entry.pnl * (0.95 + Math.random() * 0.1)),
    winRate: Math.round((entry.winRate + (Math.random() - 0.5) * 2) * 10) / 10,
  }));

  return NextResponse.json({ entries: data, updatedAt: new Date().toISOString() });
}
