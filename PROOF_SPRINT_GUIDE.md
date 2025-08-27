# AakiTech Proof Sprint Build Guide  
**Project:** Lathi Tha’ Eyecare – Rapid Prototype (Proof Sprint)  
**Date:** Aug 27, 2025  
**Owner:** AakiTech  

---

## Goal
Deliver a **demo-able prototype** in under 3 hours using **React + Vite**.  
Focus areas:  
1. Mobile-first practice management (invoice flow)  
2. Order tracking (status timeline)  
3. Automated comms (WhatsApp/SMS mock)  

This is **not production code** — it’s a **sales/demo artifact** to show value quickly.  

---

## Scope (What to Prototype)

### 1. Mobile-First Practice Management
- **Scenario:** Optometrist creates invoice while standing with customer at frame display.  
- **UI Components:**  
  - Patient info form (name, age, prescription).  
  - Frame selection dropdown/list.  
  - Lens options (clear, tinted, transitions).  
  - Button → “Generate Invoice.”  
- **Goal:** Show **freedom from desktop**; mobile-first responsive layout.

---

### 2. Order Tracking Dashboard
- **Scenario:** Customer wants to check order progress.  
- **UI Components:**  
  - Order ID input field.  
  - Status timeline:  
    - Eye Test Done  
    - Lens Cutting  
    - Frame Fitting  
    - Courier Pickup  
    - Ready for Collection  
  - Progress indicator (active step highlighted).  
- **Goal:** Mirror “car service updates” experience.  

---

### 3. Automated Comms (WhatsApp Sandbox Integration)
- **Scenario:** Customer receives proactive updates via WhatsApp.  
- **UI Components:**  
  - Card showing WhatsApp-style message preview inside the app.  
  - Example messages:  
    - “Hi [Name], your glasses are now at the *Lens Cutting* stage.”  
    - “Update: Ready for collection at East London branch.”  

- **Integration (Optional):**  
  - Use **Twilio WhatsApp Sandbox** (free developer environment).  
  - Configure sandbox number + connect test phone.  
  - Trigger a live outbound WhatsApp message from the app to a test device.  

- **Steps:**  
  1. Set up Twilio account + activate WhatsApp sandbox.  
  2. Add sandbox credentials to `.env` (e.g. `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE`).  
  3. Install SDK: `npm install twilio`.  
  4. Create a lightweight API route in Vite dev server (Node/Express or serverless function) to call Twilio API.  
  5. From UI → button click triggers API → sends WhatsApp message.  

- **Goal:**  
  - Demo impact: client sees WhatsApp preview in UI **and** gets a real WhatsApp notification on their phone.  
  - Show how this approach reduces SMS costs dramatically.  

---

## Technical Setup
- **Framework:** React (Vite setup)  
- **Styling:** TailwindCSS  
- **Icons/Visuals:** lucide-react (for status icons)  
- **Animations (optional):** framer-motion for transitions  
- **Data:** Hardcoded mock JSON (no backend)  

---

## Deliverable
- A lightweight React app (Vite project) with 3 main views:  
  1. Invoice creation (mobile-first)  
  2. Order tracking timeline  
  3. Comms preview  
- Focus = polished UI, clickable demo, mock data only.  

---

## Guardrails
- Timebox: ≤ 3 hours (single sprint).  
- Prioritize **demo impact over depth**.  
- No backend, no persistence → static mock data only.  
- Keep code clean & modular → easy to extend later.  
- Use client’s language in UI: “car service style,” “angry customers,” “ridiculous SMS costs.”  

---

## Next Steps
1. **Init project:** `npm create vite@latest proof-sprint --template react`  
2. **Install deps:** Tailwind, lucide-react, framer-motion  
3. **Build 3 screens** with mock data & simple navigation.  
4. **Polish for demo** (responsive design, smooth transitions).  
5. **Push to repo** → ready for demo within 3–5 days (externally framed).  

---
