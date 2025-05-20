import React from "react";
import { useRef } from "react";
import { darkTheme, GraphCanvas, useSelection } from "reagraph";

export default function Graph({ nodes, edges, layout, selections: externalSelections }) {
  const graphRef = useRef(null);
  const {
    selections: localSelections,
    actives,
    onNodeClick,
    onCanvasClick,
    onNodePointerOver,
    onNodePointerOut,
  } = useSelection({
    ref: graphRef,
    pathSelectionType: "out",
    defaultSelection: externalSelections,
  });
  return (
    <GraphCanvas
      ref={graphRef}      nodes={nodes}
      edges={edges}
      selections={externalSelections || localSelections}
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
