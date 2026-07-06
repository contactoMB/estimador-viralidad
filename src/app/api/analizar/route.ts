import { NextResponse } from 'next/server'

const SPACE_URL = 'https://contactomundo-estimador-de-viralidad.hf.space'
const SPACE_SECRET = process.env.SPACE_SECRET || ''

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const video = formData.get('video') as File

    if (!video) {
      return NextResponse.json({ error: 'No video' }, { status: 400 })
    }

    // Paso 1: Subir el video al Space
    const uploadForm = new FormData()
    const videoBuffer = await video.arrayBuffer()
    const cleanName = 'video_' + Date.now() + '.mp4'
    const videoFile = new File([videoBuffer], cleanName, {
      type: video.type || 'video/mp4'
    })
    uploadForm.append('files', videoFile)

    const uploadRes = await fetch(`${SPACE_URL}/gradio_api/upload`, {
      method: 'POST',
      body: uploadForm,
    })

    if (!uploadRes.ok) {
      throw new Error(`Error subiendo: ${uploadRes.status}`)
    }

    const uploaded = await uploadRes.json()
    const filePath = uploaded[0]
    console.log('File path:', filePath)

    // Paso 2: Llamar al modelo con el formato correcto de Gradio 6
    const predictRes = await fetch(`${SPACE_URL}/gradio_api/call/analizar_video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          {
            path: filePath,
            meta: { _type: 'gradio.FileData' }
          },
          SPACE_SECRET
        ]
      }),
    })

    if (!predictRes.ok) {
      const text = await predictRes.text()
      throw new Error(`Error prediciendo: ${predictRes.status} - ${text.slice(0, 200)}`)
    }

    const { event_id } = await predictRes.json()
    console.log('Event ID:', event_id)

    // Paso 3: Obtener el resultado
    const resultRes = await fetch(
      `${SPACE_URL}/gradio_api/call/analizar_video/${event_id}`
    )

    const text = await resultRes.text()
    console.log('Result:', text.slice(0, 300))

    const lines = text.split('\n').filter((l: string) => l.startsWith('data:'))
    const lastLine = lines[lines.length - 1]
    const resultData = JSON.parse(lastLine.replace('data: ', ''))
    const jsonString = resultData[0]
    const resultado = JSON.parse(jsonString)

    if (resultado.error) {
      throw new Error(resultado.error)
    }

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