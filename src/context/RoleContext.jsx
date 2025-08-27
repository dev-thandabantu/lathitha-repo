import React, { createContext, useContext, useState, useEffect } from 'react'

const RoleContext = createContext(null)

export function RoleProvider({ children }){
  const [role, setRole] = useState(() => {
    try { return localStorage.getItem('role') } catch { return null }
  })

  useEffect(()=>{
    try { if(role) localStorage.setItem('role', role); else localStorage.removeItem('role') } catch {}
  }, [role])

  function login(asRole){
    setRole(asRole)
  }

  function logout(){
    setRole(null)
  }

  return (
    <RoleContext.Provider value={{ role, login, logout }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole(){
  const ctx = useContext(RoleContext)
  if(!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}

export default RoleContext
