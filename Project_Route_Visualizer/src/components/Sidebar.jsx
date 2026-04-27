"use client";

import { motion } from "framer-motion";

// @ts-nocheck
export default function Sidebar({ start, end, setStart, setEnd, runAlgorithm, algorithm, setAlgorithm }) {

  console.log("Sidebar props:", { start, end, runAlgorithm });

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col gap-6"
    >
      <h1 className="text-2xl font-bold tracking-wide text-blue-400">
        Route AI
      </h1>

      {/* Start */}
      <div>
        <label className="text-sm text-gray-400">Start Node</label>
        <input
          value={start || ""}
          onChange={(e) => setStart(e.target.value.toUpperCase())}
          className="w-full mt-2 p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. A"
        />
      </div>

      {/* End */}
      <div>
        <label className="text-sm text-gray-400">End Node</label>
        <input
          value={end || ""}
          onChange={(e) => setEnd(e.target.value.toUpperCase())}
          className="w-full mt-2 p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. F"
        />
      </div>

      {/* Algorithm */}
      <div>
        <label className="text-sm text-gray-400">Algorithm</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="w-full mt-2 p-2 rounded-lg bg-gray-900 border border-gray-700"
        >
          <option value="dijkstra">Dijkstra</option>
          <option value="astar">A*</option>
          <option value="bfs">BFS</option>
          <option value="dfs">DFS</option>
          <option value="iddfs">IDDFS</option>
        </select>
      </div>

      {/* Button */}
      <button
        onClick={() => {
          console.log("BUTTON CLICKED");
          runAlgorithm && runAlgorithm();
        }}
        className="mt-4 bg-blue-600 hover:bg-blue-700 transition-all duration-200 p-2 rounded-lg font-semibold shadow-lg shadow-blue-600/20"
      >
        Run Algorithm
      </button>
    </motion.div>
  );
}