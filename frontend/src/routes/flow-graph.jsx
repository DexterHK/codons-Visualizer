import React from "react";
import { useStore } from "../store";
import { Link } from "react-router";
import GraphV2 from "../components/graph-v2";
import { ReactFlowProvider } from "@xyflow/react";

const FlowGraph = () => {
  const originalCodons = useStore((state) => state.originalCodons);
  const alphaOne = useStore((state) => state.alphaOne);
  const alphaTwo = useStore((state) => state.alphaTwo);
  const alphaThree = useStore((state) => state.alphaThree);
  const numOfCodons = useStore((state) => state.numOfCodons);

  const hasMinimumData =
    originalCodons &&
    alphaOne &&
    originalCodons.nodes &&
    originalCodons.edges &&
    alphaOne.nodes &&
    alphaOne.edges;

  const hasRequiredData = () => {
    if (numOfCodons === 2) return hasMinimumData;
    if (numOfCodons === 3)
      return hasMinimumData && alphaTwo && alphaTwo.nodes && alphaTwo.edges;
    if (numOfCodons === 4)
      return (
        hasMinimumData &&
        alphaTwo &&
        alphaTwo.nodes &&
        alphaTwo.edges &&
        alphaThree &&
        alphaThree.nodes &&
        alphaThree.edges
      );
    return false;
  };

  const normalizeNodes = (nodes) => {
    return nodes.map((item) => ({
      id: item,
      data: { label: item },
    }));
  };

  const normalizeEdges = (edges) => {
    return edges.map((item) => ({
      id: `${item[0]}-${item[1]}`,
      source: item[0],
      target: item[1],
    }));
  };



  return (
    <ReactFlowProvider>
      <GraphV2
        layoutType={"circular"}
        nodeColor={"lightblue"}
        initialNodes={normalizeNodes(originalCodons.nodes)}
        initialEdges={normalizeEdges(originalCodons.edges)}
      />
    </ReactFlowProvider>
  );
};

export default FlowGraph;
