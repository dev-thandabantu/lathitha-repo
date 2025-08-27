import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRole } from '../context/RoleContext'

export default function LoginView(){
  const { login } = useRole()
  const navigate = useNavigate()

  function submit(asRole){
    login(asRole)
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-4">Login (mock)</h2>
        <p className="text-sm text-gray-600 mb-4">Choose a role to simulate access levels.</p>
        <div className="flex gap-2">
          <button onClick={()=>submit('admin')} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded">Login as Admin</button>
          <button onClick={()=>submit('staff')} className="flex-1 bg-gray-200 px-3 py-2 rounded">Login as Staff</button>
        </div>
      </div>
    </div>
  )
}
