'use client'

import { Trash2 } from 'lucide-react'
import { deleteClassSession } from '@/actions/classes'

export function DeleteClassButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        await deleteClassSession(id)
      }}
      onSubmit={(e) => {
        if (!confirm('Adakah anda pasti mahu memadam sesi kelas ini?')) {
          e.preventDefault()
        }
      }}
    >
      <button
        type="submit"
        aria-label="Padam sesi kelas"
        className="rounded border border-destructive/20 bg-destructive/10 px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
      >
        <Trash2 className="size-3.5" />
      </button>
    </form>
  )
}
