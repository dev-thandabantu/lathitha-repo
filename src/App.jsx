import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import InvoiceView from './views/InvoiceView'
import OrderTrackingView from './views/OrderTrackingView'
import CommsView from './views/CommsView'
import LoginView from './views/LoginView'
import CustomerTrackingView from './views/CustomerTrackingView'
import { useRole } from './context/RoleContext'
import { Navigate } from 'react-router-dom'

export default function App(){
  const location = useLocation()
  const { role } = useRole()

  function RequireAuth({ children }){
    if(!role) return <Navigate to="/login" replace />
    return children
  }

  return (
  <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 overflow-x-hidden">
      <Header />

  <main className="max-w-4xl mx-auto p-4 min-w-0">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<LoginView/>} />
            <Route path="/" element={<RequireAuth><InvoiceView/></RequireAuth>} />
            <Route path="/track" element={<RequireAuth><OrderTrackingView/></RequireAuth>} />
            <Route path="/track/customer" element={<CustomerTrackingView/>} />
            <Route path="/comms" element={<RequireAuth><CommsView/></RequireAuth>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}
