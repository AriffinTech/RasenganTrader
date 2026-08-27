# SECURITY_HEADERS Fix Plan

## Changes

- `next.config.ts` — Add `headers()` function to inject standard security headers globally.

## New files

None.

## Verification goals

- [ ] All five headers present on every response.
- [ ] Headers set via a single global configuration in Next.js.

## Manual verification (for the human)

- Start the dev server, make a request, and inspect the Network tab to ensure headers are present.
