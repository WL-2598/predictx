/**
 * Global application store using Zustand
 * Manages portfolio, trades, settings, and user state
 */
import { create } from 'zustand';

interface Position {
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

interface TradeRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  marketId: string;
  outcomeId: string;
  outcomeName: string;
  side: 'buy' | 'sell';
  shares: number;
  price: number;
  fee: number;
  total: number;
  timestamp: string;
}

interface UserSettings {
  notifications: {
    trades: boolean;
    priceAlerts: boolean;
    marketUpdates: boolean;
    news: boolean;
  };
  display: {
    currency: string;
    language: string;
    compactNumbers: boolean;
    animationsEnabled: boolean;
  };
  privacy: {
    showPositions: boolean;
    showTrades: boolean;
    showPnl: boolean;
  };
}

interface PriceAlert {
  id: string;
  eventId: string;
  eventName: string;
  outcomeName: string;
  targetPrice: number;
  direction: 'above' | 'below';
  active: boolean;
}

interface AppState {
  // User
  balance: number;
  positions: Position[];
  trades: TradeRecord[];
  totalPnl: number;
  
  // Settings
  settings: UserSettings;
  
  // Alerts
  priceAlerts: PriceAlert[];
  
  // Watchlist
  watchlist: Set<string>;
  
  // Platform stats
  platformRevenue: number;
  platformTrades: number;
  
  // Actions
  addTrade: (trade: TradeRecord) => void;
  updateBalance: (amount: number) => void;
  updatePosition: (position: Position) => void;
  removePosition: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  toggleWatchlist: (eventId: string) => void;
  addPriceAlert: (alert: PriceAlert) => void;
  removePriceAlert: (id: string) => void;
  togglePriceAlert: (id: string) => void;
  updatePlatformStats: (revenue: number, trades: number) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const STORAGE_KEY = 'predictx_state_v1';

const defaultSettings: UserSettings = {
  notifications: { trades: true, priceAlerts: true, marketUpdates: true, news: false },
  display: { currency: 'USD', language: 'zh-CN', compactNumbers: false, animationsEnabled: true },
  privacy: { showPositions: true, showTrades: true, showPnl: false },
};

const defaultPositions: Position[] = [
  { id: 'pos-1', eventId: 'nba-lal-gsw-2026', eventTitle: 'Lakers vs. Warriors', marketId: 'm1', outcomeId: 'lal-win', outcomeName: 'Lakers', shares: 50, avgPrice: 55, currentPrice: 62, pnl: 3.50 },
  { id: 'pos-2', eventId: 'epl-ars-che-2026', eventTitle: 'Arsenal vs. Chelsea', marketId: 'm2', outcomeId: 'over25', outcomeName: '超过 2.5', shares: 100, avgPrice: 60, currentPrice: 65, pnl: 5.00 },
  { id: 'pos-3', eventId: 'lol-worlds-t1-gen-2026', eventTitle: 'T1 vs. Gen.G', marketId: 'm1', outcomeId: 'gen-win', outcomeName: 'Gen.G', shares: 80, avgPrice: 55, currentPrice: 50, pnl: -4.00 },
];

function loadState(): Partial<AppState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      watchlist: new Set(parsed.watchlist || []),
    };
  } catch {
    return {};
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  balance: 10000,
  positions: defaultPositions,
  trades: [],
  totalPnl: 4.50,
  settings: defaultSettings,
  priceAlerts: [],
  watchlist: new Set<string>(),
  platformRevenue: 0,
  platformTrades: 0,

  addTrade: (trade) => set(state => {
    const newTrades = [trade, ...state.trades];
    let newPositions = [...state.positions];
    let newBalance = state.balance;

    if (trade.side === 'buy') {
      newBalance -= trade.total + trade.fee;
      // Find or create position
      const existing = newPositions.find(p => p.eventId === trade.eventId && p.outcomeId === trade.outcomeId);
      if (existing) {
        const totalShares = existing.shares + trade.shares;
        existing.avgPrice = ((existing.avgPrice * existing.shares) + (trade.price * trade.shares)) / totalShares;
        existing.shares = totalShares;
        existing.currentPrice = trade.price;
        existing.pnl = ((existing.currentPrice - existing.avgPrice) / 100) * existing.shares;
      } else {
        newPositions.push({
          id: `pos-${Date.now()}`,
          eventId: trade.eventId,
          eventTitle: trade.eventTitle,
          marketId: trade.marketId,
          outcomeId: trade.outcomeId,
          outcomeName: trade.outcomeName,
          shares: trade.shares,
          avgPrice: trade.price,
          currentPrice: trade.price,
          pnl: 0,
        });
      }
    } else {
      newBalance += trade.total - trade.fee;
      const existing = newPositions.find(p => p.eventId === trade.eventId && p.outcomeId === trade.outcomeId);
      if (existing) {
        existing.shares -= trade.shares;
        if (existing.shares <= 0) {
          newPositions = newPositions.filter(p => p.id !== existing.id);
        }
      }
    }

    const totalPnl = newPositions.reduce((sum, p) => sum + p.pnl, 0);

    return {
      trades: newTrades,
      positions: newPositions,
      balance: Math.round(newBalance * 100) / 100,
      totalPnl: Math.round(totalPnl * 100) / 100,
    };
  }),

  updateBalance: (amount) => set(state => ({
    balance: Math.round((state.balance + amount) * 100) / 100,
  })),

  updatePosition: (position) => set(state => ({
    positions: state.positions.map(p => p.id === position.id ? position : p),
  })),

  removePosition: (id) => set(state => ({
    positions: state.positions.filter(p => p.id !== id),
  })),

  updateSettings: (newSettings) => set(state => {
    const updated = {
      ...state.settings,
      ...newSettings,
      notifications: { ...state.settings.notifications, ...(newSettings.notifications || {}) },
      display: { ...state.settings.display, ...(newSettings.display || {}) },
      privacy: { ...state.settings.privacy, ...(newSettings.privacy || {}) },
    };
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        settings: updated,
        watchlist: [...state.watchlist],
        priceAlerts: state.priceAlerts,
      }));
    }
    return { settings: updated };
  }),

  toggleWatchlist: (eventId) => set(state => {
    const newWatchlist = new Set(state.watchlist);
    if (newWatchlist.has(eventId)) {
      newWatchlist.delete(eventId);
    } else {
      newWatchlist.add(eventId);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'),
        watchlist: [...newWatchlist],
      }));
    }
    return { watchlist: newWatchlist };
  }),

  addPriceAlert: (alert) => set(state => ({
    priceAlerts: [alert, ...state.priceAlerts],
  })),

  removePriceAlert: (id) => set(state => ({
    priceAlerts: state.priceAlerts.filter(a => a.id !== id),
  })),

  togglePriceAlert: (id) => set(state => ({
    priceAlerts: state.priceAlerts.map(a => a.id === id ? { ...a, active: !a.active } : a),
  })),

  updatePlatformStats: (revenue, trades) => set({
    platformRevenue: revenue,
    platformTrades: trades,
  }),

  loadFromStorage: () => {
    const saved = loadState();
    if (saved.settings) {
      set({ settings: { ...defaultSettings, ...saved.settings } });
    }
    if (saved.watchlist) {
      set({ watchlist: saved.watchlist as Set<string> });
    }
    if (saved.priceAlerts) {
      set({ priceAlerts: saved.priceAlerts as PriceAlert[] });
    }
  },

  saveToStorage: () => {
    const state = get();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        settings: state.settings,
        watchlist: [...state.watchlist],
        priceAlerts: state.priceAlerts,
      }));
    }
  },
}));
