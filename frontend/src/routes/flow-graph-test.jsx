import React from "react";
import GraphV2 from "../components/graph-v2";
import { ReactFlowProvider } from "@xyflow/react";

const FlowGraphTest = () => {
  // Test data with self-loops
  const testNodes = [
    { id: "A", data: { label: "A" } },
    { id: "B", data: { label: "B" } },
    { id: "C", data: { label: "C" } },
  ];

  const testEdges = [
    { id: "A-B", source: "A", target: "B" },
    { id: "B-C", source: "B", target: "C" },
    { id: "A-A", source: "A", target: "A" }, // Self-loop for node A
    { id: "C-C", source: "C", target: "C" }, // Self-loop for node C
  ];

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <GraphV2
          layoutType={"circular"}
          nodeColor={"lightblue"}
          initialNodes={testNodes}
          initialEdges={testEdges}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default FlowGraphTest;
