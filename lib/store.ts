"use client"

import { create } from "zustand"
import type {
  AnimeData,
  SearchResult,
  DetailedAnimeData,
  SectionType,
  AnimeSections,
} from "./types"
import { AnimeAggregator } from "./api/aggregator"

interface AnimeStore {
  animeData: AnimeData | null
  detailedAnimeData: DetailedAnimeData | null
  selectedEpisodes: string[]
  error: string | null
  searchResults: SearchResult[]
  isSearching: boolean
  sections: AnimeSections
  isLoadingSection: Record<SectionType, boolean>
  isLoadingEpisodes: boolean
  downloadingEpisodes: Set<string>

  // Actions
  setAnimeData: (data: AnimeData) => void
  setDetailedAnimeData: (data: DetailedAnimeData | null) => void
  toggleEpisode: (episodeId: string) => void
  clearSelection: () => void
  setError: (error: string | null) => void
  setSearchResults: (results: SearchResult[]) => void
  setIsSearching: (loading: boolean) => void
  setIsLoadingEpisodes: (loading: boolean) => void
  setDownloadingEpisodes: (episodes: Set<string>) => void
  addDownloadingEpisode: (episodeId: string) => void
  removeDownloadingEpisode: (episodeId: string) => void
  clearSearch: () => void
  loadSection: (type: SectionType, force?: boolean) => Promise<void>
  loadAllSections: () => Promise<void>

  // Optional direct setters for trending
  setTrendingAnime: (results: SearchResult[]) => void
  setIsLoadingTrending: (loading: boolean) => void
}

export const useAnimeStore = create<AnimeStore>((set, get) => ({
  animeData: null,
  detailedAnimeData: null,
  selectedEpisodes: [],
  error: null,
  searchResults: [],
  isSearching: false,
  sections: {
    new: [],
    trending: [],
    popular: [],
    action: [],
    romance: [],
    comedy: [],
    alphabetical: [],
  },
  isLoadingSection: {
    new: false,
    trending: false,
    popular: false,
    action: false,
    romance: false,
    comedy: false,
    alphabetical: false,
  },
  isLoadingEpisodes: false,
  downloadingEpisodes: new Set(),

  setAnimeData: (data) => set({ animeData: data, error: null }),
  setDetailedAnimeData: (data) => set({ detailedAnimeData: data, error: null }),

  toggleEpisode: (episodeId) => {
    const { selectedEpisodes } = get()
    const isSelected = selectedEpisodes.includes(episodeId)
    set({
      selectedEpisodes: isSelected
        ? selectedEpisodes.filter((id) => id !== episodeId)
        : [...selectedEpisodes, episodeId],
    })
  },

  clearSelection: () => set({ selectedEpisodes: [] }),
  setError: (error) => set({ error, animeData: null, detailedAnimeData: null }),
  setSearchResults: (results) => set({ searchResults: results }),
  setIsSearching: (loading) => set({ isSearching: loading }),
  setIsLoadingEpisodes: (loading) => set({ isLoadingEpisodes: loading }),
  setDownloadingEpisodes: (episodes) => set({ downloadingEpisodes: episodes }),

  addDownloadingEpisode: (episodeId) => {
    const { downloadingEpisodes } = get()
    const newSet = new Set(downloadingEpisodes)
    newSet.add(episodeId)
    set({ downloadingEpisodes: newSet })
  },

  removeDownloadingEpisode: (episodeId) => {
    const { downloadingEpisodes } = get()
    const newSet = new Set(downloadingEpisodes)
    newSet.delete(episodeId)
    set({ downloadingEpisodes: newSet })
  },

  clearSearch: () => set({ searchResults: [], error: null }),

  loadSection: async (type: SectionType, force = false) => {
    const { sections, isLoadingSection } = get()

    if (!force && sections[type].length > 0) return
    if (isLoadingSection[type]) return

    set({
      isLoadingSection: { ...isLoadingSection, [type]: true },
    })

    try {
      let results: SearchResult[] = []

      switch (type) {
        case "new":
          results = await AnimeAggregator.getNewReleases()
          break
        case "trending":
          results = await AnimeAggregator.getTrending()
          break
        case "popular":
          results = await AnimeAggregator.getPopular()
          break
        case "action":
          results = await AnimeAggregator.getByGenre("Action")
          break
        case "romance":
          results = await AnimeAggregator.getByGenre("Romance")
          break
        case "comedy":
          results = await AnimeAggregator.getByGenre("Comedy")
          break
        case "alphabetical":
          results = await AnimeAggregator.getAllAlphabetical()
          break
      }

      set({
        sections: { ...sections, [type]: results },
        isLoadingSection: { ...isLoadingSection, [type]: false },
      })
    } catch (error) {
      console.error(`Failed to load ${type} section:`, error)
      set({
        isLoadingSection: { ...isLoadingSection, [type]: false },
      })
    }
  },

  loadAllSections: async () => {
    const sectionTypes: SectionType[] = [
      "new",
      "trending",
      "popular",
      "action",
      "romance",
      "comedy",
    ]

    for (let i = 0; i < sectionTypes.length; i++) {
      setTimeout(() => {
        get().loadSection(sectionTypes[i])
      }, i * 1000)
    }
  },

  // Optional direct setters for trending
  setTrendingAnime: (results) => {
    const { sections } = get()
    set({ sections: { ...sections, trending: results } })
  },

  setIsLoadingTrending: (loading) => {
    const { isLoadingSection } = get()
    set({ isLoadingSection: { ...isLoadingSection, trending: loading } })
  },
}))
