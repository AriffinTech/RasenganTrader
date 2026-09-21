export type RegistrationOfferKey = 'fast-track' | 'personal-coaching' | 'saham-101' | 'trading-clinic-online' | 'trading-clinic-f2f' | 'account'

export type ClassStatus = 'open' | 'opening-soon' | 'full'

export const courseOffer = {
  title: 'True SMC Fast Track Course',
  educator: 'Dr Hanis Hanafi',
  nextClass: 'November 2026',
  price: 'RM499',
  modules: [
    {
      number: '01',
      title: 'True SMC Foundation',
      lessons: [
        'Understanding Concept of Liquidity',
        'Valid Pullback',
        'Inducement',
        'SMC Market Structure',
        'Imbalance / FVG',
        'OrderFlow',
        'OrderBlock',
      ],
    },
    {
      number: '02',
      title: 'True SMC Execution Model',
      lessons: [
        'Identifying High Probability Levels',
        'Setups',
        'Price Action',
        'Entry Method',
        'Trading Plan & Risk Management',
      ],
    },
  ],
  bonuses: [
    '100 Backtested Setup Journal',
    'Weekly FCPO Journal',
    '3 Months Support Group',
    'Lifetime Course Access',
  ],
  exclusiveBonus: {
    title: 'New Momentum Strategy: SPC Setup',
    benefits: [
      'Identify & apply liquidity and inducement concept during breakout',
      'Super easy for beginners',
      'Applicable for all instruments & timeframes',
    ],
  },
} as const

export const saham101Offer = {
  title: 'Saham 101: Kelas Khas untuk Beginner',
  date: '3 & 4 Oktober 2026',
  time: '9.30am–12pm, 9–11pm',
  price: 'RM199',
  topics: [
    'Pengenalan Saham',
    'Pengenalan IPO',
    'Teknikal Analysis: Basic - Intermediate',
    'Risk Management + Trading Plan',
    'Journal',
    'Top 10 Kesilapan Traders',
  ],
  bonuses: [
    'Ilmu Common Indicator (EMA, RSI & MACD)',
    'Kajian Saham Menarik Mingguan',
    '3 Bulan Support Group',
    'Class Recording',
  ],
  exclusiveBonus: {
    title: 'Step By Step Beginner Friendly Setup',
    benefits: [
      'Simple & Clear: Mudah difahami & untuk beginner',
      'Praktikal: Boleh terus diaplikasi dalam market sebenar',
    ],
  },
} as const

export const personalCoachingOffer = {
  title: '1-1 Online personal coaching (Advance)',
  price: 'RM1,800',
  inclusions: [
    'Belajar teknik True Smart Money Concept mengikut pace anda',
    '10x sessions',
    '1 hour per session',
    'Jika pembelajaran selesai dan ada baki sesi, boleh request utk live analysis session',
  ],
} as const

export const tradingClinicOnlineOffer = {
  title: 'Trading Clinic (Online)',
  price: 'RM120 / session',
  inclusions: ['1-1 online personal coaching', '1 hour per session'],
  topics: [
    'Apa-apa soalan trading',
    'TA & chart analysis',
    'Review trades',
    'Kenalpasti mistakes',
    'EP / CL / TP review',
    'Trading psychology',
    'Risk management',
    'Strategy discussion',
    'Improve trading plan',
  ],
  note: 'Trading Clinic ini tidak akan ajar teknik advance True SMC (kecuali Alumni).',
} as const

export const tradingClinicF2FOffer = {
  ...tradingClinicOnlineOffer,
  title: 'Trading Clinic (Face to face - JB)',
  price: 'RM180 / session',
  inclusions: ['Face to face personal coaching di JB', '1 hour per session'],
} as const

// Backwards-compatible alias for components that use the generic coaching name.
export const coachingOffer = tradingClinicOnlineOffer

export const defaultClassSchedule = [
  {
    offerId: 'fast-track' as const,
    name: courseOffer.title,
    date: courseOffer.nextClass,
    price: courseOffer.price,
    status: 'Opening Soon' as const,
    availability: '',
  },
  {
    offerId: 'personal-coaching' as const,
    name: personalCoachingOffer.title,
    date: '10x sessions · 1 hour per session',
    price: personalCoachingOffer.price,
    status: 'Open' as const,
    availability: '3 slot per month',
  },
  {
    offerId: 'saham-101' as const,
    name: saham101Offer.title,
    date: `${saham101Offer.date} · ${saham101Offer.time}`,
    price: saham101Offer.price,
    status: 'Open' as const,
    availability: '',
  },
  {
    offerId: 'trading-clinic-online' as const,
    name: tradingClinicOnlineOffer.title,
    date: 'By appointment · 1 hour per session',
    price: tradingClinicOnlineOffer.price,
    status: 'Open' as const,
    availability: '',
  },
  {
    offerId: 'trading-clinic-f2f' as const,
    name: tradingClinicF2FOffer.title,
    date: 'By appointment · 1 hour per session',
    price: tradingClinicF2FOffer.price,
    status: 'Open' as const,
    availability: '',
  },
] as const

export const registrationOffers = {
  'fast-track': {
    title: courseOffer.title,
    price: courseOffer.price,
    description: 'Pendaftaran untuk kelas True SMC Fast Track Course.',
  },
  'personal-coaching': {
    title: personalCoachingOffer.title,
    price: personalCoachingOffer.price,
    description: '1-1 personal online coaching bersama RasenganTrader.',
  },
  'saham-101': {
    title: saham101Offer.title,
    price: saham101Offer.price,
    description: 'Kelas khas untuk beginner yang mahu memahami asas saham dan analisis teknikal.',
  },
  'trading-clinic-online': {
    title: tradingClinicOnlineOffer.title,
    price: tradingClinicOnlineOffer.price,
    description: '1-1 online personal coaching bersama RasenganTrader selama 1 jam.',
  },
  'trading-clinic-f2f': {
    title: tradingClinicF2FOffer.title,
    price: tradingClinicF2FOffer.price,
    description: 'Face to face personal coaching di JB selama 1 jam.',
  },
  account: {
    title: 'Buka Akaun',
    price: undefined,
    description: 'Permohonan bantuan membuka akaun dengan Mplus, moomoo, atau Phillip Capital.',
  },
} as const

export function isRegistrationOffer(value: string | undefined): value is RegistrationOfferKey {
  return value === 'fast-track' || value === 'personal-coaching' || value === 'saham-101' || value === 'trading-clinic-online' || value === 'trading-clinic-f2f' || value === 'account'
}

export function isPaidRegistrationOffer(value: RegistrationOfferKey): value is Exclude<RegistrationOfferKey, 'account'> {
  return value !== 'account'
}
