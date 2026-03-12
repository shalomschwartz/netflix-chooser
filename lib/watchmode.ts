export const MOOD_OPTIONS = [
  { value: 'feel-good', label: 'Feel-Good' },
  { value: 'thrilling', label: 'Thrilling' },
  { value: 'scary', label: 'Scary' },
  { value: 'funny', label: 'Funny' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'adventurous', label: 'Adventurous' },
  { value: 'mind-bending', label: 'Mind-Bending' },
  { value: 'relaxing', label: 'Relaxing' },
]

// Mood → Watchmode genre names (resolved to real IDs at request time)
export const MOOD_GENRE_NAMES: Record<string, string[]> = {
  'feel-good':    ['Comedy', 'Family', 'Romance'],
  'thrilling':    ['Action & Adventure', 'Thriller', 'Crime'],
  'scary':        ['Horror', 'Mystery'],
  'funny':        ['Comedy'],
  'romantic':     ['Romance', 'Drama'],
  'adventurous':  ['Action & Adventure', 'Fantasy'],
  'mind-bending': ['Sci-Fi', 'Mystery', 'Thriller'],
  'relaxing':     ['Documentary', 'Family'],
}

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'ko', name: 'Korean' },
  { code: 'ja', name: 'Japanese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
]

export interface WatchmodeGenre {
  id: number
  name: string
}

export interface WatchmodeTitle {
  id: number
  name: string
  plot_overview: string
  type: string
  runtime_minutes: number
  year: number
  poster: string
  user_rating: number
  release_date: string
  genre_names: string[]
}
