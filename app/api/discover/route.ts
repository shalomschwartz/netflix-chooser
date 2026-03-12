import { NextRequest, NextResponse } from 'next/server'
import { MOOD_GENRE_NAMES, WatchmodeGenre, WatchmodeTitle } from '@/lib/watchmode'

const NETFLIX_SOURCE_ID = '203'
const WATCHMODE_BASE = 'https://api.watchmode.com/v1'
const FETCH_COUNT = 20

async function getGenreMap(apiKey: string): Promise<Map<string, number>> {
  const res = await fetch(`${WATCHMODE_BASE}/genres/?apiKey=${apiKey}`, {
    next: { revalidate: 86400 },
  })
  const genres: WatchmodeGenre[] = await res.json()
  const map = new Map<string, number>()
  for (const g of genres ?? []) {
    map.set(g.name.toLowerCase(), g.id)
  }
  return map
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const type = searchParams.get('type') || 'movie'
  const genreId = searchParams.get('genre') || ''
  const mood = searchParams.get('mood') || ''
  const runtime = searchParams.get('runtime') || ''
  const rating = searchParams.get('rating') || ''
  const language = searchParams.get('language') || ''

  const apiKey = process.env.WATCHMODE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing WATCHMODE_API_KEY' }, { status: 500 })
  }

  const types = type === 'tv' ? 'tv_series,tv_miniseries' : 'movie'

  // Resolve genre IDs: explicit dropdown selection, or mood → names → real IDs
  let genreIds: number[] = []
  if (genreId) {
    genreIds = [parseInt(genreId)]
  } else if (mood && MOOD_GENRE_NAMES[mood]) {
    const genreMap = await getGenreMap(apiKey)
    genreIds = MOOD_GENRE_NAMES[mood]
      .map((name) => genreMap.get(name.toLowerCase()))
      .filter((id): id is number => id !== undefined)
  }

  const params = new URLSearchParams({
    apiKey,
    source_ids: NETFLIX_SOURCE_ID,
    types,
    sort_by: 'popularity_desc',
  })
  if (genreIds.length > 0) params.set('genres', genreIds.join(','))
  if (language) params.set('languages', language)

  const listUrl = `${WATCHMODE_BASE}/list-titles/?${params}`

  try {
    const listRes = await fetch(listUrl, { next: { revalidate: 3600 } })
    const listData = await listRes.json()

    if (!listRes.ok || listData.error) {
      console.error('Watchmode list-titles error:', JSON.stringify(listData))
      return NextResponse.json(
        { error: listData.error ?? `Watchmode returned ${listRes.status}` },
        { status: listRes.status || 500 }
      )
    }

    const titles: { id: number }[] = (listData.titles ?? []).slice(0, FETCH_COUNT)

    if (titles.length === 0) {
      return NextResponse.json({ results: [] })
    }

    // Fetch details in parallel; use allSettled so one failure doesn't kill all
    const settled = await Promise.allSettled(
      titles.map((t) =>
        fetch(`${WATCHMODE_BASE}/title/${t.id}/details/?apiKey=${apiKey}`, {
          next: { revalidate: 3600 },
        }).then((r) => r.json())
      )
    )

    const details: WatchmodeTitle[] = settled
      .filter((r): r is PromiseFulfilledResult<WatchmodeTitle> => r.status === 'fulfilled')
      .map((r) => r.value)
      .filter((d) => d && !('error' in d))

    const results = details.filter((d) => {
      if (rating && d.user_rating < parseFloat(rating)) return false
      if (type === 'movie' && runtime) {
        const mins = d.runtime_minutes
        if (runtime === 'short' && mins > 89) return false
        if (runtime === 'medium' && (mins < 90 || mins > 120)) return false
        if (runtime === 'long' && mins < 121) return false
      }
      return true
    })

    return NextResponse.json({ results })
  } catch (e) {
    console.error('Discover route error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
