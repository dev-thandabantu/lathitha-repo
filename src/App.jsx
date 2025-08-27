import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import InvoiceView from './views/InvoiceView'
import OrderTrackingView from './views/OrderTrackingView'
import CommsView from './views/CommsView'

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <h1 className="font-semibold">Lathi Tha' - Proof Sprint</h1>
          <nav className="space-x-3">
            <Link to="/" className="text-sm text-blue-600">Invoice</Link>
            <Link to="/track" className="text-sm text-blue-600">Order Track</Link>
            <Link to="/comms" className="text-sm text-blue-600">Comms</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<InvoiceView/>} />
          <Route path="/track" element={<OrderTrackingView/>} />
          <Route path="/comms" element={<CommsView/>} />
        </Routes>
      </main>
    </div>
  )
}
