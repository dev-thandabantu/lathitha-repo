import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'

const steps = [
  'Order Received',
  'Lens Cutting',
  'Frame Fitting',
  'Quality Check',
  'Ready for Pickup'
]

const mockOrders = {
  'ORD-1001': 2,
  'ORD-1002': 4,
  'ORD-1003': 1,
  'CUST-500': 3
}

export default function CustomerTrackingView(){
  const [searchParams] = useSearchParams()
  const prefill = searchParams.get('order') || ''

  const [orderId, setOrderId] = useState(prefill)
  const [active, setActive] = useState(null)
  const [error, setError] = useState('')

  useEffect(()=>{
    if(prefill){
      setTimeout(()=>{
        // small delay for nicer UX when landing via link
        handleLookup(prefill)
      }, 260)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill])

  function handleLookup(raw){
    setError('')
    const trimmed = (raw || orderId || '').trim().toUpperCase()
    if(!trimmed){
      setError('Please enter an Order ID from your receipt.')
      setActive(null)
      return
    }

    if(!(trimmed in mockOrders)){
      setError('Order not found. Check your Order ID or contact the store for help.')
      setActive(null)
      return
    }

    setActive(mockOrders[trimmed])
    setOrderId(trimmed)
  }

  return (
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="space-y-6">
      <section className="bg-white p-4 rounded shadow-sm">
        <h2 className="font-semibold mb-2">Track your order</h2>
        <p className="text-sm text-gray-600 mb-3">Enter the Order ID from your receipt to see progress. This page is public — no login required.</p>

        <div className="flex gap-2">
          <input
            value={orderId}
            onChange={e=>setOrderId(e.target.value)}
            onKeyDown={e=>{ if(e.key === 'Enter') handleLookup() }}
            placeholder="Enter Order ID e.g. ORD-1001"
            className="flex-1 p-2 border rounded" />
          <button onClick={()=>handleLookup()} className="bg-blue-600 text-white px-3 py-1 rounded">Lookup</button>
        </div>

        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </section>

      <section className="bg-white p-4 rounded shadow-sm">
        <h3 className="font-medium">Status Timeline</h3>
        <div className="mt-6 space-y-6">
          {steps.map((s, idx)=>{
            const isActive = active === idx
            const done = active > idx
            return (
              <div key={s} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${done? 'bg-green-500 text-white' : isActive? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {done? '✓' : idx+1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-px flex-1 mt-2 ${done? 'bg-green-300' : 'bg-gray-200'}`}></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${isActive? 'text-blue-700' : done? 'text-gray-800' : 'text-gray-700'}`}>{s}</div>
                  <div className="text-sm text-gray-500">{done? 'Completed' : isActive? 'In progress' : 'Pending'}</div>
                </div>
                <div className="text-sm text-gray-400">{done? '✓' : isActive? '●' : ''}</div>
              </div>
            )
          })}
        </div>
      </section>
    </motion.div>
  )
}
