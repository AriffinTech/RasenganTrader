export const courseOffer = {
  title: 'True SMC Fast Track Course',
  educator: 'Dr Hanis Hanafi',
  date: '18 & 19 July 2026',
  schedule: ['9.30am – 12pm', '9pm – 11pm'],
  platform: 'Google Meet',
  price: 'RM399',
  previousPrice: 'RM499',
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
