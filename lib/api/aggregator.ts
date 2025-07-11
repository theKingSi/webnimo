import { JikanAPI } from "./jikan"
import { AniListAPI } from "./anilist"
import { KitsuAPI } from "./kitsu"
import type { SearchResult } from "../types"

export class AnimeAggregator {
  static async searchAll(query: string): Promise<SearchResult[]> {
    try {
      // Search all APIs concurrently
      const [jikanResults, anilistResults, kitsuResults] = await Promise.allSettled([
        JikanAPI.searchAnime(query, 8),
        AniListAPI.searchAnime(query, 8),
        KitsuAPI.searchAnime(query, 8),
      ])

      const allResults: SearchResult[] = []

      // Collect results from successful API calls
      if (jikanResults.status === "fulfilled") {
        allResults.push(...jikanResults.value)
      }
      if (anilistResults.status === "fulfilled") {
        allResults.push(...anilistResults.value)
      }
      if (kitsuResults.status === "fulfilled") {
        allResults.push(...kitsuResults.value)
      }

      // Remove duplicates based on title similarity
      const uniqueResults = this.removeDuplicates(allResults)

      // Sort by score (highest first) and limit results
      return uniqueResults.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 24)
    } catch (error) {
      console.error("Search aggregation error:", error)
      return []
    }
  }

  static async getTrending(): Promise<SearchResult[]> {
    try {
      const [jikanResults, anilistResults] = await Promise.allSettled([
        JikanAPI.getTopAnime(12),
        AniListAPI.getTrendingAnime(12),
      ])

      const allResults: SearchResult[] = []

      if (jikanResults.status === "fulfilled") {
        allResults.push(...jikanResults.value)
      }
      if (anilistResults.status === "fulfilled") {
        allResults.push(...anilistResults.value)
      }

      const uniqueResults = this.removeDuplicates(allResults)
      return uniqueResults.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 20)
    } catch (error) {
      console.error("Trending aggregation error:", error)
      return []
    }
  }

  static async getNewReleases(): Promise<SearchResult[]> {
    try {
      const results = await JikanAPI.getCurrentSeason(16)
      return results.sort((a, b) => (b.year || 0) - (a.year || 0))
    } catch (error) {
      console.error("New releases error:", error)
      return []
    }
  }

  static async getPopular(): Promise<SearchResult[]> {
    try {
      const results = await JikanAPI.getTopAnime(20)
      return results
    } catch (error) {
      console.error("Popular anime error:", error)
      return []
    }
  }

  static async getByGenre(genre: string): Promise<SearchResult[]> {
    try {
      const results = await JikanAPI.getAnimeByGenre(genre, 16)
      return results
    } catch (error) {
      console.error(`${genre} anime error:`, error)
      return []
    }
  }

  static async getAllAlphabetical(): Promise<SearchResult[]> {
    try {
      const results = await JikanAPI.getTopAnime(50)
      return results.sort((a, b) => a.title.localeCompare(b.title))
    } catch (error) {
      console.error("Alphabetical anime error:", error)
      return []
    }
  }

  private static removeDuplicates(results: SearchResult[]): SearchResult[] {
    const seen = new Map<string, SearchResult>()

    for (const result of results) {
      const normalizedTitle = this.normalizeTitle(result.title)

      if (!seen.has(normalizedTitle)) {
        seen.set(normalizedTitle, result)
      } else {
        // Keep the result with higher score or from preferred source
        const existing = seen.get(normalizedTitle)!
        if ((result.score || 0) > (existing.score || 0) || (result.source === "jikan" && existing.source !== "jikan")) {
          seen.set(normalizedTitle, result)
        }
      }
    }

    return Array.from(seen.values())
  }

  private static normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  }
}
