import type { DetailedAnimeData, AnimeEpisode, SearchResult } from "../types"

export class EpisodeFetcher {
  static async fetchEpisodes(anime: SearchResult): Promise<DetailedAnimeData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate mock episodes based on the anime data
    const episodeCount = anime.episodes || Math.floor(Math.random() * 24) + 12
    const episodes: AnimeEpisode[] = []

    for (let i = 1; i <= episodeCount; i++) {
      episodes.push({
        id: `${anime.id}-episode-${i}`,
        number: i,
        title: `Episode ${i}: ${this.generateEpisodeTitle(anime.title, i)}`,
        duration: `${Math.floor(Math.random() * 5) + 20}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
        thumbnail: `/placeholder.svg?height=200&width=350&text=Episode+${i}`,
        quality: ["1080p", "720p", "480p"][Math.floor(Math.random() * 3)],
        downloadUrl: `#download-${anime.id}-episode-${i}`,
        airDate: this.generateAirDate(anime.year, i, episodeCount),
        synopsis: `Episode ${i} synopsis for ${anime.title}. This episode continues the story with exciting developments and character growth.`,
      })
    }

    return {
      id: anime.id,
      title: anime.title,
      englishTitle: anime.englishTitle,
      description: anime.description || `${anime.title} is an exciting anime series with ${episodeCount} episodes.`,
      poster: anime.poster,
      year: anime.year,
      status: anime.status,
      episodes,
      totalEpisodes: episodeCount,
      genres: anime.genres,
      studios: anime.studios,
      score: anime.score,
      source: anime.source,
      originalId: anime.originalId,
    }
  }

  private static generateEpisodeTitle(animeTitle: string, episodeNumber: number): string {
    const genericTitles = [
      "The Beginning",
      "New Challenges",
      "Unexpected Turn",
      "Rising Action",
      "The Truth Revealed",
      "Battle Begins",
      "Friendship and Rivalry",
      "Past Memories",
      "The Final Stand",
      "New Horizons",
      "Hidden Powers",
      "Confrontation",
      "Bonds of Trust",
      "The Journey Continues",
      "Secrets Unveiled",
      "Turning Point",
      "Last Hope",
      "Victory and Loss",
      "New Beginning",
      "The End of an Era",
    ]

    return genericTitles[episodeNumber % genericTitles.length] || `Episode ${episodeNumber}`
  }

  private static generateAirDate(year?: number, episodeNumber?: number, totalEpisodes?: number): string {
    if (!year) return new Date().toISOString().split("T")[0]

    const startDate = new Date(year, 0, 1)
    const weeksBetweenEpisodes = 1
    const episodeDate = new Date(startDate)
    episodeDate.setDate(startDate.getDate() + (episodeNumber || 1) * 7 * weeksBetweenEpisodes)

    return episodeDate.toISOString().split("T")[0]
  }
}
