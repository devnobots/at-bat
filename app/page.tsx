"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const handlePlayNow = () => {
    // Simple audio unlock attempt
    try {
      const audio = new Audio()
      audio.play().catch((e) => console.log("Silent audio play failed:", e))
    } catch (e) {
      console.log("Audio unlock failed:", e)
    }

    // Navigate to game page
    router.push("/game")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OH1-KZzGjNbBHpbbXRDLfllkNBEcwzewgP.png"
          alt="The At Bat Challenge - SportsGrid"
          width={400}
          height={800}
          className="w-full h-auto object-contain"
          priority
        />

        {/* Buttons overlaying the bottom of the image */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <button
            onClick={() => router.push("/how-to-play")}
            className="w-full py-3 text-lg font-medium rounded-md bg-zinc-600 text-white text-center hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            HOW TO PLAY
          </button>
          <button
            onClick={handlePlayNow}
            className="w-full py-3 text-lg font-medium rounded-md bg-red-600 text-white text-center hover:bg-red-700 transition-colors cursor-pointer"
          >
            PLAY NOW
          </button>
        </div>
      </div>
    </div>
  )
}
