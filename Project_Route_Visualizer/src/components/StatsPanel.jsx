// @ts-nocheck
export default function StatsPanel({ result }) {
  return (
    <div className="h-24 bg-white/5 backdrop-blur-xl border-t border-white/10 flex items-center justify-around">
      
      <div className="text-center">
        <p className="text-gray-400 text-sm">Distance</p>
        <p className="text-xl font-semibold text-blue-400">
          {result ? result.distance : "--"}
        </p>
      </div>

      <div className="text-center">
        <p className="text-gray-400 text-sm">Nodes Explored</p>
        <p className="text-xl font-semibold text-green-400">
          {result ? result.visitedCount : "--"}
        </p>
      </div>

      <div className="text-center">
        <p className="text-gray-400 text-sm">Path</p>
        <p className="text-xl font-semibold text-purple-400">
          {result ? result.path.join(" → ") : "--"}
        </p>
      </div>

    </div>
  );
}