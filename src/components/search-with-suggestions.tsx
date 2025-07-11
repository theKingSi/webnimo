"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Loader2, X, TrendingUp, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimeGrid } from "@/components/anime-grid"
import { SearchResult } from "../../lib/types"
import { AnimeAggregator } from "../../lib/api/aggregator"
import { useToast } from "../../hooks/use-toast"
import { useAnimeStore } from "../../lib/store"


export function SearchWithSuggestions() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const { searchResults, isSearching, setSearchResults, setIsSearching, clearSearch, setError } = useAnimeStore()

  // Debounced search for suggestions
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoadingSuggestions(true)
        try {
          const results = await AnimeAggregator.searchAll(query)
          setSuggestions(results.slice(0, 6))
          setShowSuggestions(true)
        } catch (error) {
          console.error("Suggestion search failed:", error)
        } finally {
          setIsLoadingSuggestions(false)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) {
      toast({
        title: "🔍 Search Required",
        description: "Please enter an anime title to search for!",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    setError(null)
    setShowSuggestions(false)

    try {
      const results = await AnimeAggregator.searchAll(searchQuery)
      setSearchResults(results)

      if (results.length === 0) {
        toast({
          title: "😅 No Results Found",
          description: "Try searching with different keywords or check the spelling!",
        })
      } else {
        toast({
          title: "🎉 Search Complete!",
          description: `Found ${results.length} amazing anime matching "${searchQuery}"!`,
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Search failed"
      setError(errorMessage)
      toast({
        title: "❌ Search Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSuggestionClick = (suggestion: SearchResult) => {
    setQuery(suggestion.title)
    setShowSuggestions(false)
    handleSearch(suggestion.title)
  }

  const handleClearSearch = () => {
    setQuery("")
    setSuggestions([])
    setShowSuggestions(false)
    clearSearch()
  }

  return (
    <div className="space-y-8">
      {/* Search Form with Suggestions */}
      <motion.div
        ref={searchRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="max-w-4xl mx-auto relative"
      >
        <Card className="p-8 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-cyan-900/20 border-2 border-purple-500/30 backdrop-blur-xl shadow-2xl">
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
              Discover Your Next Anime Adventure!
            </h2>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
            className="flex gap-4"
          >
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="🔍 Search for anime (e.g., Attack on Titan, Naruto, One Piece)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                className="bg-gray-800/50 border-2 border-purple-400/50 text-white placeholder-gray-300 focus:border-pink-400 pr-12 h-14 text-lg rounded-xl"
                disabled={isSearching}
              />
              {query && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-400 hover:text-white rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSearching}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Search className="w-5 h-5 mr-2" />}
              {isSearching ? "Searching..." : "Search"}
            </Button>
            {searchResults.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearSearch}
                className="border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 bg-transparent h-14 px-6 rounded-xl"
              >
                Clear
              </Button>
            )}
          </form>
        </Card>

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && (suggestions.length > 0 || isLoadingSuggestions) && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 z-50 mt-4"
            >
              <Card className="bg-gray-900/95 border-2 border-purple-500/30 backdrop-blur-xl overflow-hidden shadow-2xl">
                {isLoadingSuggestions ? (
                  <div className="p-6 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-400 mr-3" />
                    <span className="text-gray-300 text-lg">Finding amazing anime...</span>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="p-4 hover:bg-gradient-to-r hover:from-purple-800/30 hover:to-pink-800/30 cursor-pointer border-b border-gray-700/30 last:border-b-0 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={suggestion.poster || "/placeholder.svg?height=60&width=40"}
                              alt={suggestion.title}
                              className="w-12 h-16 object-cover rounded-lg shadow-lg"
                            />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold truncate text-lg">{suggestion.title}</h4>
                            {suggestion.englishTitle && suggestion.englishTitle !== suggestion.title && (
                              <p className="text-gray-400 text-sm truncate">{suggestion.englishTitle}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              {suggestion.year && (
                                <Badge variant="outline" className="border-cyan-400/50 text-cyan-300 text-xs">
                                  {suggestion.year}
                                </Badge>
                              )}
                              {suggestion.score && (
                                <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">
                                  ⭐ {suggestion.score.toFixed(1)}
                                </Badge>
                              )}
                              <Badge
                                className={`text-xs ${
                                  suggestion.source === "jikan"
                                    ? "bg-blue-500/20 text-blue-300"
                                    : suggestion.source === "anilist"
                                      ? "bg-purple-500/20 text-purple-300"
                                      : "bg-green-500/20 text-green-300"
                                }`}
                              >
                                {suggestion.source.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <TrendingUp className="w-5 h-5 text-pink-400" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Search className="w-8 h-8 text-pink-400" />
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
              Search Results
            </h2>
            <Badge className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 text-lg px-4 py-2">
              {searchResults.length} found
            </Badge>
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
          <AnimeGrid anime={searchResults} />
        </motion.div>
      )}
    </div>
  )
}
