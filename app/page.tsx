'use client'

import { useState } from 'react'
import { GENRES, MOOD_OPTIONS, LANGUAGES, WatchmodeTitle } from '@/lib/watchmode'
import MediaCard from '@/components/MediaCard'

const RATINGS = [
  { value: '6', label: '6+' },
  { value: '7', label: '7+' },
  { value: '8', label: '8+' },
]

const RUNTIMES = [
  { value: 'short', label: 'Short (< 90 min)' },
  { value: 'medium', label: 'Medium (90–120 min)' },
  { value: 'long', label: 'Long (> 120 min)' },
]

export default function Home() {
  const [type, setType] = useState('movie')
  const [genre, setGenre] = useState('')
  const [mood, setMood] = useState('')
  const [runtime, setRuntime] = useState('')
  const [rating, setRating] = useState('')
  const [language, setLanguage] = useState('')
  const [results, setResults] = useState<WatchmodeTitle[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleFind() {
    setLoading(true)
    setSearched(true)
    const params = new URLSearchParams({ type })
    if (genre) params.set('genre', genre)
    if (mood) params.set('mood', mood)
    if (runtime) params.set('runtime', runtime)
    if (rating) params.set('rating', rating)
    if (language) params.set('language', language)

    const res = await fetch(`/api/discover?${params}`)
    const data = await res.json()
    setResults(data.results || [])
    setLoading(false)
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">What to Watch</h1>
          <p className="text-gray-400">Find something great on Netflix</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Type</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                value={type}
                onChange={(e) => { setType(e.target.value); setGenre('') }}
              >
                <option value="movie">Movie</option>
                <option value="tv">TV Show</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Genre</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="">Any</option>
                {GENRES.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Mood</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              >
                <option value="">Any</option>
                {MOOD_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Runtime</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                value={runtime}
                onChange={(e) => setRuntime(e.target.value)}
                disabled={type === 'tv'}
              >
                <option value="">Any</option>
                {RUNTIMES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Min Rating</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">Any</option>
                {RATINGS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Language</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="">Any</option>
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleFind}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg py-3 font-semibold transition-colors"
          >
            {loading ? 'Finding...' : 'Find Something to Watch'}
          </button>
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center text-gray-400 py-20 text-lg">Searching Netflix...</div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            <p className="text-lg mb-2">No results found</p>
            <p className="text-sm">Try loosening your filters</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
