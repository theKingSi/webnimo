import type { SearchResult } from "../types"

const KITSU_BASE_URL = "https://kitsu.io/api/edge"

interface KitsuAnime {
  id: string
  attributes: {
    canonicalTitle: string
    titles: {
      en?: string
      en_jp?: string
      ja_jp?: string
    }
    synopsis?: string
    posterImage?: {
      large?: string
      medium?: string
    }
    episodeCount?: number
    status: string
    startDate?: string
    averageRating?: string
    ageRating?: string
  }
}

export class KitsuAPI {
  private static async request(endpoint: string) {
    const response = await fetch(`${KITSU_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`Kitsu API error: ${response.status}`)
    }
    return response.json()
  }

  static async searchAnime(query: string, limit = 12): Promise<SearchResult[]> {
    try {
      const data = await this.request(`/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=${limit}`)

      return data.data.map((anime: KitsuAnime) => ({
        id: `kitsu-${anime.id}`,
        title: anime.attributes.canonicalTitle,
        englishTitle: anime.attributes.titles.en,
        description: anime.attributes.synopsis,
        poster: anime.attributes.posterImage?.large || anime.attributes.posterImage?.medium || "/placeholder.svg",
        year: anime.attributes.startDate ? new Date(anime.attributes.startDate).getFullYear() : undefined,
        episodes: anime.attributes.episodeCount,
        status: anime.attributes.status,
        score: anime.attributes.averageRating ? Number.parseFloat(anime.attributes.averageRating) / 10 : undefined,
        genres: [], // Kitsu requires separate API call for genres
        studios: [], // Kitsu requires separate API call for studios
        source: "kitsu" as const,
        originalId: Number.parseInt(anime.id),
      }))
    } catch (error) {
      console.error("Kitsu API error:", error)
      return []
    }
  }

  static async getTrendingAnime(limit = 12): Promise<SearchResult[]> {
    try {
      const data = await this.request(`/anime?sort=-averageRating&page[limit]=${limit}`)

      return data.data.map((anime: KitsuAnime) => ({
        id: `kitsu-${anime.id}`,
        title: anime.attributes.canonicalTitle,
        englishTitle: anime.attributes.titles.en,
        description: anime.attributes.synopsis,
        poster: anime.attributes.posterImage?.large || anime.attributes.posterImage?.medium || "/placeholder.svg",
        year: anime.attributes.startDate ? new Date(anime.attributes.startDate).getFullYear() : undefined,
        episodes: anime.attributes.episodeCount,
        status: anime.attributes.status,
        score: anime.attributes.averageRating ? Number.parseFloat(anime.attributes.averageRating) / 10 : undefined,
        genres: [],
        studios: [],
        source: "kitsu" as const,
        originalId: Number.parseInt(anime.id),
      }))
    } catch (error) {
      console.error("Kitsu API error:", error)
      return []
    }
  }
}
