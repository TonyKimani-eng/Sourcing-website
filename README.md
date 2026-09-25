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

## Real Authentication and Firestore

This site uses Firebase phone authentication for customer accounts and a separate
anonymous Firebase session for public website chat. Enable Phone and Anonymous
under Authentication, then add these values to `.env.local` for local development:

```text
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
```

For GitHub Pages deployment, add the same keys as repository secrets.

Deploy the database rules with `firebase deploy --only firestore:rules`.

## WhatsApp alerts for website chat

Customer conversations stay in the website and are answered in the admin dashboard.
A Firestore-triggered function sends the owner a WhatsApp Cloud API alert when a
visitor writes, throttled to one alert per chat per minute.

Configure these Firebase Functions secrets, install the function dependencies, and deploy:

```bash
firebase functions:secrets:set WHATSAPP_ACCESS_TOKEN
firebase functions:secrets:set WHATSAPP_PHONE_NUMBER_ID
firebase functions:secrets:set WHATSAPP_TO_NUMBER
cd functions
npm install
cd ..
firebase deploy --only functions:alertWhatsAppForNewWebsiteChat
```

`WHATSAPP_TO_NUMBER` is the owner's WhatsApp number in international format. The
access token and sender phone-number ID come from Meta WhatsApp Cloud API and are
kept out of the static website bundle.

Create and approve a WhatsApp message template named `website_chat_alert` with this
body (three variables in this order):

```text
New Teekay website chat from {{1}} ({{2}}): {{3}} Reply in the admin dashboard.
```

If you use another approved template name or language, set the Firebase parameter
`WHATSAPP_ALERT_TEMPLATE_NAME` or `WHATSAPP_ALERT_TEMPLATE_LANGUAGE` when deploying.
