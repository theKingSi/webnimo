import type { JikanAnime, SearchResult } from "../types"

const JIKAN_BASE_URL = "https://api.jikan.moe/v4"

const _cache = new Map<string, any>()
const CACHE_TTL = 1000 * 60 * 60 * 6 // 6 hours

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export class JikanAPI {
  private static async request(endpoint: string) {
    const now = Date.now()
    const cached = _cache.get(endpoint)
    if (cached && now - cached.timestamp < CACHE_TTL) return cached.data

    const fetchOnce = async () => {
      const res = await fetch(`${JIKAN_BASE_URL}${endpoint}`)
      if (res.status === 429) throw new Error("RATE_LIMIT")
      if (!res.ok) throw new Error(`Jikan API error: ${res.status}`)
      return res.json()
    }

    try {
      const data = await fetchOnce()
      _cache.set(endpoint, { data, timestamp: now })
      return data
    } catch (err) {
      if ((err as Error).message === "RATE_LIMIT") {
        // back-off once
        await sleep(500)
        try {
          const data = await fetchOnce()
          _cache.set(endpoint, { data, timestamp: now })
          return data
        } catch {
          console.warn(`Jikan 429 persisted for ${endpoint}, returning empty.`)
          return { data: [] } // ← graceful empty payload
        }
      }
      throw err
    }
  }

  static async searchAnime(query: string, limit = 12): Promise<SearchResult[]> {
    try {
      const data = await this.request(`/anime?q=${encodeURIComponent(query)}&limit=${limit}&order_by=popularity`)

      return data.data.map((anime: JikanAnime) => ({
        id: `jikan-${anime.mal_id}`,
        title: anime.title,
        englishTitle: anime.title_english,
        description: anime.synopsis,
        poster: anime.images.jpg.large_image_url,
        year: anime.year,
        episodes: anime.episodes,
        status: anime.status,
        score: anime.score,
        genres: anime.genres.map((g) => g.name),
        studios: anime.studios.map((s) => s.name),
        source: "jikan" as const,
        originalId: anime.mal_id,
      }))
    } catch (error) {
      console.error("Jikan API error:", error)
      return []
    }
  }

  static async getAnimeById(id: number): Promise<JikanAnime | null> {
    try {
      const data = await this.request(`/anime/${id}`)
      return data.data
    } catch (error) {
      console.error("Jikan API error:", error)
      return null
    }
  }

  static async getTopAnime(limit = 12): Promise<SearchResult[]> {
    try {
      const data = await this.request(`/top/anime?limit=${limit}`)

      return data.data.map((anime: JikanAnime) => ({
        id: `jikan-${anime.mal_id}`,
        title: anime.title,
        englishTitle: anime.title_english,
        description: anime.synopsis,
        poster: anime.images.jpg.large_image_url,
        year: anime.year,
        episodes: anime.episodes,
        status: anime.status,
        score: anime.score,
        genres: anime.genres.map((g) => g.name),
        studios: anime.studios.map((s) => s.name),
        source: "jikan" as const,
        originalId: anime.mal_id,
      }))
    } catch (error) {
      console.error("Jikan API error:", error)
      return []
    }
  }

  static async getCurrentSeason(limit = 12): Promise<SearchResult[]> {
    try {
      const data = await this.request(`/seasons/now?limit=${limit}`)

      return data.data.map((anime: JikanAnime) => ({
        id: `jikan-${anime.mal_id}`,
        title: anime.title,
        englishTitle: anime.title_english,
        description: anime.synopsis,
        poster: anime.images.jpg.large_image_url,
        year: anime.year,
        episodes: anime.episodes,
        status: anime.status,
        score: anime.score,
        genres: anime.genres.map((g) => g.name),
        studios: anime.studios.map((s) => s.name),
        source: "jikan" as const,
        originalId: anime.mal_id,
      }))
    } catch (error) {
      console.error("Jikan API error:", error)
      return []
    }
  }

  static async getAnimeByGenre(genre: string, limit = 12): Promise<SearchResult[]> {
    try {
      // Genre mapping for Jikan API
      const genreMap: Record<string, number> = {
        Action: 1,
        Adventure: 2,
        Comedy: 4,
        Drama: 8,
        Fantasy: 10,
        Romance: 22,
        "Sci-Fi": 24,
        Thriller: 41,
      }

      const genreId = genreMap[genre] || 1
      const data = await this.request(`/anime?genres=${genreId}&limit=${limit}&order_by=popularity`)

      return data.data.map((anime: JikanAnime) => ({
        id: `jikan-${anime.mal_id}`,
        title: anime.title,
        englishTitle: anime.title_english,
        description: anime.synopsis,
        poster: anime.images.jpg.large_image_url,
        year: anime.year,
        episodes: anime.episodes,
        status: anime.status,
        score: anime.score,
        genres: anime.genres.map((g) => g.name),
        studios: anime.studios.map((s) => s.name),
        source: "jikan" as const,
        originalId: anime.mal_id,
      }))
    } catch (error) {
      console.error("Jikan API error:", error)
      return []
    }
  }
}
