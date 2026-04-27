function dls(graphData, current, end, depth, visited, parent, steps, visitedEdges) {
  if (depth < 0) return false;

  visited.add(current);
  steps.push(current);

  if (current === end) return true;

  const neighbors = graphData.edges.filter(
    (e) => e.from === current || e.to === current
  );

  for (const edge of neighbors) {
    const neighbor = edge.from === current ? edge.to : edge.from;

    if (!visited.has(neighbor)) {
      parent[neighbor] = current;
      visitedEdges.push([current, neighbor]);

      if (
        dls(
          graphData,
          neighbor,
          end,
          depth - 1,
          visited,
          parent,
          steps,
          visitedEdges
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

export function iddfs(graphData, start, end) {

  let depth = 0;
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
  
  while (depth < 10) {
    const visited = new Set();
    const parent = {};
    const steps = /** @type {string[]} */ ([]);
    const visitedEdges = /** @type {[string, string][]} */ ([]);

    let visitedCount = 0;

    if (
      dls(
        graphData,
        start,
        end,
        depth,
        visited,
        parent,
        steps,
        visitedEdges
      )
    ) {
      visitedCount = visited.size;

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

    depth++;
  }

  return {
    path: [],
    distance: Infinity,
    visitedCount: 0,
    steps: [],
    visitedEdges: [],
  };
}