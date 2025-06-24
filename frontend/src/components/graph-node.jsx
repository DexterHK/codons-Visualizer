import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

const GraphNode = memo(({ data, isConnectable }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "30px",
        height: "30px",
        border: "1px solid black",
        padding: "0.5rem",
        borderRadius: "50%",
      }}
    >
      <Handle
        style={{
          opacity: 0,
        }}
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <span style={{ color: "black" }}>{data.label}</span>
      <Handle
        style={{
          opacity: 0,
        }}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
});

export default GraphNode;
