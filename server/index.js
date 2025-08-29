/**
 * Lightweight Twilio API for demoing WhatsApp sends.
 * Usage: set TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, and run `node server/index.js`
 * Endpoint: POST /send-whatsapp { to: '+27...', body: 'message' }
 */

import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const app = express()
app.use(bodyParser.json())


const PORT = process.env.PORT || 4001

// data directory for simple file-backed persistence
const DATA_DIR = path.resolve(process.cwd(), 'server', 'data')
const INV_FILE = path.join(DATA_DIR, 'inventory.json')

app.post('/send-whatsapp', async (req, res) => {
  const { to, body } = req.body
  if(!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_FROM){
    return res.status(500).json({ error: 'Twilio not configured. Set TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM in env.' })
  }

  try{
    const client = (await import('twilio'))(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
    const message = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_FROM}`,
      to: `whatsapp:${to}`,
      body
    })
    res.json({ sid: message.sid })
  }catch(err){
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// messages persistence helpers
const MSG_FILE = path.join(DATA_DIR, 'messages.json')
function readMessages(){
  try{ return JSON.parse(fs.readFileSync(MSG_FILE, 'utf-8')) }catch(e){ return [] }
}
function writeMessages(arr){ try{ fs.writeFileSync(MSG_FILE, JSON.stringify(arr, null,2)); return true }catch(e){ console.error(e); return false } }

// New unified API for sending WhatsApp via Meta Cloud API (preferred) or Twilio fallback
app.post('/api/send-whatsapp', async (req, res) => {
  const { to, body, type='text', template } = req.body
  if(!to) return res.status(400).json({ error: 'Missing "to" phone number' })

  // persist a local stub record
  const messages = readMessages()
  const local = { id: `MSG-${Date.now().toString().slice(-6)}`, to, body, status: 'queued', createdAt: new Date().toISOString() }
  messages.push(local)
  writeMessages(messages)

  // If Meta creds present, send via Graph API
  if(process.env.WA_ACCESS_TOKEN && process.env.WA_PHONE_NUMBER_ID){
    try{
      // prefer global fetch (Node 18+). Fallback to node-fetch if not available.
      const fetch = globalThis.fetch ?? (await import('node-fetch')).default
      const url = `https://graph.facebook.com/v17.0/${process.env.WA_PHONE_NUMBER_ID}/messages`
      const payload = template ? { messaging_product: 'whatsapp', to, type: 'template', template } : { messaging_product: 'whatsapp', to, type: 'text', text: { body } }
      const resp = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await resp.json()
      // update local record
      local.status = resp.ok ? 'sent' : 'error'
      local.remote = json
      writeMessages(messages)
      return res.json({ ok: resp.ok, localId: local.id, remote: json })
    }catch(err){
      console.error('Meta send failed', err)
      local.status = 'error'
      writeMessages(messages)
      return res.status(500).json({ error: err.message })
    }
  }

  // Fallback to Twilio if configured
  if(process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM){
    try{
      const client = (await import('twilio'))(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
      const message = await client.messages.create({ from: `whatsapp:${process.env.TWILIO_FROM}`, to: `whatsapp:${to}`, body })
      local.status = 'sent'
      local.remote = { sid: message.sid }
      writeMessages(messages)
      return res.json({ ok: true, localId: local.id, remote: { sid: message.sid } })
    }catch(err){
      console.error('Twilio send failed', err)
      local.status = 'error'
      writeMessages(messages)
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(500).json({ error: 'No messaging provider configured (set WA_ACCESS_TOKEN+WA_PHONE_NUMBER_ID or Twilio env vars).' })
})

// webhook stub to receive Meta/Twilio callbacks (for demo, updates message status)
app.post('/api/messages/webhook', (req, res) => {
  // For Meta, the webhook structure is nested; for demo we'll log and rudimentarily update status by local id if provided
  const body = req.body
  console.log('Webhook received', JSON.stringify(body).slice(0,500))
  // If webhook contains a localId we can update it, otherwise ignore
  try{
    const messages = readMessages()
    const update = (body && body.localId) ? messages.find(m=>m.id===body.localId) : null
    if(update && body.status){ update.status = body.status; writeMessages(messages) }
  }catch(e){ console.error(e) }
  res.status(200).json({ received: true })
})

// list persisted messages for demo UI
app.get('/api/messages', (req, res) => {
  const messages = readMessages()
  res.json(messages)
})

// --- simple inventory API (file-backed, minimal for demo)
function readInventory(){
  try{
    const raw = fs.readFileSync(INV_FILE, 'utf-8')
    return JSON.parse(raw)
  }catch(e){
    return []
  }
}

function writeInventory(arr){
  try{
    fs.writeFileSync(INV_FILE, JSON.stringify(arr, null, 2))
    return true
  }catch(e){
    console.error('Failed to write inventory', e)
    return false
  }
}

app.get('/api/inventory', (req, res) => {
  const data = readInventory()
  res.json(data)
})

app.post('/api/inventory', (req, res) => {
  const item = req.body
  if(!item || !item.id){
    return res.status(400).json({ error: 'Invalid item' })
  }
  const data = readInventory()
  data.push(item)
  writeInventory(data)
  res.status(201).json(item)
})

app.put('/api/inventory/:id', (req, res) => {
  const id = req.params.id
  const patch = req.body
  const data = readInventory()
  const idx = data.findIndex(i=>i.id===id)
  if(idx === -1) return res.status(404).json({ error: 'Not found' })
  data[idx] = { ...data[idx], ...patch }
  writeInventory(data)
  res.json(data[idx])
})

app.delete('/api/inventory/:id', (req, res) => {
  const id = req.params.id
  let data = readInventory()
  data = data.filter(i=>i.id!==id)
  writeInventory(data)
  res.status(204).end()
})

app.listen(PORT, ()=> console.log(`Twilio demo API listening on http://localhost:${PORT}`))
