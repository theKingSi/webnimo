"use client"

import { motion } from "framer-motion"
import { AnimeCard } from "@/components/anime-card"
import { SearchResult } from "../../lib/types"


interface AnimeGridProps {
  anime: SearchResult[]
}

export function AnimeGrid({ anime }: AnimeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {anime.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <AnimeCard anime={item} />
        </motion.div>
      ))}
    </div>
  )
}
