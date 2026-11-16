import { SportEvent } from '@/types';

export const expandedEvents: SportEvent[] = [
  // ============ CRYPTO MARKETS ============
  {
    id: 'crypto-btc-100k-2026',
    title: '比特币会在2026年底前突破$150K吗?',
    league: 'Crypto',
    leagueId: 'crypto',
    category: 'crypto',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: 'BTC > $150K by Dec 2026?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 34, change: 2.8 },
        { id: 'no', name: 'No', price: 68, change: -2.5 },
      ],
      volume: 4200000, liquidity: 1200000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 4200000, isHot: true,
  },
  {
    id: 'crypto-eth-merge-2026',
    title: '以太坊会在Q1 2027前完成Pectra升级吗?',
    league: 'Crypto',
    leagueId: 'crypto',
    category: 'crypto',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: 'Pectra升级在Q1 2027前完成?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 72, change: 5.2 },
        { id: 'no', name: 'No', price: 30, change: -4.8 },
      ],
      volume: 1800000, liquidity: 520000, endDate: '2027-03-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-06-01T00:00:00Z', status: 'live', volume: 1800000,
  },
  {
    id: 'crypto-sol-flip-eth',
    title: 'Solana会超越以太坊市值吗?',
    league: 'Crypto',
    leagueId: 'crypto',
    category: 'crypto',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: 'SOL市值 > ETH市值?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 8, change: 1.2 },
        { id: 'no', name: 'No', price: 93, change: -1.0 },
      ],
      volume: 2400000, liquidity: 680000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 2400000,
  },
  {
    id: 'crypto-cbdc-us',
    title: '美国会在2026年推出数字美元(CBDC)吗?',
    league: 'Crypto',
    leagueId: 'crypto',
    category: 'crypto',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: '美国CBDC 2026年推出?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 12, change: -0.5 },
        { id: 'no', name: 'No', price: 89, change: 0.4 },
      ],
      volume: 890000, liquidity: 250000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 890000,
  },

  // ============ ENTERTAINMENT MARKETS ============
  {
    id: 'ent-oscars-bp-2027',
    title: '2027奥斯卡最佳影片',
    league: 'Entertainment',
    leagueId: 'entertainment',
    category: 'entertainment',
    teams: [
      { id: 'opp', name: 'Oppenheimer 2', shortName: 'OPP' },
      { id: 'dune', name: 'Dune: Part 3', shortName: 'DUN' },
    ],
    markets: [{
      id: 'm1', question: '哪部电影将赢得最佳影片?',
      outcomes: [
        { id: 'opp', name: 'Oppenheimer 2', price: 28, change: 3.5 },
        { id: 'dune', name: 'Dune: Part 3', price: 22, change: -1.2 },
        { id: 'other', name: '其他', price: 52, change: -2.0 },
      ],
      volume: 3100000, liquidity: 920000, endDate: '2027-03-15T23:59:00Z', status: 'open',
    }],
    startTime: '2026-06-01T00:00:00Z', status: 'live', volume: 3100000, isHot: true,
  },
  {
    id: 'ent-squid-game-s3',
    title: '鱿鱼游戏第三季会成为Netflix最高收视吗?',
    league: 'Entertainment',
    leagueId: 'entertainment',
    category: 'entertainment',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: '鱿鱼游戏S3破纪录?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 45, change: 8.2 },
        { id: 'no', name: 'No', price: 57, change: -7.5 },
      ],
      volume: 1500000, liquidity: 430000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-09-01T00:00:00Z', status: 'live', volume: 1500000, isHot: true,
  },
  {
    id: 'ent-taylor-eras',
    title: 'Taylor Swift会在2026年宣布新巡演吗?',
    league: 'Entertainment',
    leagueId: 'entertainment',
    category: 'entertainment',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: 'Taylor新巡演2026?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 62, change: 4.5 },
        { id: 'no', name: 'No', price: 40, change: -4.0 },
      ],
      volume: 2800000, liquidity: 820000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 2800000,
  },
  {
    id: 'ent-gta6-release',
    title: 'GTA 6会在2026年发布吗?',
    league: 'Gaming',
    leagueId: 'gaming',
    category: 'entertainment',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: 'GTA 6 2026年发售?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 55, change: -3.2 },
        { id: 'no', name: 'No', price: 47, change: 3.5 },
      ],
      volume: 5600000, liquidity: 1600000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 5600000, isHot: true,
  },

  // ============ SCIENCE & TECH MARKETS ============
  {
    id: 'sci-spacex-mars',
    title: 'SpaceX会在2026年向火星发射任务吗?',
    league: 'Space',
    leagueId: 'space',
    category: 'science',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: 'SpaceX火星任务2026?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 15, change: 2.1 },
        { id: 'no', name: 'No', price: 86, change: -1.8 },
      ],
      volume: 1900000, liquidity: 550000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 1900000,
  },
  {
    id: 'sci-agi-2026',
    title: '会在2026年宣布达到AGI吗?',
    league: 'AI & Tech',
    leagueId: 'ai',
    category: 'science',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: '2026年宣布AGI?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 18, change: 5.5 },
        { id: 'no', name: 'No', price: 83, change: -5.0 },
      ],
      volume: 3800000, liquidity: 1100000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 3800000, isHot: true,
  },
  {
    id: 'sci-apple-ar',
    title: 'Apple会在2026年发布Vision Pro 2吗?',
    league: 'Tech',
    leagueId: 'tech',
    category: 'science',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: 'Vision Pro 2 在2026年?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 68, change: 3.2 },
        { id: 'no', name: 'No', price: 34, change: -2.8 },
      ],
      volume: 1200000, liquidity: 360000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 1200000,
  },
  {
    id: 'sci-fusion-power',
    title: '核聚变发电会在2026年取得商业突破吗?',
    league: 'Science',
    leagueId: 'science',
    category: 'science',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: '核聚变商业突破2026?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 6, change: 0.8 },
        { id: 'no', name: 'No', price: 95, change: -0.6 },
      ],
      volume: 720000, liquidity: 200000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 720000,
  },

  // ============ WEATHER & CLIMATE MARKETS ============
  {
    id: 'weather-el-nino-2026',
    title: '2026年会出现厄尔尼诺现象吗?',
    league: 'Weather',
    leagueId: 'weather',
    category: 'weather',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: '2026厄尔尼诺?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 42, change: -2.1 },
        { id: 'no', name: 'No', price: 60, change: 2.3 },
      ],
      volume: 560000, liquidity: 160000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 560000,
  },
  {
    id: 'weather-record-heat',
    title: '2026年会成为有记录以来最热的一年吗?',
    league: 'Climate',
    leagueId: 'climate',
    category: 'weather',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: '2026最热年?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 58, change: 3.8 },
        { id: 'no', name: 'No', price: 44, change: -3.5 },
      ],
      volume: 920000, liquidity: 270000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 920000,
  },

  // ============ NEWS & POLITICS MARKETS ============
  {
    id: 'news-eu-tariff',
    title: '欧盟会在2026年对中国电动车征收额外关税吗?',
    league: 'Geopolitics',
    leagueId: 'geopolitics',
    category: 'politics',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: 'EU对华EV关税2026?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 75, change: 4.2 },
        { id: 'no', name: 'No', price: 27, change: -3.8 },
      ],
      volume: 2100000, liquidity: 620000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 2100000, isHot: true,
  },
  {
    id: 'news-fed-rate-2026',
    title: '美联储会在2026年底前将利率降至4%以下吗?',
    league: 'Economics',
    leagueId: 'economics',
    category: 'politics',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: 'Fed利率 < 4% by 2026?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 38, change: -2.5 },
        { id: 'no', name: 'No', price: 64, change: 2.8 },
      ],
      volume: 3400000, liquidity: 980000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 3400000, isHot: true,
  },
  {
    id: 'news-jp-earthquake',
    title: '日本会在2026年发生7级以上地震吗?',
    league: 'Natural Events',
    leagueId: 'natural',
    category: 'science',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: '日本7+地震2026?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 25, change: 1.5 },
        { id: 'no', name: 'No', price: 77, change: -1.2 },
      ],
      volume: 680000, liquidity: 190000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 680000,
  },
  {
    id: 'news-uk-election',
    title: '2026英国地方选举保守党会获胜吗?',
    league: 'UK Politics',
    leagueId: 'uk-politics',
    category: 'politics',
    teams: [
      { id: 'con', name: '保守党', shortName: 'CON' },
      { id: 'lab', name: '工党', shortName: 'LAB' },
    ],
    markets: [{
      id: 'm1', question: '哪方将赢得更多席位?',
      outcomes: [
        { id: 'con', name: '保守党', price: 35, change: -1.8 },
        { id: 'lab', name: '工党', price: 67, change: 2.1 },
      ],
      volume: 1100000, liquidity: 320000, endDate: '2026-05-07T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 1100000,
  },
  {
    id: 'news-tesla-robotaxi',
    title: 'Tesla Robotaxi会在2026年开始商业运营吗?',
    league: 'Auto & Tech',
    leagueId: 'auto',
    category: 'science',
    teams: [
      { id: 'yes', name: 'Yes', shortName: 'YES' },
      { id: 'no', name: 'No', shortName: 'NO' },
    ],
    markets: [{
      id: 'm1', question: 'Robotaxi商业运营2026?',
      outcomes: [
        { id: 'yes', name: 'Yes', price: 42, change: 6.5 },
        { id: 'no', name: 'No', price: 60, change: -6.0 },
      ],
      volume: 4500000, liquidity: 1300000, endDate: '2026-12-31T23:59:00Z', status: 'open',
    }],
    startTime: '2026-01-01T00:00:00Z', status: 'live', volume: 4500000, isHot: true,
  },
];
