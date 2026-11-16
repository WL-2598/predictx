import { NextRequest, NextResponse } from 'next/server';
import { getMatchingEngine } from '@/lib/engine/matching';
import { allEvents } from '@/lib/data';

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60000;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT) {
    return false;
  }
  
  entry.count++;
  return true;
}

function sanitizeString(str: string, maxLen: number): string {
  return str.replace(/[<>"'`]/g, '').slice(0, maxLen);
}

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || 'anonymous';
  if (!checkRateLimit(`trade:${clientIp}`)) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '无效的请求格式' }, { status: 400 });
  }

  const required = ['eventId', 'marketId', 'outcomeId', 'side', 'shares', 'price'] as const;
  for (const field of required) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return NextResponse.json({ error: `缺少必要字段: ${field}` }, { status: 400 });
    }
  }

  if (!['buy', 'sell'].includes(body.side)) {
    return NextResponse.json({ error: 'side 必须是 buy 或 sell' }, { status: 400 });
  }

  if (typeof body.shares !== 'number' || !Number.isFinite(body.shares)) {
    return NextResponse.json({ error: 'shares 必须是有效数字' }, { status: 400 });
  }

  if (typeof body.price !== 'number' || !Number.isFinite(body.price)) {
    return NextResponse.json({ error: 'price 必须是有效数字' }, { status: 400 });
  }

  if (body.shares <= 0 || body.shares > 10000) {
    return NextResponse.json({ error: '份额数量必须在 1-10000 之间' }, { status: 400 });
  }

  if (body.price < 1 || body.price > 99) {
    return NextResponse.json({ error: '价格必须在 1-99 之间' }, { status: 400 });
  }

  const eventId = sanitizeString(body.eventId, 100);
  const marketId = sanitizeString(body.marketId, 100);
  const outcomeId = sanitizeString(body.outcomeId, 100);

  // Verify event exists
  const event = allEvents.find(e => e.id === eventId);
  if (!event) {
    return NextResponse.json({ error: '赛事不存在' }, { status: 404 });
  }

  const market = event.markets.find(m => m.id === marketId);
  if (!market) {
    return NextResponse.json({ error: '市场不存在' }, { status: 404 });
  }

  const outcome = market.outcomes.find(o => o.id === outcomeId);
  if (!outcome) {
    return NextResponse.json({ error: '结果不存在' }, { status: 404 });
  }

  // Submit to matching engine
  const engine = getMatchingEngine();
  
  const userId = 'user-' + (request.headers.get('x-user-id') || 'anonymous');
  
  const result = engine.submitOrder({
    userId,
    eventId,
    marketId,
    outcomeId,
    side: body.side,
    shares: Math.floor(body.shares),
    price: Math.round(body.price * 10) / 10,
  });

  // If no matches, create a direct fill (simulated market order)
  if (result.trades.length === 0) {
    const notional = (body.price / 100) * body.shares;
    const fee = Math.max(notional * 0.015, 0.01); // 1.5% taker fee
    
    const trade = {
      id: `trade-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      eventId,
      eventTitle: event.title,
      marketId,
      outcomeId,
      outcomeName: outcome.name,
      side: body.side,
      shares: Math.floor(body.shares),
      price: Math.round(body.price * 10) / 10,
      fee: Math.round(fee * 100) / 100,
      total: Math.round(notional * 100) / 100,
      timestamp: new Date().toISOString(),
      status: 'filled',
    };

    return NextResponse.json({ 
      trade, 
      message: '交易成功',
      revenue: {
        fee: trade.fee,
        totalPlatformRevenue: engine.getRevenueStats().totalRevenue,
      }
    });
  }

  // Return matched trades
  const totalNotional = result.trades.reduce((sum, t) => sum + (t.price / 100) * t.shares, 0);
  
  return NextResponse.json({
    trades: result.trades,
    order: result.order,
    totalNotional: Math.round(totalNotional * 100) / 100,
    totalFees: Math.round(result.fees * 100) / 100,
    message: `成功撮合 ${result.trades.length} 笔交易`,
    revenue: {
      fees: Math.round(result.fees * 100) / 100,
      totalPlatformRevenue: engine.getRevenueStats().totalRevenue,
    }
  });
}

export async function GET(request: NextRequest) {
  const engine = getMatchingEngine();
  const stats = engine.getRevenueStats();
  
  return NextResponse.json({
    revenue: stats,
    orderCount: engine.getTrades().length,
  });
}
