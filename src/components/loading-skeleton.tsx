"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

export function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Anime Info Skeleton */}
      <Card className="p-6 mb-8 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-48 bg-gray-700 rounded-lg animate-pulse" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-16 bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-12 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </Card>

      {/* Episodes Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <div className="h-48 bg-gray-700 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
                <div className="h-10 bg-gray-700 rounded animate-pulse" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
