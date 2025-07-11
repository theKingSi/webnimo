"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Check, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { DetailedEpisodeCard } from "@/components/detailed-episode-card"
import { DownloadProgress } from "@/components/download-progress"
import { useToast } from "../../hooks/use-toast"
import { useAnimeStore } from "../../lib/store"

export function DetailedEpisodeList() {
  const { toast } = useToast()
  const {
    detailedAnimeData,
    selectedEpisodes,
    downloadingEpisodes,
    toggleEpisode,
    clearSelection,
    setDetailedAnimeData,
    addDownloadingEpisode,
    removeDownloadingEpisode,
  } = useAnimeStore()

  if (!detailedAnimeData) return null

  const handleDownloadSelected = async () => {
    if (selectedEpisodes.length === 0) {
      toast({
        title: "No episodes selected",
        description: "Please select at least one episode to download",
        variant: "destructive",
      })
      return
    }

    // Add selected episodes to downloading state
    selectedEpisodes.forEach((episodeId) => {
      addDownloadingEpisode(episodeId)
    })

    toast({
      title: "Download started",
      description: `Starting download of ${selectedEpisodes.length} episode(s)`,
    })

    // Simulate download completion
    setTimeout(() => {
      selectedEpisodes.forEach((episodeId) => {
        removeDownloadingEpisode(episodeId)
      })
      toast({
        title: "Download completed",
        description: `Successfully downloaded ${selectedEpisodes.length} episode(s)`,
      })
      clearSelection()
    }, 3000)
  }

  const handleDownloadAll = async () => {
    const allEpisodeIds = detailedAnimeData.episodes.map((ep) => ep.id)

    // Add all episodes to downloading state
    allEpisodeIds.forEach((episodeId) => {
      addDownloadingEpisode(episodeId)
    })

    toast({
      title: "Download started",
      description: `Starting download of all ${detailedAnimeData.episodes.length} episodes`,
    })

    // Simulate download completion
    setTimeout(() => {
      allEpisodeIds.forEach((episodeId) => {
        removeDownloadingEpisode(episodeId)
      })
      toast({
        title: "Download completed",
        description: `Successfully downloaded all ${detailedAnimeData.episodes.length} episodes`,
      })
    }, 5000)
  }

  const selectAll = () => {
    detailedAnimeData.episodes.forEach((episode) => {
      if (!selectedEpisodes.includes(episode.id)) {
        toggleEpisode(episode.id)
      }
    })
  }

  const deselectAll = () => {
    clearSelection()
  }

  const handleBackToSearch = () => {
    setDetailedAnimeData(null)
    clearSelection()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto mt-8"
    >
      {/* Back Button */}
      <Button
        onClick={handleBackToSearch}
        variant="outline"
        className="mb-6 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Search
      </Button>

      {/* Anime Info Header */}
      <Card className="p-6 mb-8 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              src={detailedAnimeData.poster || "/placeholder.svg"}
              alt={detailedAnimeData.title}
              className="w-48 h-72 object-cover rounded-lg mx-auto lg:mx-0"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-white mb-2">{detailedAnimeData.title}</h2>
            {detailedAnimeData.englishTitle && detailedAnimeData.englishTitle !== detailedAnimeData.title && (
              <h3 className="text-xl text-gray-300 mb-4">{detailedAnimeData.englishTitle}</h3>
            )}
            <p className="text-gray-300 mb-6 leading-relaxed">{detailedAnimeData.description}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                {detailedAnimeData.episodes.length} Episodes
              </Badge>
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                {detailedAnimeData.status}
              </Badge>
              {detailedAnimeData.year && (
                <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                  {detailedAnimeData.year}
                </Badge>
              )}
              {detailedAnimeData.score && (
                <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-300">
                  ⭐ {detailedAnimeData.score.toFixed(1)}
                </Badge>
              )}
              <Badge variant="secondary" className="bg-gray-600/20 text-gray-300">
                {detailedAnimeData.source.toUpperCase()}
              </Badge>
            </div>

            {detailedAnimeData.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {detailedAnimeData.genres.map((genre) => (
                  <Badge key={genre} className="bg-indigo-600/20 text-indigo-300 text-sm">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {detailedAnimeData.studios.length > 0 && (
              <p className="text-gray-400">
                <span className="font-medium">Studio:</span> {detailedAnimeData.studios.join(", ")}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Selection Controls */}
      <Card className="p-4 mb-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">
              {selectedEpisodes.length} of {detailedAnimeData.episodes.length} episodes selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                <Check className="w-4 h-4 mr-1" />
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deselectAll}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleDownloadSelected}
              disabled={selectedEpisodes.length === 0}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Selected ({selectedEpisodes.length})
            </Button>
            <Button
              onClick={handleDownloadAll}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download All ({detailedAnimeData.episodes.length})
            </Button>
          </div>
        </div>
      </Card>

      {/* Episodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {detailedAnimeData.episodes.map((episode, index) => (
            <DetailedEpisodeCard
              key={episode.id}
              episode={episode}
              index={index}
              isSelected={selectedEpisodes.includes(episode.id)}
              isDownloading={downloadingEpisodes.has(episode.id)}
              onToggleSelect={() => toggleEpisode(episode.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Download Progress */}
      {downloadingEpisodes.size > 0 && <DownloadProgress downloadingEpisodes={downloadingEpisodes} />}
    </motion.div>
  )
}
