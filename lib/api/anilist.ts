import type { AniListAnime, SearchResult } from "../types"

const ANILIST_BASE_URL = "https://graphql.anilist.co"

export class AniListAPI {
  private static async request(query: string, variables: any = {}) {
    const response = await fetch(ANILIST_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    if (!response.ok) {
      throw new Error(`AniList API error: ${response.status}`)
    }

    const data = await response.json()
    if (data.errors) {
      throw new Error(`AniList GraphQL error: ${data.errors[0].message}`)
    }

    return data.data
  }

  static async searchAnime(query: string, limit = 12): Promise<SearchResult[]> {
    const searchQuery = `
      query ($search: String, $perPage: Int) {
        Page(perPage: $perPage) {
          media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
            id
            title {
              romaji
              english
              native
            }
            description
            coverImage {
              large
              medium
            }
            episodes
            status
            startDate {
              year
            }
            averageScore
            genres
            studios {
              nodes {
                name
              }
            }
            duration
          }
        }
      }
    `

    try {
      const data = await this.request(searchQuery, { search: query, perPage: limit })

      return data.Page.media.map((anime: AniListAnime) => ({
        id: `anilist-${anime.id}`,
        title: anime.title.romaji,
        englishTitle: anime.title.english,
        description: anime.description?.replace(/<[^>]*>/g, ""), // Remove HTML tags
        poster: anime.coverImage.large,
        year: anime.startDate.year,
        episodes: anime.episodes,
        status: anime.status,
        score: anime.averageScore ? anime.averageScore / 10 : undefined,
        genres: anime.genres,
        studios: anime.studios.nodes.map((s) => s.name),
        source: "anilist" as const,
        originalId: anime.id,
      }))
    } catch (error) {
      console.error("AniList API error:", error)
      return []
    }
  }

  static async getTrendingAnime(limit = 12): Promise<SearchResult[]> {
    const trendingQuery = `
      query ($perPage: Int) {
        Page(perPage: $perPage) {
          media(type: ANIME, sort: TRENDING_DESC) {
            id
            title {
              romaji
              english
              native
            }
            description
            coverImage {
              large
              medium
            }
            episodes
            status
            startDate {
              year
            }
            averageScore
            genres
            studios {
              nodes {
                name
              }
            }
            duration
          }
        }
      }
    `

    try {
      const data = await this.request(trendingQuery, { perPage: limit })

      return data.Page.media.map((anime: AniListAnime) => ({
        id: `anilist-${anime.id}`,
        title: anime.title.romaji,
        englishTitle: anime.title.english,
        description: anime.description?.replace(/<[^>]*>/g, ""),
        poster: anime.coverImage.large,
        year: anime.startDate.year,
        episodes: anime.episodes,
        status: anime.status,
        score: anime.averageScore ? anime.averageScore / 10 : undefined,
        genres: anime.genres,
        studios: anime.studios.nodes.map((s) => s.name),
        source: "anilist" as const,
        originalId: anime.id,
      }))
    } catch (error) {
      console.error("AniList API error:", error)
      return []
    }
  }
}
