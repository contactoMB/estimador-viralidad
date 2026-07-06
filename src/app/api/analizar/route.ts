import { NextResponse } from 'next/server'

const SPACE_URL = 'https://contactomundo-estimador-de-viralidad.hf.space'
const SPACE_SECRET = process.env.SPACE_SECRET || ''

export async function POST(req: Request) {
  try {
    const { filePath } = await req.json()

    if (!filePath) {
      return NextResponse.json({ error: 'No se recibio filePath' }, { status: 400 })
    }

    const predictRes = await fetch(`${SPACE_URL}/gradio_api/call/analizar_video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          { path: filePath, meta: { _type: 'gradio.FileData' } },
          SPACE_SECRET
        ]
      }),
    })

    if (!predictRes.ok) throw new Error(`Error prediciendo: ${predictRes.status}`)

    const { event_id } = await predictRes.json()

    const resultRes = await fetch(`${SPACE_URL}/gradio_api/call/analizar_video/${event_id}`)
    const text = await resultRes.text()
    const lines = text.split('\n').filter((l: string) => l.startsWith('data:'))
    const lastLine = lines[lines.length - 1]
    const resultData = JSON.parse(lastLine.replace('data: ', ''))
    const jsonString = resultData[0]
    const resultado = JSON.parse(jsonString)

    if (resultado.error) throw new Error(resultado.error)

    return NextResponse.json({
      scores: resultado.scores,
      total: resultado.total,
      transcripcion: resultado.transcripcion || '',
    })
  } catch (error) {
    console.error('Error analizar:', error)
    return NextResponse.json({ error: 'Error al analizar' }, { status: 500 })
  }
}