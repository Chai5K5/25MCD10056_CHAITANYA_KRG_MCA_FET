export function bfs(graphData, start, end) {

  const getDistance = (path, edges) => {
    let total = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];

      const edge = edges.find(
        (e) =>
          (e.from === from && e.to === to) ||
          (e.from === to && e.to === from)
      );

      if (edge) total += edge.weight;
    }

    return total;
  };

  const queue = [start];
  const visited = new Set([start]);
  const parent = {};

  const steps = /** @type {string[]} */ ([]);
  const visitedEdges = /** @type {[string, string][]} */ ([]);

  let visitedCount = 1;

  while (queue.length > 0) {
    const current = queue.shift();
    steps.push(current);

    if (current === end) {
      const path = /** @type {string[]} */ ([]);
      let temp = end;

      while (temp) {
        path.unshift(temp);
        temp = parent[temp];
      }

      return {
        path,
        distance: getDistance(path, graphData.edges),
        visitedCount,
        steps,
        visitedEdges,
      };
    }

    const neighbors = graphData.edges.filter(
      (e) => e.from === current || e.to === current
    );

    for (const edge of neighbors) {
      const neighbor = edge.from === current ? edge.to : edge.from;

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        visitedCount++;
        parent[neighbor] = current;
        queue.push(neighbor);

        visitedEdges.push([current, neighbor]);
      }
    }
  }

  // fallback
  return {
    path: [],
    distance: Infinity,
    visitedCount: 0,
    steps: [],
    visitedEdges: [],
  };
}