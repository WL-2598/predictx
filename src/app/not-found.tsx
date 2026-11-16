export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <span className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-500 leading-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl mt-4">🔍</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">页面未找到</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          您访问的页面不存在或已被移除。请检查链接是否正确，或者返回首页浏览。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="h-11 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-sm font-bold text-white hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/20 inline-flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            返回首页
          </a>
          <a
            href="/leaderboard"
            className="h-11 px-6 rounded-xl bg-gray-800 border border-gray-700/50 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all inline-flex items-center justify-center"
          >
            浏览排行榜
          </a>
        </div>
      </div>
    </div>
  );
}
