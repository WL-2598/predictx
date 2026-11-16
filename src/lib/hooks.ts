'use client';

import { useState, useEffect, useCallback } from 'react';
import { SportEvent } from '@/types';

export function useEvents(category?: string, status?: string, search?: string) {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (status) params.set('status', status);
      if (search) params.set('search', search);

      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      setEvents(data.events);
    } catch {
      // Error handled silently - UI shows loading state
    } finally {
      setLoading(false);
    }
  }, [category, status, search]);

  useEffect(() => {
    setLoading(true);
    fetchEvents();
  }, [fetchEvents]);

  // Auto-refresh every 5 seconds for live updates
  useEffect(() => {
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  return { events, loading, refetch: fetchEvents };
}
