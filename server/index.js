/**
 * Lightweight Twilio API for demoing WhatsApp sends.
 * Usage: set TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, and run `node server/index.js`
 * Endpoint: POST /send-whatsapp { to: '+27...', body: 'message' }
 */

import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

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

app.listen(PORT, ()=> console.log(`Twilio demo API listening on http://localhost:${PORT}`))
