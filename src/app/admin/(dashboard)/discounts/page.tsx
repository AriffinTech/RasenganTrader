import { getDiscountCodes } from '@/lib/db/discounts'
import { getCourses } from '@/lib/db/courses'
import { DiscountCodeManager } from '@/components/admin/discount-code-manager'

export default async function AdminDiscountsPage() {
  const [discounts, courses] = await Promise.all([
    getDiscountCodes(),
    getCourses(),
  ])

  return <DiscountCodeManager initialDiscounts={discounts} courses={courses} />
}
