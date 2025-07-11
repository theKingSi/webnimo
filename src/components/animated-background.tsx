"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// Custom Hook for Parallax Effect
function useParallax(max = 30) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * max
      const y = (e.clientY / window.innerHeight - 0.5) * max
      setOffset({ x, y })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [max])

  return offset
}

export function AnimatedBackground() {
  const { x, y } = useParallax(20)

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {/* Static Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
        style={{
          transform: `translate(${x * 0.2}px, ${y * 0.2}px)`,
        }}
      />

      {/* Animated Gradient Overlays */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transform: `translate(${x * 0.4}px, ${y * 0.4}px)`,
        }}
      />

      {/* Animated Lines */}
      <motion.svg
        className="absolute inset-0 w-full h-full opacity-20"
        style={{
          transform: `translate(${x * 0.1}px, ${y * 0.1}px)`,
        }}
      >
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Horizontal Lines */}
        {[...Array(6)].map((_, i) => (
          <motion.line
            key={`h-line-${i}`}
            x1="0"
            y1={100 + i * 120}
            x2="1000"
            y2={100 + i * 120}
            stroke="url(#lineGradient1)"
            strokeWidth="2"
            initial={{ strokeDasharray: "500, 500", strokeDashoffset: 500, opacity: 0 }}
            animate={{ strokeDashoffset: [500, 0, -500], opacity: [0, 0.8, 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Vertical Lines */}
        {[...Array(4)].map((_, i) => (
          <motion.line
            key={`v-line-${i}`}
            x1={150 + i * 200}
            y1="0"
            x2={150 + i * 200}
            y2="1000"
            stroke="url(#lineGradient2)"
            strokeWidth="1.5"
            initial={{ strokeDasharray: "500, 500", strokeDashoffset: 500, opacity: 0 }}
            animate={{ strokeDashoffset: [500, 0, -500], opacity: [0, 0.6, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.svg>

      {/* Subtle Grid Overlay */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          transform: `translate(${x * 0.05}px, ${y * 0.05}px)`,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  )
}
