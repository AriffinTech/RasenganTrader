import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import type { RegistrationOfferKey } from '@/lib/course'

type EnrollmentLinkProps = {
  children: React.ReactNode
  className?: string
  variant?: 'solid' | 'outline'
  showIcon?: boolean
  offer?: RegistrationOfferKey
}

export function EnrollmentLink({
  children,
  className,
  variant = 'solid',
  showIcon = true,
  offer = 'course',
}: EnrollmentLinkProps) {
  const baseClass = variant === 'solid' ? 'enroll-solid' : 'enroll-outline'

  return (
    <Link href={'/register?offer=' + offer} className={cn(baseClass, className)}>
      {children}
      {showIcon ? <ArrowUpRight aria-hidden="true" className="size-4" /> : null}
    </Link>
  )
}
