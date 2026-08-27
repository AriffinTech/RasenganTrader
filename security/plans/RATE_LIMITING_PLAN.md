# RATE_LIMITING Fix Plan

## Changes

- `src/app/api/create-bill/route.ts` — Import a simple rate-limiting utility and wrap the handler to enforce a limit (e.g., 5 requests per IP per minute). Return `429 Too Many Requests` when the limit is exceeded.

## New files

- `src/lib/rate-limit.ts` — A simple in-memory rate limiter using a `Map` to track IP request counts over time.

## Verification goals

- [ ] The `create-bill` endpoint blocks requests after the configured limit.
- [ ] Rate-limited requests return status `429`.

## Manual verification (for the human)

- Submit the form rapidly more than 5 times and ensure the UI shows an error and the network tab shows a 429 response.
