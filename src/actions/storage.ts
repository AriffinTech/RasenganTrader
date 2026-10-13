'use server'

import crypto from 'crypto'
import { verifyAdminSession } from '@/actions/auth'

type SupportedImageMime = 'image/jpeg' | 'image/png' | 'image/webp'

const MIME_EXTENSION_MAP: Record<SupportedImageMime, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

/**
 * Validates the file buffer's magic bytes to ensure it is genuinely a JPEG, PNG, or WebP image.
 * - JPEG magic bytes: 0xFF, 0xD8, 0xFF
 * - PNG magic bytes:  0x89, 0x50, 0x4E, 0x47
 * - WebP magic bytes: 'RIFF' (0x52, 0x49, 0x46, 0x46) ... 'WEBP' (0x57, 0x45, 0x42, 0x50)
 */
function detectVerifiedImageMime(buffer: Buffer): SupportedImageMime | null {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return 'image/jpeg'
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png'
  }

  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp'
  }

  return null
}

export async function uploadPosterImage(formData: FormData) {
  try {
    // Enforce verified administrator session
    const adminCheck = await verifyAdminSession()
    if (!adminCheck.authorized || !adminCheck.supabase) {
      return { error: adminCheck.error || 'Tidak dibenarkan. Akses pentadbir diperlukan.' }
    }
    const supabase = adminCheck.supabase

    const file = formData.get('file') as File | null
    if (!file || file.size === 0) {
      return { error: 'Tiada fail dipilih.' }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { error: 'Saiz fail melebihi had maksimum 5MB.' }
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Verify magic bytes
    const verifiedMime = detectVerifiedImageMime(buffer)
    if (!verifiedMime) {
      return {
        error: 'Format fail tidak sah atau tidak disokong. Sila muat naik format JPEG, PNG, atau WebP yang sah.',
      }
    }

    // Do NOT use user-supplied file extensions; map strictly from verified MIME
    const ext = MIME_EXTENSION_MAP[verifiedMime]

    // Ensure generated filename is strictly alphanumeric UUID
    const fileUuid = crypto.randomUUID().replace(/[^a-zA-Z0-9]/g, '')
    const fileName = `${fileUuid}${ext}`
    const filePath = `posters/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('class-posters')
      .upload(filePath, buffer, {
        contentType: verifiedMime,
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data: publicUrlData } = supabase.storage
      .from('class-posters')
      .getPublicUrl(filePath)

    return { success: true, url: publicUrlData.publicUrl }
  } catch (err: any) {
    console.error('Upload poster error:', err)
    return { error: err.message || 'Gagal memuat naik imej poster.' }
  }
}
