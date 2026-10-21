'use client'

import { useTransition } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { moveClassSession } from '@/actions/classes'

export function ReorderClassButtons({
  id,
  index,
  total,
}: {
  id: string
  index: number
  total: number
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={isPending || index === 0}
        onClick={() => {
          startTransition(async () => {
            await moveClassSession(id, 'up')
          })
        }}
        title="Pindah ke atas"
        className="rounded border border-border bg-background p-1.5 text-xs text-foreground hover:bg-secondary disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
      >
        <ArrowUp className="size-3.5" />
      </button>

      <button
        type="button"
        disabled={isPending || index === total - 1}
        onClick={() => {
          startTransition(async () => {
            await moveClassSession(id, 'down')
          })
        }}
        title="Pindah ke bawah"
        className="rounded border border-border bg-background p-1.5 text-xs text-foreground hover:bg-secondary disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
      >
        <ArrowDown className="size-3.5" />
      </button>
    </div>
  )
}
