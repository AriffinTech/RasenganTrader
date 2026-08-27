# CSRF Security Report

## Status: N/A

## Findings

The application does not use cookie-based authenticated sessions. The state-changing endpoint `/api/create-bill` is intended to be called unauthenticated as part of the public checkout flow. Thus, CSRF is not applicable in the traditional sense, though rate-limiting will be applied in another category to protect the endpoint.

## What's at risk

N/A

## What's already secure

No authenticated sessions to forge.

## Recommendations

No action required.
