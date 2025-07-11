"use client"

import { motion } from "framer-motion"
import { Download, Play, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "../../hooks/use-toast"
import { Episode } from "../../lib/types"


interface EpisodeCardProps {
  episode: Episode
  index: number
  isSelected: boolean
  isDownloading: boolean
  onToggleSelect: () => void
}

export function EpisodeCard({ episode, index, isSelected, isDownloading, onToggleSelect }: EpisodeCardProps) {
  const { toast } = useToast()

  const handleDownload = async () => {
    toast({
      title: "Download started",
      description: `Downloading ${episode.title}`,
    })

    // Mock download process
    setTimeout(() => {
      toast({
        title: "Download completed",
        description: `${episode.title} downloaded successfully`,
      })
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
        <div className="relative">
          <img
            src={episode.thumbnail || "/placeholder.svg"}
            alt={episode.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Selection Checkbox */}
          <div className="absolute top-3 left-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              className="bg-gray-800/80 border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
            />
          </div>

          {/* Episode Number Badge */}
          <Badge className="absolute top-3 right-3 bg-purple-600/80 text-white">Episode {episode.number}</Badge>

          {/* Play Button Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Button
              size="icon"
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/30"
            >
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </Button>
          </motion.div>
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
            {episode.title}
          </h3>

          <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {episode.duration}
            </div>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              {episode.quality}
            </Badge>
          </div>

          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
