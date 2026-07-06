'use client'

import { useState, useRef, useEffect } from 'react'

type Scores = { emocion: number; visual: number; audio: number; narrativa: number }
type Etapa = { id: string; label: string; pct: number; activa: boolean; completa: boolean }

function getMensaje(total: number) {
  if (total < 65) return {
    color: '#ef4444',
    emoji: '🚫',
    titulo: 'NO TESTEAR',
    texto: 'El cerebro no engancha. Este video no tiene el estimulo minimo para detener el scroll. Reescribir antes de invertir.',
  }
  if (total < 75) return {
    color: '#f5a623',
    emoji: '⚠️',
    titulo: 'TESTEAR CON MONITOREO',
    texto: 'Hay senal, pero debil. Lanza con presupuesto minimo y medi las primeras 6 horas antes de escalar.',
  }
  if (total < 85) return {
    color: '#4caf6e',
    emoji: '🚀',
    titulo: 'LANZAR',
    texto: 'Activacion cerebral alta. Este video tiene lo necesario para generar resultados reales. Verde para lanzar.',
  }
  return {
    color: '#f5a623',
    emoji: '🔥',
    titulo: 'CONTENIDO ESTRELLA',
    texto: 'Esto es un activo. Alta activacion en todas las dimensiones. Escala el presupuesto sin dudar.',
  }
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value < 65 ? '#ef4444' : value < 75 ? '#f5a623' : '#4caf6e'
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8aab7a' }}>{label}</span>
        <span style={{ fontSize: '13px', color: '#4a6b52' }}>{value}/100</span>
      </div>
      <div style={{ background: '#2d4a35', height: '1px', width: '100%' }}>
        <div style={{ background: color, height: '1px', width: `${value}%`, transition: 'width 0.7s ease' }} />
      </div>
    </div>
  )
}

function EtapaBar({ label, pct, activa, completa }: { label: string; pct: number; activa: boolean; completa: boolean }) {
  const color = completa ? '#4caf6e' : activa ? '#f5a623' : '#2d4a35'
  const textColor = completa ? '#4caf6e' : activa ? '#ffffff' : '#4a6b52'
  const width = completa ? 100 : activa ? pct : 0
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', color: textColor }}>
          {completa ? '✓ ' : activa ? '→ ' : ''}{label}
        </span>
        <span style={{ fontSize: '13px', color: '#4a6b52' }}>{width}%</span>
      </div>
      <div style={{ background: '#2d4a35', height: '1px', width: '100%' }}>
        <div style={{ background: color, height: '1px', width: `${width}%`, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}

const ETAPAS_INIT: Etapa[] = [
  { id: 'upload',  label: 'Subiendo video',            pct: 0, activa: false, completa: false },
  { id: 'audio',   label: 'Extrayendo audio',          pct: 0, activa: false, completa: false },
  { id: 'tribev2', label: 'Analizando con TribeV2',    pct: 0, activa: false, completa: false },
  { id: 'visual',  label: 'Procesando impacto visual', pct: 0, activa: false, completa: false },
  { id: 'scores',  label: 'Calculando scores finales', pct: 0, activa: false, completa: false },
]

const TIEMPO_TRIBEV2_MS = 300000

function CerebroAnimado() {
  const mountRef = useRef<HTMLDivElement>(null)
  const initDone = useRef(false)

  useEffect(() => {
    if (initDone.current || !mountRef.current) return
    initDone.current = true
    const el = mountRef.current

    const init = () => {
      const THREE = (window as any).THREE
      if (!THREE || !el) return

      const w = el.offsetWidth || 500
      const h = 220

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(w, h)
      renderer.setClearColor(0x000000, 0)
      el.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100)
      camera.position.z = 4.5

      const cerebro = new THREE.Group()
      scene.add(cerebro)

      const matWire = new THREE.MeshBasicMaterial({ color: 0xaaffcc, wireframe: true, transparent: true, opacity: 0.18 })

      const hemiLGeo = new THREE.SphereGeometry(0.88, 18, 14, 0, Math.PI)
      hemiLGeo.scale(1.1, 0.92, 1.0)
      const hemiL = new THREE.Mesh(hemiLGeo, matWire)
      hemiL.position.set(-0.15, 0.05, 0)
      cerebro.add(hemiL)

      const hemiRGeo = new THREE.SphereGeometry(0.88, 18, 14, Math.PI, Math.PI)
      hemiRGeo.scale(1.1, 0.92, 1.0)
      const hemiR = new THREE.Mesh(hemiRGeo, matWire)
      hemiR.position.set(0.15, 0.05, 0)
      cerebro.add(hemiR)

      const cerebeloGeo = new THREE.SphereGeometry(0.35, 12, 10)
      cerebeloGeo.scale(1.3, 0.65, 0.85)
      const cerebelo = new THREE.Mesh(cerebeloGeo, new THREE.MeshBasicMaterial({ color: 0xaaffcc, wireframe: true, transparent: true, opacity: 0.12 }))
      cerebelo.position.set(0, -0.72, -0.5)
      cerebro.add(cerebelo)

      const surcoMat = new THREE.MeshBasicMaterial({ color: 0x88ffbb, wireframe: true, transparent: true, opacity: 0.22 })
      const surcos = [
        { r: 0.9, arc: 0.65, rx: 0.15, ry: 0.0, rz: 0.0, px: -0.15, py: 0.15 },
        { r: 0.9, arc: 0.55, rx: -0.25, ry: 0.4, rz: 0.2, px: -0.15, py: 0.35 },
        { r: 0.9, arc: 0.75, rx: 0.45, ry: -0.15, rz: 0.1, px: -0.15, py: -0.05 },
        { r: 0.9, arc: 0.6, rx: 0.1, ry: 0.7, rz: -0.15, px: -0.15, py: 0.25 },
        { r: 0.9, arc: 0.65, rx: 0.15, ry: 0.0, rz: 0.0, px: 0.15, py: 0.15 },
        { r: 0.9, arc: 0.7, rx: -0.25, ry: 0.4, rz: 0.2, px: 0.15, py: 0.35 },
        { r: 0.9, arc: 0.5, rx: 0.45, ry: -0.15, rz: 0.1, px: 0.15, py: -0.05 },
        { r: 0.9, arc: 0.8, rx: 0.1, ry: 0.7, rz: -0.15, px: 0.15, py: 0.25 },
      ]
      surcos.forEach(s => {
        const geo = new THREE.TorusGeometry(s.r, 0.03, 4, 18, Math.PI * s.arc)
        const mesh = new THREE.Mesh(geo, surcoMat)
        mesh.rotation.set(s.rx, s.ry, s.rz)
        mesh.position.set(s.px, s.py, 0)
        cerebro.add(mesh)
      })

      const nodePositions = [
        [0.6, 0.45, 0.5], [-0.6, 0.45, 0.5],
        [0.65, 0.0, 0.35], [-0.65, 0.0, 0.35],
        [0.4, -0.25, 0.6], [-0.4, -0.25, 0.6],
        [0.2, 0.6, 0.1], [-0.2, 0.6, 0.1],
        [0.55, 0.3, -0.2], [-0.55, 0.3, -0.2],
        [0.0, 0.1, 0.85], [0.0, -0.1, 0.85],
      ]
      const nodeMats: any[] = []
      const nodeColors = [0xf5a623, 0x4caf6e, 0xffffff, 0xf5a623, 0x4caf6e, 0xffffff, 0xf5a623, 0x4caf6e, 0xffffff, 0xf5a623, 0x4caf6e, 0xffffff]
      const nodeMeshes: any[] = []

      nodePositions.forEach((pos, i) => {
        const mat = new THREE.MeshBasicMaterial({ color: nodeColors[i], transparent: true, opacity: 0.9 })
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), mat)
        mesh.position.set(pos[0], pos[1], pos[2])
        cerebro.add(mesh)
        nodeMats.push({ mat, fase: Math.random() * Math.PI * 2 })
        nodeMeshes.push(mesh)
      })

      const lineMat = new THREE.LineBasicMaterial({ color: 0x55cc88, transparent: true, opacity: 0.25 })
      const conexiones = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,10],[5,10],[6,0],[7,1],[8,2],[9,3],[10,11],[0,6],[1,7]]
      conexiones.forEach(([a, b]) => {
        const points = [
          new THREE.Vector3(...nodePositions[a] as [number, number, number]),
          new THREE.Vector3(...nodePositions[b] as [number, number, number]),
        ]
        const geo = new THREE.BufferGeometry().setFromPoints(points)
        cerebro.add(new THREE.Line(geo, lineMat))
      })

      const pGeo = new THREE.BufferGeometry()
      const pPos = new Float32Array(60 * 3)
      for (let i = 0; i < 60; i++) { pPos[i*3] = (Math.random()-0.5)*8; pPos[i*3+1] = (Math.random()-0.5)*4; pPos[i*3+2] = (Math.random()-0.5)*3 }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
      scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x4caf6e, size: 0.018, transparent: true, opacity: 0.3 })))

      let frame = 0
      let animId: number
      const animate = () => {
        animId = requestAnimationFrame(animate)
        frame++
        cerebro.rotation.y += 0.004
        cerebro.rotation.x = Math.sin(frame * 0.003) * 0.06
        nodeMats.forEach((n, i) => {
          const t = frame * 0.06 + n.fase
          n.mat.opacity = 0.4 + Math.abs(Math.sin(t)) * 0.9
          nodeMeshes[i].scale.setScalar(0.6 + Math.abs(Math.sin(t)) * 0.8)
        })
        renderer.render(scene, camera)
      }
      animate()
      ;(el as any)._cleanup = () => { cancelAnimationFrame(animId); renderer.dispose() }
    }

    const existing = document.getElementById('three-mb')
    if (existing) {
      if ((window as any).THREE) init()
      else existing.addEventListener('load', init)
    } else {
      const s = document.createElement('script')
      s.id = 'three-mb'
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
      s.onload = init
      document.head.appendChild(s)
    }
    return () => { if ((mountRef.current as any)?._cleanup) (mountRef.current as any)._cleanup() }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '220px' }} />
}


export default function Dashboard() {
  const [dragging, setDragging] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoURL, setVideoURL] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [etapas, setEtapas] = useState<Etapa[]>(ETAPAS_INIT)
  const [scores, setScores] = useState<Scores | null>(null)
  const [total, setTotal] = useState<number | null>(null)
  const [guion, setGuion] = useState<string | null>(null)
  const [loadingGuion, setLoadingGuion] = useState(false)
  const [errorGuion, setErrorGuion] = useState<string | null>(null)
  const [transcripcion, setTranscripcion] = useState<string>('')
  const tribeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const setVideo = (file: File) => {
    setVideoFile(file)
    setVideoURL(URL.createObjectURL(file))
    setScores(null); setTotal(null); setGuion(null)
    setErrorGuion(null); setEtapas(ETAPAS_INIT); setTranscripcion('')
  }
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('video/')) setVideo(f) }
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) setVideo(f) }
  const setEtapaState = (id: string, patch: Partial<Etapa>) => setEtapas(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))

  const handleAnalizar = async () => {
    if (!videoFile) return
    setLoading(true); setEtapas(ETAPAS_INIT)
    setEtapaState('upload', { activa: true, pct: 5 })
    let uploadPct = 5
    const uploadTimer = setInterval(() => { uploadPct = Math.min(uploadPct + 20, 90); setEtapaState('upload', { pct: uploadPct }) }, 400)
    try {
      const formData = new FormData(); formData.append('video', videoFile)
      const fetchPromise = fetch('/api/analizar', { method: 'POST', body: formData })
      await new Promise(r => setTimeout(r, 2000))
      clearInterval(uploadTimer); setEtapaState('upload', { activa: false, completa: true, pct: 100 })
      setEtapaState('audio', { activa: true, pct: 10 })
      await new Promise(r => setTimeout(r, 3000))
      setEtapaState('audio', { activa: false, completa: true, pct: 100 })
      setEtapaState('tribev2', { activa: true, pct: 1 })
      let tribePct = 1
      tribeTimerRef.current = setInterval(() => { tribePct = Math.min(tribePct + 1, 95); setEtapaState('tribev2', { pct: tribePct }) }, TIEMPO_TRIBEV2_MS / 95)
      const res = await fetchPromise
      if (tribeTimerRef.current) clearInterval(tribeTimerRef.current)
      setEtapaState('tribev2', { activa: false, completa: true, pct: 100 })
      setEtapaState('visual', { activa: true, pct: 20 })
      await new Promise(r => setTimeout(r, 800))
      setEtapaState('visual', { activa: false, completa: true, pct: 100 })
      setEtapaState('scores', { activa: true, pct: 50 })
      const data = await res.json()
      await new Promise(r => setTimeout(r, 400))
      setEtapaState('scores', { activa: false, completa: true, pct: 100 })
      setScores(data.scores)
      setTotal(data.total)
      setTranscripcion(data.transcripcion || '')
    } catch (err) { console.error(err); if (tribeTimerRef.current) clearInterval(tribeTimerRef.current) }
    setLoading(false)
  }

  const handleGenerarGuion = async () => {
    if (!scores || total === null) return
    setLoadingGuion(true); setErrorGuion(null); setGuion(null)
    try {
      const res = await fetch('/api/generar-guion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores, total, transcripcion })
      })
      const data = await res.json()
      if (data.guion) setGuion(data.guion); else setErrorGuion(data.error || 'Error inesperado.')
    } catch { setErrorGuion('No se pudo conectar.') }
    setLoadingGuion(false)
  }

  const handleReset = () => {
    setVideoFile(null); setVideoURL(null); setScores(null); setTotal(null)
    setGuion(null); setErrorGuion(null); setEtapas(ETAPAS_INIT); setTranscripcion('')
    if (tribeTimerRef.current) clearInterval(tribeTimerRef.current)
  }

  const mensaje = total !== null ? getMensaje(total) : null

  return (
    <main style={{ minHeight: '100vh', background: '#111f14' }}>
      <header style={{ borderBottom: '0.5px solid #2d4a35', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '16px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e8f5e9', fontWeight: 700 }}>Estimador de Viralidad</span>
        <img src="/logo-mb.png" alt="Mundo Barefoot" style={{ height: '48px', filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
      </header>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px' }}>

        {videoURL && (
          <div style={{ marginBottom: '24px' }}>
            <video src={videoURL} style={{ width: '100%', maxHeight: '260px', objectFit: 'contain', background: '#1a2e1a', borderRadius: '2px' }} controls muted />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '13px', color: '#4a6b52' }}>{videoFile?.name}</span>
              {!loading && !scores && (
                <label style={{ cursor: 'pointer', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6aab7a', textDecoration: 'underline' }}>
                  Cambiar<input type="file" accept="video/*" style={{ display: 'none' }} onChange={handleFileInput} />
                </label>
              )}
            </div>
          </div>
        )}

        {!videoURL && (
          <div onDragOver={(e) => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}
            style={{ border: `0.5px solid ${dragging ? '#f5a623' : '#2d4a35'}`, padding: '64px 32px', textAlign: 'center', marginBottom: '24px', transition: 'border-color 0.2s' }}>
            <p style={{ fontSize: '14px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#e8f5e9', marginBottom: '10px' }}>Arrastra tu video aqui</p>
            <p style={{ fontSize: '14px', color: '#4a6b52', marginBottom: '28px' }}>o seleccionalo desde tu computadora</p>
            <label style={{ cursor: 'pointer', border: '0.5px solid #f5a623', color: '#f5a623', padding: '10px 28px', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Seleccionar video<input type="file" accept="video/*" style={{ display: 'none' }} onChange={handleFileInput} />
            </label>
          </div>
        )}

        {loading && (
          <div style={{ border: '0.5px solid #2d4a35', marginBottom: '24px' }}>
            <div style={{ borderBottom: '0.5px solid #2d4a35' }}>
              <CerebroAnimado />
            </div>
            <div style={{ padding: '28px' }}>
              <p style={{ fontSize: '13px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8aab7a', marginBottom: '24px' }}>Analizando activacion cerebral</p>
              {etapas.map(e => <EtapaBar key={e.id} label={e.label} pct={e.pct} activa={e.activa} completa={e.completa} />)}
              <p style={{ fontSize: '13px', color: '#4a6b52', marginTop: '20px', textAlign: 'center' }}>El analisis puede tardar entre 2 y 7 minutos. No cierres esta ventana.</p>
            </div>
          </div>
        )}

        {videoFile && !scores && !loading && (
          <button onClick={handleAnalizar} style={{ width: '100%', marginTop: '8px', border: '0.5px solid #f5a623', background: 'transparent', color: '#f5a623', padding: '16px', fontSize: '14px', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}>
            Analizar video
          </button>
        )}

        {scores && total !== null && mensaje && (
          <div>
            <div style={{ border: '0.5px solid #2d4a35', padding: '40px', marginBottom: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ fontSize: '80px', fontWeight: 300, color: mensaje.color, lineHeight: 1 }}>{total}</div>
                <div style={{ fontSize: '13px', color: '#4a6b52', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '8px 0 12px' }}>Score de viralidad</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  border: `0.5px solid ${mensaje.color}`, padding: '8px 20px',
                  marginBottom: '16px',
                }}>
                  <span style={{ fontSize: '16px' }}>{mensaje.emoji}</span>
                  <span style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: mensaje.color, fontWeight: 700 }}>{mensaje.titulo}</span>
                </div>
                <p style={{ fontSize: '13px', color: mensaje.color, marginTop: '4px', lineHeight: 1.6 }}>{mensaje.texto}</p>
              </div>
              <ScoreBar label="Recompensa emocional" value={scores.emocion} />
              <ScoreBar label="Impacto visual" value={scores.visual} />
              <ScoreBar label="Enganche auditivo" value={scores.audio} />
              <ScoreBar label="Narrativa" value={scores.narrativa} />
            </div>

            {!guion && !errorGuion && (
              <button onClick={handleGenerarGuion} disabled={loadingGuion} style={{ width: '100%', marginBottom: '12px', border: '0.5px solid #f5a623', background: 'transparent', color: '#f5a623', padding: '16px', fontSize: '14px', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', opacity: loadingGuion ? 0.5 : 1 }}>
                {loadingGuion ? 'Generando guion...' : 'Generar guion viral'}
              </button>
            )}

            {errorGuion && (
              <div style={{ border: '0.5px solid #4a1515', background: '#1a0a0a', padding: '20px', marginBottom: '12px' }}>
                <p style={{ fontSize: '13px', color: '#ef4444', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Error</p>
                <p style={{ fontSize: '14px', color: '#f87171' }}>{errorGuion}</p>
                <button onClick={handleGenerarGuion} style={{ marginTop: '12px', border: '0.5px solid #ef4444', color: '#ef4444', background: 'transparent', padding: '8px 16px', fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Reintentar</button>
              </div>
            )}

            {guion && (
              <div style={{ border: '0.5px solid #2d4a35', padding: '32px', marginBottom: '12px' }}>
                <p style={{ fontSize: '13px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8aab7a', marginBottom: '20px' }}>Guion viral generado</p>
                <div style={{ fontSize: '15px', color: '#e8f5e9', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{guion}</div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                  <button onClick={() => navigator.clipboard.writeText(guion)} style={{ border: '0.5px solid #f5a623', color: '#f5a623', background: 'transparent', padding: '10px 20px', fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Copiar guion</button>
                  <button onClick={() => { setGuion(null); setErrorGuion(null) }} style={{ border: '0.5px solid #2d4a35', color: '#6aab7a', background: 'transparent', padding: '10px 20px', fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Generar otro</button>
                </div>
              </div>
            )}

            <button onClick={handleReset} style={{ width: '100%', border: '0.5px solid #2d4a35', color: '#4a6b52', background: 'transparent', padding: '12px', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Analizar otro video
            </button>
          </div>
        )}
      </div>
    </main>
  )
}