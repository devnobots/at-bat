"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PredictionOption } from "@/components/prediction-option"
import { GameState } from "@/components/game-state"

export default function GamePage() {
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null)
  const [predictionSubmitted, setPredictionSubmitted] = useState(false)
  const [showResultScreen, setShowResultScreen] = useState(false)
  const [resultType, setResultType] = useState<"win" | "lose">("win") // Track which result to show
  const [isWinTurn, setIsWinTurn] = useState(true) // Track alternating pattern
  const [animationState, setAnimationState] = useState("initial") // "initial", "animating", "completed"
  const [currentLeaderboardState, setCurrentLeaderboardState] = useState<"initial" | "gabeFirst" | "sluggerFirst">(
    "initial",
  )
  const [leaderboardTitle, setLeaderboardTitle] = useState("LEADERBOARD") // New state for leaderboard title
  const leaderboardRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const loseAudioRef = useRef<HTMLAudioElement | null>(null)
  const musicAudioRef = useRef<HTMLAudioElement | null>(null)
  const winAudioRef = useRef<HTMLAudioElement | null>(null)

  const [showCommentBox, setShowCommentBox] = useState(false)
  const [comment, setComment] = useState("")
  const [countdown, setCountdown] = useState(15)

  const availableEmojis = ["🔥", "💪", "🎯", "⚾", "🏆", "⚡", "🚀", "💥"]

  const playMusicSequence = () => {
    if (musicAudioRef.current) {
      musicAudioRef.current.currentTime = 0 // Reset to beginning
      const playPromise = musicAudioRef.current.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Music play failed:", error)
        })
      }
    }
  }

  const stopMusic = () => {
    if (musicAudioRef.current) {
      musicAudioRef.current.pause()
      musicAudioRef.current.currentTime = 0
    }
  }

  const handlePredictionSelect = (prediction: string) => {
    setSelectedPrediction(prediction)
  }

  const handleSubmit = () => {
    if (selectedPrediction) {
      // Try to play a silent sound to unlock audio
      try {
        const audio = new Audio()
        audio.play().catch((e) => console.log("Silent audio play failed:", e))
      } catch (e) {
        console.log("Audio unlock failed:", e)
      }

      setPredictionSubmitted(true)
      playMusicSequence()

      // Alternate between win and lose
      setResultType(isWinTurn ? "win" : "lose")
      setIsWinTurn(!isWinTurn) // Toggle for next time

      // After 5 seconds, show the result screen AND trigger animation
      setTimeout(() => {
        setShowResultScreen(true)
        // Reset animation state and immediately trigger animation
        setAnimationState("initial")

        // Trigger animation immediately when result screen shows
        setTimeout(() => {
          setAnimationState("animating")

          // Complete animation after 1.5 seconds
          setTimeout(() => {
            setAnimationState("completed")
            // Update the persistent leaderboard state
            if (isWinTurn) {
              // This was a win turn, so Gabe should be first
              setCurrentLeaderboardState("gabeFirst")
            } else {
              // This was a lose turn, so Slugger should be first
              setCurrentLeaderboardState("sluggerFirst")
            }
          }, 1500)
        }, 50) // Small delay to ensure state is set

        // After another 10 seconds, reset to prediction selection OR show comment box for wins
        setTimeout(() => {
          const currentResultType = isWinTurn ? "win" : "lose" // Use the current state, not the toggled one
          if (currentResultType === "win") {
            setShowCommentBox(true)
            setCountdown(15) // Reset countdown when showing comment box
          } else {
            // For losses, show WALK-OFF WINNERS immediately
            setLeaderboardTitle("WALK-OFF WINNERS!")

            // Change back to LEADERBOARD after 10 seconds, then reset to prediction view
            setTimeout(() => {
              setLeaderboardTitle("LEADERBOARD")
              setPredictionSubmitted(false)
              setShowResultScreen(false)
              setSelectedPrediction(null)
              setAnimationState("initial")
            }, 10000)
          }
        }, 10000)

        console.log("Prediction submitted:", selectedPrediction)
      }, 5000)
    }
  }

  // Play audio when result screen is shown
  const playAudio = useCallback(() => {
    if (showResultScreen) {
      const audioToPlay = resultType === "win" ? winAudioRef.current : loseAudioRef.current
      if (audioToPlay) {
        audioToPlay.currentTime = 0 // Reset to beginning

        // Try to play the audio
        const playPromise = audioToPlay.play()

        // Handle play promise (modern browsers return a promise from play())
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Audio play failed:", error)
          })
        }
      }
    }
  }, [showResultScreen, resultType])

  useEffect(() => {
    playAudio()
  }, [playAudio])

  // Stop music when result screen is shown
  useEffect(() => {
    if (showResultScreen) {
      stopMusic()
    }
  }, [showResultScreen])

  // Countdown timer for comment box
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showCommentBox && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (showCommentBox && countdown === 0) {
      // Time's up, show WALK-OFF WINNERS for wins
      setLeaderboardTitle("WALK-OFF WINNERS")

      // Change back to LEADERBOARD after 10 seconds
      setTimeout(() => {
        setLeaderboardTitle("LEADERBOARD")
      }, 10000)

      // Go back to prediction view
      setShowCommentBox(false)
      setComment("")
      setPredictionSubmitted(false)
      setShowResultScreen(false)
      setSelectedPrediction(null)
      setAnimationState("initial")
      setCountdown(15) // Reset countdown for next time
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [showCommentBox, countdown, resultType])

  // Function to convert abbreviation to full display name
  const getPredictionDisplayName = (prediction: string) => {
    const displayNames: { [key: string]: string } = {
      K: "K",
      "1B": "1B",
      "2B": "2B",
      "3B": "3B",
      O: "OUT",
      BB: "BB",
      HR: "HR",
    }
    return displayNames[prediction] || prediction
  }

  // Function to get points for a prediction type
  const getPredictionPoints = (prediction: string) => {
    const pointsMap: { [key: string]: number } = {
      HR: 100,
      "3B": 75,
      "2B": 60,
      "1B": 50,
      K: 40,
      BB: 30,
      O: 20,
    }
    return pointsMap[prediction] || 0
  }

  // Walk-off winners data with points
  const walkOffWinnersData = [
    {
      id: 1,
      name: "SLUGGERKING",
      message: "I told you so!! 🔥",
      rank: 3,
      correctPicks: 8,
      lastCorrectPick: "HR",
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/penguin-hjLH3VdPv42eUNWcwsHXUjHMKvBbPt.gif",
      points: 85,
    },
    {
      id: 2,
      name: "BENNYTHEBAT!",
      message: "Called it from the start!",
      rank: 1,
      correctPicks: 12,
      lastCorrectPick: "K",
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      points: 100,
    },
    {
      id: 3,
      name: "GRANDSLAM",
      message: "Easy money right there!",
      rank: 5,
      correctPicks: 6,
      lastCorrectPick: "1B",
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      points: 50,
    },
    {
      id: 4,
      name: "DIAMONDPRO",
      message: "That's how it's done!",
      rank: 2,
      correctPicks: 10,
      lastCorrectPick: "2B",
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      points: 75,
    },
    {
      id: 5,
      name: "STRIKEZONE",
      message: "Saw that coming a mile away!",
      rank: 4,
      correctPicks: 7,
      lastCorrectPick: "3B",
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      points: 35,
    },
  ]

  // Sort winners by points
  const sortedWalkOffWinnersData = [...walkOffWinnersData].sort((a, b) => b.points - a.points)

  // Initial data with SluggerKing first
  const sluggerFirstData = [
    {
      id: 1,
      rank: 1,
      name: "SLUGGERKING",
      pick: "HR",
      score: 912,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/penguin-hjLH3VdPv42eUNWcwsHXUjHMKvBbPt.gif",
      hasPick: true,
    },
    {
      id: 2,
      rank: 2,
      name: "BENNYTHEBAT!",
      pick: "K",
      score: 847,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: true,
    },
    {
      id: 3,
      name: "GRANDSLAM",
      pick: null,
      score: 798,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: false,
    },
    {
      id: 4,
      rank: 4,
      name: "DIAMONDPRO",
      pick: "OUT",
      score: 756,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: true,
    },
    {
      id: 5,
      rank: 5,
      name: "STRIKEZONE",
      pick: "K",
      score: 689,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: true,
    },
    {
      id: 6,
      rank: 6,
      name: "BASEBALLFAN",
      pick: null,
      score: 623,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: false,
    },
    {
      id: 7,
      rank: 7,
      name: "CATCHERCALL",
      pick: "OUT",
      score: 567,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: true,
    },
    {
      id: 8,
      rank: 8,
      name: "HOMERUNHERO",
      pick: "BB",
      score: 534,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: true,
    },
    {
      id: 9,
      rank: 9,
      name: "BATSWINGER",
      pick: null,
      score: 423,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: false,
    },
    {
      id: 10,
      rank: 10,
      name: "WALKMASTER",
      pick: "BB",
      score: 345,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: true,
    },
  ]

  // Data with Gabe first
  const gabeFirstData = [
    {
      id: 2,
      rank: 1,
      name: "BENNYTHEBAT!",
      pick: "K",
      score: 847,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: true,
    },
    {
      id: 1,
      rank: 2,
      name: "SLUGGERKING",
      pick: "HR",
      score: 912,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/penguin-hjLH3VdPv42eUNWcwsHXUjHMKvBbPt.gif",
      hasPick: true,
    },
    {
      id: 3,
      rank: 3,
      name: "GRANDSLAM",
      pick: null,
      score: 798,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: false,
    },
    {
      id: 4,
      rank: 4,
      name: "DIAMONDPRO",
      pick: "OUT",
      score: 756,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: true,
    },
    {
      id: 5,
      rank: 5,
      name: "STRIKEZONE",
      pick: "K",
      score: 689,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: true,
    },
    {
      id: 6,
      rank: 6,
      name: "BASEBALLFAN",
      pick: null,
      score: 623,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: false,
    },
    {
      id: 7,
      rank: 7,
      name: "CATCHERCALL",
      pick: "OUT",
      score: 567,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: true,
    },
    {
      id: 8,
      rank: 8,
      name: "HOMERUNHERO",
      pick: "BB",
      score: 534,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: true,
    },
    {
      id: 9,
      rank: 9,
      name: "BATSWINGER",
      pick: null,
      score: 423,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: false,
    },
    {
      id: 10,
      rank: 10,
      name: "WALKMASTER",
      pick: "BB",
      score: 345,
      avatar: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/Glee_xlarge-F6h29o7fSSWkPANT5bKeTvTk8WJGYO.jpg",
      hasPick: true,
    },
  ]

  // Get the appropriate data based on current state and animation
  const getLeaderboardData = useCallback(() => {
    // During animation, show the data we're animating FROM
    if (animationState === "animating") {
      if (resultType === "win") {
        // Animating TO Gabe first, so show Slugger first during animation
        return sluggerFirstData
      } else {
        // Animating TO Slugger first, so show Gabe first during animation
        return gabeFirstData
      }
    }

    // When animation is completed or we're showing result, show target state
    if (animationState === "completed" || showResultScreen) {
      if (resultType === "win") {
        return gabeFirstData
      } else {
        return sluggerFirstData
      }
    }

    // Default state based on current leaderboard state
    switch (currentLeaderboardState) {
      case "gabeFirst":
        return gabeFirstData
      case "sluggerFirst":
        return sluggerFirstData
      default:
        return sluggerFirstData // Initial state
    }
  }, [animationState, currentLeaderboardState, resultType, gabeFirstData, sluggerFirstData])

  const leaderboardData = getLeaderboardData()

  useEffect(() => {
    // Reset card refs array
    cardRefs.current = cardRefs.current.slice(0, leaderboardData.length)
  }, [leaderboardData.length])

  const getCardStyles = useCallback((rank: number) => {
    if (rank <= 3) {
      return "bg-gradient-to-r from-lime-600 to-lime-500"
    }
    return "bg-zinc-800"
  }, [])

  const getRankBadgeStyles = useCallback((rank: number) => {
    if (rank <= 3) {
      return "bg-zinc-900 text-white"
    }
    return "bg-zinc-600 text-white"
  }, [])

  // Get animation styles for each card
  const getCardAnimationStyle = useCallback(
    (id: number, index: number) => {
      if (animationState !== "animating") return {}

      // Calculate card height + margin (adjusted for 30% reduction)
      const cardHeight = 44 // Reduced height in pixels
      const marginHeight = 8 // Space between cards (2 * 0.5rem)
      const totalOffset = cardHeight + marginHeight

      // Animation based on result type
      if (resultType === "win") {
        // YOU WON: BennyTheBat! (id: 2) moves up, SluggerKing (id: 1) moves down
        switch (id) {
          case 1: // SluggerKing moves from 1st to 2nd (down 1 position)
            return {
              transform: `translateY(${totalOffset}px)`,
              zIndex: 10,
              transition: "transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }
          case 2: // BennyTheBat! moves from 2nd to 1st (up 1 position)
            return {
              transform: `translateY(-${totalOffset}px)`,
              zIndex: 10,
              transition: "transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }
          default:
            return {}
        }
      } else {
        // BAD CALL: SluggerKing (id: 1) moves up, BennyTheBat! (id: 2) moves down
        switch (id) {
          case 2: // BennyTheBat! moves from 1st to 2nd (down 1 position)
            return {
              transform: `translateY(${totalOffset}px)`,
              zIndex: 10,
              transition: "transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }
          case 1: // SluggerKing moves from 2nd to 1st (up 1 position)
            return {
              transform: `translateY(-${totalOffset}px)`,
              zIndex: 10,
              transition: "transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }
          default:
            return {}
        }
      }
    },
    [animationState, resultType],
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hidden audio elements */}
      <audio ref={winAudioRef} preload="auto" style={{ display: "none" }}>
        <source
          src="https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/cheer2-XkzDwyrtzPspMyTR6Xti69RVp0UUqD.wav"
          type="audio/wav"
        />
        Your browser does not support the audio element.
      </audio>
      <audio ref={loseAudioRef} preload="auto" style={{ display: "none" }}>
        <source
          src="https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/boo2-H8MlNsaArLp9uBrzLAwQe0CNPyNAbm.wav"
          type="audio/wav"
        />
        Your browser does not support the audio element.
      </audio>
      <audio ref={musicAudioRef} preload="auto" style={{ display: "none" }}>
        <source
          src="https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/take_me_out-pj7VNwzzKBv9oAa4Jude14rTgGYCxy.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>

      <div className="mx-auto max-w-[600px]">
        <div className="px-4 py-2">
          <header className="mb-3 flex items-center">
            <Link href="/" className="mr-4">
              <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div className="flex-1 flex justify-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LONG%20LOGO%20WHITE%20RED%201920x154%281%29-tPnDRzwCRcYNviY4qZSOIJ7dPf0rzl.png"
                alt="SportsGrid"
                width={150}
                height={20}
                className="h-4 w-auto"
              />
            </div>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </header>

          <div className="grid grid-cols-3 gap-2 mb-3 mt-1 items-center">
            <div className="bg-zinc-900 rounded-2xl p-2">
              <div className="mb-1">
                <h3 className="text-sm font-bold text-center uppercase">Pitcher</h3>
              </div>
              <div className="bg-zinc-800 rounded-xl p-2 flex flex-col items-center text-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mb-2 border-2 border-red-600 bg-white">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pitcher-EyuvWREn4EijFTcHCprPoYNLEOnLPb.webp"
                    alt="Pitcher"
                    fill
                    className="object-cover object-top"
                    style={{ objectPosition: "50% 10%" }}
                  />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase">Max Scherzer</div>
                  <div className="text-red-600 font-bold text-xs uppercase">Nationals</div>
                  <div className="text-gray-400 text-xs">ERA: 2.86</div>
                </div>
              </div>
            </div>

            {/* Center column with HOST title and inner rectangle */}
            <div className="bg-zinc-900 rounded-2xl p-2">
              <div className="mb-1" style={{ marginTop: "-2px" }}>
                <h3 className="text-sm font-bold text-center uppercase">Ringmaster</h3>
              </div>
              <div className="bg-zinc-800 rounded-xl overflow-hidden relative" style={{ height: "120px" }}>
                <Image
                  src="https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/cy-DY2qGApBF95rg2eEHiOH2H0l2Uuw24.gif"
                  alt="Host"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 600px) 180px, 180px"
                  unoptimized
                />
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-2">
              <div className="mb-1">
                <h3 className="text-sm font-bold text-center uppercase">Batter</h3>
              </div>
              <div className="bg-zinc-800 rounded-xl p-2 flex flex-col items-center text-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mb-2 border-2 border-blue-900 bg-white">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/batter-DwAa3HihC3T1Uy53dYVPeL6h1nwZ63.webp"
                    alt="Batter"
                    fill
                    className="object-cover object-top"
                    style={{ objectPosition: "50% 15%" }}
                  />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase">Anthony Rizzo</div>
                  <div className="text-blue-500 font-bold text-xs uppercase">Yankees</div>
                  <div className="text-gray-400 text-xs">AVG: .281</div>
                </div>
              </div>
            </div>
          </div>

          <GameState />

          {!predictionSubmitted ? (
            <>
              <div className="bg-zinc-900 rounded-2xl p-3 mb-3">
                <h3 className="text-lg font-bold mb-2 text-center uppercase" style={{ fontSize: "19px" }}>
                  Make Your Prediction
                </h3>
                <div className="grid grid-cols-7 gap-1">
                  <PredictionOption
                    label="Strikeout"
                    value="K"
                    selected={selectedPrediction === "K"}
                    onSelect={handlePredictionSelect}
                  />
                  <PredictionOption
                    label="Single"
                    value="1B"
                    selected={selectedPrediction === "1B"}
                    onSelect={handlePredictionSelect}
                  />
                  <PredictionOption
                    label="Double"
                    value="2B"
                    selected={selectedPrediction === "2B"}
                    onSelect={handlePredictionSelect}
                  />
                  <PredictionOption
                    label="Triple"
                    value="3B"
                    selected={selectedPrediction === "3B"}
                    onSelect={handlePredictionSelect}
                  />
                  <PredictionOption
                    label="Out"
                    value="O"
                    selected={selectedPrediction === "O"}
                    onSelect={handlePredictionSelect}
                  />
                  <PredictionOption
                    label="Walk"
                    value="BB"
                    selected={selectedPrediction === "BB"}
                    onSelect={handlePredictionSelect}
                  />
                  <PredictionOption
                    label="Home Run"
                    value="HR"
                    selected={selectedPrediction === "HR"}
                    onSelect={handlePredictionSelect}
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!selectedPrediction}
                className="w-full text-white text-lg py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                style={{ backgroundColor: "#5d6d7e" }}
              >
                SUBMIT PREDICTION
              </Button>
			             </>
          ) : (
            <div className="bg-zinc-900 rounded-2xl p-4 text-center h-[150px] flex flex-col justify-center">
              {showResultScreen ? (
                <>
                  {resultType === "win" ? (
                    <>
                      {!showCommentBox ? (
                        <>
                          <div className="text-amber-400 text-4xl mb-2">🙌</div>
                          <h3 className="text-xl font-bold mb-2">YOU WON!!</h3>
                          <p className="text-gray-400 text-base">
                            You predicted:{" "}
                            <span className="text-white font-bold">{getPredictionDisplayName(selectedPrediction)}</span>{" "}
                            <span className="text-lime-500 font-bold">+{getPredictionPoints(selectedPrediction)}</span>
                          </p>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-center">
                            <h3 className="text-xl font-bold">Scoreboard Roasts</h3>
                            <div className="text-red-500 font-bold text-xl">{countdown}</div>
                          </div>

                          {/* Comment input */}
                          <div className="relative">
                            <input
                              type="text"
                              value={comment}
                              onChange={(e) => {
                                const newValue = e.target.value.slice(0, 25)
                                setComment(newValue)
                              }}
                              placeholder="Time to flex on 'em..."
                              className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-600 focus:border-lime-500 focus:outline-none text-sm"
                              maxLength={25}
                              autoFocus
                            />
                            <div
                              className={`absolute bottom-1 right-2 text-xs ${comment.length > 20 ? "text-red-500" : "text-gray-400"}`}
                            >
                              {comment.length}/25
                            </div>
                          </div>

                          {/* Emoji selector and Send button in same row */}
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              {availableEmojis.map((emoji, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    if (comment.length < 25) {
                                      setComment((prev) => prev + emoji)
                                    }
                                  }}
                                  className="text-lg p-1 hover:bg-zinc-700 rounded transition-colors"
                                  disabled={comment.length >= 25}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>

                            {/* Send button */}
                            <button
                              onClick={() => {
                                // Show WALK-OFF WINNERS for wins
                                setLeaderboardTitle("WALK-OFF WINNERS")

                                // Change back to LEADERBOARD after 10 seconds
                                setTimeout(() => {
                                  setLeaderboardTitle("LEADERBOARD")
                                }, 10000)

                                // Reset everything
                                setShowCommentBox(false)
                                setComment("")
                                setPredictionSubmitted(false)
                                setShowResultScreen(false)
                                setSelectedPrediction(null)
                                setAnimationState("initial")
                                setCountdown(15)
                              }}
                              className="bg-lime-500 hover:bg-lime-600 text-black font-semibold px-4 py-1 rounded-lg transition-colors text-sm"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="text-amber-600 text-4xl mb-2">💩</div>
                      <h3 className="text-xl font-bold mb-2">BAD CALL!</h3>
                      <p className="text-gray-400 text-base">
                        You predicted:{" "}
                        <span className="text-white font-bold">{getPredictionDisplayName(selectedPrediction)}</span>
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="text-lime-500 text-4xl mb-2">✓</div>
                  <h3 className="text-xl font-bold mb-1">Prediction Submitted!</h3>
                  <p className="text-gray-400 text-base mb-2">
                    You predicted:{" "}
                    <span className="text-white font-bold">{getPredictionDisplayName(selectedPrediction)}</span>
                  </p>
                  <p className="text-gray-400 text-sm">Waiting for the at-bat to complete...</p>
                </>
              )}
            </div>
          )}

          {/* Leaderboard Section */}
          <div ref={leaderboardRef} className="bg-zinc-900 rounded-2xl px-3 pt-3 pb-4 mt-3">
            <h3 className="text-lg font-bold mb-3 text-center uppercase" style={{ fontSize: "21px" }}>
              {leaderboardTitle}
            </h3>

            {leaderboardTitle === "WALK-OFF WINNERS" ? (
              <div className="space-y-3">
                {sortedWalkOffWinnersData.map((player) => (
                  <div key={player.id} className="bg-zinc-800 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      {/* Large Avatar */}
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 mr-3 flex-shrink-0">
                        <Image
                          src={player.avatar || "/placeholder.svg"}
                          alt={player.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        {/* Large text */}
                        <div className="text-white font-semibold text-base mb-1">
                          {player.name}: {player.message}
                        </div>
                        {/* Small text */}
                        <div className="text-gray-400 text-sm">
                          Rank: {player.rank} Correct Picks: {player.correctPicks} Last Correct Pick:{" "}
                          <span className="text-lime-500">{player.lastCorrectPick}</span>
                        </div>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-lime-500 font-bold text-xl mr-1">+{player.points}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1 relative">
                {leaderboardData.map((player, index) => (
                  <div
                    key={player.id}
                    ref={(el) => (cardRefs.current[index] = el)}
                    className={`relative rounded-xl p-2 flex items-center justify-between overflow-hidden ${getCardStyles(player.rank)}`}
                    style={{
                      ...getCardAnimationStyle(player.id, index),
                      height: "44px",
                    }}
                  >
                    {/* Rank Badge */}
                    <div
                      className={`absolute top-0 left-0 w-8 h-8 ${getRankBadgeStyles(player.rank)} rounded-br-xl flex items-center justify-center`}
                    >
                      <div className="text-base font-bold">{player.rank}</div>
                    </div>

                    {/* Avatar - moved next to rank */}
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white/20 ml-10">
                      <Image
                        src={player.avatar || "/placeholder.svg"}
                        alt={player.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 ml-3">
                      <div className={`text-base font-semibold ${player.rank <= 3 ? "text-black" : "text-white"}`}>
                        {player.name}
                      </div>
                      <div
                        className={`text-xs ${
                          player.rank <= 3
                            ? player.hasPick
                              ? "text-black/70"
                              : "text-black/50"
                            : player.hasPick
                              ? "text-blue-400"
                              : "text-gray-400"
                        } font-medium`}
                      >
                        Current Pick: {player.hasPick ? player.pick : "No Pick Selected"}
                      </div>
                    </div>

                    {/* Score */}
                    <div className={`text-xl font-bold ${player.rank <= 3 ? "text-black" : "text-white"} mr-3`}>
                      {player.score}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
