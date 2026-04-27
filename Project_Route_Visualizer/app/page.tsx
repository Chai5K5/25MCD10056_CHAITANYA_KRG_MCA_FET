"use client";

import { useState } from "react";
import Sidebar from "../src/components/Sidebar";
import MapCanvas from "../src/components/MapCanvas";
import StatsPanel from "../src/components/StatsPanel";
import { graphData } from "../src/utils/graphGenerator";
import { dijkstra } from "../src/algorithms/dijkstra";
import { astar } from "../src/algorithms/astar";
import { bfs } from "../src/algorithms/bfs";
import { dfs } from "../src/algorithms/dfs";
import { iddfs } from "../src/algorithms/iddfs";

type AlgoResult = {
  path: string[];
  distance: number;
  visitedCount: number;
  steps: string[];
  visitedEdges: [string, string][];
};

export default function Home() {
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [result, setResult] = useState<AlgoResult | null>(null);
  const [algorithm, setAlgorithm] = useState("dijkstra");

  const [steps, setSteps] = useState<string[]>([]);
  const [visitedEdges, setVisitedEdges] = useState<[string, string][]>([]);

  const [graph, setGraph] = useState(graphData);

  const runAlgorithm = () => {
    if (!start || !end) {
      console.log("Select start and end first");
      return;
    }

    let res: AlgoResult | null = null;

    switch (algorithm) {
      case "dijkstra":
        res = dijkstra(graph, start, end);
        break;

      case "astar":
        res = astar(graph, start, end);
        break;

      case "bfs":
        res = bfs(graph, start, end);
        break;

      case "dfs":
        res = dfs(graph, start, end);
        break;

      case "iddfs":
        res = iddfs(graph, start, end);
        break;

      default:
        console.log("Unknown algorithm");
        return;
    }

    console.log("GRAPH USED:", graph);
    console.log("RESULT:", res);

    if (!res) return;

    setResult(res);
    setSteps(res.steps);
    setVisitedEdges(res.visitedEdges);
  };

  return (
    <div className="h-screen w-full bg-gray-950 text-white flex overflow-hidden">

      <Sidebar
        start={start}
        end={end}
        setStart={setStart}
        setEnd={setEnd}
        runAlgorithm={runAlgorithm}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
      />

      <div className="flex-1 flex flex-col">

        <div className="flex-1 overflow-hidden">
          <MapCanvas
            graph={graph}
            setGraph={setGraph}
            start={start}
            end={end}
            setStart={setStart}
            setEnd={setEnd}
            path={result ? result.path : null}
            steps={steps}
            visitedEdges={visitedEdges}
          />
        </div>

        <div className="h-24 flex-shrink-0">
          <StatsPanel result={result} />
        </div>

      </div>
    </div>
  );
}