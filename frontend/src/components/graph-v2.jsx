import React from "react";
import { useResizeObserver } from "../hooks/useResizeObserver";
import GraphInner from "./graph-inner";

export default function GraphV2({ initialNodes, initialEdges, layoutType, nodeColor, longestPathSelections }) {
  const graphWrapperRef = React.useRef(null);
  const size = useResizeObserver(graphWrapperRef);

  return (
    <div ref={graphWrapperRef} style={{ width: "100%", display: "block", height: "100%" }}>
      <GraphInner
        size={size}
        nodeColor={nodeColor}
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        layoutType={layoutType}
        longestPathSelections={longestPathSelections}
      />
    </div>
  );
}
