'use client';

import Link from 'next/link';
import { SportEvent } from '@/types';
import { formatCurrency, formatPrice, formatEventTime, getCategoryColor } from '@/lib/utils';
import { useWatchlist } from '@/lib/hooks/useWatchlist';

interface EventCardProps {
  event: SportEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const isLive = event.status === 'live';
  const mainMarket = event.markets[0];
  const { toggle, isWatched } = useWatchlist();
  const watched = isWatched(event.id);

  return (
    <div className="group relative">
        {/* Watchlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(event.id);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
            watched
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
              : 'bg-gray-800/50 text-gray-500 border border-transparent opacity-0 group-hover:opacity-100 hover:text-amber-400 hover:bg-amber-500/10'
          }`}
          aria-label={watched ? '取消收藏' : '添加到收藏'}
        >
          <svg className="w-4 h-4" fill={watched ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>

      <Link href={`/event/${event.id}`}>
        <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-4 md:p-5 hover:border-gray-700/80 hover:bg-[#181c28] transition-all duration-300 cursor-pointer overflow-hidden h-full">
          {/* Live indicator + league */}
          <div className="flex items-center gap-2 mb-3 pr-10">
            {isLive && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-red-400 uppercase">直播</span>
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${getCategoryColor(event.category)}`}>
              {event.league}
            </span>
            {event.isHot && (
              <span className="text-[11px]">🔥</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors mb-3 line-clamp-1">
            {event.title}
          </h3>

          {/* Teams + Score */}
          {event.teams[0]?.score !== undefined && (
            <div className="flex items-center justify-between gap-4 px-3 py-2.5 rounded-xl bg-gray-800/40 border border-gray-700/30 mb-4">
              {event.teams.map((team, i) => (
                <div key={team.id} className={`flex items-center gap-2 ${i === 1 ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {team.shortName.slice(0, 3)}
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <p className="text-xs font-medium text-gray-300 truncate max-w-[80px]">{team.name}</p>
                  </div>
                  <span className="text-xl font-bold text-white tabular-nums">{team.score ?? '-'}</span>
                </div>
              ))}
            </div>
          )}

          {/* Market odds */}
          {mainMarket && (
            <div className="space-y-2">
              <p className="text-[11px] text-gray-500 font-medium">{mainMarket.question}</p>
              <div className={`grid gap-2 ${mainMarket.outcomes.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {mainMarket.outcomes.map(outcome => (
                  <div
                    key={outcome.id}
                    className="relative flex flex-col items-center justify-center px-3 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group/btn cursor-pointer"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="text-[11px] text-gray-400 font-medium truncate w-full text-center mb-0.5">
                      {outcome.name}
                    </span>
                    <span className="text-lg font-bold text-white tabular-nums">
                      {formatPrice(outcome.price)}
                    </span>
                    {outcome.change !== 0 && (
                      <span className={`text-[10px] font-medium ${outcome.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {outcome.change > 0 ? '↑' : '↓'} {Math.abs(outcome.change).toFixed(1)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Volume + Time */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/60">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatEventTime(event.startTime)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{formatCurrency(event.volume)}</span>
            </div>
          </div>

          {/* Hover glow */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />
        </div>
      </Link>
    </div>
  );
}
