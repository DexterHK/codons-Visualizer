import {
  forceSimulation,
  forceManyBody,
  forceRadial,
  forceLink,
  forceCenter,
} from "d3-force";
import { data } from "react-router";

export function computeColumnLayout(
  nodes,
  numColumns,
  width,
  height,
  nodeColor,
) {
  const columns = Array.from({ length: numColumns }, () => []);
  nodes.forEach((node, i) => {
    const colIndex = i % numColumns;
    columns[colIndex].push(node);
  });

  const columnSpacing = width / (numColumns + 1);
  const rowSpacing =
    height / (Math.max(...columns.map((col) => col.length)) + 2);

  const positionedNodes = [];

  columns.forEach((col, colIndex) => {
    const x = (colIndex + 1) * columnSpacing;

    col.forEach((node, rowIndex) => {
      const y = (rowIndex + 1) * rowSpacing;

      positionedNodes.push({
        ...node,
        type: "graphNode",
        style: {
          background: nodeColor,
          borderRadius: "50%",
        },
        position: { x, y },
      });
    });
  });

  return positionedNodes;
}

export function computeCircularLayout(nodes, width, height, nodeColor) {
  const radius = Math.min(width, height) / 5;
  const angleStep = (2 * Math.PI) / nodes.length;
  return nodes.map((node, i) => {
    const angle = i * angleStep;
    return {
      ...node,
      type: "graphNode",
      style: {
        background: nodeColor,
        borderRadius: "50%",
      },
      position: {
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle),
      },
    };
  });
}

export function computeForceLayout(nodes, edges, width, height, nodeColor) {
  const simNodes = nodes.map((n) => ({
    id: n.id,
    data: { label: n.data.label },
  }));
  const simLinks = edges.map((e) => ({
    source: e.source,
    target: e.target,
  }));

  const simulation = forceSimulation(simNodes)
    .force("charge", forceManyBody().strength(-500))
    .force(
      "link",
      forceLink(simLinks)
        .id((d) => d.id)
        .distance(100)
        .strength(1),
    )
    .force("center", forceCenter(width / 2, height / 2))
    .force("radial", forceRadial(250, width / 2, height / 2))
    .stop();

  for (let i = 0; i < 300; i++) simulation.tick();

  console.log(simNodes);
  const newNodes = simNodes.map((simNode) => ({
    id: simNode.id,
    type: "graphNode",
    data: { label: simNode.data.label },
    style: {
      background: nodeColor,
      borderRadius: "50%",
    },
    position: { x: simNode.x, y: simNode.y },
  }));

  return newNodes;
}
