import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { transcripcion, scores, total } = await req.json()

    const lineas = [
      'Eres el director de contenido de Mundo Barefoot, marca de calzado minimalista de Chile.',
      '',
      'IDENTIDAD DE MARCA:',
      '- Frase madre: El pie nunca fue el problema. El zapato si.',
      '- Tono: Directo, declarativo, filosofico. Educa antes de vender.',
      '- NUNCA usar: lenguaje de venta generico, urgencia artificial.',
      '- SI usar: libertad natural, movimiento natural, barefoot, calzado minimalista.',
      '',
      'ANALISIS DEL VIDEO (Score: ' + total + '/100):',
      '- Recompensa emocional: ' + scores.emocion + '/100',
      '- Impacto visual: ' + scores.visual + '/100',
      '- Enganche auditivo: ' + scores.audio + '/100',
      '- Narrativa: ' + scores.narrativa + '/100',
      '',
      transcripcion
        ? 'Transcripcion real del video: ' + transcripcion
        : 'Sin transcripcion disponible.',
      '',
      'TU TAREA:',
      '1. Identifica el punto debil mas critico del video basandote en la transcripcion',
      '2. Explica en 2 lineas concretas por que baja el potencial viral',
      '3. Reescribe el guion con un hook poderoso en los primeros 3 segundos usando frases reales del video',
      '4. Da 3 hooks alternativos especificos al contenido: emocional, autoridad e identidad',
      '',
      'Responde en espanol. Se MUY concreto y accionable. Usa el contenido real de la transcripcion.',
    ]

    const prompt = lineas.join('\n')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const text = await response.text()
    console.log('Anthropic raw:', text.slice(0, 300))

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { error: 'Respuesta invalida de Anthropic: ' + text.slice(0, 200) },
        { status: 500 }
      )
    }

    const guion = data.content?.[0]?.text || 'Sin contenido en la respuesta.'

    return NextResponse.json({ guion })

  } catch (error) {
    console.error('Error Anthropic:', error)
    return NextResponse.json({ error: 'Error al generar guion' }, { status: 500 })
  }
}