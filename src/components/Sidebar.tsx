'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { categories } from '@/lib/data';

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

function SidebarContent({ activeCategory, onCategoryChange }: SidebarProps) {
  const pathname = usePathname();

  // Hide on detail/settings/leaderboard pages
  if (pathname.startsWith('/event/') || pathname.startsWith('/settings') || pathname.startsWith('/leaderboard')) return null;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-16 md:w-56 border-r border-gray-800 bg-[#0d0f14] overflow-y-auto z-40">
      <div className="py-4 px-2 md:px-3">
        <div className="hidden md:block mb-4 px-3">
          <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">体育赛事</h3>
        </div>

        <nav className="space-y-0.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                activeCategory === cat.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              <span className="text-lg w-6 text-center shrink-0">{cat.icon}</span>
              <span className="hidden md:flex items-center justify-between flex-1 min-w-0">
                <span className="font-medium truncate">{cat.nameZh}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeCategory === cat.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-gray-800 text-gray-500 group-hover:bg-gray-700 group-hover:text-gray-400'
                }`}>
                  {cat.count}
                </span>
              </span>
            </button>
          ))}
        </nav>

        <div className="hidden md:block mt-6 mb-4 px-3">
          <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">功能</h3>
        </div>

        <nav className="space-y-0.5">
          <Link
            href="/portfolio"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              pathname === '/portfolio'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
            }`}
          >
            <span className="text-lg w-6 text-center shrink-0">📊</span>
            <span className="hidden md:block font-medium">我的投资组合</span>
          </Link>
          <Link
            href="/leaderboard"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              pathname === '/leaderboard'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
            }`}
          >
            <span className="text-lg w-6 text-center shrink-0">🏆</span>
            <span className="hidden md:block font-medium">排行榜</span>
          </Link>
          <Link
            href="/create"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              pathname === '/create'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
            }`}
          >
            <span className="text-lg w-6 text-center shrink-0">📝</span>
            <span className="hidden md:block font-medium">创建市场</span>
          </Link>
          <Link
            href="/settings"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              pathname === '/settings'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
            }`}
          >
            <span className="text-lg w-6 text-center shrink-0">⚙️</span>
            <span className="hidden md:block font-medium">设置</span>
          </Link>
        </nav>

        {/* Bottom info card (desktop only) */}
        <div className="hidden md:block mt-8 mx-1">
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-500/15">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">💡</span>
              <span className="text-xs font-semibold text-white">交易提示</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              买入价低于50¢的合约，如果预测正确，每份合约将获得$1回报。
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Sidebar(props: SidebarProps) {
  return (
    <Suspense fallback={
      <aside className="fixed left-0 top-16 bottom-0 w-16 md:w-56 border-r border-gray-800 bg-[#0d0f14] z-40">
        <div className="py-4 px-2 md:px-3 space-y-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-800/30 rounded-xl animate-pulse" />
          ))}
        </div>
      </aside>
    }>
      <SidebarContent {...props} />
    </Suspense>
  );
}
