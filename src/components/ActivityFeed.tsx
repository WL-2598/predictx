'use client';

import { ActivityItem } from '@/lib/hooks/useActivityFeed';

interface ActivityFeedProps {
  activities: ActivityItem[];
  compact?: boolean;
}

export default function ActivityFeed({ activities, compact = false }: ActivityFeedProps) {
  return (
    <div className={`${compact ? '' : 'bg-[#141720] border border-gray-800/60 rounded-2xl p-5'}`}>
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">实时动态</h3>
          <span className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            实时
          </span>
        </div>
      )}

      <div className={`space-y-1 ${compact ? '' : 'max-h-[400px] overflow-y-auto pr-1'}`}>
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-800/30 transition-all ${
              index === 0 ? 'animate-fade-in' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${activity.avatar} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
              {activity.user.slice(0, 2)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-medium text-gray-300">{activity.user}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  activity.action === 'bought'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-red-500/15 text-red-400'
                }`}>
                  {activity.action === 'bought' ? '买入' : '卖出'}
                </span>
                <span className="text-xs text-gray-400 truncate">
                  {activity.outcome}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-gray-500 truncate">{activity.eventName}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right shrink-0">
              <p className="text-xs font-medium text-white tabular-nums">${activity.total.toFixed(2)}</p>
              <p className="text-[10px] text-gray-500 tabular-nums">
                {activity.shares}份 @ {activity.price}¢
              </p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            暂无交易动态
          </div>
        )}
      </div>
    </div>
  );
}
