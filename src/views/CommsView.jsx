import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Toast from '../components/Toast'

const statuses = [
  'Eye Test Done',
  'Lens Cutting',
  'Frame Fitting',
  'Courier Pickup',
  'Ready for Collection'
]

function template(status, name='Customer'){
  return `Hi ${name}, your glasses are now at the *${status}* stage. Reply if you need help.`
}

export default function CommsView(){
  const [messages, setMessages] = useState([
    { id:1, text: "Hi Amina, your glasses are now at the *Lens Cutting* stage.", time: '2025-08-27 10:00', outgoing: false }
  ])
  const [to, setTo] = useState('')
  const [orderId, setOrderId] = useState('ORD-1001')
  const [selectedStatus, setSelectedStatus] = useState(statuses[1])
  const [toast, setToast] = useState(null)
  const [sending, setSending] = useState(false)
  const listRef = useRef(null)

  function pushMessage(text, outgoing=true){
    const msg = { id: Date.now(), text, time: new Date().toLocaleString(), outgoing }
    setMessages(prev=>[...prev, msg])
    // scroll to bottom on new message
    setTimeout(()=>{
      if(listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
    }, 60)
  }

  async function sendStatus(){
    const name = 'Customer' // could be looked up from order
    const body = template(selectedStatus, name)
    setToast('Sending...')
    setSending(true)
    pushMessage(body, true)

    try{
      const res = await fetch('/send-whatsapp', { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify({ to, body }) })
      if(!res.ok) throw new Error('server error')
      setToast('Sent ✅')
    }catch(err){
      console.warn('send failed', err.message)
      setToast('Error ❌')
    }
    setSending(false)
  }

  return (
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="space-y-6">
      <Toast message={toast} onClose={()=>setToast(null)} />

      <section className="bg-white p-4 rounded shadow-sm">
        <h2 className="font-semibold mb-2">Comms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input placeholder="Customer phone (+27...)" className="p-2 border rounded col-span-1 sm:col-span-2" value={to} onChange={e=>setTo(e.target.value)} />
          <input value={orderId} onChange={e=>setOrderId(e.target.value)} className="p-2 border rounded" />

          <div className="sm:col-span-3">
            <label className="text-sm text-gray-600">Select status:</label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {statuses.map(s=> (
                <button key={s} onClick={()=>setSelectedStatus(s)} className={`px-3 py-1 rounded ${selectedStatus===s? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="text-sm text-gray-600">Preview message:</label>
            <div className="mt-2 p-3 bg-green-50 rounded">{template(selectedStatus)}</div>
          </div>

          <div className="sm:col-span-3 flex items-center justify-end gap-2">
            <button onClick={sendStatus} disabled={sending} className="bg-green-600 text-white px-3 py-1 rounded">{sending? 'Sending...' : 'Send status update'}</button>
          </div>
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow-sm">
        <h3 className="font-medium">Messages</h3>
        <div ref={listRef} className="mt-3 space-y-3 max-h-80 overflow-y-auto p-2">
          <AnimatePresence initial={false}>
            {messages.map(m=> (
              <motion.div key={m.id} initial={{opacity:0, x:50}} animate={{opacity:1, x:0}} exit={{opacity:0, x:50}} className={`max-w-xs p-3 rounded-md ${m.outgoing? 'ml-auto bg-blue-600 text-white' : 'bg-white border'}`}>
                <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                <div className="text-xs text-gray-300 mt-1">{m.time}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  )
}
