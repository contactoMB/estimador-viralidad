'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SPACE_URL = 'https://contactomundo-estimador-de-viralidad.hf.space'

type SpaceStatus = 'checking' | 'ready' | 'sleeping' | 'error'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [spaceStatus, setSpaceStatus] = useState<SpaceStatus>('checking')
  const router = useRouter()

  useEffect(() => {
    checkSpaceStatus()
  }, [])

  const checkSpaceStatus = async () => {
    setSpaceStatus('checking')
    try {
      const res = await fetch(`${SPACE_URL}/gradio_api/queue/status`, {
        signal: AbortSignal.timeout(10000)
      })
      if (res.ok) {
        setSpaceStatus('ready')
      } else {
        setSpaceStatus('sleeping')
      }
    } catch {
      setSpaceStatus('sleeping')
    }
  }

  const handleLogin = async () => {
    if (!password) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/')
      } else {
        setError('Contraseña incorrecta.')
      }
    } catch {
      setError('No se pudo conectar.')
    }
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  const statusConfig = {
    checking: { color: '#f5a623', dot: '#f5a623', text: 'Verificando servidor...' },
    ready:    { color: '#4caf6e', dot: '#4caf6e', text: 'Servidor listo' },
    sleeping: { color: '#ef4444', dot: '#ef4444', text: 'Servidor dormido — puede tardar ~1 min en despertar' },
    error:    { color: '#ef4444', dot: '#ef4444', text: 'Error de conexión' },
  }

  const status = statusConfig[spaceStatus]

  return (
    <main style={{ minHeight: '100vh', background: '#111f14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      {/* Status del Space */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#1a2e1a', borderBottom: '0.5px solid #2d4a35', padding: '8px 32px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: status.dot }} />
        <span style={{ fontSize: '12px', color: status.color, letterSpacing: '0.1em' }}>{status.text}</span>
        {spaceStatus === 'sleeping' && (
          <button onClick={checkSpaceStatus} style={{ marginLeft: '8px', fontSize: '11px', color: '#f5a623', background: 'transparent', border: '0.5px solid #f5a623', padding: '2px 10px', cursor: 'pointer', letterSpacing: '0.1em' }}>
            Reintentar
          </button>
        )}
      </div>

      {/* Logo */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <img src="/logo-mb.png" alt="Mundo Barefoot" style={{ height: '56px', filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
      </div>

      {/* Título */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p style={{ fontSize: '18px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#e8f5e9', fontWeight: 700, marginBottom: '6px' }}>
          Estimador de Viralidad
        </p>
        <p style={{ fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4a6b52' }}>
          Mundo Barefoot — Uso interno
        </p>
      </div>

      {/* Formulario */}
      <div style={{ width: '100%', maxWidth: '360px', padding: '0 24px' }}>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: `0.5px solid ${error ? '#ef4444' : '#2d4a35'}`,
            color: '#e8f5e9',
            fontSize: '14px',
            letterSpacing: '0.1em',
            padding: '12px 0',
            outline: 'none',
            marginBottom: '32px',
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <p style={{ fontSize: '13px', color: '#ef4444', letterSpacing: '0.1em', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading || !password}
          style={{
            width: '100%',
            border: '0.5px solid #f5a623',
            background: 'transparent',
            color: '#f5a623',
            padding: '16px',
            fontSize: '13px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: loading || !password ? 'not-allowed' : 'pointer',
            opacity: loading || !password ? 0.4 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? 'Verificando...' : 'Entrar'}
        </button>
      </div>
    </main>
  )
}