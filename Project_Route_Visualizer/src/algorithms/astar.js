import { euclidean } from "../utils/heuristics";

export function astar(graphData, start, end) {
  const openSet = new Set([start]);

  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  const steps = [];
  const visitedEdges = [];

  graphData.nodes.forEach((node) => {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
  });

  gScore[start] = 0;

  const getNode = (id) => graphData.nodes.find(n => n.id === id);

  fScore[start] = euclidean(getNode(start), getNode(end));

  let visitedCount = 0;

  while (openSet.size > 0) {
    let current = null;
    let minF = Infinity;

    // find node with lowest fScore
    openSet.forEach((node) => {
      if (fScore[node] < minF) {
        minF = fScore[node];
        current = node;
      }
    });

    if (!current) break;

    steps.push(current);

    // ✅ FOUND TARGET
    if (current === end) {
      const path = [];
      let temp = end;

      while (temp) {
        path.unshift(temp);
        temp = cameFrom[temp];
      }

      return {
        path,
        distance: gScore[end],
        visitedCount,
        steps,
        visitedEdges, // ✅ FIXED
      };
    }

    openSet.delete(current);
    visitedCount++;

    const neighbors = graphData.edges.filter(
      (e) => e.from === current || e.to === current
    );

    neighbors.forEach((edge) => {
      const neighbor = edge.from === current ? edge.to : edge.from;

      visitedEdges.push([current, neighbor]); // ✅ track edges

      const tentativeG = gScore[current] + edge.weight;

      if (tentativeG < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeG;

        fScore[neighbor] =
          tentativeG +
          euclidean(getNode(neighbor), getNode(end));

        openSet.add(neighbor);
      }
    });
  }

  // fallback
  return {
    path: [],
    distance: Infinity,
    visitedCount,
    steps,
    visitedEdges,
  };
}