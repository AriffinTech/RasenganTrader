'use client'

import { useState } from 'react'
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react'
import { uploadPosterImage } from '@/actions/storage'

type PosterUploaderProps = {
  initialUrl?: string | null
  fieldName?: string
}

export function PosterUploader({
  initialUrl = null,
  fieldName = 'poster_url_override',
}: PosterUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadPosterImage(formData)
    setUploading(false)

    if (result.error) {
      setError(result.error)
    } else if (result.url) {
      setPreviewUrl(result.url)
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={fieldName} value={previewUrl || ''} />

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {previewUrl ? (
          <div className="relative h-32 w-32 shrink-0 rounded-lg border border-border overflow-hidden bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Poster Preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setPreviewUrl(null)}
              className="absolute top-1 right-1 rounded-full bg-background/80 p-1 text-xs text-destructive hover:bg-background"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-background/50 text-muted-foreground">
            <ImageIcon className="size-8 opacity-40" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <label className="relative inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors">
            {uploading ? (
              <Loader2 className="size-4 animate-spin text-primary" />
            ) : (
              <UploadCloud className="size-4 text-primary" />
            )}
            <span>{uploading ? 'Memuat Naik...' : 'Pilih Fail Poster (JPG, PNG, WebP)'}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              disabled={uploading}
              className="sr-only"
            />
          </label>
          <p className="text-[11px] text-muted-foreground">
            Had saiz maksimum: 5MB. Imej akan dimuat naik ke Supabase Storage secara selamat.
          </p>

          {error ? (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="size-3.5" />
              {error}
            </p>
          ) : null}

          {previewUrl && !uploading ? (
            <p className="text-xs text-primary flex items-center gap-1">
              <CheckCircle2 className="size-3.5" />
              Poster berjaya dimuat naik &amp; sedia disimpan.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
