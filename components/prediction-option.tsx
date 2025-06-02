"use client"

interface PredictionOptionProps {
  label: string
  value: string
  selected: boolean
  onSelect: (value: string) => void
}

export function PredictionOption({ label, value, selected, onSelect }: PredictionOptionProps) {
  return (
    <button
      onClick={() => onSelect(value)}
      className={`
        p-3 rounded-lg text-center transition-all font-semibold text-base
        ${selected ? "bg-lime-500 text-black hover:bg-lime-600" : "bg-zinc-800 text-white hover:bg-zinc-700"}
      `}
      style={{
        backgroundColor: selected ? "#7bc113" : "#27272a",
        color: selected ? "#000000" : "#ffffff",
      }}
    >
      <div>{value}</div>
    </button>
  )
}
