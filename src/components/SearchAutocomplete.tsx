'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SportEvent } from '@/types';

interface SearchAutocompleteProps {
  className?: string;
  placeholder?: string;
}

export default function SearchAutocomplete({ className = '', placeholder = '搜索赛事...' }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SportEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/events?search=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.events.slice(0, 6));
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 200);
  };

  const handleSelect = (event: SportEvent) => {
    setQuery('');
    setIsOpen(false);
    router.push(`/event/${event.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      basketball: '🏀', soccer: '⚽', football: '🏈', tennis: '🎾',
      hockey: '🏒', mma: '🥊', esports: '🎮', cricket: '🏏',
      baseball: '⚾', golf: '⛳', politics: '🏛️',
    };
    return icons[category] || '📊';
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="搜索赛事"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          className="w-full h-9 pl-9 pr-8 rounded-lg bg-gray-800/60 border border-gray-700/50 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-gray-600 border-t-emerald-400 rounded-full animate-spin" />
          </div>
        )}
        {query && !loading && (
          <button
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-[#1a1f2e] border border-gray-700/60 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-fade-in"
        >
          <div className="p-1.5">
            <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider px-3 py-1.5">
              搜索结果 ({results.length})
            </div>
            {results.map((event, i) => (
              <button
                key={event.id}
                onClick={() => handleSelect(event)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  i === selectedIndex ? 'bg-gray-700/40' : 'hover:bg-gray-800/40'
                }`}
              >
                <span className="text-base shrink-0">{getCategoryIcon(event.category)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{event.title}</p>
                  <p className="text-[10px] text-gray-500">{event.league} · {event.markets[0]?.outcomes[0]?.name} {event.markets[0]?.outcomes[0]?.price}¢</p>
                </div>
                {event.status === 'live' && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/15 text-[10px] text-red-400 font-medium shrink-0">
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    直播
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {isOpen && query && results.length === 0 && !loading && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-[#1a1f2e] border border-gray-700/60 rounded-xl shadow-2xl shadow-black/40 p-4 z-50 animate-fade-in"
        >
          <p className="text-sm text-gray-500 text-center">未找到相关赛事</p>
        </div>
      )}
    </div>
  );
}
