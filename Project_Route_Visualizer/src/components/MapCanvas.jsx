"use client";

// @ts-nocheck
import { useState, useEffect } from "react";
import { graphData } from "../utils/graphGenerator";

export default function MapCanvas({ graph, setGraph, start, end, setStart, setEnd, path, steps, visitedEdges }) {

    const [visitedNodes, setVisitedNodes] = useState([]);
    const [animatedEdges, setAnimatedEdges] = useState([]);
    const [showPath, setShowPath] = useState(false);
    const [draggingNode, setDraggingNode] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleNodeClick = (nodeId) => {
        if (!start) {
            setStart(nodeId);
        } else if (!end && nodeId !== start) {
            setEnd(nodeId);
        } else {
            setStart(nodeId);
            setEnd(null);
        }
    };

    // Animate steps
    useEffect(() => {
        if (!steps || steps.length === 0) return;

        setVisitedNodes([]);
        setAnimatedEdges([]);
        setShowPath(false);

        steps.forEach((node, index) => {
            setTimeout(() => {
                setVisitedNodes(prev => [...prev, node]);
            }, index * 300);
        });

        visitedEdges.forEach((edge, index) => {
            setTimeout(() => {
                setAnimatedEdges(prev => [...prev, edge]);
            }, index * 300);
        });

        // shows final path AFTER animation
        setTimeout(() => {
            setShowPath(true);
        }, steps.length * 300 + 200);

    }, [steps, visitedEdges]);

    // Checks if edge is in shortest path
    const isEdgeInPath = (from, to) => {
        if (!path) return false;

        for (let i = 0; i < path.length - 1; i++) {
            if (
                (path[i] === from && path[i + 1] === to) ||
                (path[i] === to && path[i + 1] === from)
            ) {
                return true;
            }
        }
        return false;
    };

    return (
        <div className="h-full w-full relative bg-gradient-to-br from-gray-900 to-black">

            <svg
            
                className="w-full h-full"
                viewBox="0 0 800 500"
                preserveAspectRatio="xMidYMid meet"
                style={{ userSelect: "none" }}

                onMouseMove={(e) => {
                    if (!draggingNode) return;

                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    setGraph(prev => ({
                        ...prev,
                        nodes: prev.nodes.map(n =>
                            n.id === draggingNode ? { ...n, x, y } : n
                        )
                    }));
                }}

                onMouseUp={() => setDraggingNode(null)}
                onMouseLeave={() => setDraggingNode(null)}
            >

                {/* EDGES */}
                {graph.edges.map((edge, i) => {
                    const fromNode = graph.nodes.find(n => n.id === edge.from);
                    const toNode = graph.nodes.find(n => n.id === edge.to);

                    const midX = (fromNode.x + toNode.x) / 2;
                    const midY = (fromNode.y + toNode.y) / 2;

                    const dx = toNode.x - fromNode.x;
                    const dy = toNode.y - fromNode.y;
                    const length = Math.sqrt(dx * dx + dy * dy);

                    const nx = -dy / length;
                    const ny = dx / length;

                    const offset = 12;

                    //  highlight logic
                    const isVisited = animatedEdges.some(
                        ([f, t]) =>
                            (f === edge.from && t === edge.to) ||
                            (f === edge.to && t === edge.from)
                    );

                    const isPath =
                        showPath &&
                        path &&
                        path.some((node, idx) => {
                            if (idx === path.length - 1) return false;
                            const next = path[idx + 1];
                            return (
                                (node === edge.from && next === edge.to) ||
                                (node === edge.to && next === edge.from)
                            );
                        });

                    return (
                        <g key={i}>
                            {/* EDGE LINE */}
                            <line
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                stroke={
                                    isPath
                                        ? "#22c55e" // 🟢 final path
                                        : isVisited
                                            ? "#facc15" // 🟡 exploring
                                            : "#555"
                                }
                                strokeWidth={isPath ? "5" : "2"}
                                className="transition-all duration-300"
                            />

                            {/*  WEIGHT LABEL */}
                            <text
                                x={midX + nx * offset}
                                y={midY + ny * offset}
                                fill="#9ca3af"
                                fontSize="12"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="cursor-pointer select-none"
                                onClick={(e) => {
                                    e.stopPropagation();

                                    const newWeight = prompt("Enter new weight:", edge.weight);
                                    if (!newWeight) return;

                                    const parsed = Number(newWeight);
                                    if (isNaN(parsed)) return;

                                    setGraph(prev => ({
                                        ...prev,
                                        edges: prev.edges.map((ed, idx) =>
                                            idx === i ? { ...ed, weight: parsed } : ed
                                        )
                                    }));
                                }}
                            >
                                {edge.weight}
                            </text>
                        </g>
                    );
                })}

                {/* NODES */}
                {graph.nodes.map((node) => {
                    const isStart = node.id === start;
                    const isEnd = node.id === end;
                    const isVisited = visitedNodes.includes(node.id);

                    return (
                        <g
                            key={node.id}
                            className="cursor-pointer"
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                setDraggingNode(node.id);
                                setIsDragging(false);
                            }}
                            onMouseUp={(e) => {
                                e.stopPropagation();

                                if (!isDragging) {
                                    handleNodeClick(node.id);
                                }

                                setDraggingNode(null);
                            }}
                        >

                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={isStart || isEnd ? 20 : 18}
                                fill={
                                    isStart
                                        ? "#22c55e"
                                        : isEnd
                                            ? "#ef4444"
                                            : isVisited
                                                ? "#facc15"   // 🟡 animated nodes
                                                : "#3b82f6"
                                }
                                className="transition-all duration-300 hover:scale-110 [transform-origin:center]"
                                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                            />

                            <text
                                x={node.x}
                                y={node.y + 5}
                                textAnchor="middle"
                                fill="white"
                                fontSize="14"
                                fontWeight="bold"
                            >
                                {node.id}
                            </text>
                        </g>
                    );
                })}

            </svg>

            {/* Info Overlay */}
            <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md p-3 rounded-lg text-sm">
                <p>Start: <span className="text-green-400">{start || "--"}</span></p>
                <p>End: <span className="text-red-400">{end || "--"}</span></p>
            </div>

        </div>
    );
}