import React from 'react'
import { Link } from 'react-router-dom'
import { Sun, FileText, MapPin, MessageSquare } from 'lucide-react'
import { useRole } from '../context/RoleContext'

export default function Header(){
  const { role, logout } = useRole()
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

        <nav className="flex items-center gap-3 min-w-0 text-sm">
          <Link to="/" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
            <FileText size={16} /> <span className="hidden sm:inline">Invoice</span>
          </Link>
          <Link to="/track" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
            <MapPin size={16} /> <span className="hidden sm:inline">Track (internal)</span>
          </Link>
          <Link to="/track/customer" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
            <MapPin size={16} /> <span className="hidden sm:inline">Track Order</span>
          </Link>
          {role === 'admin' && (
            <Link to="/comms" className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600">
              <MessageSquare size={16} /> Comms
            </Link>
          )}
          {role ? (
            <button onClick={logout} className="text-sm text-red-500">Logout</button>
          ) : (
            <Link to="/login" className="text-sm text-blue-600">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
