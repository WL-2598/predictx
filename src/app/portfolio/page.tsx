'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PortfolioDashboard from '@/components/PortfolioDashboard';
import PortfolioAnalytics from '@/components/PortfolioAnalytics';
import CopyTrading from '@/components/CopyTrading';
import PriceAlerts from '@/components/PriceAlerts';

type Tab = 'positions' | 'analytics' | 'copy' | 'alerts';

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<Tab>('positions');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'positions', label: '持仓', icon: '📊' },
    { id: 'analytics', label: '分析', icon: '📈' },
    { id: 'copy', label: '跟单', icon: '👥' },
    { id: 'alerts', label: '提醒', icon: '🔔' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10]">
      <Header />
      <main className="pt-16 px-4 md:px-6 pb-20 md:pb-6">
        <div className="max-w-6xl mx-auto py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">我的投资组合</h1>
              <p className="text-gray-400 text-sm">管理持仓、分析绩效、跟单交易</p>
            </div>

            <div className="flex gap-1 p-1 rounded-xl bg-gray-800/50 w-fit">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gray-700 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'positions' && <PortfolioDashboard />}
          {activeTab === 'analytics' && (
            <PortfolioAnalytics currentBalance={10000} totalPnl={450} totalInvested={13150} />
          )}
          {activeTab === 'copy' && <CopyTrading />}
          {activeTab === 'alerts' && <PriceAlerts />}
        </div>
      </main>
    </div>
  );
}
