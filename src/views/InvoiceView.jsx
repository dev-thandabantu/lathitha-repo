import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// inventory will be fetched from the demo server
let initialInventory = []


export default function InvoiceView(){
  const [inventory, setInventory] = useState(initialInventory)
  const [patient, setPatient] = useState({ name: '', age: '', prescription: '' })
  const [items, setItems] = useState([
    { id: 'F-100', desc: 'Classic Black Frame', qty: 1, unit: 1200 },
    { id: 'L-clear', desc: 'Clear Lens', qty: 2, unit: 800 }
  ])
  const [invoice, setInvoice] = useState(null)
  const [discount, setDiscount] = useState(0)
  const taxRate = 0.15

  function subtotal(){
    return items.reduce((s, it) => s + (Number(it.qty || 0) * Number(it.unit || 0)), 0)
  }

  function tax(){
    return Math.round(subtotal() * taxRate)
  }

  function grandTotal(){
    return subtotal() + tax() - Number(discount || 0)
  }

  function updateItem(idx, patch){
    setItems(prev => prev.map((it, i) => i===idx ? {...it, ...patch} : it))
  }

  function addItem(){
    setItems(prev => [...prev, { id: `X-${Date.now()}`, desc: 'New Item', qty:1, unit:0 }])
  }

  function removeItem(idx){
    setItems(prev => prev.filter((_,i)=>i!==idx))
  }

  function quickAddFrame(id){
    const f = inventory.find(f=>f.id===id)
    if(!f) return
    setItems(prev => [...prev, { id: f.id, desc: f.name + ' (Frame)', qty:1, unit: f.price }])
  }

  function quickAddLens(id){
    const l = inventory.find(l=>l.id===id)
    if(!l) return
    setItems(prev => [...prev, { id: l.id, desc: l.name + ' (Lens)', qty:1, unit: l.price }])
  }

  useEffect(()=>{
    let mounted = true
    fetch('/api/inventory').then(r=>r.json()).then(data=>{
      if(!mounted) return
      setInventory(data || [])
    }).catch(()=>setInventory([]))
    return ()=> mounted = false
  }, [])

  function generate(){
    setInvoice({
      id: `INV-${Date.now().toString().slice(-6)}`,
      patient,
      items,
      subtotal: subtotal(),
      tax: tax(),
      discount: Number(discount || 0),
      total: grandTotal()
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

          <div className="sm:col-span-2 flex gap-2">
            <select className="p-2 border rounded" onChange={e=>quickAddFrame(e.target.value)} defaultValue="">
              <option value="" disabled>Quick add frame...</option>
              {inventory.filter(i=>i.type==='frame').map(f=> <option key={f.id} value={f.id}>{f.name} — R{f.price}</option>)}
            </select>
            <select className="p-2 border rounded" onChange={e=>quickAddLens(e.target.value)} defaultValue="">
              <option value="" disabled>Quick add lens...</option>
              {inventory.filter(i=>i.type==='lens').map(l=> <option key={l.id} value={l.id}>{l.name} — R{l.price}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
      <div className="overflow-x-auto min-w-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th>Description</th>
                    <th className="w-20">Qty</th>
                    <th className="w-28">Unit</th>
                    <th className="w-28">Line</th>
                    <th className="w-20"> </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx)=> (
                    <tr key={it.id} className="align-top">
                      <td>
                        <input className="w-full p-1 border rounded" value={it.desc} onChange={e=>updateItem(idx, { desc: e.target.value })} />
                      </td>
                      <td>
                        <input className="p-1 border rounded w-full" type="number" value={it.qty} onChange={e=>updateItem(idx, { qty: Number(e.target.value) })} />
                      </td>
                      <td>
                        <input className="p-1 border rounded w-full" type="number" value={it.unit} onChange={e=>updateItem(idx, { unit: Number(e.target.value) })} />
                      </td>
                      <td>R{(Number(it.qty||0) * Number(it.unit||0)).toLocaleString()}</td>
                      <td><button onClick={()=>removeItem(idx)} className="text-red-500">Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <button onClick={addItem} className="px-3 py-1 bg-gray-100 rounded">+ Add line</button>
              <div className="ml-auto text-sm">
                <div>Subtotal: <strong>R{subtotal().toLocaleString()}</strong></div>
                <div>Tax ({Math.round(taxRate*100)}%): <strong>R{tax().toLocaleString()}</strong></div>
                <div className="flex items-center gap-2 mt-1">Discount: <input type="number" className="p-1 border rounded w-32" value={discount} onChange={e=>setDiscount(Number(e.target.value))} /> </div>
                <div className="mt-2 text-lg">Total: <strong>R{grandTotal().toLocaleString()}</strong></div>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center justify-end gap-2">
            <button onClick={generate} className="bg-blue-600 text-white px-3 py-1 rounded">Generate Invoice</button>
          </div>
        </div>
      </section>

      {invoice && (
        <section className="bg-white p-4 rounded shadow-sm printable-invoice">
          <div className="flex items-start justify-between border-b pb-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#CBD5E1" />
                  <text x="12" y="16" fontSize="10" textAnchor="middle" fill="#1F2937">Logo</text>
                </svg>
              </div>
              <div>
                <div className="text-lg font-semibold">Lathi Tha' Eyecare</div>
                <div className="text-sm text-gray-600">123 Vision Street, East London</div>
                <div className="text-sm text-gray-600">contact@lathitha.example | +27 11 123 4567</div>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div className="text-sm text-gray-600">Invoice</div>
              <div className="text-sm">ID: {invoice.id}</div>
              <div className="text-sm text-gray-600">Patient: {invoice.patient.name} — {invoice.patient.age}</div>
              <button onClick={()=>window.print()} className="px-3 py-1 bg-gray-100 rounded no-print">Print / Save PDF</button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm table-auto">
              <thead>
                <tr className="text-left text-gray-600">
                  <th>Description</th>
                  <th className="w-24">Qty</th>
                  <th className="w-28">Unit</th>
                  <th className="w-28">Line</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(it=> (
                  <tr key={it.id}>
                    <td>{it.desc}</td>
                    <td>{it.qty}</td>
                    <td>R{it.unit.toLocaleString()}</td>
                    <td>R{(it.qty * it.unit).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right text-sm">
            <div>Subtotal: R{invoice.subtotal.toLocaleString()}</div>
            <div>Tax: R{invoice.tax.toLocaleString()}</div>
            <div>Discount: -R{invoice.discount.toLocaleString()}</div>
            <div className="mt-2 text-lg">Total: <strong>R{invoice.total.toLocaleString()}</strong></div>
          </div>

          <div className="mt-4 border-t pt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1 text-sm text-gray-700">
              Share this invoice and tracking link with the customer.
            </div>
            <div className="flex items-center gap-2">
              <TrackingCtas invoiceId={invoice.id} />
            </div>
          </div>
        </section>
      )}
    </motion.div>
  )
}

function TrackingCtas({ invoiceId }){
  const [copied, setCopied] = React.useState(false)
  const trackUrl = `${window.location.origin}/track/customer?order=${encodeURIComponent(invoiceId.replace(/^INV-/, 'ORD-'))}`

  async function copy(){
    try{
      await navigator.clipboard.writeText(trackUrl)
      setCopied(true)
      setTimeout(()=>setCopied(false), 2500)
    }catch(e){
      // fallback
      const el = document.createElement('textarea')
      el.value = trackUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(()=>setCopied(false), 2500)
    }
  }

  const waText = encodeURIComponent(`Your order is being processed. Track it here: ${trackUrl}`)
  const waLink = `https://wa.me/?text=${waText}`

  return (
    <div className="flex items-center gap-2">
      <button onClick={copy} className="px-3 py-1 bg-gray-100 rounded text-sm">Copy tracking link</button>
      <a href={waLink} target="_blank" rel="noreferrer" className="px-3 py-1 bg-green-600 text-white rounded text-sm">Share via WhatsApp</a>
      {copied && <div className="text-sm text-green-600">Link copied!</div>}
    </div>
  )
}
