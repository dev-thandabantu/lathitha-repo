import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

function empty(){ return { id: '', sku: '', name: '', type: 'frame', price: 0, stock: 0, reorderThreshold: 5 } }

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
      setItems(got.map(item => ({
        ...item,
        reorderThreshold: item.reorderThreshold || 5
      })))
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
function isLowStock(item){
  return item.stock <= item.reorderThreshold
}

const lowStockCount = items.filter(isLowStock).length
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
      <div className="flex items-center justify-between">
      <div>
        <h2 className="font-semibold text-lg">Inventory</h2>
        {lowStockCount > 0 && (
          <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
            <AlertCircle size={16} />
            <span>{lowStockCount} item{lowStockCount > 1 ? 's' : ''} below reorder threshold</span>
          </div>
        )}
      </div>
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
                  <th className="pb-2">SKU</th>
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2 w-24">Price</th>
                  <th className="pb-2 w-24">Stock</th>
                  <th className="pb-2 w-24">Reorder Threshold</th>
                  <th className="pb-2 w-28"> </th>                </tr>
              </thead>
              <tbody>
                {items.map(it=> {
                  const lowStock = isLowStock(it)
                  return (
                    <tr key={it.id} className={`border-b ${lowStock ? 'bg-red-50' : ''}`}>
                      <td className="py-2">{it.sku}</td>
                      <td className="py-2">{it.name}</td>
                      <td className="py-2">{it.type}</td>
                      <td className="py-2">R{it.price.toLocaleString()}</td>
                      <td className="py-2">
                        <span className={`font-semibold ${lowStock ? 'text-red-600' : 'text-gray-900'}`}>
                          {it.stock}
                        </span>
                        {lowStock && (
                          <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            Low
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-gray-600">{it.reorderThreshold}</td>
                      <td className="py-2">
                        <button onClick={()=>setEditing(it)} className="text-blue-600 mr-2">Edit</button>
                        <button onClick={()=>remove(it.id)} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-medium mb-3">{items.find(i=>i.id===editing.id)? 'Edit' : 'New'} item</h3>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
            <input 
              className="p-2 border rounded sm:col-span-1" 
              placeholder="ID" 
              value={editing.id} 
              onChange={e=>setEditing(prev=>({...prev, id:e.target.value}))} 
            />
            <input 
              className="p-2 border rounded sm:col-span-2" 
              placeholder="SKU" 
              value={editing.sku} 
              onChange={e=>setEditing(prev=>({...prev, sku:e.target.value}))} 
            />
            <input 
              className="p-2 border rounded sm:col-span-2" 
              placeholder="Name" 
              value={editing.name} 
              onChange={e=>setEditing(prev=>({...prev, name:e.target.value}))} 
            />
            <select 
              className="p-2 border rounded" 
              value={editing.type} 
              onChange={e=>setEditing(prev=>({...prev, type:e.target.value}))}
            >
              <option value="frame">Frame</option>
              <option value="lens">Lens</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Price (R)</label>
              <input 
                className="p-2 border rounded w-full" 
                type="number" 
                placeholder="Price" 
                value={editing.price} 
                onChange={e=>setEditing(prev=>({...prev, price: Number(e.target.value)}))} 
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Stock Quantity</label>
              <input 
                className="p-2 border rounded w-full" 
                type="number" 
                placeholder="Stock" 
                value={editing.stock} 
                onChange={e=>setEditing(prev=>({...prev, stock: Number(e.target.value)}))} 
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Reorder Threshold</label>
              <input 
                className="p-2 border rounded w-full" 
                type="number" 
                placeholder="Threshold" 
                value={editing.reorderThreshold} 
                onChange={e=>setEditing(prev=>({...prev, reorderThreshold: Number(e.target.value)}))} 
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            <button onClick={()=>setEditing(null)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
