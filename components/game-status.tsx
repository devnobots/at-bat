interface GameStatusProps {
  status: "Upcoming" | "Live" | "Final"
}

export function GameStatus({ status }: GameStatusProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "Live":
        return "bg-lime-500 text-black"
      case "Final":
        return "bg-gray-500 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

  return <div className={`px-4 py-1 rounded-full font-medium ${getStatusStyles()}`}>{status}</div>
}
