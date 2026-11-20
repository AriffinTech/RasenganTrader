'use client'

import * as React from 'react'

import { EnrollmentLink } from '@/components/enrollment-link'

type MobileCtaProps = {
  title: string
  detail?: string
  /** When registration is not open, link to the schedule instead of the form. */
  enrollOpen: boolean
}

/**
 * Sticky enrol bar for small screens. Shows after the hero scrolls away and
 * hides while the schedule (which has its own CTAs) or the footer is on screen.
 */
export function MobileCta({ title, detail, enrollOpen }: MobileCtaProps) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const hero = document.querySelector('[data-hero]')
    const blockers = [document.getElementById('jadual'), document.querySelector('footer')].filter(Boolean) as Element[]
    const state = { pastHero: false, blocked: new Set<Element>() }

    const update = () => setVisible(state.pastHero && state.blocked.size === 0)

    const heroObserver = new IntersectionObserver(([entry]) => {
      state.pastHero = !entry.isIntersecting
      update()
    })
    const blockObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) state.blocked.add(entry.target)
        else state.blocked.delete(entry.target)
      }
      update()
    })

    if (hero) heroObserver.observe(hero)
    blockers.forEach((el) => blockObserver.observe(el))
    return () => {
      heroObserver.disconnect()
      blockObserver.disconnect()
    }
  }, [])

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          {detail ? <p className="truncate font-mono text-xs text-muted-foreground">{detail}</p> : null}
        </div>
        {enrollOpen ? (
          <EnrollmentLink offer="fast-track" className="shrink-0 px-4 text-sm font-semibold">
            Daftar
          </EnrollmentLink>
        ) : (
          <a href="#jadual" className="enroll-solid shrink-0 px-4 text-sm font-semibold">
            Lihat jadual
          </a>
        )}
      </div>
    </div>
  )
}
