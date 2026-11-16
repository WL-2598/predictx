'use client';

import ErrorBoundary from '@/components/ui/ErrorBoundary';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-[#0a0c10] text-white antialiased">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">应用发生错误</h1>
            <p className="text-sm text-gray-400 mb-6">
              我们遇到了意外问题，技术团队已收到通知。请尝试刷新页面。
            </p>
            <button
              onClick={reset}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-sm font-bold text-white hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              重试
            </button>
          </div>
        </div>
        <ErrorBoundary>
          <div />
        </ErrorBoundary>
      </body>
    </html>
  );
}
