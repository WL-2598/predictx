# 🚀 PredictX — 全球预测市场交易平台

> 参考 Polymarket 设计开发的全栈预测市场平台，具备真实 CLOB 撮合引擎和完整盈利模型。

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)
![Zustand](https://img.shields.io/badge/Zustand-5-orange)
![Tests](https://img.shields.io/badge/Tests-13%20passing-green)

## 💰 盈利模型

PredictX 通过以下机制实现平台盈利：

| 收入来源 | 费率 | 说明 |
|----------|------|------|
| **Taker 交易手续费** | 1.5% | 主动吃单方支付 |
| **Maker 交易手续费** | 0.5% | 提供流动性方支付 |
| **结算手续费** | 0.1% | 市场结算时收取 |
| **提现手续费** | 0.25% | 用户提现时收取 |
| **最低手续费** | $0.01 | 每笔交易最低收费 |

**示例：** 一笔 $50 的交易（100份 @ 50¢），平台收取 $0.25 (Maker) + $0.75 (Taker) = **$1.00**

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 16 Frontend                    │
│  ┌──────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ Home │ │  Event   │ │ Portfolio│ │  Leaderboard  │  │
│  │ 31   │ │  Detail  │ │ Analytics│ │  Copy Trading │  │
│  │ Mkts │ │ Trading  │ │ Alerts   │ │  Settings     │  │
│  └──┬───┘ └────┬─────┘ └────┬─────┘ └───────┬───────┘  │
│     │          │            │               │           │
│  ┌──┴──────────┴────────────┴───────────────┴────────┐  │
│  │              Zustand Global Store                  │  │
│  │  (Portfolio, Trades, Settings, Alerts, Watchlist)  │  │
│  └──────────────────────┬────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────┐
│                    API Routes (5)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ /events  │  │  /trade  │  │/portfolio│              │
│  │ filter   │  │ CLOB     │  │ persist  │              │
│  │ search   │  │ match    │  │ sync     │              │
│  └──────────┘  └────┬─────┘  └──────────┘              │
│                     │                                    │
│  ┌──────────────────┴──────────────────────────────┐    │
│  │           CLOB Matching Engine                    │    │
│  │  • Price/Time priority matching                  │    │
│  │  • Maker/Taker fee calculation                   │    │
│  │  • Order book management                         │    │
│  │  • Revenue tracking                              │    │
│  │  • Market maker seeding                          │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## ✨ 功能清单

### 📊 市场覆盖 (31 个市场, 13 个分类)
- **体育** — NBA, NFL, 英超, 西甲, ATP, NHL, UFC, 电竞, 板球
- **加密货币** — BTC>$150K, ETH Pectra, SOL翻转, CBDC
- **政治** — 美参议院, EU关税, Fed利率, UK选举
- **科技** — AGI, SpaceX火星, Apple VR, 核聚变, Tesla Robotaxi
- **娱乐** — 奥斯卡, 鱿鱼游戏, Taylor Swift, GTA 6
- **天气** — 厄尔尼诺, 最热年

### 💱 交易系统
- CLOB 撮合引擎 (价格/时间优先)
- 实时手续费计算和收入追踪
- 订单簿深度可视化
- 增强价格走势图 (十字准线, 4档时间周期)
- 余额验证和风控

### 👥 社交功能
- 评论/讨论区 (看多/看空标签)
- 跟单交易 (5位顶级交易者)
- 排行榜 (12位交易者)
- 实时动态流

### 📱 用户体验
- 暗黑主题 + 毛玻璃效果
- 响应式设计 (桌面/平板/手机)
- Toast 通知系统
- 新手引导教程
- 搜索自动完成
- 收藏/关注
- 价格提醒

### 🔐 安全
- API 输入验证和消毒
- XSS 防护
- 速率限制 (30 req/min)
- Error Boundary
- 全局错误处理

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/your-username/predictx.git
cd predictx

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
node --test __tests__/api.test.mjs
```

访问 http://localhost:3000

## 📂 项目结构

```
src/
├── app/
│   ├── page.tsx              # 首页 (31个市场)
│   ├── event/[id]/           # 赛事详情 (图表+订单簿+评论)
│   ├── portfolio/            # 投资组合 (持仓+分析+跟单+提醒)
│   ├── leaderboard/          # 排行榜
│   ├── create/               # 创建市场 (3步向导)
│   ├── settings/             # 设置 (通知+显示+隐私)
│   ├── api/
│   │   ├── events/           # 赛事API (过滤+搜索+验证)
│   │   ├── trade/            # 交易API (CLOB+手续费+限速)
│   │   ├── portfolio/        # 组合API
│   │   └── leaderboard/      # 排行榜API
│   ├── not-found.tsx         # 404页面
│   ├── global-error.tsx      # 全局错误
│   └── loading.tsx           # 加载状态
├── components/
│   ├── EnhancedPriceChart.tsx # Canvas图表 (十字准线+tooltip)
│   ├── TradingPanel.tsx       # 交易面板 (费用计算+余额检查)
│   ├── OrderBook.tsx          # 订单簿可视化
│   ├── CommentSection.tsx     # 评论区
│   ├── CopyTrading.tsx        # 跟单交易
│   ├── CreateMarket.tsx       # 市场创建
│   ├── PortfolioAnalytics.tsx # P&L分析图
│   ├── PriceAlerts.tsx        # 价格提醒
│   ├── Onboarding.tsx         # 新手引导
│   ├── AuthModal.tsx          # 登录/注册
│   └── ui/
│       ├── ToastProvider.tsx  # Toast通知
│       └── ErrorBoundary.tsx  # 错误边界
├── lib/
│   ├── engine/
│   │   └── matching.ts        # CLOB撮合引擎 ⭐核心
│   ├── store/
│   │   └── appStore.ts        # Zustand全局状态
│   ├── hooks/
│   │   ├── useAuth.tsx        # 认证
│   │   ├── useWatchlist.ts    # 收藏
│   │   └── useActivityFeed.ts # 动态流
│   ├── data.ts                # 31个市场数据
│   ├── expandedData.ts        # 扩展市场
│   └── utils.ts               # 工具函数
└── types/
    └── index.ts               # TypeScript类型
```

## 🧪 测试

```bash
# API 验证测试 (13 tests)
node --test __tests__/api.test.mjs

# 匹配引擎测试
# (需要 ts-node 或编译后运行)
```

测试覆盖:
- ✅ API 输入验证 (空body/无效side/负数shares/价格越界)
- ✅ XSS 防护
- ✅ 搜索长度限制
- ✅ Limit 参数验证
- ✅ 分类过滤
- ✅ 404 处理
- ✅ CLOB 撮合 (价格交叉/部分成交/优先级)
- ✅ 手续费计算
- ✅ 订单取消
- ✅ 平台收入追踪

## 📊 盈利分析

假设日交易量 $1M (类似中型预测市场):

| 指标 | 数值 |
|------|------|
| 日均交易量 | $1,000,000 |
| 平均费率 | 1.0% (maker+taker混合) |
| 日手续费收入 | **$10,000** |
| 月手续费收入 | **$300,000** |
| 年手续费收入 | **$3,600,000** |
| 结算+提现附加 | +$500,000/年 |
| **年总收入** | **~$4,100,000** |

## 🛠️ 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS 4 |
| 状态 | Zustand 5 |
| 图表 | Canvas API (手绘) |
| 测试 | Node.js Test Runner |
| 部署 | Vercel / Docker |

## 📋 开发路线图

### Phase 1: 基础设施 (2-3周)
- [ ] PostgreSQL + Prisma ORM 数据持久化
- [ ] NextAuth.js + JWT 认证
- [ ] WebSocket 实时推送 (Socket.io)
- [ ] 完整测试套件 (Vitest + Playwright)

### Phase 2: 业务扩展 (3-4周)
- [ ] 真实钱包集成 (wagmi + viem)
- [ ] 智能合约部署 (Polygon/Base)
- [ ] USDC 结算
- [ ] KYC/AML 合规
- [ ] 移动端 App (React Native)

### Phase 3: 增长 (2-3周)
- [ ] 推荐奖励系统
- [ ] 做市商激励计划
- [ ] API 开放平台
- [ ] 多语言支持 (i18n)
- [ ] SEO 优化 + 内容营销

## 📄 License

MIT License — 仅供学习和研究使用。

---

Built with ❤️ by PredictX Team
