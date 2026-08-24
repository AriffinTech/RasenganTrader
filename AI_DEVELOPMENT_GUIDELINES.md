# AI-Friendly Full-Stack Development Stack

Use this as the **default technology stack and implementation standard** when building websites, web apps, dashboards, internal tools, SaaS products, client portals, or custom software.

The goal is to use technologies that are:

* Easy for AI coding agents to understand and modify
* Fast to build with
* Production-ready
* Maintainable
* Scalable without unnecessary complexity
* Easy to deploy
* Supported by strong documentation and ecosystems

Do not introduce another framework, library, database, or infrastructure service unless there is a clear technical reason.

---

## 🚀 Frontend & Core Framework

### Next.js

Use:

* **Next.js**
* **App Router**
* **TypeScript**
* React Server Components where appropriate
* Server Actions where they simplify backend operations

Next.js should be the default framework unless the project specifically requires something else.

Prefer the standard structure:

```text
/app
/components
/components/ui
/lib
/hooks
/types
/public
```

Keep routing predictable using the App Router.

Example:

```text
app/
├── page.tsx
├── about/
│   └── page.tsx
├── services/
│   └── page.tsx
├── dashboard/
│   └── page.tsx
└── api/
```

Do not over-engineer the folder structure.

---

## 🎨 Styling

### Tailwind CSS

Use **Tailwind CSS** as the primary styling system.

Prefer Tailwind utility classes instead of creating large custom CSS files.

Use reusable components when the same styling pattern appears multiple times.

Avoid:

* Excessive inline styles
* Large global stylesheets
* Random hardcoded CSS values
* Duplicate styling across components

Use responsive Tailwind classes from the beginning.

Example:

```tsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
```

Every interface should work properly on:

* Mobile
* Tablet
* Desktop

---

## 🧩 UI Components

### shadcn/ui

Use **shadcn/ui** as the default component system.

Preferred location:

```text
/components/ui
```

Use shadcn components for common interface elements such as:

* Buttons
* Inputs
* Forms
* Dialogs
* Dropdowns
* Tables
* Tabs
* Cards
* Sheets
* Navigation
* Toasts
* Command menus

Customize these components using Tailwind rather than rebuilding basic UI primitives unnecessarily.

### v0

v0-generated components may be used as:

* UI inspiration
* Layout starting points
* Component scaffolding

When importing generated UI, adapt it to the project's:

* Existing design system
* Data model
* Components
* Naming conventions
* Responsive behavior

Never blindly paste generated components without integrating them properly.

---

# 🗄️ Backend & Database

## Supabase

Use **Supabase** as the default backend when the application requires:

* PostgreSQL database
* Authentication
* User accounts
* File storage
* Realtime functionality
* Row Level Security
* Server-side database operations

Supabase should normally handle:

```text
Database
Authentication
Storage
Realtime
Authorization
```

instead of adding separate services for each feature.

Use the official Supabase JavaScript/TypeScript client.

---

## PostgreSQL

Treat PostgreSQL as the primary relational database.

Design the database properly instead of storing everything inside JSON fields.

Prefer:

* Clear tables
* Proper foreign keys
* Constraints
* Timestamps
* Indexes where necessary
* Consistent naming

Example naming:

```text
users
projects
clients
orders
payments
messages
```

Prefer:

```text
snake_case
```

for database fields.

Example:

```text
created_at
updated_at
client_id
payment_status
```

---

# 🔐 Authentication

Use **Supabase Auth** by default.

Support whichever authentication methods make sense for the project, such as:

* Email + password
* Magic link
* Google OAuth

Authentication alone is not authorization.

Always verify that users are allowed to access the requested resource.

---

# 🛡️ Security

## Row Level Security

Enable **Row Level Security (RLS)** for user-sensitive Supabase tables.

Never rely only on frontend restrictions.

For example, a user should not be able to change:

```text
/client/123
```

to:

```text
/client/124
```

and access someone else's information.

Authorization must be enforced at the database or server level.

---

## Environment Variables

Secrets must be stored in environment variables.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Never:

* Hardcode API keys
* Commit secrets
* Expose service-role keys to the browser
* Put private credentials inside components

Use:

```text
.env.local
```

for local secrets.

---

# 📦 File Storage

Use **Supabase Storage** when the application needs:

* Images
* Documents
* User uploads
* Receipts
* PDFs
* Profile pictures
* Client assets

Store the file itself in storage and store its relevant metadata/path in PostgreSQL.

Do not store large files directly inside database fields.

---

# 📝 Forms & Validation

Use:

* **React Hook Form**
* **Zod**

for complex forms.

All important input must be validated.

Prefer sharing Zod schemas between frontend and server where practical.

Example:

```ts
const clientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})
```

Never trust frontend validation alone.

Validate again on the server for important operations.

---

# 🔄 Data Fetching

Choose the simplest appropriate method.

Prefer:

1. Server Components for server-side data requirements
2. Server Actions for mutations and forms
3. Supabase server client for protected queries
4. Client-side fetching only when interactive/realtime behavior requires it

Do not automatically use client components everywhere.

Only add:

```tsx
"use client"
```

when the component genuinely requires browser-side functionality such as:

* State
* Effects
* Browser APIs
* Interactive UI
* Client-side event handlers

---

# 🧠 State Management

Start with React's built-in state management.

Use:

```text
useState
useReducer
Context
URL/search params
```

before adding another state management library.

Only introduce tools such as Zustand when application-wide state genuinely requires them.

Do not install Redux or another large state library by default.

---

# 🌐 API & Server Architecture

Prefer **Server Actions** for straightforward application mutations.

Use Next.js Route Handlers when a real API endpoint is appropriate.

Example:

```text
app/api/webhooks/route.ts
app/api/payments/route.ts
app/api/integrations/route.ts
```

Route Handlers are especially suitable for:

* Webhooks
* External integrations
* Public APIs
* Payment callbacks
* Third-party services

Keep sensitive logic server-side.

---

# 🔌 Third-Party Integrations

When connecting external services:

1. Use the official SDK/API where practical.
2. Read current documentation before implementation.
3. Keep credentials server-side.
4. Validate incoming webhook signatures.
5. Handle API failures gracefully.
6. Do not expose secret keys to client components.

Examples may include:

```text
WhatsApp
payment gateways
Ninja Van
email providers
AI APIs
CRM systems
accounting systems
```

Create integrations as isolated modules where possible.

Example:

```text
lib/
├── supabase/
├── payments/
├── whatsapp/
├── shipping/
└── ai/
```

---

# 🤖 AI Features

When AI functionality is required, isolate it from the main application logic.

Example:

```text
lib/ai/
├── client.ts
├── prompts.ts
├── schemas.ts
└── actions.ts
```

Keep prompts reusable instead of scattering large prompt strings across components.

Where possible, request structured output and validate it using Zod.

Do not allow AI-generated output to directly execute dangerous database or system actions without validation.

---

# 💳 Payments

Do not build payment-processing logic manually when an established payment provider can handle it.

Payment architecture should generally follow:

```text
User
↓
Checkout / Payment Provider
↓
Webhook
↓
Server verifies webhook
↓
Database updated
↓
UI reflects new status
```

Never treat a frontend success page alone as proof that payment succeeded.

Verify payment status through the provider or authenticated webhook.

---

# 📧 Email & Notifications

Create notification functionality as a reusable service.

Example:

```text
lib/notifications/
```

Separate:

* Trigger logic
* Message/template content
* Provider-specific implementation

This makes providers easier to replace later.

---

# 📊 Analytics & Error Monitoring

For production applications, consider adding:

* Vercel Analytics
* PostHog
* Sentry

Only add them when useful to the project's requirements.

Important production errors should not rely solely on:

```ts
console.log()
```

---

# 🚀 Deployment

## Vercel

Use **Vercel** as the default deployment platform for Next.js unless the project requires different infrastructure.

Recommended workflow:

```text
GitHub
↓
Vercel
↓
Production
```

Maintain separate configuration where useful for:

```text
Development
Preview
Production
```

---

# 🔄 Version Control

Use Git.

Prefer GitHub for repository hosting.

Before significant changes:

* Understand the existing implementation
* Avoid unnecessarily rewriting working code
* Keep commits focused
* Preserve functioning features

Do not delete or replace major sections simply because another implementation looks cleaner.

---

# 📦 Package Management

Use one package manager consistently.

Preferred:

```text
pnpm
```

Alternatively use the package manager already present in the project.

Do not mix:

```text
npm
pnpm
yarn
bun
```

inside the same project without a strong reason.

---

# 🏗️ Architecture Principle

Always choose:

> The simplest architecture that reliably solves the current problem while leaving a reasonable path to scale.

Do not build enterprise-level architecture for a simple client website.

For example:

### Simple company website

```text
Next.js
Tailwind
shadcn/ui
Vercel
```

### Website with database/forms

```text
Next.js
Tailwind
shadcn/ui
Supabase
Vercel
```

### Full web application

```text
Next.js
TypeScript
Tailwind
shadcn/ui
Supabase
React Hook Form
Zod
Vercel
```

Additional services should only be introduced when their functionality is actually required.

---

# 🧱 Component Rules

Prefer small reusable components.

Example:

```text
components/
├── navbar.tsx
├── footer.tsx
├── hero.tsx
├── service-card.tsx
└── contact-form.tsx
```

Avoid single page files containing thousands of lines.

However, do not create dozens of tiny components unnecessarily.

Extract a component when:

* It is reused
* It represents a meaningful UI section
* It significantly improves readability

---

# 🎨 Design Quality

The interface must look intentionally designed.

Avoid the stereotypical AI-generated website appearance:

* Excessive gradients
* Excessive glowing effects
* Giant rounded cards everywhere
* Random glassmorphism
* Too many animations
* Huge generic hero text
* Repetitive three-card sections
* Emojis used as interface icons

Prefer:

* Strong typography
* Clear visual hierarchy
* Proper spacing
* Consistent border radius
* High-quality imagery
* Subtle interaction
* Good content structure

Use **Lucide React** for interface icons unless the project already uses another icon library.

---

# ✨ Animation

Use animation only when it improves the experience.

Preferred options:

* CSS/Tailwind transitions
* Motion / Framer Motion when more advanced animation is genuinely needed

Animations should generally be:

* Subtle
* Fast
* Purposeful

Do not animate everything.

---

# ♿ Accessibility

Follow basic accessibility standards.

Ensure:

* Images have appropriate `alt` text
* Inputs have labels
* Buttons have meaningful text or accessible labels
* Keyboard navigation works
* Semantic HTML is used
* Text contrast is readable

Prefer:

```html
<header>
<nav>
<main>
<section>
<footer>
```

instead of using `<div>` for everything.

---

# ⚡ Performance

Prioritize performance by default.

Use:

* `next/image`
* `next/font`
* Lazy loading where appropriate
* Server Components
* Optimized assets

Avoid:

* Huge client-side bundles
* Unnecessary JavaScript libraries
* Unoptimized images
* Loading massive datasets into the browser

---

# 🔍 SEO

For public-facing websites, configure:

* Metadata
* Page titles
* Descriptions
* Open Graph metadata
* Sitemap
* robots.txt
* Semantic headings

Use Next.js metadata APIs.

Each important page should have meaningful metadata rather than identical default titles.

---

# 🗂️ Project Context

Every significant project should contain a context document such as:

```text
PROJECT_CONTEXT.md
```

It should explain:

```text
Project purpose
Business context
Target users
Technology stack
Pages/routes
Database structure
Features
Integrations
Design direction
Important business rules
Completed features
Pending work
Known issues
Important decisions
```

AI agents should read this document before making major changes.

Update it whenever major architecture or business rules change.

---

# 📚 Documentation

Important implementation decisions should be documented.

Do not make future AI agents reverse-engineer important business rules from code if a short explanation can prevent confusion.

Useful files may include:

```text
README.md
PROJECT_CONTEXT.md
DATABASE.md
INTEGRATIONS.md
```

Do not create documentation files unnecessarily for tiny projects.

---

# 🧪 Testing & Verification

Do not consider a feature complete merely because the code was generated.

After implementation:

1. Check TypeScript errors.
2. Check linting.
3. Build the project.
4. Test the affected user flow.
5. Test mobile responsiveness.
6. Test loading/error states.
7. Confirm existing features still work.

When relevant, run:

```bash
pnpm lint
pnpm build
```

Fix errors rather than hiding or suppressing them.

---

# 🚨 Error Handling

Every important asynchronous operation must account for:

```text
Loading
Success
Empty state
Failure
```

User-facing failures should produce understandable messages.

Do not expose raw stack traces or sensitive system information to users.

---

# 🧭 AI Coding Agent Workflow

Before writing code, the AI should:

1. Read the repository structure.
2. Read `package.json`.
3. Read relevant context/documentation files.
4. Identify the existing stack.
5. Inspect related components before modifying them.
6. Understand how data currently flows.
7. Determine whether an existing component/function can be reused.

Then provide a short implementation plan for non-trivial changes.

Only after understanding the project should implementation begin.

---

# 🚫 Do Not Blindly Rewrite

When working inside an existing project:

**Preserve all existing information, functionality and business logic unless explicitly instructed otherwise.**

Do not:

* Replace entire pages unnecessarily
* Remove working features
* Rename important routes without reason
* Change database schemas casually
* Remove content supplied by the user/client
* Replace real information with placeholder content

Make targeted changes.

---

# 🧠 Never Hallucinate Project Information

Never invent:

* Business information
* Prices
* Contact information
* Customer testimonials
* Statistics
* Product descriptions
* API credentials
* Database fields
* Client requirements

If information is unavailable, use clearly identified placeholders or leave the field incomplete.

Existing project files and supplied client information are the source of truth.

---

# 🔎 Source of Truth Priority

When conflicting information exists, use this priority:

```text
1. Explicit current user instruction
2. PROJECT_CONTEXT.md / project specification
3. Existing database/business rules
4. Existing working application behavior
5. Existing code
6. Assumptions
```

Avoid assumptions whenever possible.

---

# 🧹 Dependency Discipline

Before installing a package:

1. Check whether the project already contains something that solves the problem.
2. Determine whether the functionality can reasonably be implemented without another dependency.
3. Install the package only if it meaningfully simplifies or improves the solution.

Do not install packages simply because they are popular.

---

# ✅ Definition of Done

A task is only complete when:

* The requested feature works
* Existing functionality remains intact
* TypeScript has no relevant errors
* No obvious console/runtime errors remain
* Responsive behavior is correct
* Loading and error states are handled where necessary
* Sensitive information remains server-side
* Database access is secure
* The implementation follows the existing design system
* Any relevant project documentation has been updated

---

# Default Stack Summary

Unless the project requirements dictate otherwise, use:

```text
Framework:        Next.js App Router
Language:         TypeScript
UI:               React
Styling:          Tailwind CSS
Components:       shadcn/ui
Icons:            Lucide React
Database:         Supabase PostgreSQL
Authentication:   Supabase Auth
Storage:          Supabase Storage
Validation:       Zod
Forms:            React Hook Form
Hosting:          Vercel
Repository:       GitHub
Package Manager:  pnpm
```

## Final Rule

Do not add complexity for its own sake.

Prioritize:

> **Working software → clean implementation → security → maintainability → scalability → cleverness.**

When there are multiple valid solutions, choose the one that is easiest for another developer or AI coding agent to understand, maintain, and extend.
