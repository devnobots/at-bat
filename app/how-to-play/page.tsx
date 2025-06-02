import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HowToPlay() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8 flex items-center">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon" className="rounded-full w-12 h-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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
          <h1 className="text-3xl font-bold">How To Play</h1>
        </header>

        <div className="space-y-6">
          <section className="bg-zinc-900 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">Game Overview</h2>
            <p className="text-gray-300">
              AT-BAT CHALLENGE is a real-time micro-event prediction game for MLB games. Predict the outcome of each
              at-bat and earn points for correct predictions!
            </p>
          </section>

          <section className="bg-zinc-900 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">How to Make Predictions</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
              <li>Select the current at-bat from the featured MLB game</li>
              <li>
                Choose your prediction from the available options:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Strikeout (K)</li>
                  <li>Single (1B)</li>
                  <li>Double (2B)</li>
                  <li>Triple (3B)</li>
                  <li>Out (Other)</li>
                  <li>Walk (BB)</li>
                  <li>Home Run (HR)</li>
                </ul>
              </li>
              <li>Submit your prediction before the first pitch is thrown</li>
              <li>Earn points based on the accuracy of your prediction</li>
            </ol>
          </section>

          <section className="bg-zinc-900 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">Scoring System</h2>
            <div className="space-y-2 text-gray-300">
              <p>Points are awarded based on the outcome:</p>
              <ul className="list-disc list-inside ml-6">
                <li>Correct Home Run: 100 points</li>
                <li>Correct Triple: 75 points</li>
                <li>Correct Double: 60 points</li>
                <li>Correct Single: 50 points</li>
                <li>Correct Strikeout: 40 points</li>
                <li>Correct Walk/Hit by Pitch: 30 points</li>
                <li>Correct Out (Other): 20 points</li>
                <li>Incorrect Prediction: 0 points</li>
              </ul>
            </div>
          </section>

          <section className="bg-zinc-900 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">Winning</h2>
            <p className="text-gray-300">
              The player with the highest score at the end of the featured game wins! Winners will be announced
              immediately after the game concludes.
            </p>
          </section>

          <div className="text-center mt-8">
            <Link href="/game">
              <Button className="bg-red-600 hover:bg-red-700 text-white text-xl py-6 px-12 rounded-xl">
                Start Playing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
