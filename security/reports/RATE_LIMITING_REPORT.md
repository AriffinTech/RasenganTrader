# RATE_LIMITING Security Report

## Status: HIGH

## Findings

The primary API route `/api/create-bill` initiates a bill creation process on a third-party gateway (Billplz). Currently, there is no rate limiting on this endpoint. An attacker could rapidly submit the registration form, causing the server to spawn thousands of requests to Billplz, potentially exhausting API quotas, incurring costs, or causing a denial of service.

## What's at risk

- Billplz API quota exhaustion.
- Potential abuse of the Telegram notification system (spamming the bot).
- Denial of Service (DoS) attacks on the application's backend.

## What's already secure

Nothing at the endpoint level.

## Recommendations

Implement a basic rate limiter on the `/api/create-bill` route to restrict the number of requests a single IP address can make within a given time window (e.g., 5 requests per minute).
