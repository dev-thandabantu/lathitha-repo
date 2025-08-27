import React, { useState } from 'react'
import { motion } from 'framer-motion'

const steps = [
  'Eye Test Done',
  'Lens Cutting',
  'Frame Fitting',
  'Courier Pickup',
  'Ready for Collection'
]

const mockOrders = {
  'ORD-1001': 2,
  'ORD-1002': 4,
  'ORD-1003': 1
}

export default function OrderTrackingView(){
  const [orderId, setOrderId] = useState('')
  const [active, setActive] = useState(null)

  function lookup(){
    const i = mockOrders[orderId] ?? 0
    setActive(i)
  }

  return (
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="space-y-6">
      <section className="bg-white p-4 rounded shadow-sm">
        <h2 className="font-semibold mb-2">Order Tracking</h2>
        <div className="flex gap-2">
          <input value={orderId} onChange={e=>setOrderId(e.target.value)} placeholder="Enter Order ID e.g. ORD-1001" className="flex-1 p-2 border rounded" />
          <button onClick={lookup} className="bg-blue-600 text-white px-3 py-1 rounded">Check</button>
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow-sm">
        <h3 className="font-medium">Status Timeline</h3>
        <div className="mt-4">
          {steps.map((s, idx)=>{
            const isActive = active === idx
            const done = active > idx
            return (
              <div key={s} className={`flex items-center gap-3 py-2 ${isActive? 'bg-blue-50 rounded': ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done? 'bg-green-500 text-white' : isActive? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{done? '✓' : idx+1}</div>
                <div>
                  <div className="font-medium">{s}</div>
                  <div className="text-sm text-gray-500">{done? 'Completed' : isActive? 'In progress' : 'Pending'}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </motion.div>
  )
}
