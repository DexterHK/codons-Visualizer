/**
 * Utility for creating consistent node positions across multiple graphs
 * Ensures that nodes with the same sequence appear in identical positions when overlaying graphs
 */

/**
 * Generate consistent positions dynamically by analyzing all nodes
 * Every unique node gets assigned a fixed position that will be used across all graphs
 * @param {Array} allGraphNodes - Array of all graph node arrays to analyze
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {Object} Map of node IDs to positions
 */
export function generateDynamicPositions(allGraphNodes, width, height) {
  const positionMap = {};
  const allUniqueNodes = new Set();
  
  // Collect all unique base sequences from all graphs
  allGraphNodes.forEach(graphNodes => {
    if (graphNodes) {
      graphNodes.forEach(node => {
        // Extract the base sequence from the node - same logic as applyConsistentPositions
        let baseSequence = null;
        
        if (node.data?.label) {
          baseSequence = node.data.label;
        } else if (node.id) {
          // Remove suffix (o, a1, a2, a3) to get base sequence
          baseSequence = node.id.replace(/[oa]\d*$/, '');
        } else if (node.label) {
          baseSequence = node.label;
        }
        
        if (baseSequence) {
          allUniqueNodes.add(baseSequence);
        }
      });
    }
  });
  
  // Convert to sorted array for consistent ordering
  const nodeArray = Array.from(allUniqueNodes).sort();
  
  // Generate positions for all unique nodes using a grid layout
  const positions = generateGridLayout(nodeArray, width, height);
  
  // Create position map
  nodeArray.forEach((nodeId, index) => {
    positionMap[nodeId] = positions[index];
  });
  
  return positionMap;
}

/**
 * Generate a grid layout that distributes nodes evenly across the canvas
 * @param {Array} nodes - Array of node IDs
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {Array} Array of positions
 */
function generateGridLayout(nodes, width, height) {
  const positions = [];
  const nodeCount = nodes.length;
  
  if (nodeCount === 0) return positions;
  
  // Calculate optimal grid dimensions
  const aspectRatio = width / height;
  let cols = Math.ceil(Math.sqrt(nodeCount * aspectRatio));
  let rows = Math.ceil(nodeCount / cols);
  
  // Adjust if we have too many empty spots
  while (cols * rows - nodeCount > cols && rows > 1) {
    rows--;
    cols = Math.ceil(nodeCount / rows);
  }
  
  // Calculate spacing
  const margin = Math.min(width, height) * 0.1; // 10% margin
  const availableWidth = width - 2 * margin;
  const availableHeight = height - 2 * margin;
  
  const cellWidth = availableWidth / cols;
  const cellHeight = availableHeight / rows;
  
  // Generate positions
  for (let i = 0; i < nodeCount; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    // Center the node within its cell
    const x = margin + col * cellWidth + cellWidth / 2;
    const y = margin + row * cellHeight + cellHeight / 2;
    
    positions.push({ x, y });
  }
  
  return positions;
}

/**
 * Apply consistent positions to graph nodes
 * @param {Array} graphNodes - Array of graph nodes
 * @param {Object} positionMap - Map of node IDs to positions
 * @param {string} nodeColor - Color for the nodes
 * @param {string} layoutType - Fallback layout type if position not found
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {Array} Array of positioned nodes
 */
export function applyConsistentPositions(graphNodes, positionMap, nodeColor, layoutType = 'force', width, height) {
  if (!graphNodes || !positionMap) return graphNodes;
  
  return graphNodes.map(node => {
    // Extract the base sequence from the node - remove suffix to get the original sequence
    let baseSequence = null;
    
    if (node.data?.label) {
      baseSequence = node.data.label;
    } else if (node.id) {
      // Remove suffix (o, a1, a2, a3) to get base sequence
      baseSequence = node.id.replace(/[oa]\d*$/, '');
    } else if (node.label) {
      baseSequence = node.label;
    }
    
    const position = positionMap[baseSequence];
    
    if (position && baseSequence) {
      return {
        ...node,
        type: "graphNode",
        style: {
          background: nodeColor,
          borderRadius: "50%",
          ...node.style, // Preserve original node styling
        },
        position: {
          x: Math.round(position.x), // Round to avoid sub-pixel positioning issues
          y: Math.round(position.y)
        }
      };
    } else {
      // Log missing nodes for debugging
      console.warn(`Base sequence "${baseSequence}" not found in position map. Available keys:`, Object.keys(positionMap));
      
      // Fallback to original position or generate a random one
      return {
        ...node,
        type: "graphNode",
        style: {
          background: nodeColor,
          borderRadius: "50%",
          ...node.style, // Preserve original node styling
        },
        position: node.position || {
          x: Math.random() * width,
          y: Math.random() * height
        }
      };
    }
  });
}

/**
 * Main function to create consistent layout for overlay graphs
 * @param {Object} options - Configuration options
 * @param {Array} options.allGraphNodes - Array of all graph node arrays
 * @param {number} options.width - Canvas width
 * @param {number} options.height - Canvas height
 * @returns {Object} Position map for consistent positioning
 */
export function createConsistentLayout({ allGraphNodes, width, height }) {
  return generateDynamicPositions(allGraphNodes, width, height);
}
