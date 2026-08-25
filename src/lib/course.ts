export type RegistrationOfferKey = 'course' | 'coaching' | 'account'

export const courseOffer = {
  title: 'True SMC Fast Track Course',
  educator: 'Dr Hanis Hanafi',
  nextClass: 'November / December',
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

export const coachingOffer = {
  title: '1-1 Personal Online Coaching',
  price: 'RM1,600',
  inclusions: ['10x sessions', '1 hour per session', 'Only 2 slots per month'],
} as const

export const registrationOffers = {
  course: {
    title: courseOffer.title,
    price: courseOffer.price,
    description: 'Pendaftaran untuk kelas True SMC Fast Track Course.',
  },
  coaching: {
    title: coachingOffer.title,
    price: coachingOffer.price,
    description: 'Permohonan untuk sesi personal online coaching.',
  },
  account: {
    title: 'Buka Akaun',
    price: undefined,
    description: 'Permohonan bantuan membuka akaun dengan Mplus, moomoo, atau Phillip Capital.',
  },
} as const

export function isRegistrationOffer(value: string | undefined): value is RegistrationOfferKey {
  return value === 'course' || value === 'coaching' || value === 'account'
}
