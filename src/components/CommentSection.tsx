'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  liked: boolean;
  side?: 'bull' | 'bear';
  replies?: Comment[];
}

interface CommentSectionProps {
  eventId: string;
}

const mockComments: Comment[] = [
  {
    id: 'c1', user: 'SharpMoney', avatar: 'from-blue-400 to-cyan-500',
    content: 'Lakers的防守最近提升很大，我觉得他们能赢。看好主场的表现。',
    timestamp: new Date(Date.now() - 1800000), likes: 24, liked: false, side: 'bull',
  },
  {
    id: 'c2', user: 'DataDriven', avatar: 'from-purple-400 to-pink-500',
    content: '数据显示Warriors的三分球命中率下降了5%，这是一个看空信号。',
    timestamp: new Date(Date.now() - 3600000), likes: 18, liked: true, side: 'bear',
  },
  {
    id: 'c3', user: 'OracleX', avatar: 'from-amber-400 to-orange-500',
    content: '我买了100份Lakers @ 58¢，目标65¢出手。LeBron最近状态很好。',
    timestamp: new Date(Date.now() - 7200000), likes: 42, liked: false, side: 'bull',
    replies: [
      {
        id: 'c3r1', user: 'EdgeFinder', avatar: 'from-green-400 to-emerald-500',
        content: '同意，我也在58¢建仓了。止损设在52¢。',
        timestamp: new Date(Date.now() - 5400000), likes: 8, liked: false,
      },
    ],
  },
  {
    id: 'c4', user: 'ContrarianKing', avatar: 'from-red-400 to-rose-500',
    content: '市场太热了，感觉会有回调。我选择观望。',
    timestamp: new Date(Date.now() - 10800000), likes: 11, liked: false, side: 'bear',
  },
  {
    id: 'c5', user: 'AlphaWolf', avatar: 'from-teal-400 to-cyan-500',
    content: '注意总得分市场，我觉得会超过220.5。两队进攻都很强。',
    timestamp: new Date(Date.now() - 14400000), likes: 15, liked: false, side: 'bull',
  },
];

export default function CommentSection({ eventId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'bull' | 'bear'>('all');

  const filteredComments = comments.filter(c => {
    if (activeFilter === 'all') return true;
    return c.side === activeFilter;
  });

  const handlePost = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `c-${Date.now()}`,
      user: 'You',
      avatar: 'from-emerald-400 to-cyan-500',
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      liked: false,
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const toggleLike = (id: string) => {
    setComments(comments.map(c => {
      if (c.id === id) return { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 };
      return c;
    }));
  };

  const timeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return `${mins}分钟前`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}小时前`;
    return `${Math.floor(hrs / 24)}天前`;
  };

  return (
    <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          💬 讨论
          <span className="text-xs text-gray-500 font-normal">({comments.length})</span>
        </h3>
        <div className="flex gap-1 p-0.5 rounded-lg bg-gray-800/40">
          {(['all', 'bull', 'bear'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                activeFilter === f
                  ? f === 'bull' ? 'bg-emerald-500/20 text-emerald-400' : f === 'bear' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {f === 'all' ? '全部' : f === 'bull' ? '🐂 看多' : '🐻 看空'}
            </button>
          ))}
        </div>
      </div>

      {/* New comment input */}
      <div className="flex gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
          U
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePost()}
            placeholder="分享你的观点..."
            className="flex-1 h-9 px-3 rounded-lg bg-gray-800/60 border border-gray-700/50 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
          />
          <button
            onClick={handlePost}
            disabled={!newComment.trim()}
            className="h-9 px-4 rounded-lg bg-emerald-500 text-sm font-semibold text-white hover:bg-emerald-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            发送
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredComments.map(comment => (
          <div key={comment.id} className="group">
            <div className="flex gap-3">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${comment.avatar} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                {comment.user.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-white">{comment.user}</span>
                  {comment.side && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      comment.side === 'bull' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                      {comment.side === 'bull' ? '🐂 看多' : '🐻 看空'}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-600">{timeAgo(comment.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                <div className="flex items-center gap-4 mt-1.5">
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className={`flex items-center gap-1 text-[11px] transition-colors ${
                      comment.liked ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill={comment.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {comment.likes}
                  </button>
                  <button className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors">
                    回复
                  </button>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-2 pl-4 border-l-2 border-gray-800 space-y-2">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex gap-2">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${reply.avatar} flex items-center justify-center text-[8px] font-bold text-white shrink-0`}>
                          {reply.user.slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-white">{reply.user}</span>
                            <span className="text-[9px] text-gray-600">{timeAgo(reply.timestamp)}</span>
                          </div>
                          <p className="text-xs text-gray-400">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
