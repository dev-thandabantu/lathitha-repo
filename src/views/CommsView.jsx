import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Toast from '../components/Toast'

const statuses = [
  'Eye Test Done',
  'Lens Cutting',
  'Frame Fitting',
  'Courier Pickup',
  'Ready for Collection'
]

function template(status, orderId = 'ORD-1001', name='Customer'){
  const trackUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/track/customer?order=${encodeURIComponent(orderId)}`
  // A concise, professional update that looks good in WhatsApp
  return `Hello ${name},\n\nGood news — your order ${orderId} is now at *${status}*.\n\nEstimated ready time: 2 business days.\nTrack your order and view pickup details:\n${trackUrl}\n\nIf you have questions, reply to this message or call +27 11 123 4567.\n\n– Lathi Tha' Eyecare`
}

export default function CommsView(){
  const [messages, setMessages] = useState([
    { id:1, text: "Hi Amina, your glasses are now at the *Lens Cutting* stage.", time: '2025-08-27 10:00', outgoing: false }
  ])
  // server log removed; keep simple client-side preview and optimistic UI
  const [useTemplate, setUseTemplate] = useState(false)
  const [to, setTo] = useState('')
  const [orderId, setOrderId] = useState('ORD-1001')
  const [customerName, setCustomerName] = useState('Customer')
  const [selectedStatus, setSelectedStatus] = useState(statuses[1])
  const [toast, setToast] = useState(null)
  const [sending, setSending] = useState(false)
  const listRef = useRef(null)
  // no polling / server log

  function pushMessage(text, outgoing=true){
    const id = Date.now()
    const msg = { id, text, time: new Date().toLocaleString(), outgoing }
    setMessages(prev=>[...prev, msg])
    // scroll to bottom on new message
    setTimeout(()=>{
      if(listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
    }, 60)
    return id
  }

  async function sendStatus(){
    const name = customerName || 'Customer'
    const body = template(selectedStatus, orderId, name)
    setToast('Sending...')
    setSending(true)
    // show optimistic UI and capture which local message to reconcile later
    const localMsgId = pushMessage(body, true)

    try{
      // always send text body for PoC (templates removed from UI)
      const payload = { to, body }
      const res = await fetch('/api/send-whatsapp', { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if(!res.ok) throw new Error(json.error || 'send error')
      setToast('Sent ✅')
      // attach server local/remote info to optimistic message
      setMessages(prev=> prev.map(m => m.id === localMsgId ? { ...m, server: { localId: json.localId, remote: json.remote, status: 'sent' } } : m))
    }catch(err){
      console.warn('send failed', err.message)
      setToast('Error ❌')
      setMessages(prev=> prev.map(m => m.id === localMsgId ? { ...m, server: { status: 'error' } } : m))
    }
    setSending(false)
  }
  // no server polling or message log

  return (
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="space-y-6">
      <Toast message={toast} onClose={()=>setToast(null)} />

      <section className="bg-white p-4 rounded shadow-sm">
        <h2 className="font-semibold mb-2">Comms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input placeholder="Customer phone (+27...)" className="p-2 border rounded col-span-1 sm:col-span-2" value={to} onChange={e=>setTo(e.target.value)} />
          <input value={orderId} onChange={e=>setOrderId(e.target.value)} className="p-2 border rounded" />
          <input value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="Customer name" className="p-2 border rounded sm:col-span-3" />

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
            <div className="mt-2 p-3 bg-green-50 rounded">{useTemplate ? 'Using approved template: hello_world' : template(selectedStatus)}</div>
            <label className="flex items-center gap-2 mt-2"><input type="checkbox" checked={useTemplate} onChange={e=>setUseTemplate(e.target.checked)} /> Use approved template (hello_world)</label>
          </div>

          <div className="sm:col-span-3 flex items-center justify-end gap-2">
            <button onClick={sendStatus} disabled={sending} className="bg-green-600 text-white px-3 py-1 rounded">{sending? 'Sending...' : 'Send status update'}</button>
          </div>
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow-sm">
        <h3 className="font-medium">Messages</h3>
  <div ref={listRef} className="mt-3 space-y-3 max-h-80 overflow-y-auto p-2 min-w-0">
          <AnimatePresence initial={false}>
            {messages.map(m=> (
              <motion.div key={m.id} initial={{opacity:0, x:50}} animate={{opacity:1, x:0}} exit={{opacity:0, x:50}} className={`max-w-xs break-words p-3 rounded-md ${m.outgoing? 'ml-auto bg-blue-600 text-white' : 'bg-white border'}`}>
                <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-xs text-gray-300">{m.time}</div>
                  {m.server && <div className="text-xs text-green-200"> · sent</div>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

  {/* server message log removed for clarity */}
    </motion.div>
  )
}
