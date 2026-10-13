import { createClient } from '@/lib/supabase/server'
import { courseOffer, saham101Offer, personalCoachingOffer, tradingClinicOnlineOffer, tradingClinicF2FOffer } from '@/lib/course'
import type { Course, ClassSession, ClassStatus } from '@/types/database'

export const fallbackCourses: Course[] = [
  {
    id: 'f1000000-0000-0000-0000-000000000001',
    slug: 'fast-track',
    title: courseOffer.title,
    category: 'advanced',
    educator: courseOffer.educator,
    description: 'Kursus lengkap dari konsep sehingga execution untuk trader yang telah mempunyai ilmu asas trading.',
    default_price_cents: 49900,
    default_telegram_link: 'https://t.me/+Bc8UkVt2yHMzMzRl',
    modules: courseOffer.modules.map(m => ({ ...m, lessons: [...m.lessons] })),
    bonuses: [...courseOffer.bonuses],
    exclusive_bonus: { ...courseOffer.exclusiveBonus, benefits: [...courseOffer.exclusiveBonus.benefits] },
    poster_url: null,
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f1000000-0000-0000-0000-000000000002',
    slug: 'saham-101',
    title: saham101Offer.title,
    category: 'foundation',
    educator: 'Dr Hanis Hanafi',
    description: 'Kelas khas untuk beginner yang mahu memahami asas saham dan analisis teknikal.',
    default_price_cents: 19900,
    default_telegram_link: 'https://t.me/+Bc8UkVt2yHMzMzRl',
    modules: [
      {
        number: '01',
        title: 'Asas Saham & Analisis',
        lessons: [...saham101Offer.topics],
      },
    ],
    bonuses: [...saham101Offer.bonuses],
    exclusive_bonus: { ...saham101Offer.exclusiveBonus, benefits: [...saham101Offer.exclusiveBonus.benefits] },
    poster_url: null,
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f1000000-0000-0000-0000-000000000003',
    slug: 'personal-coaching',
    title: personalCoachingOffer.title,
    category: 'coaching',
    educator: 'Dr Hanis Hanafi',
    description: '1-1 personal online coaching bersama RasenganTrader mengikut pace anda.',
    default_price_cents: 180000,
    default_telegram_link: 'https://t.me/HanishanafiRT',
    modules: [],
    bonuses: [...personalCoachingOffer.inclusions],
    exclusive_bonus: null,
    poster_url: null,
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f1000000-0000-0000-0000-000000000004',
    slug: 'trading-clinic-online',
    title: tradingClinicOnlineOffer.title,
    category: 'clinic',
    educator: 'Dr Hanis Hanafi',
    description: '1-1 online personal coaching bersama RasenganTrader selama 1 jam.',
    default_price_cents: 12000,
    default_telegram_link: 'https://t.me/HanishanafiRT',
    modules: [],
    bonuses: [...tradingClinicOnlineOffer.topics],
    exclusive_bonus: null,
    poster_url: null,
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f1000000-0000-0000-0000-000000000005',
    slug: 'trading-clinic-f2f',
    title: tradingClinicF2FOffer.title,
    category: 'clinic',
    educator: 'Dr Hanis Hanafi',
    description: 'Face to face personal coaching di JB selama 1 jam.',
    default_price_cents: 18000,
    default_telegram_link: 'https://t.me/HanishanafiRT',
    modules: [],
    bonuses: [...tradingClinicF2FOffer.topics],
    exclusive_bonus: null,
    poster_url: null,
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const fallbackSessions: ClassSession[] = [
  {
    id: 's1000000-0000-0000-0000-000000000001',
    course_id: fallbackCourses[1].id,
    session_title: fallbackCourses[1].title,
    display_date: `${saham101Offer.date} · ${saham101Offer.time}`,
    display_time: saham101Offer.time,
    start_date: '2026-10-03T09:30:00Z',
    end_date: '2026-10-04T23:00:00Z',
    price_cents: 19900,
    status: 'open',
    telegram_link_override: null,
    poster_url_override: null,
    registration_url_override: null,
    custom_inclusions: null,
    is_featured: false,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    course: fallbackCourses[1],
  },
  {
    id: 's1000000-0000-0000-0000-000000000002',
    course_id: fallbackCourses[3].id,
    session_title: fallbackCourses[3].title,
    display_date: 'By appointment · 1 hour per session',
    display_time: '1 hour per session',
    start_date: null,
    end_date: null,
    price_cents: 12000,
    status: 'open',
    telegram_link_override: null,
    poster_url_override: null,
    registration_url_override: null,
    custom_inclusions: null,
    is_featured: false,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    course: fallbackCourses[3],
  },
  {
    id: 's1000000-0000-0000-0000-000000000003',
    course_id: fallbackCourses[4].id,
    session_title: fallbackCourses[4].title,
    display_date: 'By appointment · 1 hour per session',
    display_time: '1 hour per session',
    start_date: null,
    end_date: null,
    price_cents: 18000,
    status: 'open',
    telegram_link_override: null,
    poster_url_override: null,
    registration_url_override: null,
    custom_inclusions: null,
    is_featured: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    course: fallbackCourses[4],
  },
  {
    id: 's1000000-0000-0000-0000-000000000004',
    course_id: fallbackCourses[0].id,
    session_title: fallbackCourses[0].title,
    display_date: courseOffer.nextClass,
    display_time: null,
    start_date: '2026-11-01T00:00:00Z',
    end_date: '2026-11-30T23:59:59Z',
    price_cents: 49900,
    status: 'upcoming',
    telegram_link_override: null,
    poster_url_override: null,
    registration_url_override: null,
    custom_inclusions: null,
    is_featured: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    course: fallbackCourses[0],
  },
  {
    id: 's1000000-0000-0000-0000-000000000005',
    course_id: fallbackCourses[2].id,
    session_title: fallbackCourses[2].title,
    display_date: '10x sessions · 1 hour per session',
    display_time: '10x sessions',
    start_date: null,
    end_date: null,
    price_cents: 180000,
    status: 'open',
    telegram_link_override: null,
    poster_url_override: null,
    registration_url_override: null,
    custom_inclusions: ['3 slot per month'],
    is_featured: false,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    course: fallbackCourses[2],
  },
]

export async function getCourses(): Promise<Course[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return fallbackCourses
    }
    return data as Course[]
  } catch {
    return fallbackCourses
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      return fallbackCourses.find(c => c.slug === slug) || null
    }
    return data as Course
  } catch {
    return fallbackCourses.find(c => c.slug === slug) || null
  }
}

export async function getPublicClassSessions(): Promise<ClassSession[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('class_sessions')
      .select('*, course:courses(*)')
      .neq('status', 'archived')
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return fallbackSessions
    }
    return data as ClassSession[]
  } catch {
    return fallbackSessions
  }
}

export async function getClassSessionById(id: string): Promise<ClassSession | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('class_sessions')
      .select('*, course:courses(*)')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) {
      return fallbackSessions.find(s => s.id === id) || null
    }
    return data as ClassSession
  } catch {
    return fallbackSessions.find(s => s.id === id) || null
  }
}

export async function getClassSessionByOffer(offerKey: string): Promise<ClassSession | null> {
  const sessions = await getPublicClassSessions()
  return sessions.find(s => s.course?.slug === offerKey) || null
}
