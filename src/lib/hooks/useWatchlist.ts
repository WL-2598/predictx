'use client';

import { useState, useEffect, useCallback } from 'react';

const WATCHLIST_KEY = 'predictx_watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY);
      if (stored) {
        setWatchlist(new Set(JSON.parse(stored)));
      }
    } catch {}
  }, []);

  const toggle = useCallback((eventId: string) => {
    setWatchlist(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isWatched = useCallback((eventId: string) => watchlist.has(eventId), [watchlist]);

  return { watchlist, toggle, isWatched };
}
