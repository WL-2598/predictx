'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import EventCard from '@/components/EventCard';
import ActivityFeed from '@/components/ActivityFeed';
import Onboarding from '@/components/Onboarding';
import { useEvents } from '@/lib/hooks';
import { useActivityFeed } from '@/lib/hooks/useActivityFeed';
import { allEvents, categories } from '@/lib/data';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { events, loading } = useEvents(
    activeCategory === 'all' ? undefined : activeCategory,
    statusFilter || undefined,
  );

  const activities = useActivityFeed(allEvents);
  const liveCount = events.filter(e => e.status === 'live').length;
  const upcomingCount = events.filter(e => e.status === 'upcoming').length;

  useEffect(() => {
    const onboarded = localStorage.getItem('predictx_onboarded');
    if (!onboarded) {
      setShowOnboarding(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0c10]">
      <Header />
      <Sidebar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <Onboarding isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />

      {/* Main content */}
      <main className="pt-16 md:pl-56 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          {/* Hero Banner */}
          <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-[#141720] via-[#1a1f2e] to-[#141720] border border-gray-800/40 p-6 md:p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/25">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold text-red-400">{liveCount} 场直播中</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/25 text-xs font-semibold text-blue-400">
                  {upcomingCount} 场即将开始
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-xs font-semibold text-emerald-400">
                  {events.length} 个市场
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                全球预测市场
              </h1>
              <p className="text-gray-400 text-sm md:text-base max-w-lg">
                体育 · 加密货币 · 政治 · 娱乐 · 科技 — 对你关注的一切进行预测和交易
              </p>
            </div>
          </div>

          {/* Content area with sidebar */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main events grid */}
            <div className="xl:col-span-3">
              {/* Mobile category chips (sidebar is hidden below md) */}
              <div className="md:hidden flex items-center gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                      activeCategory === cat.id
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-[#141720] text-gray-400 border-gray-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.nameZh}</span>
                  </button>
                ))}
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                {[
                  { id: '', label: '全部', count: events.length },
                  { id: 'live', label: '🔴 直播', count: liveCount },
                  { id: 'upcoming', label: '⏰ 即将开始', count: upcomingCount },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      statusFilter === tab.id
                        ? 'bg-gray-800 text-white border border-gray-700'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
                    }`}
                  >
                    {tab.label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      statusFilter === tab.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Events grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-[#141720] rounded-2xl p-5 animate-pulse">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-5 w-16 bg-gray-800 rounded-full" />
                        <div className="h-5 w-20 bg-gray-800 rounded-full" />
                      </div>
                      <div className="h-5 w-3/4 bg-gray-800 rounded mb-4" />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-16 bg-gray-800/50 rounded-xl" />
                        <div className="h-16 bg-gray-800/50 rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mb-4">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">暂无赛事</p>
                  <p className="text-gray-600 text-sm mt-1">请尝试更换分类或搜索条件</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((event, index) => (
                    <div key={event.id} className="animate-fade-in" style={{ animationDelay: `${index * 40}ms` }}>
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="xl:col-span-1 hidden xl:block">
              <div className="sticky top-20 space-y-4">
                <ActivityFeed activities={activities.slice(0, 10)} />

                <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-3">📊 平台数据</h3>
                  <div className="space-y-3">
                    {[
                      { label: '24h交易量', value: '$18.6M' },
                      { label: '活跃市场', value: '385' },
                      { label: '活跃用户', value: '12,847' },
                      { label: '24h交易数', value: '52,341' },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between">
                        <span className="text-xs text-gray-500">{item.label}</span>
                        <span className="text-xs text-white font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-3">🔥 热门趋势</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'BTC > $150K', change: '+12%', up: true },
                      { label: 'GTA 6 发售', change: '-3%', up: false },
                      { label: 'AGI 2026', change: '+18%', up: true },
                      { label: 'NBA 总冠军', change: '+8%', up: true },
                      { label: 'Tesla Robotaxi', change: '+15%', up: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-800/30 transition-colors cursor-pointer">
                        <span className="text-xs text-gray-300 truncate">{item.label}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.up ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                        }`}>
                          {item.change}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
