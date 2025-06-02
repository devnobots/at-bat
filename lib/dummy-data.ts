export interface Player {
  id: string
  name: string
  team: string
  position: "pitcher" | "batter"
  stats: {
    [key: string]: string | number
  }
  imageUrl: string
}

export interface Game {
  id: string
  homeTeam: {
    id: string
    name: string
    abbreviation: string
    color: string
    score: number
  }
  awayTeam: {
    id: string
    name: string
    abbreviation: string
    color: string
    score: number
  }
  status: "Upcoming" | "Live" | "Final"
  inning: {
    number: number
    half: "top" | "bottom"
  }
  outs: number
  baseRunners: {
    first: boolean
    second: boolean
    third: boolean
  }
  currentAtBat: {
    pitcher: Player
    batter: Player
  }
}

export const dummyGame: Game = {
  id: "game-001",
  homeTeam: {
    id: "nyy",
    name: "Yankees",
    abbreviation: "NYY",
    color: "#0C2340",
    score: 3,
  },
  awayTeam: {
    id: "wsh",
    name: "Nationals",
    abbreviation: "WSH",
    color: "#AB0003",
    score: 2,
  },
  status: "Live",
  inning: {
    number: 6,
    half: "bottom",
  },
  outs: 1,
  baseRunners: {
    first: true,
    second: true,
    third: false,
  },
  currentAtBat: {
    pitcher: {
      id: "player-001",
      name: "Max Scherzer",
      team: "Washington Nationals",
      position: "pitcher",
      stats: {
        ERA: "2.86",
        SO: 174,
        WHIP: "1.05",
      },
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pitcher-EyuvWREn4EijFTcHCprPoYNLEOnLPb.webp",
    },
    batter: {
      id: "player-002",
      name: "Anthony Rizzo",
      team: "New York Yankees",
      position: "batter",
      stats: {
        AVG: ".281",
        HR: 22,
        RBI: 67,
      },
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/batter-DwAa3HihC3T1Uy53dYVPeL6h1nwZ63.webp",
    },
  },
}

export const dummyUserStats = {
  todayScore: 320,
  correctPredictions: 8,
  totalPredictions: 12,
  currentRank: 5,
}
