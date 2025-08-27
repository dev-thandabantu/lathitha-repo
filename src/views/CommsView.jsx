import React from 'react'

export default function CommsView(){
  const sample = [
    { id:1, text: "Hi Amina, your glasses are now at the *Lens Cutting* stage.", time: '2025-08-27 10:00' },
    { id:2, text: "Update: Ready for collection at East London branch.", time: '2025-08-27 14:30' }
  ]

  return (
    <div className="space-y-6">
      <section className="bg-white p-4 rounded shadow-sm">
        <h2 className="font-semibold mb-2">Comms Preview</h2>
        <div className="space-y-3">
          {sample.map(m=> (
            <div key={m.id} className="border rounded p-3 bg-green-50">
              <div className="text-sm text-gray-600">WhatsApp</div>
              <div className="mt-1">{m.text}</div>
              <div className="mt-2 text-xs text-gray-500">{m.time}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow-sm">
        <h3 className="font-medium">Send Live (Twilio)</h3>
        <div className="text-sm text-gray-600">This demo shows a mock preview. To send real WhatsApp messages, add Twilio credentials and an API route.</div>
      </section>
    </div>
  )
}
