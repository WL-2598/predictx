export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount.toFixed(2)}`;
}

export function formatPrice(cents: number): string {
  return `${Math.round(cents)}¢`;
}

export function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return `${Math.floor(hours / 24)}天前`;
}

export function formatEventTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) + ' ' +
    date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    basketball: 'bg-orange-500/20 text-orange-400',
    soccer: 'bg-green-500/20 text-green-400',
    football: 'bg-blue-500/20 text-blue-400',
    tennis: 'bg-yellow-500/20 text-yellow-400',
    hockey: 'bg-cyan-500/20 text-cyan-400',
    mma: 'bg-red-500/20 text-red-400',
    esports: 'bg-purple-500/20 text-purple-400',
    cricket: 'bg-emerald-500/20 text-emerald-400',
    baseball: 'bg-amber-500/20 text-amber-400',
    golf: 'bg-lime-500/20 text-lime-400',
    politics: 'bg-indigo-500/20 text-indigo-400',
  };
  return colors[category] || 'bg-gray-500/20 text-gray-400';
}
