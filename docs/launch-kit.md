# Econom-IA — Launch Kit

## Core message

**Econom-IA — Tu dinero, entendido por una IA.**

Supporting line:

> Gestioná tus ingresos, gastos y objetivos financieros desde un solo lugar y obtené ayuda de una IA que entiende tu situación.

## Product positioning

Econom-IA combina gestión financiera personal con un AI Copilot. El producto está disponible como experiencia web y aplicación de escritorio basada en Tauri.

### Free

- Gestión financiera y dashboard
- Presupuestos
- Funciones principales
- Hasta 3 consultas de IA por mes
- Sin tarjeta para comenzar

### Pro

- US$9.99 / mes
- Facturación recurrente vía Stripe
- Hasta 1.000 consultas de IA por mes
- Administración de suscripción desde Stripe Customer Portal

## Product Hunt — Maker Comment

I built Econom-IA because I wanted personal finance software to do more than display numbers.

Most financial tools are very good at showing you what happened. I wanted to build something that could also help you understand why it happened and what you could do next.

That led me to build Econom-IA from the ground up with React, Node.js, Supabase and Tauri, with Stripe Billing for the Pro plan. Security became a major part of the project: server-side quota enforcement, authenticated API access, database-level controls, webhook verification and strict separation between the client and privileged services.

Econom-IA is now ready for its first users.

The Free plan lets you explore the product with a limited number of AI queries, while Pro expands the AI usage significantly.

I'm launching it to get real feedback from people who care about personal finance, product design and building useful software.

What would you want a personal finance AI to understand about your money?

## X / Twitter — Launch Thread

### 1/5

🧵 I just launched Econom-IA.

A personal finance app built around one idea:

Your financial dashboard shouldn't just show you numbers.

It should help you understand them.

👇

### 2/5

Econom-IA combines:

📊 Financial tracking
💰 Budgets
🤖 AI Copilot
🔐 Server-side security
💳 Freemium + Pro billing
🖥️ Web + desktop

The goal is simple:

make personal finance easier to understand.

### 3/5

One of the hardest parts wasn't the UI.

It was building the infrastructure behind it.

React + Node.js + Supabase + Stripe + Tauri.

Authentication, quotas, database policies, webhook verification and billing all had to work together.

### 4/5

The AI isn't unlimited.

Free users get 3 AI queries/month.

Pro gets up to 1,000.

That limit exists deliberately: AI has a real infrastructure cost, and abuse protection has to be part of the architecture rather than an afterthought.

### 5/5

🚀 Econom-IA is live.

Try it, break it, criticize it, and tell me what you'd change.

#buildinpublic #SaaS #AI #fintech #webdev

## Reddit — r/SideProject

### I built Econom-IA — personal finance management with an AI Copilot

I've been working on Econom-IA, a personal finance application designed to combine traditional financial tracking with an AI assistant.

The basic idea is simple:

You record your income, expenses and budgets, and then you can ask an AI Copilot questions about your financial situation.

The stack currently includes:

- React
- Node.js / Express
- Supabase / PostgreSQL
- Supabase Auth
- OpenAI
- Stripe Billing
- Tauri for the desktop application

One thing that took much more time than expected was security.

The AI quota isn't enforced only in the frontend. The server controls usage, database functions enforce the quota, Stripe webhooks synchronize billing state, and privileged Supabase operations stay on the backend.

The current model is:

Free — 3 AI queries/month  
Pro — US$9.99/month — up to 1,000 AI queries/month

The project has also gone through multiple rounds of security and architecture review, which exposed interesting problems around database migrations, quota synchronization and deployment scripts.

I'd rather launch with real feedback than keep polishing it forever.

What would you expect from an AI assistant that has access to your personal financial context?

## Visual direction

Palette:

- Navy: `#020617`
- Emerald: `#34D399`
- Cyan: `#22D3EE`
- Violet: `#8B5CF6`
- Slate: `#94A3B8`

Primary visual:

- Real Econom-IA dashboard mockup
- Copilot conversation visible
- Dark navy background
- Emerald/cyan financial graph
- Violet AI accent

## Logo prompt

> A minimalist vector logo icon on a pure white background. The concept is "Neural Growth" for a fintech AI app. An abstract upward trending financial growth curve where the data points along the curve transform into a simple neural network. The design must be extremely clean, modern, and flat. Use a color palette of deep navy blue, bright emerald green, and a subtle electric violet accent. No 3D effects, no gradients, flat vector style. Do not include any text or words, only the abstract symbol.

The repository includes the production SVG mark at `public/brand/econom-ia-neural-growth.svg`.

## Launch checklist

- [ ] Configure Supabase Auth email provider and redirect URL for the production domain.
- [ ] Configure Stripe Product/Price and Customer Portal.
- [ ] Set production backend environment variables.
- [ ] Register Stripe webhook `POST /api/billing/webhook`.
- [ ] Run Supabase migrations against production.
- [ ] Configure Vercel project with the production frontend environment variables.
- [ ] Verify magic-link login on production.
- [ ] Verify Free quota and Pro checkout in Stripe test mode.
- [ ] Verify cancellation at period end and webhook synchronization.
- [ ] Replace placeholder launch links with the production URL.
- [ ] Publish Product Hunt / X / Reddit assets.
