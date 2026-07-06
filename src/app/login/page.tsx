'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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

  return (
    <main style={{ minHeight: '100vh', background: '#111f14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      {/* Logo */}
      <div style={{ marginBottom: '80px', textAlign: 'center' }}>
        <img
          src="https://mundobarefoot.cl/cdn/shop/files/ORIGINAL_MUNDO_BAREFOOT_Mesa_de_trabajo_1_copia_2.png"
          alt="Mundo Barefoot"
          style={{ height: '56px', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
        />
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