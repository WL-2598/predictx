'use client';

import { useState } from 'react';

export default function SettingsContent() {
  const [notifications, setNotifications] = useState({
    trades: true,
    priceAlerts: true,
    marketUpdates: true,
    news: false,
  });

  const [display, setDisplay] = useState({
    currency: 'USD',
    language: 'zh-CN',
    compactNumbers: false,
    animationsEnabled: true,
  });

  const [privacy, setPrivacy] = useState({
    showPositions: true,
    showTrades: true,
    showPnl: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">⚙️ 设置</h1>
          <p className="text-gray-400 text-sm">管理您的账户和应用偏好</p>
        </div>
        <button
          onClick={handleSave}
          className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all ${
            saved
              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
              : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 shadow-lg shadow-emerald-500/20'
          }`}
        >
          {saved ? '✓ 已保存' : '保存设置'}
        </button>
      </div>

      {/* Account Section */}
      <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5 md:p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          账户信息
        </h2>

        <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-lg font-bold text-white">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">未连接钱包</p>
            <p className="text-xs text-gray-500">连接钱包以启用完整功能</p>
          </div>
          <button className="h-9 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-sm font-semibold text-white hover:from-emerald-400 hover:to-cyan-400 transition-all">
            连接钱包
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1.5 block">显示名称</label>
            <input
              type="text"
              placeholder="输入显示名称"
              className="w-full h-10 px-4 rounded-xl bg-gray-800/60 border border-gray-700/50 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1.5 block">邮箱地址</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full h-10 px-4 rounded-xl bg-gray-800/60 border border-gray-700/50 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5 md:p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          通知设置
        </h2>

        <div className="space-y-1">
          {[
            { key: 'trades' as const, label: '交易通知', desc: '当您的订单成交时通知' },
            { key: 'priceAlerts' as const, label: '价格提醒', desc: '价格大幅变动时提醒' },
            { key: 'marketUpdates' as const, label: '市场更新', desc: '关注的市场有新动态' },
            { key: 'news' as const, label: '新闻资讯', desc: '平台新闻和功能更新' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/30 transition-colors">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                  notifications[item.key] ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  notifications[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Display */}
      <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5 md:p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
          </svg>
          显示设置
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">货币单位</label>
              <select
                value={display.currency}
                onChange={(e) => setDisplay(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full h-10 px-4 rounded-xl bg-gray-800/60 border border-gray-700/50 text-sm text-white focus:outline-none focus:border-emerald-500/50 appearance-none"
              >
                <option value="USD">美元 (USD)</option>
                <option value="CNY">人民币 (CNY)</option>
                <option value="EUR">欧元 (EUR)</option>
                <option value="JPY">日元 (JPY)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">语言</label>
              <select
                value={display.language}
                onChange={(e) => setDisplay(prev => ({ ...prev, language: e.target.value }))}
                className="w-full h-10 px-4 rounded-xl bg-gray-800/60 border border-gray-700/50 text-sm text-white focus:outline-none focus:border-emerald-500/50 appearance-none"
              >
                <option value="zh-CN">简体中文</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            {[
              { key: 'compactNumbers' as const, label: '紧凑数字格式', desc: '使用K/M缩写大数字 (如 $1.2M)' },
              { key: 'animationsEnabled' as const, label: '启用动画效果', desc: '界面过渡和加载动画' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/30 transition-colors">
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => setDisplay(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                    display[item.key] ? 'bg-emerald-500' : 'bg-gray-700'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    display[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5 md:p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          隐私设置
        </h2>

        <div className="space-y-1">
          {[
            { key: 'showPositions' as const, label: '公开持仓', desc: '其他用户可以查看您的持仓' },
            { key: 'showTrades' as const, label: '公开交易', desc: '在动态流中显示您的交易' },
            { key: 'showPnl' as const, label: '公开盈亏', desc: '在排行榜中显示您的盈亏数据' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/30 transition-colors">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => setPrivacy(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                  privacy[item.key] ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  privacy[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#141720] border border-red-500/20 rounded-2xl p-5 md:p-6">
        <h2 className="text-base font-semibold text-red-400 mb-4">⚠️ 危险区域</h2>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
            <div>
              <p className="text-sm font-medium text-white">清除所有数据</p>
              <p className="text-xs text-gray-500">重置所有本地存储的偏好和数据</p>
            </div>
            <button className="h-9 px-4 rounded-lg bg-red-500/10 border border-red-500/30 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all shrink-0">
              清除数据
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
            <div>
              <p className="text-sm font-medium text-white">注销账户</p>
              <p className="text-xs text-gray-500">永久删除您的账户和所有关联数据</p>
            </div>
            <button className="h-9 px-4 rounded-lg bg-red-500/10 border border-red-500/30 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all shrink-0">
              注销账户
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
