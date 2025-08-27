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

// --- simple inventory API (file-backed, minimal for demo)
const DATA_DIR = path.resolve(process.cwd(), 'server', 'data')
const INV_FILE = path.join(DATA_DIR, 'inventory.json')

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
