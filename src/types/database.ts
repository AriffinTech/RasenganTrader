export type ClassStatus =
  | 'upcoming'
  | 'open'
  | 'completed_registering'
  | 'closed'
  | 'archived'

export type DiscountType = 'fixed' | 'percentage'

export type CourseModule = {
  number: string
  title: string
  lessons: string[]
}

export type ExclusiveBonus = {
  title: string
  benefits: string[]
  badge_label?: string
}

export interface Course {
  id: string
  slug: string
  title: string
  category: 'foundation' | 'advanced' | 'coaching' | 'clinic' | 'account'
  educator: string
  description: string
  default_price_cents: number
  default_telegram_link: string | null
  modules: CourseModule[]
  bonuses: string[]
  exclusive_bonus: ExclusiveBonus | null
  poster_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ClassSession {
  id: string
  course_id: string
  session_title: string
  display_date: string
  display_time: string | null
  start_date: string | null
  end_date: string | null
  price_cents: number
  status: ClassStatus
  telegram_link_override: string | null
  poster_url_override: string | null
  registration_url_override: string | null
  custom_inclusions: string[] | null
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
  // Joined relation:
  course?: Course
}

export interface DiscountCode {
  id: string
  code: string
  discount_type: DiscountType
  discount_value: number // Fixed in cents (e.g. 5000 = RM50), percentage in integer (e.g. 15 = 15%)
  course_id: string | null
  class_session_id: string | null
  is_active: boolean
  valid_from: string | null
  valid_until: string | null
  max_uses: number | null
  times_used: number
  created_at: string
  updated_at: string
  // Joined relations:
  course?: Pick<Course, 'id' | 'title' | 'slug'> | null
}

export interface SiteSetting {
  key: string
  value: any
  description: string | null
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  created_at: string
}

export interface PaymentTransaction {
  id: string
  bill_id: string
  status: string
  amount_cents: number
  customer_name?: string | null
  customer_email?: string | null
  customer_phone?: string | null
  reference_1?: string | null
  reference_2?: string | null
  metadata?: any
  processed_at: string
  created_at: string
}
