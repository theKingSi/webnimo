"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimeGrid } from "@/components/anime-grid"
import { useAnimeStore } from "../../lib/store"
import { SectionType } from "../../lib/types"


interface AnimeSectionProps {
  title: string
  type: SectionType
  description: string
  showAll?: boolean
}

export function AnimeSection({ title, type, description, showAll = false }: AnimeSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const { sections, isLoadingSection } = useAnimeStore()

  const sectionData = sections[type]
  const isLoading = isLoadingSection[type]
  const displayCount = expanded || showAll ? sectionData.length : 8

  const handleLoadMore = () => {
    if (!expanded && !showAll) {
      setExpanded(true)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400 text-sm sm:text-base">{description}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {sectionData.length > 8 && !showAll && (
            <Badge className="bg-gray-700/50 text-gray-300 text-xs sm:text-sm">
              {expanded ? sectionData.length : `${Math.min(displayCount, sectionData.length)}/${sectionData.length}`}
            </Badge>
          )}
          {sectionData.length > 8 && !showAll && !expanded && (
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-xs sm:text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1 sm:mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1 sm:mr-2" />
              )}
              <span className="hidden sm:inline">View More</span>
              <span className="sm:hidden">More</span>
            </Button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && sectionData.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-800/30 border border-gray-700/50 rounded-lg overflow-hidden backdrop-blur-sm"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-700/50 to-gray-800/50 animate-pulse" />
              <div className="p-2 sm:p-3 space-y-2">
                <div className="h-3 sm:h-4 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-2 sm:h-3 bg-gray-700/50 rounded animate-pulse w-3/4" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <AnimeGrid anime={sectionData.slice(0, displayCount)} />
      )}

      {/* Show More Button for Large Sections */}
      {sectionData.length > displayCount && !showAll && (
        <div className="text-center pt-4 sm:pt-6">
          <Button
            onClick={() => setExpanded(true)}
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 text-white border border-purple-500/30 text-sm sm:text-base"
          >
            Show {sectionData.length - displayCount} More Anime
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </motion.section>
  )
}
