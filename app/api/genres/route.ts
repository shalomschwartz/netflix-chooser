import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.WATCHMODE_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Missing API key' }, { status: 500 })

  const res = await fetch(`https://api.watchmode.com/v1/genres/?apiKey=${apiKey}`, {
    next: { revalidate: 86400 }, // cache for 24 hours
  })
  const data = await res.json()
  return NextResponse.json(data)
}
