export const GENRES = [
  { id: 1, name: 'Action & Adventure' },
  { id: 3, name: 'Comedy' },
  { id: 4, name: 'Crime' },
  { id: 5, name: 'Documentary' },
  { id: 6, name: 'Drama' },
  { id: 7, name: 'Family' },
  { id: 8, name: 'Fantasy' },
  { id: 11, name: 'Horror' },
  { id: 14, name: 'Mystery' },
  { id: 16, name: 'Romance' },
  { id: 17, name: 'Sci-Fi' },
  { id: 19, name: 'Thriller' },
]

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

// Watchmode genre IDs
export const MOOD_GENRES: Record<string, number[]> = {
  'feel-good':    [3, 7, 16],       // Comedy, Family, Romance
  'thrilling':    [1, 19, 4],       // Action, Thriller, Crime
  'scary':        [11, 14],         // Horror, Mystery
  'funny':        [3],              // Comedy
  'romantic':     [16, 6],          // Romance, Drama
  'adventurous':  [1, 8],           // Action, Fantasy
  'mind-bending': [17, 14, 19],     // Sci-Fi, Mystery, Thriller
  'relaxing':     [5, 7],           // Documentary, Family
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
