export const graphData = (() => {
  const nodes = [
    { id: "A", x: 100, y: 100 },
    { id: "B", x: 300, y: 80 },
    { id: "C", x: 550, y: 150 },
    { id: "D", x: 200, y: 350 },
    { id: "E", x: 400, y: 350 },
    { id: "F", x: 650, y: 250 },
  ];

  const edges = [
    { from: "A", to: "B" },
    { from: "A", to: "D" },
    { from: "B", to: "C" },
    { from: "C", to: "F" },
    { from: "D", to: "E" },
    { from: "E", to: "F" },
    { from: "B", to: "E" },
  ];

  const computedEdges = edges.map((edge) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);

    const rawDistance = Math.sqrt(
      Math.pow(fromNode.x - toNode.x, 2) +
      Math.pow(fromNode.y - toNode.y, 2)
    );

    // scale it down
    const weight = Math.round(rawDistance / 100);

    return { ...edge, weight: Math.round(weight) };
  });

  return {
    nodes,
    edges: computedEdges,
  };
})();