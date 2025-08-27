import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function empty(){ return { id: '', sku: '', name: '', type: 'frame', price: 0, stock: 0 } }

export default function InventoryView(){
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(()=>{ fetchList() }, [])

  async function fetchList(){
    setLoading(true)
    setErrorMsg('')
    try{
      let res = await fetch('/api/inventory')
      // If the dev proxy isn't configured or Vite not restarted, server may return HTML (index.html)
      const contentType = res.headers.get('content-type') || ''
      if(!res.ok || !contentType.includes('application/json')){
        // try direct server fallback
        try{
          res = await fetch('http://localhost:4001/api/inventory')
        }catch(fallbackErr){
          console.error('Fallback fetch failed', fallbackErr)
        }
      }

      if(res && res.ok){
        const got = await res.json()
        setItems(got)
      }else{
        const status = res? `${res.status} ${res.statusText}` : 'no response'
        setErrorMsg(`Failed to load inventory (${status}). Ensure the demo server is running on http://localhost:4001 and restart the Vite dev server after adding the proxy.`)
        console.error('Inventory fetch failed', res)
      }
    }catch(e){
      console.error(e)
      setErrorMsg('Unexpected error while loading inventory. Check the server and proxy settings.')
    }finally{ setLoading(false) }
  }

  function startNew(){ setEditing(empty()) }

  async function save(){
    if(!editing) return
    try{
      if(items.find(i=>i.id===editing.id)){
        await fetch(`/api/inventory/${encodeURIComponent(editing.id)}`, { method: 'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify(editing) })
      }else{
        await fetch('/api/inventory', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(editing) })
      }
      setEditing(null)
      fetchList()
    }catch(e){ console.error(e) }
  }

  async function remove(id){
    if(!confirm('Delete this item?')) return
    await fetch(`/api/inventory/${encodeURIComponent(id)}`, { method: 'DELETE' })
    fetchList()
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Inventory</h2>
        <div>
          <button onClick={startNew} className="px-3 py-1 bg-blue-600 text-white rounded">+ Add item</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-sm">
        {loading ? <div>Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-auto">
              <thead>
                <tr className="text-left text-gray-600">
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th className="w-24">Price</th>
                  <th className="w-24">Stock</th>
                  <th className="w-28"> </th>
                </tr>
              </thead>
              <tbody>
                {items.map(it=> (
                  <tr key={it.id}>
                    <td>{it.sku}</td>
                    <td>{it.name}</td>
                    <td>{it.type}</td>
                    <td>R{it.price.toLocaleString()}</td>
                    <td>{it.stock}</td>
                    <td>
                      <button onClick={()=>setEditing(it)} className="text-blue-600 mr-2">Edit</button>
                      <button onClick={()=>remove(it.id)} className="text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-medium mb-2">{items.find(i=>i.id===editing.id)? 'Edit' : 'New'} item</h3>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
            <input className="p-2 border rounded sm:col-span-1" placeholder="ID" value={editing.id} onChange={e=>setEditing(prev=>({...prev, id:e.target.value}))} />
            <input className="p-2 border rounded sm:col-span-2" placeholder="SKU" value={editing.sku} onChange={e=>setEditing(prev=>({...prev, sku:e.target.value}))} />
            <input className="p-2 border rounded sm:col-span-2" placeholder="Name" value={editing.name} onChange={e=>setEditing(prev=>({...prev, name:e.target.value}))} />
            <select className="p-2 border rounded" value={editing.type} onChange={e=>setEditing(prev=>({...prev, type:e.target.value}))}>
              <option value="frame">Frame</option>
              <option value="lens">Lens</option>
            </select>
            <input className="p-2 border rounded" type="number" placeholder="Price" value={editing.price} onChange={e=>setEditing(prev=>({...prev, price: Number(e.target.value)}))} />
            <input className="p-2 border rounded" type="number" placeholder="Stock" value={editing.stock} onChange={e=>setEditing(prev=>({...prev, stock: Number(e.target.value)}))} />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={save} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
            <button onClick={()=>setEditing(null)} className="px-3 py-1 bg-gray-100 rounded">Cancel</button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
