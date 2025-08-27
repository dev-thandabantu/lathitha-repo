# Proof Sprint - Lathi Tha' Eyecare

Lightweight Vite + React demo for rapid prototyping.

Quick start (Windows PowerShell):

```powershell
npm install
npm run dev
```

Notes:
- Mobile-first UI but styled to work on desktop as well.
- TailwindCSS is used for styles. If Tailwind CLI reports errors about unknown `@tailwind` rules, ensure `postcss` is configured and that you installed `tailwindcss`.
- To enable Twilio WhatsApp sending, create a server route and add `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE` in `.env`.
