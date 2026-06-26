# E-Commerce Platform

A full-stack e-commerce platform built with a microservices architecture and event-driven communication via Apache Kafka.

## Overview

The project consists of 5 backend microservices, 2 Next.js frontends, and a shared packages layer — all managed in a pnpm monorepo with Turborepo.

```
apps/
├── auth-service       # User management (Express)
├── product-service    # Product & category CRUD (Express)
├── order-service      # Order management & analytics (Fastify)
├── payment-service    # Stripe payment processing (Hono)
├── email-service      # Event-driven email notifications
├── client             # Customer storefront (Next.js)
└── admin              # Admin dashboard (Next.js)

packages/
├── kafka              # Shared Kafka client
├── product-db         # Prisma + PostgreSQL
├── order-db           # Mongoose + MongoDB
└── types              # Shared TypeScript types & Zod schemas
```

## Tech Stack

**Backend:** Node.js, TypeScript, Express.js, Fastify, Hono, Apache Kafka (KafkaJS), PostgreSQL (Prisma), MongoDB (Mongoose), Stripe, Clerk, Nodemailer

**Frontend:** Next.js 15, React 19, TailwindCSS, Shadcn/ui, Zustand, React Query, React Hook Form, Zod, Recharts, Stripe Elements

**Tooling:** pnpm, Turborepo, Docker (Kafka cluster)

## Features

- **Product catalog** — browsing, filtering by category/search/price, sorting
- **Shopping cart** — persistent cart state with Zustand
- **Checkout & payments** — Stripe-powered checkout with webhook handling
- **Order management** — per-user order history and admin order overview
- **Order analytics** — monthly charts (last 6 months) in the admin dashboard
- **Admin dashboard** — manage products, categories, users, and orders
- **Authentication** — Clerk-based auth with role system (`user` / `admin`)
- **Event-driven messaging** — Kafka events connect services loosely:
  - `user.created` → welcome email
  - `product.created / deleted` → Stripe product sync
  - `payment.successful` → order creation
- **Email notifications** — welcome and order confirmation emails via Nodemailer

## Service Ports

| Service         | Port |
|-----------------|------|
| Product Service | 8000 |
| Order Service   | 8001 |
| Payment Service | 8002 |
| Auth Service    | 8003 |
| Client          | 3002 |
| Admin           | 3003 |
| Kafka UI        | 8080 |
