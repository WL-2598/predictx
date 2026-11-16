/**
 * PredictX CLOB (Central Limit Order Book) Matching Engine
 * 
 * This is the core revenue-generating component.
 * Revenue Model:
 * 1. Trading Fees (1-2% per trade)
 * 2. Spread capture on market making
 * 3. Settlement fees
 * 4. Withdrawal fees
 */

export interface Order {
  id: string;
  userId: string;
  eventId: string;
  marketId: string;
  outcomeId: string;
  side: 'buy' | 'sell';
  shares: number;
  remainingShares: number;
  price: number; // in cents (1-99)
  timestamp: number;
  status: 'open' | 'partial' | 'filled' | 'cancelled';
}

export interface Trade {
  id: string;
  buyOrderId: string;
  sellOrderId: string;
  eventId: string;
  marketId: string;
  outcomeId: string;
  buyerId: string;
  sellerId: string;
  shares: number;
  price: number;
  fee: number; // Platform fee
  timestamp: number;
}

export interface MarketState {
  eventId: string;
  marketId: string;
  outcomeId: string;
  lastPrice: number;
  bestBid: number;
  bestAsk: number;
  spread: number;
  volume24h: number;
  fees24h: number; // Revenue tracking
}

export interface FeeStructure {
  makerFee: number; // 0.5% - fee for providing liquidity
  takerFee: number; // 1.5% - fee for taking liquidity
  settlementFee: number; // 0.1% - fee on market resolution
  withdrawalFee: number; // 0.25% - fee on cash-out
  minFee: number; // $0.01 minimum
}

export const DEFAULT_FEES: FeeStructure = {
  makerFee: 0.005,   // 0.5%
  takerFee: 0.015,   // 1.5%
  settlementFee: 0.001, // 0.1%
  withdrawalFee: 0.0025, // 0.25%
  minFee: 0.01,
};

export class MatchingEngine {
  private orderBook: Map<string, Order[]> = new Map(); // key: `${marketId}:${outcomeId}:${side}`
  private trades: Trade[] = [];
  private marketStates: Map<string, MarketState> = new Map();
  private fees: FeeStructure;
  private totalRevenue: number = 0;
  private tradeIdCounter: number = 0;

  constructor(fees: FeeStructure = DEFAULT_FEES) {
    this.fees = fees;
  }

  private getOrderBookKey(marketId: string, outcomeId: string, side: 'buy' | 'sell'): string {
    return `${marketId}:${outcomeId}:${side}`;
  }

  private generateTradeId(): string {
    this.tradeIdCounter++;
    return `T${Date.now()}-${this.tradeIdCounter}`;
  }

  /**
   * Calculate the fee for a trade
   */
  calculateFee(notional: number, isMaker: boolean): number {
    const rate = isMaker ? this.fees.makerFee : this.fees.takerFee;
    const fee = notional * rate;
    return Math.max(fee, this.fees.minFee);
  }

  /**
   * Submit a new order to the matching engine
   * Returns any matched trades
   */
  submitOrder(order: Omit<Order, 'id' | 'remainingShares' | 'status' | 'timestamp'>): { 
    order: Order; 
    trades: Trade[];
    fees: number;
  } {
    const newOrder: Order = {
      ...order,
      id: `O${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      remainingShares: order.shares,
      status: 'open',
      timestamp: Date.now(),
    };

    const matchedTrades: Trade[] = [];
    let totalFees = 0;

    // Try to match against opposite side
    const oppositeSide = order.side === 'buy' ? 'sell' : 'buy';
    const oppKey = this.getOrderBookKey(order.marketId, order.outcomeId, oppositeSide);
    const oppositeOrders = this.orderBook.get(oppKey) || [];

    // Sort: for buys, match against lowest asks first; for sells, match against highest bids first
    const sorted = [...oppositeOrders].sort((a, b) => {
      if (order.side === 'buy') return a.price - b.price; // Buy: lowest ask first
      return b.price - a.price; // Sell: highest bid first
    });

    for (const oppOrder of sorted) {
      if (newOrder.remainingShares <= 0) break;

      // Check if prices cross
      const canMatch = order.side === 'buy'
        ? order.price >= oppOrder.price // Buyer willing to pay >= seller's ask
        : order.price <= oppOrder.price; // Seller willing to accept <= buyer's bid

      if (!canMatch) continue;

      // Determine trade price (use the resting order's price - price/time priority)
      const tradePrice = oppOrder.price;
      const matchShares = Math.min(newOrder.remainingShares, oppOrder.remainingShares);
      const notional = (tradePrice / 100) * matchShares;

      // Calculate fees (taker pays taker fee, maker pays maker fee)
      const takerFee = this.calculateFee(notional, false);
      const makerFee = this.calculateFee(notional, true);
      const totalFee = takerFee + makerFee;

      // Create trade record
      const trade: Trade = {
        id: this.generateTradeId(),
        buyOrderId: order.side === 'buy' ? newOrder.id : oppOrder.id,
        sellOrderId: order.side === 'sell' ? newOrder.id : oppOrder.id,
        eventId: order.eventId,
        marketId: order.marketId,
        outcomeId: order.outcomeId,
        buyerId: order.side === 'buy' ? order.userId : oppOrder.userId,
        sellerId: order.side === 'sell' ? order.userId : oppOrder.userId,
        shares: matchShares,
        price: tradePrice,
        fee: totalFee,
        timestamp: Date.now(),
      };

      matchedTrades.push(trade);
      totalFees += totalFee;
      this.totalRevenue += totalFee;

      // Update order quantities
      newOrder.remainingShares -= matchShares;
      oppOrder.remainingShares -= matchShares;

      if (oppOrder.remainingShares <= 0) {
        oppOrder.status = 'filled';
      } else {
        oppOrder.status = 'partial';
      }

      // Update market state
      this.updateMarketState(order.marketId, order.outcomeId, tradePrice, matchShares, totalFee);
    }

    // Remove filled orders from the opposite book
    const remainingOpp = sorted.filter(o => o.remainingShares > 0);
    const unmatchedOpp = (this.orderBook.get(oppKey) || []).filter(o => !sorted.find(s => s.id === o.id));
    this.orderBook.set(oppKey, [...remainingOpp, ...unmatchedOpp]);

    // Set order status
    if (newOrder.remainingShares <= 0) {
      newOrder.status = 'filled';
    } else if (newOrder.remainingShares < newOrder.shares) {
      newOrder.status = 'partial';
    }

    // If not fully filled, add to the order book
    if (newOrder.remainingShares > 0) {
      const bookKey = this.getOrderBookKey(order.marketId, order.outcomeId, order.side);
      const book = this.orderBook.get(bookKey) || [];
      book.push(newOrder);
      this.orderBook.set(bookKey, book);
    }

    this.trades.push(...matchedTrades);

    return { order: newOrder, trades: matchedTrades, fees: totalFees };
  }

  /**
   * Cancel an open order
   */
  cancelOrder(orderId: string, userId: string): boolean {
    for (const [key, orders] of this.orderBook.entries()) {
      const idx = orders.findIndex(o => o.id === orderId && o.userId === userId);
      if (idx !== -1) {
        orders[idx].status = 'cancelled';
        orders.splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Get order book depth for a market
   */
  getOrderBook(marketId: string, outcomeId: string): { bids: Order[]; asks: Order[] } {
    const bidKey = this.getOrderBookKey(marketId, outcomeId, 'buy');
    const askKey = this.getOrderBookKey(marketId, outcomeId, 'sell');

    const bids = (this.orderBook.get(bidKey) || [])
      .filter(o => o.status !== 'cancelled')
      .sort((a, b) => b.price - a.price); // Highest bid first

    const asks = (this.orderBook.get(askKey) || [])
      .filter(o => o.status !== 'cancelled')
      .sort((a, b) => a.price - b.price); // Lowest ask first

    return { bids, asks };
  }

  /**
   * Get current market price
   */
  getMarketState(marketId: string, outcomeId: string): MarketState | undefined {
    return this.marketStates.get(`${marketId}:${outcomeId}`);
  }

  private updateMarketState(marketId: string, outcomeId: string, price: number, volume: number, fee: number) {
    const key = `${marketId}:${outcomeId}`;
    const state = this.marketStates.get(key) || {
      eventId: '',
      marketId,
      outcomeId,
      lastPrice: price,
      bestBid: 0,
      bestAsk: 0,
      spread: 0,
      volume24h: 0,
      fees24h: 0,
    };

    state.lastPrice = price;
    state.volume24h += (price / 100) * volume;
    state.fees24h += fee;

    // Update best bid/ask
    const { bids, asks } = this.getOrderBook(marketId, outcomeId);
    state.bestBid = bids.length > 0 ? bids[0].price : 0;
    state.bestAsk = asks.length > 0 ? asks[0].price : 0;
    state.spread = state.bestAsk > 0 && state.bestBid > 0 ? state.bestAsk - state.bestBid : 0;

    this.marketStates.set(key, state);
  }

  /**
   * Get platform revenue stats
   */
  getRevenueStats(): { totalRevenue: number; totalTrades: number; avgFeePerTrade: number } {
    return {
      totalRevenue: Math.round(this.totalRevenue * 100) / 100,
      totalTrades: this.trades.length,
      avgFeePerTrade: this.trades.length > 0 ? Math.round((this.totalRevenue / this.trades.length) * 100) / 100 : 0,
    };
  }

  /**
   * Get all trades
   */
  getTrades(): Trade[] {
    return [...this.trades];
  }

  /**
   * Seed the order book with initial market maker orders
   * This creates liquidity and spread revenue
   */
  seedMarketMakerOrders(marketId: string, outcomeId: string, eventId: string, midPrice: number, depth: number = 5) {
    const mmUserId = 'market-maker-system';
    const spread = 2; // 2 cent spread

    for (let i = 0; i < depth; i++) {
      // Bid orders (below mid)
      this.submitOrder({
        userId: mmUserId,
        eventId,
        marketId,
        outcomeId,
        side: 'buy',
        shares: Math.floor(100 + Math.random() * 400),
        price: Math.max(1, Math.round(midPrice - spread - i * 1.5)),
      });

      // Ask orders (above mid)
      this.submitOrder({
        userId: mmUserId,
        eventId,
        marketId,
        outcomeId,
        side: 'sell',
        shares: Math.floor(100 + Math.random() * 400),
        price: Math.min(99, Math.round(midPrice + spread + i * 1.5)),
      });
    }
  }
}

// Singleton instance
let engineInstance: MatchingEngine | null = null;

export function getMatchingEngine(): MatchingEngine {
  if (!engineInstance) {
    engineInstance = new MatchingEngine();
  }
  return engineInstance;
}
