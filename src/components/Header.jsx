import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sun, FileText, MapPin, MessageSquare, Menu, X } from 'lucide-react'
import { useRole } from '../context/RoleContext'

export default function Header(){
  const { role, logout } = useRole()
  const [open, setOpen] = useState(false)

  function close(){ setOpen(false) }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between min-w-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white rounded p-2">
            <Sun size={18} />
          </div>
          <div>
            <div className="font-semibold">LathiTha'</div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-3 min-w-0 text-sm">
          <Link to="/" className="flex items-center gap-1 text-gray-700 hover:text-blue-600" onClick={close}>
            <FileText size={16} /> <span className="hidden sm:inline">Invoice</span>
          </Link>
          <Link to="/track" className="flex items-center gap-1 text-gray-700 hover:text-blue-600" onClick={close}>
            <MapPin size={16} /> <span className="hidden sm:inline">Track (internal)</span>
          </Link>
          <Link to="/track/customer" className="flex items-center gap-1 text-gray-700 hover:text-blue-600" onClick={close}>
            <MapPin size={16} /> <span className="hidden sm:inline">Track Order</span>
          </Link>
          {(role === 'admin' || role === 'staff') && (
            <Link to="/inventory" className="flex items-center gap-1 text-gray-700 hover:text-blue-600" onClick={close}>
              Inventory
            </Link>
          )}
          {role === 'admin' && (
            <Link to="/comms" className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600" onClick={close}>
              <MessageSquare size={16} /> Comms
            </Link>
          )}
          {role ? (
            <button onClick={logout} className="text-sm text-red-500">Logout</button>
          ) : (
            <Link to="/login" className="text-sm text-blue-600">Login</Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <div className="sm:hidden">
          <button aria-label="Toggle menu" onClick={()=>setOpen(o=>!o)} className="p-2 rounded bg-gray-100">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <div className="sm:hidden px-4 pb-4">
          <div className="bg-white shadow rounded p-3 space-y-2">
            <Link to="/" onClick={close} className="block text-gray-700">Invoice</Link>
            <Link to="/track" onClick={close} className="block text-gray-700">Track (internal)</Link>
            <Link to="/track/customer" onClick={close} className="block text-gray-700">Track Order</Link>
            {(role === 'admin' || role === 'staff') && (
              <Link to="/inventory" onClick={close} className="block text-gray-700">Inventory</Link>
            )}
            {role === 'admin' && (
              <Link to="/comms" onClick={close} className="block text-gray-700">Comms</Link>
            )}
            {role ? (
              <button onClick={()=>{ logout(); close() }} className="text-left w-full text-red-500">Logout</button>
            ) : (
              <Link to="/login" onClick={close} className="block text-blue-600">Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
