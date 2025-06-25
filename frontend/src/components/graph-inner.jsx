import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import GraphNode from "./graph-node";
import {
  computeCircularLayout,
  computeColumnLayout,
  computeForceLayout,
  computeAdvancedLayout,
  computeGridLayout,
} from "../utils/computeLayout";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { useEffect } from "react";
import FloatingEdge from "./floating-edge";
import SelfLoopEdge from "./self-loop-edge";
import FloatingConnectionLine from "./floating-connection-line";

const nodeTypes = {
  graphNode: GraphNode,
};

const edgeTypes = {
  floatingEdge: FloatingEdge,
  selfLoopEdge: SelfLoopEdge,
};

export default function GraphInner({
  initialNodes,
  initialEdges,
  layoutType,
  nodeColor,
  edgeColor = "#b1b1b7", // Default edge color
  longestPathSelections = [],
}) {
  const graphWrapperRef = React.useRef(null);
  const size = useResizeObserver(graphWrapperRef);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: params.source === params.target ? "selfLoopEdge" : "floatingEdge",
            markerEnd: { type: MarkerType.Arrow },
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const handleNodeClick = useCallback((event, node) => {
    event.stopPropagation();
    setSelectedNodeId(node.id);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Effect to handle longest path highlighting
  useEffect(() => {
    if (longestPathSelections.length > 0) {
      setNodes((nds) =>
        nds.map((node) => {
          const isInLongestPath = longestPathSelections.includes(node.id);
          return {
            ...node,
            style: {
              ...node.style,
              background: isInLongestPath ? "#FF6B6B" : nodeColor,
              border: isInLongestPath ? "3px solid #FF1744" : "1px solid #666",
              boxShadow: isInLongestPath ? "0 0 15px rgba(255, 107, 107, 0.6)" : "none",
            },
          };
        }),
      );

      // Highlight edges that connect longest path nodes
      setEdges((eds) =>
        eds.map((edge) => {
          const isLongestPathEdge = longestPathSelections.includes(edge.source) && 
                                   longestPathSelections.includes(edge.target);
          return {
            ...edge,
            style: {
              ...edge.style,
              stroke: isLongestPathEdge ? "#FF1744" : edgeColor,
              strokeWidth: isLongestPathEdge ? 3 : 1,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isLongestPathEdge ? "#FF1744" : edgeColor,
            },
          };
        }),
      );
      return;
    }

    if (!selectedNodeId) {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          style: {
            ...node.style,
            background: nodeColor,
            border: "1px solid #666",
            boxShadow: "none",
          },
        })),
      );

      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          style: {
            ...edge.style,
            stroke: edgeColor,
            strokeWidth: 1,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeColor,
          },
        })),
      );

      return;
    }

    setNodes((nds) =>
      nds.map((node) => {
        const isSelected = node.id === selectedNodeId;
        const isConnected = initialEdges.some(
          (e) =>
            (e.source === selectedNodeId && e.target === node.id) ||
            (e.target === selectedNodeId && e.source === node.id),
        );

        return {
          ...node,
          style: {
            ...node.style,
            borderRadius: "50%",
            background: isSelected
              ? "#0CECDD"
              : isConnected
                ? "#FFF338"
                : "#3a3a3a",
          },
        };
      }),
    );

    setEdges((eds) =>
      eds.map((edge) => {
        const isConnected =
          edge.source === selectedNodeId || edge.target === selectedNodeId;
        return {
          ...edge,
          style: {
            ...edge.style,
            stroke: isConnected ? "#0CECDD" : "#5a5a5a",
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isConnected ? "#0CECDD" : "#5a5a5a",
          },
        };
      }),
    );
  }, [selectedNodeId, initialEdges, setNodes, setEdges, longestPathSelections, nodeColor]);

  useEffect(() => {
    if (!size.width || !size.height) return;
    if (!initialNodes || !initialEdges) return;

    const applyLayoutAsync = async () => {
      let layoutedNodes;
      
      // Handle preset layout (nodes already have positions)
      if (layoutType === "preset") {
        layoutedNodes = initialNodes.map(node => ({
          ...node,
          type: "graphNode",
          style: {
            background: nodeColor,
            borderRadius: "50%",
            ...node.style,
          },
          position: node.position || { x: 0, y: 0 }
        }));
      }
      // Handle basic layouts that don't need async processing
      else if (layoutType === "force") {
        layoutedNodes = computeForceLayout(
          initialNodes,
          initialEdges,
          size.width,
          size.height,
          nodeColor,
        );
      } else if (layoutType === "circular") {
        layoutedNodes = computeCircularLayout(
          initialNodes,
          size.width,
          size.height,
          nodeColor,
        );
      } else if (layoutType === "grid") {
        layoutedNodes = computeGridLayout(
          initialNodes,
          size.width,
          size.height,
          nodeColor,
        );
      } else if (layoutType === "columns") {
        layoutedNodes = computeColumnLayout(
          initialNodes,
          3,
          size.width,
          size.height,
          nodeColor,
        );
      } else {
        // Handle advanced layouts (Dagre, ELK, D3-Hierarchy, etc.)
        try {
          layoutedNodes = await computeAdvancedLayout(
            initialNodes,
            initialEdges,
            layoutType,
            size.width,
            size.height,
            nodeColor,
          );
        } catch (error) {
          console.warn(`Advanced layout ${layoutType} failed, using force layout:`, error);
          layoutedNodes = computeForceLayout(
            initialNodes,
            initialEdges,
            size.width,
            size.height,
            nodeColor,
          );
        }
      }

      const newEdges = initialEdges.map((e, i) => ({
        id: `${e.source}-${e.target}-${i}`,
        source: e.source,
        target: e.target,
        type: e.source === e.target ? "selfLoopEdge" : "floatingEdge",
        markerEnd: { type: MarkerType.ArrowClosed },
      }));

      setNodes(layoutedNodes);
      setEdges(newEdges);
    };

    applyLayoutAsync();
  }, [size, layoutType, initialNodes, initialEdges, setNodes, setEdges, nodeColor]);

  if (!nodes || !edges) return null;

  return (
    <div ref={graphWrapperRef} style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        connectionLineComponent={FloatingConnectionLine}
        fitView
      >
        <Controls
          style={{
            color: "black",
            gap: 5,
          }}
        />
      </ReactFlow>
    </div>
  );
}
