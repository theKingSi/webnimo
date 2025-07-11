"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export function WebnimeLogo() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative w-32 h-32 cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Animated Glow Border */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #ff006e, #8338ec, #3a86ff, #06ffa5, #ffbe0b, #ff006e)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner Circle with the Image */}
      <motion.div
        className="absolute inset-2 rounded-full overflow-hidden border-2 border-purple-400/50"
        animate={{
          boxShadow: isHovered
            ? [
                "0 0 20px rgba(147, 51, 234, 0.5)",
                "0 0 40px rgba(236, 72, 153, 0.7)",
                "0 0 20px rgba(147, 51, 234, 0.5)",
              ]
            : "0 0 20px rgba(147, 51, 234, 0.3)",
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.img
          src="/zoro.jpeg" // Replace with your image path
          alt="Logo"
          className="w-full h-full object-cover"
          animate={{
            rotate: isHovered ? [0, 10, -10, 0] : 0,
            scale: isHovered ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.8,
            repeat: isHovered ? Infinity : 0,
          }}
        />
      </motion.div>
    </motion.div>
  )
}
