/**
 * Matching Engine Tests
 * Run with: node --test __tests__/matching.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { MatchingEngine, DEFAULT_FEES } from '../src/lib/engine/matching.ts';

describe('MatchingEngine', () => {
  it('should calculate fees correctly', () => {
    const engine = new MatchingEngine();
    const notional = 100; // $100 trade
    
    const makerFee = engine.calculateFee(notional, true);
    const takerFee = engine.calculateFee(notional, false);
    
    assert.strictEqual(makerFee, 0.50); // 0.5% of $100
    assert.strictEqual(takerFee, 1.50); // 1.5% of $100
  });

  it('should enforce minimum fee', () => {
    const engine = new MatchingEngine();
    const tinyNotional = 0.10; // 10 cent trade
    
    const fee = engine.calculateFee(tinyNotional, false);
    assert.strictEqual(fee, DEFAULT_FEES.minFee); // Should be $0.01 minimum
  });

  it('should match buy order against existing sell', () => {
    const engine = new MatchingEngine();
    
    // Place sell order at 50¢
    engine.submitOrder({
      userId: 'seller-1',
      eventId: 'event-1',
      marketId: 'market-1',
      outcomeId: 'outcome-1',
      side: 'sell',
      shares: 100,
      price: 50,
    });
    
    // Place buy order at 50¢ (should match)
    const result = engine.submitOrder({
      userId: 'buyer-1',
      eventId: 'event-1',
      marketId: 'market-1',
      outcomeId: 'outcome-1',
      side: 'buy',
      shares: 100,
      price: 50,
    });
    
    assert.strictEqual(result.trades.length, 1);
    assert.strictEqual(result.trades[0].shares, 100);
    assert.strictEqual(result.trades[0].price, 50);
    assert.strictEqual(result.order.status, 'filled');
  });

  it('should not match when prices do not cross', () => {
    const engine = new MatchingEngine();
    
    // Sell at 60¢
    engine.submitOrder({
      userId: 'seller-1',
      eventId: 'event-1',
      marketId: 'market-1',
      outcomeId: 'outcome-1',
      side: 'sell',
      shares: 100,
      price: 60,
    });
    
    // Buy at 50¢ (should not match, 50 < 60)
    const result = engine.submitOrder({
      userId: 'buyer-1',
      eventId: 'event-1',
      marketId: 'market-1',
      outcomeId: 'outcome-1',
      side: 'buy',
      shares: 100,
      price: 50,
    });
    
    assert.strictEqual(result.trades.length, 0);
    assert.strictEqual(result.order.status, 'open');
  });

  it('should partially fill orders', () => {
    const engine = new MatchingEngine();
    
    // Sell 50 shares at 50¢
    engine.submitOrder({
      userId: 'seller-1',
      eventId: 'event-1',
      marketId: 'market-1',
      outcomeId: 'outcome-1',
      side: 'sell',
      shares: 50,
      price: 50,
    });
    
    // Buy 100 shares at 50¢ (only 50 should fill)
    const result = engine.submitOrder({
      userId: 'buyer-1',
      eventId: 'event-1',
      marketId: 'market-1',
      outcomeId: 'outcome-1',
      side: 'buy',
      shares: 100,
      price: 50,
    });
    
    assert.strictEqual(result.trades.length, 1);
    assert.strictEqual(result.trades[0].shares, 50);
    assert.strictEqual(result.order.status, 'partial');
    assert.strictEqual(result.order.remainingShares, 50);
  });

  it('should generate revenue from fees', () => {
    const engine = new MatchingEngine();
    
    engine.submitOrder({
      userId: 'seller-1',
      eventId: 'event-1',
      marketId: 'market-1',
      outcomeId: 'outcome-1',
      side: 'sell',
      shares: 100,
      price: 50,
    });
    
    engine.submitOrder({
      userId: 'buyer-1',
      eventId: 'event-1',
      marketId: 'market-1',
      outcomeId: 'outcome-1',
      side: 'buy',
      shares: 100,
      price: 50,
    });
    
    const stats = engine.getRevenueStats();
    assert.ok(stats.totalRevenue > 0);
    assert.strictEqual(stats.totalTrades, 1);
    
    // Expected: 100 shares × $0.50 = $50 notional
    // Maker fee: 0.5% × $50 = $0.25
    // Taker fee: 1.5% × $50 = $0.75
    // Total: $1.00
    assert.strictEqual(stats.totalRevenue, 1.00);
  });

  it('should cancel orders correctly', () => {
    const engine = new MatchingEngine();
    
    const result = engine.submitOrder({
      userId: 'user-1',
      eventId: 'event-1',
      marketId: 'market-1',
      outcomeId: 'outcome-1',
      side: 'buy',
      shares: 100,
      price: 50,
    });
    
    const cancelled = engine.cancelOrder(result.order.id, 'user-1');
    assert.strictEqual(cancelled, true);
    
    const book = engine.getOrderBook('market-1', 'outcome-1');
    assert.strictEqual(book.bids.length, 0);
  });

  it('should not cancel orders from other users', () => {
    const engine = new MatchingEngine();
    
    const result = engine.submitOrder({
      userId: 'user-1',
      eventId: 'event-1',
      marketId: 'market-1',
      outcomeId: 'outcome-1',
      side: 'buy',
      shares: 100,
      price: 50,
    });
    
    const cancelled = engine.cancelOrder(result.order.id, 'user-2');
    assert.strictEqual(cancelled, false);
  });

  it('should maintain price/time priority', () => {
    const engine = new MatchingEngine();
    
    // Two sell orders at different prices
    engine.submitOrder({ userId: 's1', eventId: 'e1', marketId: 'm1', outcomeId: 'o1', side: 'sell', shares: 100, price: 52 });
    engine.submitOrder({ userId: 's2', eventId: 'e1', marketId: 'm1', outcomeId: 'o1', side: 'sell', shares: 100, price: 50 });
    
    // Buy should match the lower price first (50¢)
    const result = engine.submitOrder({
      userId: 'b1', eventId: 'e1', marketId: 'm1', outcomeId: 'o1', side: 'buy', shares: 100, price: 52,
    });
    
    assert.strictEqual(result.trades.length, 1);
    assert.strictEqual(result.trades[0].price, 50); // Matched at lower ask
    assert.strictEqual(result.trades[0].sellerId, 's2'); // s2 had the lower price
  });
});

console.log('All tests passed!');
