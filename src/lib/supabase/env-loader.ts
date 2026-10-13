import fs from 'fs'
import path from 'path'

let isLoaded = false

/**
 * Ensures that environment variables from .env.local are actively populated in process.env,
 * even if Next.js dev server worker threads were initialized before keys were updated.
 */
export function ensureEnvLoaded(force = false): void {
  // In production builds and deployments, environment variables are injected by the runtime environment
  if (process.env.NODE_ENV === 'production' && !force) return
  if (isLoaded && !force) return

  try {
    const candidates = [
      path.resolve(process.cwd(), '.env.local'),
      path.resolve(process.cwd(), '.env'),
      path.resolve(__dirname, '../../../.env.local'),
      path.resolve(__dirname, '../../../../.env.local'),
      'C:\\Users\\Acer\\Downloads\\Rasengan Trader\\.env.local',
    ]

    for (const envPath of candidates) {
      if (fs.existsSync(/*turbopackIgnore: true*/ envPath)) {
        const content = fs.readFileSync(/*turbopackIgnore: true*/ envPath, 'utf8')
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith('#')) continue
          const idx = trimmed.indexOf('=')
          if (idx > 0) {
            const key = trimmed.slice(0, idx).trim()
            let val = trimmed.slice(idx + 1).trim()
            if (
              (val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))
            ) {
              val = val.slice(1, -1)
            }
            if (val) {
              // Always synchronize with .env.local in development
              process.env[key] = val
            }
          }
        }
        isLoaded = true
        break
      }
    }
  } catch (err) {
    console.error('ensureEnvLoaded error:', err)
  }
}
