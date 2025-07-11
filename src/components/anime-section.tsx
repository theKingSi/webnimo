"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimeGrid } from "@/components/anime-grid"
import { SectionType } from "../../lib/types"
import { useAnimeStore } from "../../lib/store"


interface AnimeSectionProps {
  title: string
  type: SectionType
  description: string
  showAll?: boolean
}

export function AnimeSection({ title, type, description, showAll = false }: AnimeSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const { sections, isLoadingSection, loadSection } = useAnimeStore()

  const sectionData = sections[type]
  const isLoading = isLoadingSection[type]
  const displayCount = expanded || showAll ? sectionData.length : 8

  const handleLoadMore = async () => {
    if (!expanded && !showAll) {
      setExpanded(true)
    } else {
      await loadSection(type, true) // Force refresh
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          {sectionData.length > 8 && !showAll && (
            <Badge className="bg-gray-700/50 text-gray-300">
              {expanded ? sectionData.length : `${displayCount}/${sectionData.length}`}
            </Badge>
          )}
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : expanded || showAll ? (
              <RefreshCw className="w-4 h-4 mr-2" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Loading..." : expanded || showAll ? "Refresh" : "View More"}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && sectionData.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-800/30 border border-gray-700/50 rounded-lg overflow-hidden backdrop-blur-sm"
            >
              <div className="h-64 bg-gradient-to-br from-gray-700/50 to-gray-800/50 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-4 bg-gray-700/50 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-700/50 rounded animate-pulse w-1/2" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <AnimeGrid anime={sectionData.slice(0, displayCount)} />
      )}

      {/* Show More Button for Large Sections */}
      {sectionData.length > displayCount && !showAll && (
        <div className="text-center">
          <Button
            onClick={() => setExpanded(true)}
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 text-white border border-purple-500/30"
          >
            Show {sectionData.length - displayCount} More Anime
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </motion.section>
  )
}
