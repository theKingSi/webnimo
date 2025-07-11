"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function AnimatedBackground() {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      delay: number
      emoji: string
      duration: number
    }>
  >([])

  const animeEmojis = ["⭐", "🌸", "🎌", "✨", "💫", "🌟", "🎭", "🎪", "🎨", "🎵", "🎬", "🌙", "☄️", "🎆"]

  useEffect(() => {
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      emoji: animeEmojis[Math.floor(Math.random() * animeEmojis.length)],
      duration: Math.random() * 10 + 8,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />

      {/* Animated Gradient Overlays */}
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #ff006e 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, #8338ec 0%, transparent 50%)",
            "radial-gradient(circle at 40% 80%, #3a86ff 0%, transparent 50%)",
            "radial-gradient(circle at 60% 30%, #06ffa5 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, #ff006e 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 70% 70%, #ffbe0b 0%, transparent 40%)",
            "radial-gradient(circle at 30% 30%, #ff006e 0%, transparent 40%)",
            "radial-gradient(circle at 80% 50%, #8338ec 0%, transparent 40%)",
            "radial-gradient(circle at 20% 80%, #3a86ff 0%, transparent 40%)",
            "radial-gradient(circle at 70% 70%, #ffbe0b 0%, transparent 40%)",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          delay: 2,
        }}
      />

      {/* Floating Emoji Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-2xl select-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size * 0.8}rem`,
          }}
          animate={{
            y: [0, -100, -200, -300],
            x: [0, Math.sin(particle.id) * 50, Math.cos(particle.id) * 30, 0],
            opacity: [0, 0.7, 0.5, 0],
            scale: [0.5, 1, 0.8, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}

      {/* Geometric Shapes */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="shapeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff006e" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#8338ec" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3a86ff" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="shapeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06ffa5" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#ffbe0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff006e" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Animated Polygons */}
        {[...Array(8)].map((_, i) => (
          <motion.polygon
            key={i}
            points={`${100 + i * 150},${50 + i * 100} ${150 + i * 150},${100 + i * 100} ${125 + i * 150},${150 + i * 100}`}
            fill="url(#shapeGradient1)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 1.5],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 1,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Animated Circles */}
        {[...Array(6)].map((_, i) => (
          <motion.circle
            key={`circle-${i}`}
            cx={200 + i * 200}
            cy={150 + i * 80}
            r="30"
            fill="url(#shapeGradient2)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.4, 0],
              scale: [0, 1, 2],
              x: [0, 50, -50, 0],
              y: [0, -30, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Shooting Stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
          }}
          animate={{
            x: [0, 300],
            y: [0, 150],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 4,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
