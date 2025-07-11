"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EpisodeCard } from "@/components/episode-card"
import { DownloadProgress } from "@/components/download-progress"
import { useToast } from "../../hooks/use-toast"
import { useAnimeStore } from "../../lib/store"

export function EpisodeList() {
  const { animeData, selectedEpisodes, toggleEpisode, clearSelection } = useAnimeStore()
  const [downloadingEpisodes, setDownloadingEpisodes] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  if (!animeData) return null

  const handleDownloadSelected = async () => {
    if (selectedEpisodes.length === 0) {
      toast({
        title: "No episodes selected",
        description: "Please select at least one episode to download",
        variant: "destructive",
      })
      return
    }

    // Mock download process
    const newDownloading = new Set(selectedEpisodes)
    setDownloadingEpisodes(newDownloading)

    toast({
      title: "Download started",
      description: `Starting download of ${selectedEpisodes.length} episode(s)`,
    })

    // Simulate download completion after 3 seconds
    setTimeout(() => {
      setDownloadingEpisodes(new Set())
      toast({
        title: "Download completed",
        description: `Successfully downloaded ${selectedEpisodes.length} episode(s)`,
      })
      clearSelection()
    }, 3000)
  }

  const selectAll = () => {
    animeData.episodes.forEach((episode) => {
      if (!selectedEpisodes.includes(episode.id)) {
        toggleEpisode(episode.id)
      }
    })
  }

  const deselectAll = () => {
    clearSelection()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="max-w-6xl mx-auto"
    >
      {/* Anime Info Header */}
      <Card className="p-6 mb-8 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              src={animeData.poster || "/placeholder.svg"}
              alt={animeData.title}
              className="w-32 h-48 object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{animeData.title}</h2>
            <p className="text-gray-300 mb-4">{animeData.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                {animeData.episodes.length} Episodes
              </Badge>
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                {animeData.status}
              </Badge>
              <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                {animeData.year}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Selection Controls */}
      <Card className="p-4 mb-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">
              {selectedEpisodes.length} of {animeData.episodes.length} episodes selected
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
          <Button
            onClick={handleDownloadSelected}
            disabled={selectedEpisodes.length === 0}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Selected ({selectedEpisodes.length})
          </Button>
        </div>
      </Card>

      {/* Episodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {animeData.episodes.map((episode, index) => (
            <EpisodeCard
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
