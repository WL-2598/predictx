'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TradingPanel from '@/components/TradingPanel';
import EnhancedPriceChart from '@/components/EnhancedPriceChart';
import OrderBook from '@/components/OrderBook';
import ActivityFeed from '@/components/ActivityFeed';
import { SportEvent } from '@/types';
import { formatCurrency, formatPrice, getCategoryColor } from '@/lib/utils';
import { useActivityFeed } from '@/lib/hooks/useActivityFeed';
import { useWatchlist } from '@/lib/hooks/useWatchlist';
import { sportEvents } from '@/lib/data';

import CommentSection from '@/components/CommentSection';

interface PriceHistory {
  marketId: string;
  history: {
    outcomeId: string;
    outcomeName: string;
    points: { time: string; price: number }[];
  }[];
}

interface EventDetailClientProps {
  eventId: string;
}

type Tab = 'chart' | 'orderbook' | 'activity';

export default function EventDetailClient({ eventId }: EventDetailClientProps) {
  const [event, setEvent] = useState<SportEvent | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('chart');
  const { toggle, isWatched } = useWatchlist();

  // Use all events for activity feed
  const activities = useActivityFeed(sportEvents);
  const watched = event ? isWatched(event.id) : false;

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        const data = await res.json();
        setEvent(data.event);
        setPriceHistory(data.priceHistory);
      } catch {
        // Fetch error - will remain in loading state
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <main className="pt-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-800 rounded w-1/3" />
            <div className="h-48 bg-[#141720] rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 h-64 bg-[#141720] rounded-2xl" />
              <div className="h-64 bg-[#141720] rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="pt-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-2xl font-bold text-white mb-2">赛事未找到</p>
          <Link href="/" className="text-emerald-400 hover:text-emerald-300">返回首页</Link>
        </div>
      </main>
    );
  }

  const isLive = event.status === 'live';
  const market = event.markets[selectedMarket];
  const marketHistory = priceHistory.find(ph => ph.marketId === market?.id);

  // Filter activities for this event
  const eventActivities = activities.filter(a =>
    event.teams.some(t => a.eventName.includes(t.name) || a.eventName === event.title)
  ).slice(0, 15);

  const tabs: { id: Tab; label: string; icon: string; count?: number }[] = [
    { id: 'chart', label: '走势图', icon: '📈' },
    { id: 'orderbook', label: '订单簿', icon: '📊' },
    { id: 'activity', label: '动态', icon: '⚡', count: eventActivities.length },
  ];

  return (
    <main className="pt-16 px-4 md:px-6 pb-20 md:pb-6">
      <div className="max-w-6xl mx-auto py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-white transition-colors">首页</Link>
          <span>/</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
            {event.league}
          </span>
          <span>/</span>
          <span className="text-gray-400 truncate">{event.title}</span>
        </div>

        {/* Event header */}
        <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5 md:p-6 mb-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {isLive && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/25">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold text-red-400">直播中</span>
                </span>
              )}
              {event.isHot && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-xs font-semibold text-amber-400">
                  🔥 热门
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggle(event.id)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
                  watched
                    ? 'bg-amber-500/15 border-amber-500/25 text-amber-400'
                    : 'bg-gray-800/50 border-gray-700/50 text-gray-500 hover:text-amber-400'
                }`}
              >
                <svg className="w-4 h-4" fill={watched ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </button>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{event.title}</h1>
          <p className="text-sm text-gray-500 mb-6">交易量 {formatCurrency(event.volume)} · {event.markets.length} 个市场</p>

          {/* Teams + Score */}
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {event.teams.map((team) => (
              <div key={team.id} className="flex flex-col items-center gap-2 flex-1 max-w-[160px]">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                  {team.shortName.slice(0, 3)}
                </div>
                <p className="text-xs md:text-sm font-semibold text-white text-center truncate w-full">
                  {team.name}
                </p>
                {team.score !== undefined && (
                  <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                    {team.score}
                  </span>
                )}
              </div>
            ))}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-lg font-bold text-gray-600">VS</span>
            </div>
          </div>
        </div>

        {/* Markets + Trading */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Tabbed content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Market tabs */}
            {event.markets.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {event.markets.map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMarket(i)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      selectedMarket === i
                        ? 'bg-gray-800 text-white border border-gray-700'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
                    }`}
                  >
                    {m.question}
                  </button>
                ))}
              </div>
            )}

            {/* Content tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-gray-800/40 w-fit">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gray-700 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                      activeTab === tab.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'chart' && market && (
              <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
                <h3 className="text-base font-semibold text-white mb-4">{market.question}</h3>

                {marketHistory?.history[0] && marketHistory?.history[1] ? (
                  <EnhancedPriceChart
                    data={marketHistory.history[0].points}
                    secondaryData={marketHistory.history[1].points}
                    color="#10b981"
                    secondaryColor="#ef4444"
                    labels={[market.outcomes[0].name, market.outcomes[1].name]}
                    height={260}
                  />
                ) : marketHistory?.history[0] ? (
                  <EnhancedPriceChart
                    data={marketHistory.history[0].points}
                    color="#10b981"
                    height={260}
                  />
                ) : null}

                {/* Market stats */}
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-800/60">
                  <div>
                    <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider">交易量</p>
                    <p className="text-sm font-semibold text-white">{formatCurrency(market.volume)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider">流动性</p>
                    <p className="text-sm font-semibold text-white">{formatCurrency(market.liquidity)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider">结束时间</p>
                    <p className="text-sm font-semibold text-white">
                      {new Date(market.endDate).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orderbook' && market && (
              <OrderBook outcomes={market.outcomes} />
            )}

            {activeTab === 'activity' && (
              <ActivityFeed activities={eventActivities.length > 0 ? eventActivities : activities.slice(0, 10)} />
            )}

            {/* All outcomes overview */}
            {event.markets.map((m) => (
              <div key={m.id} className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">{m.question}</h3>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${m.outcomes.length}, 1fr)` }}>
                  {m.outcomes.map(outcome => (
                    <div key={outcome.id} className="flex flex-col items-center p-3 rounded-xl bg-gray-800/40 border border-gray-700/30 hover:border-gray-600/50 transition-colors">
                      <span className="text-xs text-gray-400 font-medium mb-1">{outcome.name}</span>
                      <span className="text-2xl font-bold text-white tabular-nums">{formatPrice(outcome.price)}</span>
                      <span className={`text-xs font-medium mt-0.5 ${outcome.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {outcome.change > 0 ? '↑' : '↓'} {Math.abs(outcome.change).toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {/* Comments */}
            <CommentSection eventId={eventId} />
          </div>

          {/* Right: Trading panel + info */}
          <div className="space-y-4">
            {market && (
              <TradingPanel market={market} eventId={event.id} eventTitle={event.title} />
            )}

            {/* Quick stats */}
            <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">市场信息</h3>
              <div className="space-y-3">
                {[
                  { label: '联赛', value: event.league },
                  { label: '状态', value: isLive ? '🔴 直播中' : '⏰ 即将开始', color: isLive ? 'text-red-400' : 'text-blue-400' },
                  { label: '总交易量', value: formatCurrency(event.volume) },
                  { label: '市场数量', value: `${event.markets.length}` },
                  { label: '开始时间', value: new Date(event.startTime).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                ].map(item => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-xs text-gray-500">{item.label}</span>
                    <span className={`text-xs font-medium ${item.color || 'text-white'}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live activity sidebar (desktop) */}
            <div className="hidden lg:block">
              <ActivityFeed activities={activities.slice(0, 8)} compact />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
