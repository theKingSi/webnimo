"use client"

import { motion } from "framer-motion"
import { AnimatedBackground } from "@/components/animated-background"
import { SearchWithSuggestions } from "@/components/search-with-suggestions"
import { AnimeSection } from "@/components/anime-section"
import { DetailedEpisodeList } from "@/components/detailed-episode-list"
import { WebnimeLogo } from "@/components/webnime-logo"

import { useEffect } from "react"
import { useAnimeStore } from "../../lib/store"

export default function HomePage() {
  const { detailedAnimeData, loadAllSections } = useAnimeStore()

  useEffect(() => {
    loadAllSections()
  }, [loadAllSections])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header with Animated Logo */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <WebnimeLogo />
            </div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-6 tracking-tight"
              style={{
                textShadow: "0 0 30px rgba(236, 72, 153, 0.3)",
                fontFamily: "'Orbitron', 'Inter', sans-serif",
              }}
            >
              WEBNIME
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative"
            >
              <p className="text-gray-200 text-xl max-w-4xl mx-auto leading-relaxed">
                🌟 Your Ultimate Anime Universe! Discover, explore, and dive into thousands of anime series with
                lightning-fast search, real-time suggestions, and stunning visuals! ✨
              </p>

              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -left-8 text-4xl"
              >
                ⭐
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -top-2 -right-12 text-3xl"
              >
                🎌
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -8, 0],
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute -bottom-6 left-1/4 text-2xl"
              >
                🌸
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Search with Suggestions */}
          <SearchWithSuggestions />

          {/* Episode List (shown when anime is selected) */}
          {detailedAnimeData && <DetailedEpisodeList />}

          {/* Anime Sections */}
          {!detailedAnimeData && (
            <div className="space-y-20 mt-20">
              <AnimeSection
                title="🆕 Fresh Releases"
                type="new"
                description="Hot off the press! Brand new anime episodes just dropped!"
              />
              <AnimeSection
                title="🔥 Trending Explosion"
                type="trending"
                description="What's setting the anime world on fire right now!"
              />
              <AnimeSection
                title="👑 Hall of Fame"
                type="popular"
                description="Legendary anime that conquered hearts worldwide!"
              />
              <AnimeSection
                title="⚔️ Epic Battles & Adventures"
                type="action"
                description="Adrenaline-pumping action that'll keep you on the edge!"
              />
              <AnimeSection
                title="💖 Love & Drama Central"
                type="romance"
                description="Heartwarming tales that'll make you believe in love!"
              />
              <AnimeSection
                title="😂 Comedy Gold Mine"
                type="comedy"
                description="Hilarious anime that'll have you rolling on the floor!"
              />
              <AnimeSection
                title="📚 Complete Anime Library"
                type="alphabetical"
                description="Every anime ever created, organized just for you!"
                showAll={true}
              />
            </div>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-center mt-32 relative"
          >
            <div className="bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-cyan-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
              <p className="text-gray-300 text-lg mb-2">
                🌟 Webnime aggregates data from MyAnimeList, AniList, and Kitsu 🌟
              </p>
              <p className="text-gray-400 text-sm">
                Made with ❤️ for anime lovers • Please support official distributors
              </p>

              {/* Animated Footer Elements */}
              <div className="flex justify-center items-center gap-8 mt-6">
                {["🎭", "🎪", "🎨", "🎵", "🎬"].map((emoji, index) => (
                  <motion.div
                    key={emoji}
                    animate={{
                      y: [0, -5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.2,
                    }}
                    className="text-2xl"
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
