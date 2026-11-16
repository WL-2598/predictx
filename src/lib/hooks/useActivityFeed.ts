'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SportEvent } from '@/types';

interface ActivityItem {
  id: string;
  user: string;
  avatar: string;
  action: 'bought' | 'sold';
  outcome: string;
  eventName: string;
  shares: number;
  price: number;
  total: number;
  timestamp: Date;
}

const userNames = [
  'TraderX', 'CryptoKing', 'AlphaHunter', 'SharpMoney', 'WhaleWatcher',
  'OddsBreaker', 'ProphetPicks', 'LineMaker', 'EdgeFinder', 'MarketMaven',
  'DeepValue', 'QuickFlip', 'LongShot', 'SafeBettor', 'RiskTaker'
];

const avatarColors = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-yellow-500 to-amber-500',
  'from-indigo-500 to-purple-500',
  'from-teal-500 to-green-500',
  'from-rose-500 to-pink-500',
];

function generateActivity(events: SportEvent[]): ActivityItem {
  const event = events[Math.floor(Math.random() * events.length)];
  const market = event.markets[0];
  const outcome = market.outcomes[Math.floor(Math.random() * market.outcomes.length)];
  const action = Math.random() > 0.35 ? 'bought' : 'sold';
  const shares = Math.floor(Math.random() * 200) + 5;
  const price = Math.round(outcome.price + (Math.random() - 0.5) * 4);
  const userName = userNames[Math.floor(Math.random() * userNames.length)];
  const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  return {
    id: `activity-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    user: userName,
    avatar: color,
    action,
    outcome: outcome.name,
    eventName: event.title,
    shares,
    price: Math.max(1, Math.min(99, price)),
    total: Math.round(shares * Math.max(1, Math.min(99, price)) / 100 * 100) / 100,
    timestamp: new Date(),
  };
}

export function useActivityFeed(events: SportEvent[]) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const eventsRef = useRef(events);
  eventsRef.current = events;

  const addActivity = useCallback(() => {
    if (eventsRef.current.length === 0) return;
    const newActivity = generateActivity(eventsRef.current);
    setActivities(prev => [newActivity, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    // Generate initial activities
    const initial: ActivityItem[] = [];
    for (let i = 0; i < 8; i++) {
      if (events.length > 0) {
        const activity = generateActivity(events);
        activity.timestamp = new Date(Date.now() - (i + 1) * 30000);
        initial.push(activity);
      }
    }
    setActivities(initial);
  }, []); // Only on mount

  useEffect(() => {
    const interval = setInterval(addActivity, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [addActivity]);

  return activities;
}

export type { ActivityItem };
