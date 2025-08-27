import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import InvoiceView from './views/InvoiceView'
import OrderTrackingView from './views/OrderTrackingView'
import CommsView from './views/CommsView'

export default function App(){
  const location = useLocation()
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800">
      <Header />

      <main className="max-w-4xl mx-auto p-4">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<InvoiceView/>} />
            <Route path="/track" element={<OrderTrackingView/>} />
            <Route path="/comms" element={<CommsView/>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}
