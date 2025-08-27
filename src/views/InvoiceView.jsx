import React, { useState } from 'react'
import { motion } from 'framer-motion'

const mockFrames = [
  { id: 'F-100', name: 'Classic Black', price: 1200 },
  { id: 'F-101', name: 'Tortoise Shell', price: 1500 },
  { id: 'F-102', name: 'Modern Clear', price: 1800 }
]

const lensOptions = [
  { id: 'L-clear', name: 'Clear', price: 800 },
  { id: 'L-tint', name: 'Tinted', price: 1100 },
  { id: 'L-trans', name: 'Transitions', price: 1600 }
]

export default function InvoiceView(){
  const [patient, setPatient] = useState({ name: '', age: '', prescription: '' })
  const [frameId, setFrameId] = useState(mockFrames[0].id)
  const [lensId, setLensId] = useState(lensOptions[0].id)
  const [invoice, setInvoice] = useState(null)

  function total(){
    const frame = mockFrames.find(f=>f.id===frameId)
    const lens = lensOptions.find(l=>l.id===lensId)
    return (frame?.price||0) + (lens?.price||0)
  }

  function generate(){
    setInvoice({
      id: `INV-${Date.now().toString().slice(-6)}`,
      patient, frame: mockFrames.find(f=>f.id===frameId), lens: lensOptions.find(l=>l.id===lensId),
      total: total()
    })
  }

  return (
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="space-y-6">
      <section className="bg-white p-4 rounded shadow-sm">
        <h2 className="font-semibold mb-2">Create Invoice</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={patient.name} onChange={e=>setPatient({...patient, name:e.target.value})} placeholder="Patient name" className="p-2 border rounded" />
          <input value={patient.age} onChange={e=>setPatient({...patient, age:e.target.value})} placeholder="Age" className="p-2 border rounded" />
          <input value={patient.prescription} onChange={e=>setPatient({...patient, prescription:e.target.value})} placeholder="Prescription" className="p-2 border rounded sm:col-span-2" />

          <select value={frameId} onChange={e=>setFrameId(e.target.value)} className="p-2 border rounded">
            {mockFrames.map(f=> <option key={f.id} value={f.id}>{f.name} — ₹{f.price}</option>)}
          </select>

          <select value={lensId} onChange={e=>setLensId(e.target.value)} className="p-2 border rounded">
            {lensOptions.map(l=> <option key={l.id} value={l.id}>{l.name} — ₹{l.price}</option>)}
          </select>

          <div className="sm:col-span-2 flex items-center justify-between">
            <div>Total: <strong>₹{total()}</strong></div>
            <button onClick={generate} className="bg-blue-600 text-white px-3 py-1 rounded">Generate Invoice</button>
          </div>
        </div>
      </section>

      {invoice && (
        <section className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-medium">Invoice Preview</h3>
          <div className="mt-2">
            <div><strong>ID:</strong> {invoice.id}</div>
            <div><strong>Patient:</strong> {invoice.patient.name} — {invoice.patient.age}</div>
            <div><strong>Frame:</strong> {invoice.frame.name} ({invoice.frame.id})</div>
            <div><strong>Lens:</strong> {invoice.lens.name}</div>
            <div className="mt-2 text-lg"><strong>Total: ₹{invoice.total}</strong></div>
          </div>
        </section>
      )}
    </motion.div>
  )
}
