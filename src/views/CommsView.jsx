import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function CommsView(){
  const [messages, setMessages] = useState([
    { id:1, text: "Hi Amina, your glasses are now at the *Lens Cutting* stage.", time: '2025-08-27 10:00', outgoing: false },
    { id:2, text: "Update: Ready for collection at East London branch.", time: '2025-08-27 14:30', outgoing: false }
  ])
  const [text, setText] = useState('')
  const [to, setTo] = useState('')
  const [sending, setSending] = useState(false)

  async function send(){
    if(!text) return
    const msg = { id: Date.now(), text, time: new Date().toLocaleString(), outgoing: true }
    setMessages(prev=>[...prev, msg])
    setText('')
    // try live send if server configured
    setSending(true)
    try{
      const res = await fetch('/send-whatsapp', { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify({ to, body: msg.text }) })
      if(!res.ok){
        // ignore; keep mock message
        console.warn('live send failed')
      }
    }catch(err){
      // fetch failed; still fine for demo
      console.warn('live send error', err.message)
    }
    setSending(false)
  }

  return (
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="space-y-6">
      <section className="bg-white p-4 rounded shadow-sm">
        <h2 className="font-semibold mb-2">Comms Preview</h2>
        <div className="space-y-3 max-h-80 overflow-y-auto p-2">
          {messages.map(m=> (
            <div key={m.id} className={`${m.outgoing? 'ml-auto bg-blue-600 text-white' : 'bg-white border'} max-w-xs p-3 rounded-md`}>
              <div className="text-sm">{m.text}</div>
              <div className="text-xs text-gray-300 mt-1">{m.time}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow-sm">
        <h3 className="font-medium">Send Message</h3>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input placeholder="Customer phone (+27...)" className="p-2 border rounded col-span-1 sm:col-span-2" value={to} onChange={e=>setTo(e.target.value)} />
          <button className="px-3 py-1 bg-gray-100 rounded" onClick={()=>setTo('+27')}>+27</button>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Type message..." className="p-2 border rounded col-span-1 sm:col-span-3" rows={3} />
          <div className="sm:col-span-3 flex items-center justify-end gap-2">
            <button onClick={send} disabled={sending} className="bg-green-600 text-white px-3 py-1 rounded">{sending? 'Sending...' : 'Send (mock / live if configured)'}</button>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
