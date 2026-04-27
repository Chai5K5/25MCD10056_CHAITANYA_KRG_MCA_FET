export function dijkstra(graphData, start, end) {
  const distances = {};
  const prev = {};
  const visited = new Set();
  const steps = []; 
  const visitedEdges = [];
  graphData.nodes.forEach((node) => {
    distances[node.id] = Infinity;
    prev[node.id] = null;
  });

  distances[start] = 0;

  while (true) {
    let current = null;
    let minDist = Infinity;

    for (let node in distances) {
      if (!visited.has(node) && distances[node] < minDist) {
        minDist = distances[node];
        current = node;
      }
    }

    if (!current) break;

    steps.push(current); 

    if (current === end) break;

    visited.add(current);

    const neighbors = graphData.edges.filter(
      (e) => e.from === current || e.to === current
    );

    neighbors.forEach((edge) => {
      const neighbor = edge.from === current ? edge.to : edge.from;
      const newDist = distances[current] + edge.weight;
      visitedEdges.push([current, neighbor]);
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        prev[neighbor] = current;
      }
    });
  }

  const path = [];
  let curr = end;

  while (curr) {
    path.unshift(curr);
    curr = prev[curr];
  }

  return {
    path,
    distance: distances[end],
    visitedCount: visited.size,
    steps,
    visitedEdges, 
  };
}