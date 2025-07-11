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
import { useToast } from "../../hooks/use-toast"
import { useAnimeStore } from "../../lib/store"
import { AnimeAggregator } from "../../lib/api/aggregator"


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
    <div className="space-y-6 sm:space-y-8">
      {/* Search Form with Suggestions */}
      <motion.div
        ref={searchRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-4xl mx-auto relative px-4 sm:px-0"
      >
        <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-cyan-900/20 border-2 border-purple-500/30 backdrop-blur-xl shadow-2xl">
          <motion.div
            className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0" />
            <h2 className="text-center text-base sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
              Discover Your Next Anime Adventure!
            </h2>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0" />
          </motion.div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
            className="space-y-3 sm:space-y-0 sm:flex sm:gap-4"
          >
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="🔍 Search anime (e.g., Attack on Titan)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                className="w-full bg-gray-800/50 border-2 border-purple-400/50 text-white placeholder-gray-300 focus:border-pink-400 pr-10 h-12 sm:h-14 text-sm sm:text-base lg:text-lg rounded-xl"
                disabled={isSearching}
              />
              {query && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-400 hover:text-white rounded-full"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              )}
            </div>

            <div className="flex gap-2 sm:gap-3">
              <Button
                type="submit"
                disabled={isSearching}
                className="flex-1 sm:flex-none bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base lg:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                    <span className="hidden xs:inline">Searching...</span>
                    <span className="xs:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span>Search</span>
                  </>
                )}
              </Button>

              {searchResults.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearSearch}
                  className="border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 bg-transparent h-12 sm:h-14 px-4 sm:px-6 rounded-xl text-sm sm:text-base"
                >
                  <X className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              )}
            </div>
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
              className="absolute top-full left-4 right-4 sm:left-0 sm:right-0 z-50 mt-2 sm:mt-4"
            >
              <Card className="bg-gray-900/95 border-2 border-purple-500/30 backdrop-blur-xl overflow-hidden shadow-2xl">
                {isLoadingSuggestions ? (
                  <div className="p-4 sm:p-6 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-purple-400 mr-3" />
                    <span className="text-gray-300 text-sm sm:text-base lg:text-lg">Finding amazing anime...</span>
                  </div>
                ) : (
                  <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="p-3 sm:p-4 hover:bg-gradient-to-r hover:from-purple-800/30 hover:to-pink-800/30 cursor-pointer border-b border-gray-700/30 last:border-b-0 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="relative flex-shrink-0">
                            <img
                              src={suggestion.poster || "/placeholder.svg?height=60&width=40"}
                              alt={suggestion.title}
                              className="w-10 h-14 sm:w-12 sm:h-16 object-cover rounded-lg shadow-lg"
                            />
                            <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold truncate text-sm sm:text-base lg:text-lg">
                              {suggestion.title}
                            </h4>
                            {suggestion.englishTitle && suggestion.englishTitle !== suggestion.title && (
                              <p className="text-gray-400 text-xs sm:text-sm truncate">{suggestion.englishTitle}</p>
                            )}
                            <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
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
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 flex-shrink-0" />
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
          className="px-4 sm:px-0"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
              Search Results
            </h2>
            <Badge className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-1 sm:py-2">
              {searchResults.length} found
            </Badge>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-pulse" />
          </div>
          <AnimeGrid anime={searchResults} />
        </motion.div>
      )}
    </div>
  )
}
