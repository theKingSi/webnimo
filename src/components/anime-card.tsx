"use client"

import { motion } from "framer-motion"
import { Star, Calendar, Play, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchResult } from "../../lib/types"
import { useAnimeStore } from "../../lib/store"
import { useToast } from "../../hooks/use-toast"

interface AnimeCardProps {
  anime: SearchResult
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const { toast } = useToast()

  const handleViewEpisodes = async () => {
    const { setDetailedAnimeData, setIsLoadingEpisodes, setError } = useAnimeStore.getState()

    setIsLoadingEpisodes(true)
    setError(null)

    try {
      // Import the EpisodeFetcher
      const { EpisodeFetcher } = await import("../../lib/api/episode-fetcher")
      const detailedData = await EpisodeFetcher.fetchEpisodes(anime)
      setDetailedAnimeData(detailedData)

      toast({
        title: "Episodes loaded",
        description: `Found ${detailedData.episodes.length} episodes for ${anime.title}`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load episodes"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoadingEpisodes(false)
    }
  }

  const handleAddToWatchlist = () => {
    toast({
      title: "Added to Watchlist",
      description: `${anime.title} has been added to your watchlist`,
    })
  }

  return (
    <motion.div whileHover={{ y: -5 }} className="group h-full">
      <Card className="overflow-hidden bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col">
        <div className="relative">
          <img
            src={anime.poster || "/placeholder.svg?height=300&width=200"}
            alt={anime.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Source Badge */}
          <Badge
            className={`absolute top-3 left-3 ${
              anime.source === "jikan"
                ? "bg-blue-600/80"
                : anime.source === "anilist"
                  ? "bg-purple-600/80"
                  : "bg-green-600/80"
            } text-white text-xs`}
          >
            {anime.source.toUpperCase()}
          </Badge>

          {/* Score Badge */}
          {anime.score && (
            <Badge className="absolute top-3 right-3 bg-yellow-600/80 text-white flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              {anime.score.toFixed(1)}
            </Badge>
          )}

          {/* Play Button Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Button
              size="icon"
              onClick={handleViewEpisodes}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/30"
            >
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </Button>
          </motion.div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
            {anime.title}
          </h3>

          {anime.englishTitle && anime.englishTitle !== anime.title && (
            <p className="text-gray-400 text-sm mb-2 line-clamp-1">{anime.englishTitle}</p>
          )}

          <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
            {anime.year && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {anime.year}
              </div>
            )}
            {anime.episodes && (
              <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                {anime.episodes} eps
              </Badge>
            )}
          </div>

          {anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {anime.genres.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="secondary" className="bg-purple-600/20 text-purple-300 text-xs">
                  {genre}
                </Badge>
              ))}
              {anime.genres.length > 3 && (
                <Badge variant="secondary" className="bg-gray-600/20 text-gray-300 text-xs">
                  +{anime.genres.length - 3}
                </Badge>
              )}
            </div>
          )}

          {anime.description && <p className="text-gray-300 text-sm line-clamp-3 mb-4 flex-1">{anime.description}</p>}

          <div className="flex gap-2 mt-auto">
            <Button
              onClick={handleViewEpisodes}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm"
            >
              <Play className="w-4 h-4 mr-1" />
              Episodes
            </Button>
            <Button
              onClick={handleAddToWatchlist}
              variant="outline"
              size="icon"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
