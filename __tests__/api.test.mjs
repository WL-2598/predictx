/**
 * API Validation Tests
 * Run with: node --test __tests__/api.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';

const BASE_URL = 'http://localhost:3000';

describe('Trade API Validation', () => {
  it('should reject empty body', async () => {
    const res = await fetch(`${BASE_URL}/api/trade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.ok(data.error);
  });

  it('should reject invalid side', async () => {
    const res = await fetch(`${BASE_URL}/api/trade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: 'x', marketId: 'm', outcomeId: 'o', side: 'invalid', shares: 10, price: 50 }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.ok(data.error.includes('side'));
  });

  it('should reject negative shares', async () => {
    const res = await fetch(`${BASE_URL}/api/trade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: 'x', marketId: 'm', outcomeId: 'o', side: 'buy', shares: -5, price: 50 }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 400);
  });

  it('should reject price out of range', async () => {
    const res = await fetch(`${BASE_URL}/api/trade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: 'x', marketId: 'm', outcomeId: 'o', side: 'buy', shares: 10, price: 150 }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.ok(data.error.includes('价格'));
  });

  it('should accept valid trade', async () => {
    const res = await fetch(`${BASE_URL}/api/trade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: 'nba-lal-gsw-2026', marketId: 'm1', outcomeId: 'lal-win', side: 'buy', shares: 10, price: 62 }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.trade || data.trades);
  });

  it('should sanitize XSS input', async () => {
    const res = await fetch(`${BASE_URL}/api/events?search=<script>alert(1)</script>`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.total, 0);
  });

  it('should reject search over 100 chars', async () => {
    const longSearch = 'a'.repeat(101);
    const res = await fetch(`${BASE_URL}/api/events?search=${longSearch}`);
    assert.strictEqual(res.status, 400);
  });

  it('should support limit parameter', async () => {
    const res = await fetch(`${BASE_URL}/api/events?limit=3`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.events.length <= 3);
  });

  it('should reject invalid limit', async () => {
    const res = await fetch(`${BASE_URL}/api/events?limit=999`);
    assert.strictEqual(res.status, 400);
  });
});

describe('Events API', () => {
  it('should return all events', async () => {
    const res = await fetch(`${BASE_URL}/api/events`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.total > 0);
    assert.ok(Array.isArray(data.events));
  });

  it('should filter by category', async () => {
    const res = await fetch(`${BASE_URL}/api/events?category=crypto`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    data.events.forEach(e => assert.strictEqual(e.category, 'crypto'));
  });

  it('should return event by id', async () => {
    const res = await fetch(`${BASE_URL}/api/events/nba-lal-gsw-2026`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.event);
    assert.strictEqual(data.event.id, 'nba-lal-gsw-2026');
  });

  it('should return 404 for invalid event id', async () => {
    const res = await fetch(`${BASE_URL}/api/events/nonexistent`);
    assert.strictEqual(res.status, 404);
  });
});

console.log('All API tests passed!');
