import React from "react";
import { useResizeObserver } from "../hooks/useResizeObserver";
import GraphInner from "./graph-inner";

export default function GraphV2({ initialNodes, initialEdges, layoutType, nodeColor, edgeColor, longestPathSelections, disableFitView }) {
  const graphWrapperRef = React.useRef(null);
  const size = useResizeObserver(graphWrapperRef);

  return (
    <div ref={graphWrapperRef} style={{ width: "100%", display: "block", height: "100%" }}>
      <GraphInner
        size={size}
        nodeColor={nodeColor}
        edgeColor={edgeColor}
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        layoutType={layoutType}
        longestPathSelections={longestPathSelections}
        disableFitView={disableFitView}
      />
    </div>
  );
}
