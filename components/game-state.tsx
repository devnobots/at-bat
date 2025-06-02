export function GameState() {
  return (
    <div className="bg-zinc-900 rounded-2xl p-2 mb-2">
      <div className="bg-zinc-800 rounded-xl p-2">
        <div className="grid grid-cols-3 gap-2 items-center">
          {/* Nationals - Left Side - Centered with Pitcher box */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold mb-1">WAS</div>
            <div className="text-xl font-bold">2</div>
          </div>

          {/* Inning and Outs - Center */}
          <div className="bg-zinc-900 rounded-lg py-1 px-3">
            <div className="text-gray-400 text-sm text-center">Bottom 6th</div>
            <div className="flex items-center justify-center mt-1">
              <div className="w-2 h-2 bg-lime-500 rounded-full mr-1"></div>
              <div className="w-2 h-2 bg-zinc-700 rounded-full mr-1"></div>
              <div className="w-2 h-2 bg-zinc-700 rounded-full"></div>
              <span className="ml-2 text-gray-400 text-xs">1 Out</span>
            </div>
          </div>

          {/* Yankees - Right Side - Centered with Batter box */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold mb-1">NYY</div>
            <div className="text-xl font-bold">3</div>
          </div>
        </div>
      </div>
    </div>
  )
}
