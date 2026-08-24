import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

type EnrollmentLinkProps = {
  children: React.ReactNode
  className?: string
  variant?: 'solid' | 'outline'
  showIcon?: boolean
}

export function EnrollmentLink({
  children,
  className,
  variant = 'solid',
  showIcon = true,
}: EnrollmentLinkProps) {
  const baseClass = variant === 'solid' ? 'enroll-solid' : 'enroll-outline'

  return (
    <Link href="/register" className={cn(baseClass, className)}>
      {children}
      {showIcon ? <ArrowUpRight aria-hidden="true" className="size-4" /> : null}
    </Link>
  )
}
