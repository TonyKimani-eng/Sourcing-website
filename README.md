# Teekay Sourcing & Shipping

A modern responsive landing page for a China-to-Kenya sourcing and freight service, built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

Install Node.js 18.17 or newer, then run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Edit Site Content

Most landing page copy, rates, FAQ items, services, and contact links live in:

```text
data/site.ts
```

## Build

```bash
npm run build
```

## Real Authentication

This site uses Firebase Authentication for email/password sign in and sign up.
Create a Firebase project, enable Email/Password under Authentication, then add
these values to `.env.local` for local development:

```text
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

For GitHub Pages deployment, add the same keys as repository secrets.
