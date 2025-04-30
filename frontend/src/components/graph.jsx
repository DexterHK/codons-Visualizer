import React from "react";
import { useRef } from "react";
import { darkTheme, GraphCanvas, useSelection } from "reagraph";

export default function Graph({ nodes, edges , layout  }) {
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
    pathSelectionType: "out",
  });
  return (
    <GraphCanvas
      ref={graphRef}
      nodes={nodes}
      edges={edges}
      selections={selections}
      actives={actives}
      onNodeClick={onNodeClick}
      onCanvasClick={onCanvasClick}
      onNodePointerOver={onNodePointerOver}
      onNodePointerOut={onNodePointerOut}
      theme={{ ...darkTheme, canvas: { background: "#242424" } }}
      layoutType= {layout}
      layoutOverrides={{
        linkDistance: 500,
      }}
      draggable
      animated={false}
    />
  );
}
