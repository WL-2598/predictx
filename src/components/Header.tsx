'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, Suspense } from 'react';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import AuthModal from '@/components/modals/AuthModal';
import { useAuth } from '@/lib/hooks/useAuth';

function HeaderContent() {
  const pathname = usePathname();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  const navItems = [
    { href: '/', label: '市场', icon: '📊', exact: true },
    { href: '/create', label: '创建' },
    { href: '/leaderboard', label: '排行榜' },
    { href: '/portfolio', label: '组合' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-800 bg-[#0d0f14]/95 backdrop-blur-md">
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              Predict<span className="text-emerald-400">X</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-8">
            {navItems.map(item => {
              const isActive = item.exact ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {item.icon && <span className="mr-1.5">{item.icon}</span>}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Search + Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <SearchAutocomplete className="w-44 lg:w-56" />
            </div>

            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"
              aria-label="搜索"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Balance */}
            {isLoggedIn && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700/50">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">$</span>
                </div>
                <span className="text-sm font-semibold text-white tabular-nums">{user?.balance.toLocaleString()}</span>
              </div>
            )}

            {/* Notifications */}
            <button 
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              aria-label="通知"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${user?.avatar || 'from-gray-500 to-gray-600'} flex items-center justify-center text-[10px] font-bold text-white cursor-pointer`}>
                  {user?.username.slice(0, 2).toUpperCase()}
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="h-9 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-sm font-semibold text-white hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/20 hidden sm:block"
              >
                连接钱包
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {mobileSearchOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 p-3 bg-[#0d0f14] border-b border-gray-800 animate-fade-in">
            <SearchAutocomplete placeholder="搜索赛事、联赛、队伍..." />
          </div>
        )}
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-800 bg-[#0d0f14]/95 backdrop-blur-md">
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-9 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg" />
          </div>
        </div>
      </header>
    }>
      <HeaderContent />
    </Suspense>
  );
}
