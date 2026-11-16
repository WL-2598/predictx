import { NextRequest, NextResponse } from 'next/server';
import { allEvents } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'volume';
  const limit = parseInt(searchParams.get('limit') || '0');

  // Input validation
  if (search && search.length > 100) {
    return NextResponse.json({ error: '搜索词过长' }, { status: 400 });
  }
  if (limit && (limit < 0 || limit > 100)) {
    return NextResponse.json({ error: '无效的 limit 参数 (0-100)' }, { status: 400 });
  }

  let filtered = [...allEvents];

  if (category && category !== 'all') {
    const validCategories = ['soccer', 'basketball', 'football', 'tennis', 'hockey', 'mma', 'cricket', 'esports', 'baseball', 'golf', 'politics', 'crypto', 'entertainment', 'science', 'weather'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: '无效的分类' }, { status: 400 });
    }
    filtered = filtered.filter(e => e.category === category);
  }

  if (status) {
    const validStatuses = ['live', 'upcoming', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: '无效的状态' }, { status: 400 });
    }
    filtered = filtered.filter(e => e.status === status);
  }

  if (search) {
    const q = search.toLowerCase().trim();
    // Sanitize: only allow alphanumeric, spaces, and common CJK characters
    const sanitized = q.replace(/[<>{}[\]\\\/]/g, '');
    filtered = filtered.filter(e =>
      e.title.toLowerCase().includes(sanitized) ||
      e.league.toLowerCase().includes(sanitized) ||
      e.teams.some(t => t.name.toLowerCase().includes(sanitized))
    );
  }

  if (sort === 'volume') {
    filtered.sort((a, b) => b.volume - a.volume);
  } else if (sort === 'time') {
    filtered.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  if (limit > 0) {
    filtered = filtered.slice(0, limit);
  }

  // Simulate real-time price fluctuations
  const events = filtered.map(event => ({
    ...event,
    markets: event.markets.map(market => ({
      ...market,
      outcomes: market.outcomes.map(outcome => ({
        ...outcome,
        price: Math.max(1, Math.min(99, outcome.price + (Math.random() - 0.5) * 2)),
      })),
    })),
  }));

  return NextResponse.json({ events, total: events.length });
}
