'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/ToastProvider';

interface PriceAlert {
  id: string;
  eventName: string;
  outcomeName: string;
  targetPrice: number;
  direction: 'above' | 'below';
  active: boolean;
  createdAt: Date;
}

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    { id: 'a1', eventName: 'Lakers vs. Warriors', outcomeName: 'Lakers', targetPrice: 70, direction: 'above', active: true, createdAt: new Date(Date.now() - 3600000) },
    { id: 'a2', eventName: 'BTC > $150K', outcomeName: 'Yes', targetPrice: 50, direction: 'above', active: true, createdAt: new Date(Date.now() - 7200000) },
    { id: 'a3', eventName: 'Arsenal vs. Chelsea', outcomeName: '超过 2.5', targetPrice: 80, direction: 'above', active: false, createdAt: new Date(Date.now() - 86400000) },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({ eventName: '', outcomeName: '', targetPrice: 50, direction: 'above' as 'above' | 'below' });
  const { addToast } = useToast();

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    addToast({ type: 'info', title: '提醒已删除' });
  };

  const createAlert = () => {
    if (!newAlert.eventName || !newAlert.outcomeName) return;
    const alert: PriceAlert = {
      id: `a-${Date.now()}`,
      ...newAlert,
      active: true,
      createdAt: new Date(),
    };
    setAlerts([alert, ...alerts]);
    setShowForm(false);
    setNewAlert({ eventName: '', outcomeName: '', targetPrice: 50, direction: 'above' });
    addToast({ type: 'success', title: '价格提醒已设置', message: `${newAlert.outcomeName} ${newAlert.direction === 'above' ? '≥' : '≤'} ${newAlert.targetPrice}¢` });
  };

  return (
    <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          🔔 价格提醒
          <span className="text-xs text-gray-500 font-normal">({alerts.filter(a => a.active).length} 活跃)</span>
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="h-7 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/25 transition-all"
        >
          + 新建
        </button>
      </div>

      {/* New alert form */}
      {showForm && (
        <div className="mb-4 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 space-y-3 animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={newAlert.eventName}
              onChange={(e) => setNewAlert({ ...newAlert, eventName: e.target.value })}
              placeholder="赛事名称"
              className="h-9 px-3 rounded-lg bg-gray-800/60 border border-gray-700/50 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
            />
            <input
              type="text"
              value={newAlert.outcomeName}
              onChange={(e) => setNewAlert({ ...newAlert, outcomeName: e.target.value })}
              placeholder="结果名称"
              className="h-9 px-3 rounded-lg bg-gray-800/60 border border-gray-700/50 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 mb-1 block">目标价格</label>
              <input
                type="number"
                value={newAlert.targetPrice}
                onChange={(e) => setNewAlert({ ...newAlert, targetPrice: parseInt(e.target.value) || 0 })}
                className="w-full h-9 px-3 rounded-lg bg-gray-800/60 border border-gray-700/50 text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 mb-1 block">方向</label>
              <select
                value={newAlert.direction}
                onChange={(e) => setNewAlert({ ...newAlert, direction: e.target.value as 'above' | 'below' })}
                className="w-full h-9 px-3 rounded-lg bg-gray-800/60 border border-gray-700/50 text-xs text-white focus:outline-none focus:border-emerald-500/50 appearance-none"
              >
                <option value="above">≥ 高于</option>
                <option value="below">≤ 低于</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={createAlert} className="flex-1 h-8 rounded-lg bg-emerald-500 text-xs font-semibold text-white hover:bg-emerald-400 transition-all">
              创建提醒
            </button>
            <button onClick={() => setShowForm(false)} className="h-8 px-3 rounded-lg bg-gray-800 text-xs text-gray-400 hover:text-white transition-all">
              取消
            </button>
          </div>
        </div>
      )}

      {/* Alert list */}
      <div className="space-y-2">
        {alerts.map(alert => (
          <div key={alert.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
            alert.active ? 'bg-gray-800/20 border-gray-700/30' : 'bg-gray-800/10 border-gray-800/20 opacity-50'
          }`}>
            <button
              onClick={() => toggleAlert(alert.id)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                alert.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-800 text-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{alert.eventName}</p>
              <p className="text-[10px] text-gray-500">
                {alert.outcomeName} {alert.direction === 'above' ? '≥' : '≤'} <span className="text-amber-400 font-semibold">{alert.targetPrice}¢</span>
              </p>
            </div>
            <button
              onClick={() => deleteAlert(alert.id)}
              className="text-gray-600 hover:text-red-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm">
            暂无价格提醒
          </div>
        )}
      </div>
    </div>
  );
}
