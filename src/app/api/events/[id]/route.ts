import { NextRequest, NextResponse } from 'next/server';
import { allEvents } from '@/lib/data';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const event = allEvents.find(e => e.id === id);

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  // Generate price history for charts
  const priceHistory = event.markets.map(market => ({
    marketId: market.id,
    history: market.outcomes.map(outcome => {
      const points = [];
      let price = outcome.price;
      for (let i = 24; i >= 0; i--) {
        const time = new Date(Date.now() - i * 3600000).toISOString();
        price = Math.max(1, Math.min(99, price + (Math.random() - 0.48) * 5));
        points.push({ time, price: Math.round(price * 10) / 10 });
      }
      return { outcomeId: outcome.id, outcomeName: outcome.name, points };
    }),
  }));

  return NextResponse.json({ event, priceHistory });
}
