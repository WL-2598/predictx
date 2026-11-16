export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  score?: number;
}

export interface Market {
  id: string;
  question: string;
  outcomes: Outcome[];
  volume: number;
  liquidity: number;
  endDate: string;
  status: 'open' | 'closed' | 'resolved';
}

export interface Outcome {
  id: string;
  name: string;
  price: number; // 0-100 cents
  change: number; // price change in last hour
}

export interface SportEvent {
  id: string;
  title: string;
  league: string;
  leagueId: string;
  category: string;
  teams: Team[];
  markets: Market[];
  startTime: string;
  status: 'live' | 'upcoming' | 'completed';
  volume: number;
  isHot?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameZh: string;
  icon: string;
  count: number;
}

export interface Position {
  id: string;
  eventId: string;
  eventTitle: string;
  marketId: string;
  outcomeId: string;
  outcomeName: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
}

export interface Trade {
  id: string;
  eventId: string;
  eventTitle: string;
  marketId: string;
  outcomeId: string;
  outcomeName: string;
  side: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  timestamp: string;
}

export interface UserPortfolio {
  balance: number;
  positions: Position[];
  trades: Trade[];
  totalPnl: number;
  totalInvested: number;
}
