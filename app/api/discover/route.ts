import { NextRequest, NextResponse } from 'next/server'
import { MOOD_GENRES, WatchmodeTitle } from '@/lib/watchmode'

const NETFLIX_SOURCE_ID = '203'
const WATCHMODE_BASE = 'https://api.watchmode.com/v1'
const FETCH_COUNT = 12

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const type = searchParams.get('type') || 'movie'
  const genre = searchParams.get('genre') || ''
  const mood = searchParams.get('mood') || ''
  const runtime = searchParams.get('runtime') || ''
  const rating = searchParams.get('rating') || ''
  const language = searchParams.get('language') || ''

  const apiKey = process.env.WATCHMODE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
  }

  // Watchmode type strings
  const types = type === 'tv' ? 'tv_series,tv_miniseries' : 'movie'

  // Genre IDs: explicit genre takes priority, otherwise use mood mapping
  let genreIds: number[] = []
  if (genre) {
    genreIds = [parseInt(genre)]
  } else if (mood && MOOD_GENRES[mood]) {
    genreIds = MOOD_GENRES[mood]
  }

  const params = new URLSearchParams({
    apiKey,
    source_ids: NETFLIX_SOURCE_ID,
    types,
    sort_by: 'popularity_desc',
    regions: 'US',
  })
  if (genreIds.length > 0) params.set('genres', genreIds.join(','))
  if (language) params.set('languages', language)

  try {
    const listRes = await fetch(`${WATCHMODE_BASE}/list-titles/?${params}`, {
      next: { revalidate: 3600 },
    })
    if (!listRes.ok) {
      const err = await listRes.json()
      return NextResponse.json({ error: err }, { status: listRes.status })
    }
    const listData = await listRes.json()
    const titles: { id: number }[] = (listData.titles || []).slice(0, FETCH_COUNT)

    // Fetch details in parallel
    const details: WatchmodeTitle[] = await Promise.all(
      titles.map((t) =>
        fetch(`${WATCHMODE_BASE}/title/${t.id}/details/?apiKey=${apiKey}`, {
          next: { revalidate: 3600 },
        }).then((r) => r.json())
      )
    )

    // Client-side runtime + rating filter
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
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
