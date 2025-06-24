import {
  forceSimulation,
  forceManyBody,
  forceRadial,
  forceLink,
  forceCenter,
} from "d3-force";
import { applyLayout, sortNodes, calculateCentrality } from "./graphSorting";

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

/**
 * Comprehensive layout function that supports all layout algorithms
 */
export async function computeAdvancedLayout(nodes, edges, layoutType, width, height, nodeColor) {
  // Convert nodes to the format expected by graphSorting utilities
  const graphNodes = nodes.map(node => ({
    id: node.id,
    label: node.data?.label || node.id,
    position: { x: 0, y: 0 },
    measured: { width: 100, height: 50 }
  }));

  const graphEdges = edges.map(edge => ({
    source: edge.source,
    target: edge.target
  }));

  try {
    // Apply the layout using our comprehensive layout system
    const layoutedNodes = await applyLayout(graphNodes, graphEdges, layoutType, {
      centerX: width / 2,
      centerY: height / 2,
      spacing: Math.min(width, height) / 10,
      radius: Math.min(width, height) / 4
    });

    // Convert back to React Flow format
    return layoutedNodes.map(node => ({
      id: node.id,
      type: "graphNode",
      data: { label: node.label },
      style: {
        background: nodeColor,
        borderRadius: "50%",
      },
      position: node.position
    }));
  } catch (error) {
    console.warn(`Layout ${layoutType} failed, falling back to force layout:`, error);
    // Fallback to force layout if advanced layout fails
    return computeForceLayout(nodes, edges, width, height, nodeColor);
  }
}

/**
 * Grid layout with better spacing
 */
export function computeGridLayout(nodes, width, height, nodeColor) {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const rows = Math.ceil(nodes.length / cols);
  
  const cellWidth = width / (cols + 1);
  const cellHeight = height / (rows + 1);
  
  return nodes.map((node, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    return {
      ...node,
      type: "graphNode",
      style: {
        background: nodeColor,
        borderRadius: "50%",
      },
      position: {
        x: (col + 1) * cellWidth,
        y: (row + 1) * cellHeight,
      },
    };
  });
}
