"use client"

import { motion } from "framer-motion"
import { Download, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAnimeStore } from "../../lib/store"


interface DownloadProgressProps {
  downloadingEpisodes: Set<string>
}

export function DownloadProgress({ downloadingEpisodes }: DownloadProgressProps) {
  const { detailedAnimeData } = useAnimeStore()

  const getEpisodeInfo = (episodeId: string) => {
    if (!detailedAnimeData) return { title: "Episode", number: 1 }
    const episode = detailedAnimeData.episodes.find((ep) => ep.id === episodeId)
    return episode ? { title: episode.title, number: episode.number } : { title: "Episode", number: 1 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Card className="p-4 bg-gray-800/95 border-gray-700 backdrop-blur-sm min-w-80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Downloading {downloadingEpisodes.size} episode(s)</span>
          </div>
          <Button size="icon" variant="ghost" className="w-6 h-6 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {Array.from(downloadingEpisodes).map((episodeId) => {
            const episodeInfo = getEpisodeInfo(episodeId)
            const progress = Math.floor(Math.random() * 80) + 20 // Random progress for demo

            return (
              <div key={episodeId} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 truncate">Episode {episodeInfo.number}</span>
                  <span className="text-gray-400">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}
