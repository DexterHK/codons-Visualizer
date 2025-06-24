import React from "react";
import { GraphUtils } from "../utils/GraphUtils";
import GraphV2 from "../../graph-v2";

const SingleGraphTab = ({ 
  graphData, 
  suffix, 
  color, 
  layout, 
  longestPathSelections = []
}) => {
  if (!graphData || !graphData.nodes || !graphData.edges) {
    return null;
  }

  const nodes = GraphUtils.createGraphNodes(graphData.nodes, suffix, color);
  const edges = GraphUtils.createGraphEdges(graphData.edges, suffix, GraphUtils.generateUniqueEdgeId);

  return (
    <GraphV2
      initialNodes={nodes}
      initialEdges={edges}
      layoutType={layout}
      nodeColor={color}
      longestPathSelections={longestPathSelections}
    />
  );
};

export default SingleGraphTab;
