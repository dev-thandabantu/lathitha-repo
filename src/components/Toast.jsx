import React, { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose }){
  useEffect(()=>{
    if(!message) return
    const t = setTimeout(()=> onClose && onClose(), 3000)
    return ()=> clearTimeout(t)
  }, [message])

  if(!message) return null

  const bg = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-gray-800'

  return (
    <div className={`fixed bottom-6 right-6 ${bg} text-white px-4 py-2 rounded shadow`} role="status">
      {message}
    </div>
  )
}
