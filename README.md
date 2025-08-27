# Proof Sprint - Lathi Tha' Eyecare

Lightweight Vite + React demo for rapid prototyping.

Quick start (Windows PowerShell):

```powershell
npm install
npm run dev
```

Local Twilio demo server (optional):

1. Copy `.env.example` to `.env` and fill in your Twilio credentials (TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM).
2. Start the demo server:

```powershell
node server/index.js
```

3. The UI will try to POST to `/send-whatsapp` (same host) — when running Vite in dev mode it proxies to the same origin by default for relative paths. If you run the server on a different port, configure a proxy in `vite.config.js` or call the server directly.

Notes:
- Mobile-first UI but styled to work on desktop as well.
- TailwindCSS is used for styles. If Tailwind CLI reports errors about unknown `@tailwind` rules, ensure `postcss` is configured and that you installed `tailwindcss`.
- To enable Twilio WhatsApp sending, create a server route and add `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` in `.env`.
