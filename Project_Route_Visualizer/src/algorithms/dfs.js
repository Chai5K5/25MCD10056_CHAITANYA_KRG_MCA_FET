export function dfs(graphData, start, end) {
  const stack = [start];
  const visited = new Set();
  const parent = {};
  const steps = /** @type {string[]} */ ([]);
  const visitedEdges = /** @type {[string, string][]} */ ([]);

  let visitedCount = 0;
  
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

  while (stack.length > 0) {
    const current = stack.pop();

    if (visited.has(current)) continue;

    visited.add(current);
    visitedCount++;
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
        parent[neighbor] = current;
        stack.push(neighbor);

        visitedEdges.push([current, neighbor]);
      }
    }
  }

  return {
    path: [],
    distance: Infinity,
    visitedCount: 0,
    steps: [],
    visitedEdges: [],
  };
}