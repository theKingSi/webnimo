export interface Episode {
  id: string
  number: number
  title: string
  duration: string
  thumbnail: string
  quality: string
  downloadUrl: string
}

export interface AnimeData {
  title: string
  description: string
  poster: string
  year: string
  status: string
  episodes: Episode[]
}

// New types for API integration
export interface JikanAnime {
  mal_id: number
  title: string
  title_english?: string
  title_japanese?: string
  synopsis?: string
  images: {
    jpg: {
      image_url: string
      large_image_url: string
    }
  }
  episodes?: number
  status: string
  aired: {
    from: string
    to?: string
  }
  score?: number
  genres: Array<{ name: string }>
  studios: Array<{ name: string }>
  year?: number
  rating?: string
  duration?: string
}

export interface AniListAnime {
  id: number
  title: {
    romaji: string
    english?: string
    native: string
  }
  description?: string
  coverImage: {
    large: string
    medium: string
  }
  episodes?: number
  status: string
  startDate: {
    year?: number
  }
  averageScore?: number
  genres: string[]
  studios: {
    nodes: Array<{ name: string }>
  }
  duration?: number
}

export interface SearchResult {
  id: string
  title: string
  englishTitle?: string
  description?: string
  poster: string
  year?: number
  episodes?: number
  status: string
  score?: number
  genres: string[]
  studios: string[]
  source: "jikan" | "anilist" | "kitsu"
  originalId: number
}

export interface AnimeEpisode {
  id: string
  number: number
  title: string
  duration: string
  thumbnail: string
  quality: string
  downloadUrl: string
  airDate?: string
  synopsis?: string
}

export interface DetailedAnimeData {
  id: string
  title: string
  englishTitle?: string
  description: string
  poster: string
  year?: number
  status: string
  episodes: AnimeEpisode[]
  totalEpisodes?: number
  genres: string[]
  studios: string[]
  score?: number
  source: "jikan" | "anilist" | "kitsu"
  originalId: number
}

export type SectionType = "new" | "trending" | "popular" | "action" | "romance" | "comedy" | "alphabetical"

export interface AnimeSections {
  new: SearchResult[]
  trending: SearchResult[]
  popular: SearchResult[]
  action: SearchResult[]
  romance: SearchResult[]
  comedy: SearchResult[]
  alphabetical: SearchResult[]
}
