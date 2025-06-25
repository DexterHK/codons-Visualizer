import { useInternalNode } from "@xyflow/react";

function SelfLoopEdge({ id, source, target, markerEnd, style }) {
  const sourceNode = useInternalNode(source);

  if (!sourceNode) {
    return null;
  }

  // Get node position and dimensions
  const nodePosition = sourceNode.internals.positionAbsolute;
  const nodeWidth = sourceNode.measured?.width || 50;
  const nodeHeight = sourceNode.measured?.height || 50;
  
  // Calculate center of the node
  const centerX = nodePosition.x + nodeWidth / 2;
  const centerY = nodePosition.y + nodeHeight / 2;
  
  // Calculate radius for the self-loop (make it larger and more visible)
  const nodeRadius = Math.max(nodeWidth, nodeHeight) / 2;
  const loopRadius = nodeRadius * 2; // Larger loop for better visibility
  
  // Position the loop at the top of the node for better visibility
  const startAngle = -Math.PI / 2; // Top of the node
  const endAngle = startAngle + Math.PI / 3; // 60 degrees arc
  
  // Start point on the node edge
  const startX = centerX + nodeRadius * Math.cos(startAngle);
  const startY = centerY + nodeRadius * Math.sin(startAngle);
  
  // End point on the node edge
  const endX = centerX + nodeRadius * Math.cos(endAngle);
  const endY = centerY + nodeRadius * Math.sin(endAngle);
  
  // Control points for a prominent circular arc
  const midAngle = (startAngle + endAngle) / 2;
  const controlX = centerX + loopRadius * Math.cos(midAngle);
  const controlY = centerY + loopRadius * Math.sin(midAngle);
  
  // Create SVG path for self-loop using quadratic bezier curve for simplicity
  const pathData = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={pathData}
      markerEnd={markerEnd}
      style={{
        fill: 'none',
        stroke: '#b1b1b7',
        strokeWidth: 3, // Thicker line for better visibility
        ...style
      }}
    />
  );
}

export default SelfLoopEdge;
