'use client'

import * as React from 'react'
import Image from 'next/image'
import { Expand, X } from 'lucide-react'

export type FeedbackItem = {
  name: string
  role: string
  image: string
  content: string
}

const INITIAL_COUNT = 6

export function FeedbackGallery({ items }: { items: FeedbackItem[] }) {
  const [expanded, setExpanded] = React.useState(false)
  const [active, setActive] = React.useState<number | null>(null)
  const dialogRef = React.useRef<HTMLDialogElement>(null)
  const hiddenCount = Math.max(items.length - INITIAL_COUNT, 0)

  function open(index: number) {
    setActive(index)
    dialogRef.current?.showModal()
  }

  function close() {
    dialogRef.current?.close()
  }

  const activeItem = active === null ? null : items[active]

  return (
    <>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {items.map((item, index) => (
          <li
            key={item.image}
            className={`surface-card flex flex-col overflow-hidden ${!expanded && index >= INITIAL_COUNT ? 'hidden' : ''}`}
          >
            <button
              type="button"
              onClick={() => open(index)}
              aria-label={`Besarkan screenshot maklum balas ${index + 1}`}
              className="group relative aspect-[4/3] w-full overflow-hidden border-b border-border bg-background"
            >
              <Image
                src={item.image}
                alt=""
                fill
                className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-foreground opacity-90 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <Expand aria-hidden="true" className="size-3" />
                Lihat
              </span>
            </button>
            <div className="flex grow flex-col p-6">
              <blockquote className="grow text-sm leading-relaxed text-[color:var(--color-ink-soft)] sm:text-[0.95rem]">
                &ldquo;{item.content}&rdquo;
              </blockquote>
              <div className="mt-5 border-t border-border pt-4">
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-muted-foreground">{item.role}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {hiddenCount > 0 ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="enroll-outline px-6 text-sm font-semibold"
          >
            {expanded ? 'Tunjuk kurang' : `Lihat semua maklum balas (${hiddenCount} lagi)`}
          </button>
        </div>
      ) : null}

      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
        aria-label="Screenshot maklum balas"
        className="m-auto max-h-[92svh] max-w-[92vw] overflow-visible bg-transparent p-0 backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        {activeItem ? (
          <div className="relative rounded-[var(--radius-md)] border border-border bg-background p-2">
            <button
              type="button"
              onClick={close}
              aria-label="Tutup"
              autoFocus
              className="absolute -right-3 -top-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-lg"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
            <Image
              src={activeItem.image}
              alt={`Screenshot maklum balas daripada ${activeItem.name}`}
              width={1080}
              height={1080}
              className="h-auto max-h-[84svh] w-auto max-w-[min(88vw,48rem)] rounded-[var(--radius-sm)]"
              sizes="(min-width: 640px) 48rem, 88vw"
            />
          </div>
        ) : null}
      </dialog>
    </>
  )
}
