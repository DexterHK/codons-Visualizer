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
} from "../utils/computeLayout";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { useEffect } from "react";
import FloatingEdge from "./floating-edge";
import FloatingConnectionLine from "./floating-connection-line";

const nodeTypes = {
  graphNode: GraphNode,
};

const edgeTypes = {
  floatingEdge: FloatingEdge,
};

export default function GraphInner({
  initialNodes,
  initialEdges,
  layoutType,
  nodeColor,
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
            type: "floatingEdge",
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

  useEffect(() => {
    if (!selectedNodeId) {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          style: {
            ...node.style,
            background: nodeColor,
            boxShadow: "none",
          },
        })),
      );

      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          style: {
            ...edge.style,
            stroke: "#b1b1b7",
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#b1b1b7",
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
  }, [selectedNodeId, initialEdges, setNodes, setEdges]);

  useEffect(() => {
    if (!size.width || !size.height) return;
    if (!initialNodes || !initialEdges) return;

    let layoutedNodes;
    if (layoutType === "force") {
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
    } else {
      layoutedNodes = computeColumnLayout(
        initialNodes,
        3,
        size.width,
        size.height,
        nodeColor,
      );
    }

    const newEdges = initialEdges.map((e, i) => ({
      id: `${e.source}-${e.target}-${i}`,
      source: e.source,
      target: e.target,
      type: "floatingEdge",
      markerEnd: { type: MarkerType.ArrowClosed },
    }));

    setNodes(layoutedNodes);
    setEdges(newEdges);
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
