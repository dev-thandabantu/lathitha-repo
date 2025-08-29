#!/usr/bin/env node
const { spawn } = require('child_process')
const http = require('http')

function waitFor(url, timeout = 20000, interval = 500) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.request(url, { method: 'GET', timeout: 2000 }, (res) => {
        res.resume()
        resolve()
      })
      req.on('error', () => {
        if (Date.now() - start > timeout) return reject(new Error('timeout'))
        setTimeout(check, interval)
      })
      req.end()
    }
    check()
  })
}

console.log('Starting demo server...')
const server = spawn('node', ['server/index.js'], { stdio: 'inherit', shell: true })

waitFor('http://localhost:4001')
  .then(() => {
    console.log('Server is up — starting Vite...')
    const vite = spawn('npx', ['vite'], { stdio: 'inherit', shell: true })

    const shutdown = () => {
      try { server.kill() } catch (e) {}
      try { vite.kill() } catch (e) {}
      process.exit()
    }
    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
    process.on('exit', shutdown)
  })
  .catch((err) => {
    console.error('Server did not start in time:', err.message)
    try { server.kill() } catch (e) {}
    process.exit(1)
  })
