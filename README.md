# Proof Sprint - Lathi Tha' Eyecare

Lightweight Vite + React demo for rapid prototyping.

Quick start (Windows PowerShell):

# Proof Sprint — Lathi Tha' Eyecare (demo)

Compact demo app (Vite + React + Tailwind) that showcases mobile-first invoice creation, order tracking, and a small WhatsApp comms PoC.

Status: Proof-of-Concept (local demo)

Features
- Mobile-first invoice editor (print / PDF)
- Public customer tracking page
- Staff comms UI to send WhatsApp updates (Meta Cloud preferred, Twilio fallback)
- File-backed demo server and inventory CRUD

Prerequisites
- Node.js (18+ recommended)
- npm

Quick start (PowerShell)

1) Install

```powershell
cd 'C:\Users\User\source\repos\aakitech\lathitha repo'
npm install
```

2) Start server + frontend (recommended)

```powershell
npm run dev:all
```

Alternatively:

```powershell
npm run server   # start demo Express server only
npm run dev      # start frontend only (Vite)
```

Environment
- Copy `.env.example` -> `.env` and add any provider credentials you want to test:
	- Meta WhatsApp Cloud: `WA_PHONE_NUMBER_ID`, `WA_ACCESS_TOKEN`
	- Twilio fallback: `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`

Project layout
- `src/` — React front-end
- `server/` — demo Express server
- `server/data/` — file-backed JSON stores (inventory, messages)

Dev notes
- The Comms UI now sends a polished text message (order id + tracking link). The server persists messages into `server/data/messages.json` for demo inspection.
- `npm run dev:all` uses `scripts/start-dev.cjs` to wait for the server before starting Vite to avoid proxy ECONNREFUSED errors.
