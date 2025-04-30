import "../index.css";
import { GraphCanvas, useSelection } from "reagraph";

import React, { useRef } from "react";



export default function App() {
  const graphRef = useRef(null);
  const {
    selections,
    actives,
    onNodeClick,
    onCanvasClick,
    onNodePointerOver,
    onNodePointerOut,
  } = useSelection({
    ref: graphRef,
    pathHoverType: "all",
  });
  return (
    <div className="App">
      <GraphCanvas
         theme={themey}
        ref={graphRef}
        selections={selections}
        actives={actives}
        onNodePointerOver={onNodePointerOver}
        onNodePointerOut={onNodePointerOut}
        onCanvasClick={onCanvasClick}
        onNodeClick={onNodeClick}
        nodes={[
          {
            id: "n-1",
            label: "1",
          },
          {
            id: "n-2",
            label: "2",
          },
          {
            id: "n-3",
            label: "3",
          },
          {
            id: "n-4",
            label: "4",
          },
        ]}
        edges={[
          {
            id: "1->2",
            source: "n-1",
            target: "n-2",
            label: "Edge 1-2",
          },
          {
            id: "1->3",
            source: "n-1",
            target: "n-3",
            label: "Edge 1-3",
          },
          {
            id: "1->4",
            source: "n-1",
            target: "n-4",
            label: "Edge 1-4",
          },
        ]}
      />
    </div>
  );
}

() => {
  const ref = (useRef < GraphCanvasRef) | (null > null);
  return (
    <div>
      <div
        style={{
          zIndex: 9,
          position: "absolute",
          top: 15,
          right: 15,
          background: "rgba(0, 0, 0, .5)",
          padding: 1,
          color: "white",
        }}
      >
        <button
          style={{
            display: "block",
            width: "100%",
          }}
          onClick={() => {
            const data = ref.current.exportCanvas();
            const link = document.createElement("a");
            link.setAttribute("href", data);
            link.setAttribute("target", "_blank");
            link.setAttribute("download", "graph.png");
            link.click();
          }}
        >
          Export Graph
        </button>
      </div>
      <GraphCanvas ref={ref} nodes={simpleNodes} edges={simpleEdges} />
    </div>
  );
};

