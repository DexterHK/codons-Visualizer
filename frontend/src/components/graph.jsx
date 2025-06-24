import React from "react";
import { useRef } from "react";
import { darkTheme, lightTheme, GraphCanvas, useSelection } from "reagraph";
import { useStore } from "../store";
import {
  sortNodes,
  sortEdges,
  calculateNodeDegrees,
  getOptimalLayoutConfig,
  bundleEdges,
} from "../utils/graphSorting";

export default function Graph({
  nodes,
  edges,
  layout,
  selections: externalSelections,
  isC3Tab = false,
  nodeSortType = "alphabetical",
  enableOptimization = false,
}) {
  const graphRef = useRef(null);
  const [activeElements, setActiveElements] = React.useState([]);
  const theme = useStore((state) => state.theme);

  const {
    selections: localSelections,
    onNodeClick,
    onCanvasClick,
  } = useSelection({
    ref: graphRef,
    pathSelectionType: "all",
    defaultSelection: externalSelections,
  });

  // Create edge selections from the selected nodes
  const edgeSelections = React.useMemo(() => {
    const selections = [];
    if (externalSelections && edges) {
      for (let i = 0; i < externalSelections.length - 1; i++) {
        const currentNode = externalSelections[i];
        const nextNode = externalSelections[i + 1];

        // Find the edge that connects these nodes
        const edge = edges.find(
          (e) =>
            (e.source === currentNode && e.target === nextNode) ||
            (e.source === nextNode && e.target === currentNode),
        );

        if (edge) {
          selections.push(edge.id);
        }
      }
    }
    return selections;
  }, [externalSelections, edges]);

  const allActiveIds = [
    ...activeElements,
    ...edgeSelections,
    ...(externalSelections || []),
  ];

  // Apply sorting and optimization to nodes and edges
  const sortedNodes = React.useMemo(() => {
    if (!nodes || nodes.length === 0) return nodes;

    let processedNodes = [...nodes];

    // Calculate degrees if needed for degree-based sorting
    if (nodeSortType === "degree") {
      processedNodes = calculateNodeDegrees(processedNodes, edges || []);
    }

    return sortNodes(processedNodes, nodeSortType);
  }, [nodes, edges, nodeSortType]);

  // Get optimal layout configuration if optimization is enabled
  const layoutOverrides = React.useMemo(() => {
    const baseOverrides = { linkDistance: 500 };

    if (enableOptimization && sortedNodes && edges) {
      const optimalConfig = getOptimalLayoutConfig(sortedNodes, edges, layout);
      return { ...baseOverrides, ...optimalConfig };
    }

    return baseOverrides;
  }, [enableOptimization, sortedNodes, edges, layout]);

  // Custom theme that adapts to the current theme
  const customTheme = React.useMemo(() => {
    const baseTheme = theme === "dark" ? darkTheme : lightTheme;

    return {
      ...baseTheme,
      canvas: {
        background: theme === "dark" ? "#242424" : "#ffffff",
      },
      edge: {
        ...baseTheme.edge,
        color: theme === "dark" ? "#666" : "#999",
        selectedColor: "#646cff",
        width: 1,
        selectedWidth: 2,
        opacity: 1,
        selectedOpacity: 1,
        label: {
          stroke: isC3Tab
            ? theme === "dark"
              ? "#ffffff"
              : "#000000"
            : "transparent",
          color: isC3Tab
            ? theme === "dark"
              ? "#ffffff"
              : "#000000"
            : "transparent",
          fontSize: isC3Tab ? 8 : 0, // Smaller font for C3, invisible for others
          fontFamily: "Arial, sans-serif",
          visible: isC3Tab,
          activeOpacity: isC3Tab ? 1 : 0,
          inactiveOpacity: isC3Tab ? 0.8 : 0,
        },
      },
      node: {
        ...baseTheme.node,
        label: {
          ...baseTheme.node.label,
          visible: true,
          color: theme === "dark" ? "#ffffff" : "#000000",
          stroke: theme === "dark" ? "#000000" : "#ffffff",
          strokeWidth: 1,
        },
      },
    };
  }, [theme, isC3Tab]);

  // Process edges to ensure proper coloring for C3 tab
  const finalProcessedEdges = React.useMemo(() => {
    if (!isC3Tab) return edges;

    return edges.map((edge) => ({
      ...edge,
      // Use the stroke color from the edge data if available
      color: edge.stroke || (theme === "dark" ? "#666" : "#999"),
      width: edge.strokeWidth || 1,
    }));
  }, [edges, isC3Tab, theme]);

  return (
    <GraphCanvas
      ref={graphRef}
      nodes={sortedNodes || nodes}
      edges={finalProcessedEdges}
      selections={allActiveIds}
      actives={allActiveIds}
      onNodeClick={onNodeClick}
      onCanvasClick={onCanvasClick}
      onEdgeClick={(edge) => {
        setActiveElements((prev) =>
          prev.includes(edge.id)
            ? prev.filter((id) => id !== edge.id)
            : [...prev, edge.id],
        );
      }}
      theme={customTheme}
      layoutType={layout}
      layoutOverrides={layoutOverrides}
      edgeArrowPosition="end"
      edgeLabelPosition="center"
      labelType={isC3Tab ? "all" : "nodes"}
      draggable
      animated={false}
    />
  );
}
