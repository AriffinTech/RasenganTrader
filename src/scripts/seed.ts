/**
 * Database Seed Script for RasenganTrader
 * Migrates existing course and schedule data from src/lib/course.ts into Supabase PostgreSQL.
 *
 * Usage:
 * npx tsx src/scripts/seed.ts
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { courseOffer, saham101Offer, personalCoachingOffer, tradingClinicOnlineOffer, tradingClinicF2FOffer } from '../lib/course'

// Automatically load .env.local or .env if present
function loadEnv() {
  const envFiles = ['.env.local', '.env']
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file)
    if (fs.existsSync(fullPath)) {
      try {
        if (typeof process.loadEnvFile === 'function') {
          process.loadEnvFile(fullPath)
        } else {
          const content = fs.readFileSync(fullPath, 'utf8')
          for (const line of content.split('\n')) {
            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith('#')) continue
            const idx = trimmed.indexOf('=')
            if (idx > 0) {
              const key = trimmed.slice(0, idx).trim()
              const val = trimmed.slice(idx + 1).trim()
              if (!process.env[key]) {
                process.env[key] = val
              }
            }
          }
        }
      } catch {}
    }
  }
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('\n❌ Ralat: Kredensial Supabase belum diisi dalam .env.local.')
  console.log('Sila pastikan nilai berikut diisi dalam fail `.env.local`:')
  console.log('  NEXT_PUBLIC_SUPABASE_URL=https://[projek-anda].supabase.co')
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key-anda]')
  console.log('  SUPABASE_SERVICE_ROLE_KEY=[service-role-key-anda]\n')
}

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

async function seed() {
  if (!supabase) {
    console.error('Supabase client tidak dapat dimulakan kerana URL atau Service Role Key kosong.')
    return
  }

  console.log('--- Starting RasenganTrader Seed ---')

  // 1. Seed Courses
  const coursesToSeed: any[] = [
    {
      slug: 'fast-track',
      title: courseOffer.title,
      category: 'advanced',
      educator: courseOffer.educator,
      description: 'Kursus lengkap dari konsep sehingga execution untuk trader yang telah mempunyai ilmu asas trading.',
      default_price_cents: 49900,
      default_telegram_link: 'https://t.me/+Bc8UkVt2yHMzMzRl',
      modules: courseOffer.modules,
      bonuses: courseOffer.bonuses,
      exclusive_bonus: courseOffer.exclusiveBonus,
      is_active: true,
      sort_order: 1,
    },
    {
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
          lessons: saham101Offer.topics,
        },
      ],
      bonuses: saham101Offer.bonuses,
      exclusive_bonus: saham101Offer.exclusiveBonus,
      is_active: true,
      sort_order: 2,
    },
    {
      slug: 'personal-coaching',
      title: personalCoachingOffer.title,
      category: 'coaching',
      educator: 'Dr Hanis Hanafi',
      description: '1-1 personal online coaching bersama RasenganTrader mengikut pace anda.',
      default_price_cents: 180000,
      default_telegram_link: 'https://t.me/HanishanafiRT',
      modules: [],
      bonuses: personalCoachingOffer.inclusions,
      exclusive_bonus: null,
      is_active: true,
      sort_order: 3,
    },
    {
      slug: 'trading-clinic-online',
      title: tradingClinicOnlineOffer.title,
      category: 'clinic',
      educator: 'Dr Hanis Hanafi',
      description: '1-1 online personal coaching bersama RasenganTrader selama 1 jam.',
      default_price_cents: 12000,
      default_telegram_link: 'https://t.me/HanishanafiRT',
      modules: [],
      bonuses: tradingClinicOnlineOffer.topics,
      exclusive_bonus: null,
      is_active: true,
      sort_order: 4,
    },
    {
      slug: 'trading-clinic-f2f',
      title: tradingClinicF2FOffer.title,
      category: 'clinic',
      educator: 'Dr Hanis Hanafi',
      description: 'Face to face personal coaching di JB selama 1 jam.',
      default_price_cents: 18000,
      default_telegram_link: 'https://t.me/HanishanafiRT',
      modules: [],
      bonuses: tradingClinicF2FOffer.topics,
      exclusive_bonus: null,
      is_active: true,
      sort_order: 5,
    },
  ]

  for (const course of coursesToSeed) {
    const { data, error } = await supabase
      .from('courses')
      .upsert(course, { onConflict: 'slug' })
      .select()

    if (error) {
      console.error(`Failed to upsert course ${course.slug}:`, error.message)
    } else {
      console.log(`Upserted course: ${course.title} (ID: ${data[0]?.id})`)
    }
  }

  // 2. Query seeded courses to map session IDs
  const { data: allCourses } = await supabase.from('courses').select('id, slug')
  const courseMap = new Map((allCourses || []).map((c: any) => [c.slug, c.id]))

  // 3. Seed Class Sessions
  const sessionsToSeed: any[] = [
    {
      course_id: courseMap.get('saham-101'),
      session_title: saham101Offer.title,
      display_date: `${saham101Offer.date} · ${saham101Offer.time}`,
      display_time: saham101Offer.time,
      price_cents: 19900,
      status: 'open',
      sort_order: 1,
    },
    {
      course_id: courseMap.get('trading-clinic-online'),
      session_title: tradingClinicOnlineOffer.title,
      display_date: 'By appointment · 1 hour per session',
      display_time: '1 hour per session',
      price_cents: 12000,
      status: 'open',
      sort_order: 2,
    },
    {
      course_id: courseMap.get('trading-clinic-f2f'),
      session_title: tradingClinicF2FOffer.title,
      display_date: 'By appointment · 1 hour per session',
      display_time: '1 hour per session',
      price_cents: 18000,
      status: 'open',
      sort_order: 3,
    },
    {
      course_id: courseMap.get('fast-track'),
      session_title: courseOffer.title,
      display_date: courseOffer.nextClass,
      price_cents: 49900,
      status: 'upcoming',
      is_featured: true,
      sort_order: 4,
    },
    {
      course_id: courseMap.get('personal-coaching'),
      session_title: personalCoachingOffer.title,
      display_date: '10x sessions · 1 hour per session',
      display_time: '10x sessions',
      price_cents: 180000,
      status: 'open',
      custom_inclusions: ['3 slot per month'],
      sort_order: 5,
    },
  ]

  for (const session of sessionsToSeed) {
    if (!session.course_id) continue
    const { data: existing } = await supabase
      .from('class_sessions')
      .select('id')
      .eq('course_id', session.course_id)
      .eq('session_title', session.session_title)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase
        .from('class_sessions')
        .update(session)
        .eq('id', existing.id)
      if (error) {
        console.error(`Failed to update session ${session.session_title}:`, error.message)
      } else {
        console.log(`Updated existing session: ${session.session_title}`)
      }
    } else {
      const { error } = await supabase.from('class_sessions').insert(session)
      if (error) {
        console.error(`Failed to insert session:`, error.message)
      } else {
        console.log(`Inserted session: ${session.session_title}`)
      }
    }
  }

  // 4. Seed an initial discount code
  const initialDiscount: any = {
    code: 'RASENGAN50',
    discount_type: 'fixed',
    discount_value: 5000, // RM50
    is_active: true,
  }

  const { error: discountError } = await supabase
    .from('discount_codes')
    .upsert(initialDiscount, { onConflict: 'code' })

  if (discountError) {
    console.error('Failed to seed discount code:', discountError.message)
  } else {
    console.log('Seeded sample promo code: RASENGAN50 (RM50 OFF)')
  }

  console.log('--- Seed Completed Successfully ---')
}

seed().catch(console.error)
