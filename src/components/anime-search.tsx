"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Loader2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AnimeGrid } from "@/components/anime-grid"
import { AnimeAggregator } from "../../lib/api/aggregator"
import { useToast } from "../../hooks/use-toast"
import { useAnimeStore } from "../../lib/store"

export function AnimeSearch() {
  const [query, setQuery] = useState("")
  const { toast } = useToast()

  const {
    trendingAnime,
    isLoadingTrending,
    setTrendingAnime,
    setIsLoadingTrending,
    searchResults,
    isSearching,
    setSearchResults,
    setIsSearching,
    setError,
    clearSearch,
    detailedAnimeData,
  } = useAnimeStore((state) => ({
    trendingAnime: state.sections.trending,
    isLoadingTrending: state.isLoadingSection.trending,
    setTrendingAnime: state.setTrendingAnime,
    setIsLoadingTrending: state.setIsLoadingTrending,
    searchResults: state.searchResults,
    isSearching: state.isSearching,
    setSearchResults: state.setSearchResults,
    setIsSearching: state.setIsSearching,
    setError: state.setError,
    clearSearch: state.clearSearch,
    detailedAnimeData: state.detailedAnimeData,
  }))

  useEffect(() => {
    loadTrendingAnime()
  }, [])

  const loadTrendingAnime = async () => {
    setIsLoadingTrending(true)
    try {
      const trending = await AnimeAggregator.getTrending()
      setTrendingAnime(trending)
    } catch (error) {
      console.error("Failed to load trending anime:", error)
      toast({
        title: "Error",
        description: "Failed to load trending anime",
        variant: "destructive",
      })
    } finally {
      setIsLoadingTrending(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search term",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const results = await AnimeAggregator.searchAll(query)
      setSearchResults(results)

      if (results.length === 0) {
        toast({
          title: "No results",
          description: "No anime found matching your search",
        })
      } else {
        toast({
          title: "Search completed",
          description: `Found ${results.length} anime matching "${query}"`,
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Search failed"
      setError(errorMessage)
      toast({
        title: "Search failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleClearSearch = () => {
    setQuery("")
    clearSearch()
  }

  return (
    <div className="space-y-8">
      {!detailedAnimeData && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search for anime (e.g., Attack on Titan, Naruto, One Piece)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                    disabled={isSearching}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSearching}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  {isSearching ? "Searching..." : "Search"}
                </Button>
                {searchResults.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearSearch}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    Clear
                  </Button>
                )}
              </form>
            </Card>
          </motion.div>

          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Search className="w-6 h-6" />
                Search Results ({searchResults.length})
              </h2>
              <AnimeGrid anime={searchResults} />
            </motion.div>
          )}

          {searchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Trending Anime
                </h2>
                <Button
                  onClick={loadTrendingAnime}
                  disabled={isLoadingTrending}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  {isLoadingTrending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Refresh
                </Button>
              </div>

              {isLoadingTrending ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden bg-gray-800/50 border-gray-700 backdrop-blur-sm"
                    >
                      <div className="h-64 bg-gray-700 animate-pulse" />
                      <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <AnimeGrid anime={trendingAnime} />
              )}
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}