# SECRETS_EXPOSURE Fix Plan

## Changes

No changes required.

## New files

None.

## Verification goals

- [x] `git ls-files .env` returns nothing
- [x] `grep -rn` for secret patterns across all source files returns nothing
- [x] No env var prefixed with NEXT_PUBLIC_, VITE_, or REACT_APP_ contains a secret key
- [x] .env.example exists with placeholder values only

## Manual verification (for the human)

None.
