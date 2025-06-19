/**
 * Graph sorting and organization utilities for better visual layout
 */

/**
 * Sort nodes by various criteria
 */
export const sortNodes = (nodes, sortType = 'alphabetical') => {
  const sortedNodes = [...nodes];
  
  switch (sortType) {
    case 'alphabetical':
      return sortedNodes.sort((a, b) => a.label.localeCompare(b.label));
    
    case 'degree':
      // Sort by node degree (requires edges to calculate)
      return sortedNodes.sort((a, b) => (b.degree || 0) - (a.degree || 0));
    
    case 'cluster':
      // Group nodes by their first character or prefix
      return sortedNodes.sort((a, b) => {
        const aPrefix = a.label.charAt(0);
        const bPrefix = b.label.charAt(0);
        if (aPrefix !== bPrefix) {
          return aPrefix.localeCompare(bPrefix);
        }
        return a.label.localeCompare(b.label);
      });
    
    case 'length':
      // Sort by label length, then alphabetically
      return sortedNodes.sort((a, b) => {
        if (a.label.length !== b.label.length) {
          return a.label.length - b.label.length;
        }
        return a.label.localeCompare(b.label);
      });
    
    default:
      return sortedNodes;
  }
};

/**
 * Sort edges by various criteria
 */
export const sortEdges = (edges, sortType = 'source-target') => {
  if (!edges || edges.length === 0) return edges;
  
  const sortedEdges = [...edges];
  
  // Helper function to get source and target from edge (handles different formats)
  const getEdgeProps = (edge) => {
    // Handle object format with source/target properties
    if (edge.source && edge.target) {
      return { source: edge.source, target: edge.target };
    }
    // Handle array format [source, target]
    if (Array.isArray(edge) && edge.length >= 2) {
      return { source: edge[0], target: edge[1] };
    }
    // Handle object with from/to properties
    if (edge.from && edge.to) {
      return { source: edge.from, target: edge.to };
    }
    // Fallback
    return { source: edge.source || edge[0] || '', target: edge.target || edge[1] || '' };
  };
  
  switch (sortType) {
    case 'source-target':
      return sortedEdges.sort((a, b) => {
        const aProps = getEdgeProps(a);
        const bProps = getEdgeProps(b);
        if (aProps.source !== bProps.source) {
          return String(aProps.source).localeCompare(String(bProps.source));
        }
        return String(aProps.target).localeCompare(String(bProps.target));
      });
    
    case 'target-source':
      return sortedEdges.sort((a, b) => {
        const aProps = getEdgeProps(a);
        const bProps = getEdgeProps(b);
        if (aProps.target !== bProps.target) {
          return String(aProps.target).localeCompare(String(bProps.target));
        }
        return String(aProps.source).localeCompare(String(bProps.source));
      });
    
    case 'weight':
      // Sort by edge weight if available
      return sortedEdges.sort((a, b) => (b.weight || b.strokeWidth || 1) - (a.weight || a.strokeWidth || 1));
    
    case 'alphabetical':
      // Sort by combined source-target string
      return sortedEdges.sort((a, b) => {
        const aProps = getEdgeProps(a);
        const bProps = getEdgeProps(b);
        const aStr = `${aProps.source}-${aProps.target}`;
        const bStr = `${bProps.source}-${bProps.target}`;
        return aStr.localeCompare(bStr);
      });
    
    case 'random':
      // Shuffle edges randomly
      for (let i = sortedEdges.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sortedEdges[i], sortedEdges[j]] = [sortedEdges[j], sortedEdges[i]];
      }
      return sortedEdges;
    
    case 'reverse':
      // Reverse the current order
      return sortedEdges.reverse();
    
    default:
      return sortedEdges;
  }
};

/**
 * Calculate node degrees for degree-based sorting
 */
export const calculateNodeDegrees = (nodes, edges) => {
  const degreeMap = new Map();
  
  // Initialize all nodes with degree 0
  nodes.forEach(node => {
    degreeMap.set(node.id, 0);
  });
  
  // Count connections for each node
  edges.forEach(edge => {
    const sourceId = edge.source;
    const targetId = edge.target;
    
    degreeMap.set(sourceId, (degreeMap.get(sourceId) || 0) + 1);
    degreeMap.set(targetId, (degreeMap.get(targetId) || 0) + 1);
  });
  
  // Add degree information to nodes
  return nodes.map(node => ({
    ...node,
    degree: degreeMap.get(node.id) || 0
  }));
};

/**
 * Group nodes by connectivity patterns
 */
export const groupNodesByConnectivity = (nodes, edges) => {
  const adjacencyMap = new Map();
  
  // Build adjacency list
  nodes.forEach(node => {
    adjacencyMap.set(node.id, new Set());
  });
  
  edges.forEach(edge => {
    adjacencyMap.get(edge.source)?.add(edge.target);
    adjacencyMap.get(edge.target)?.add(edge.source);
  });
  
  // Group nodes by their connection patterns
  const groups = new Map();
  
  nodes.forEach(node => {
    const connections = Array.from(adjacencyMap.get(node.id) || []).sort();
    const pattern = connections.join(',');
    
    if (!groups.has(pattern)) {
      groups.set(pattern, []);
    }
    groups.get(pattern).push(node);
  });
  
  return Array.from(groups.values());
};

/**
 * Apply hierarchical positioning based on node importance
 */
export const applyHierarchicalLayout = (nodes, edges) => {
  const nodesWithDegree = calculateNodeDegrees(nodes, edges);
  
  // Sort nodes by degree (most connected first)
  const sortedByDegree = [...nodesWithDegree].sort((a, b) => b.degree - a.degree);
  
  // Assign hierarchical levels
  const levels = [];
  const maxLevel = Math.min(5, Math.ceil(sortedByDegree.length / 3)); // Max 5 levels
  
  for (let i = 0; i < maxLevel; i++) {
    levels[i] = [];
  }
  
  sortedByDegree.forEach((node, index) => {
    const level = Math.floor(index / Math.ceil(sortedByDegree.length / maxLevel));
    const clampedLevel = Math.min(level, maxLevel - 1);
    levels[clampedLevel].push(node);
  });
  
  return levels;
};

/**
 * Optimize layout parameters based on graph characteristics
 */
export const getOptimalLayoutConfig = (nodes, edges, layoutType) => {
  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  const density = edgeCount / (nodeCount * (nodeCount - 1) / 2);
  
  const baseConfig = {
    linkDistance: 100,
    linkStrength: 1,
    charge: -300,
    gravity: 0.1,
    theta: 0.8,
    alpha: 0.1
  };
  
  // Adjust parameters based on graph size and density
  if (nodeCount > 50) {
    baseConfig.linkDistance = 150;
    baseConfig.charge = -500;
  } else if (nodeCount < 10) {
    baseConfig.linkDistance = 200;
    baseConfig.charge = -200;
  }
  
  if (density > 0.5) {
    // Dense graph - spread nodes more
    baseConfig.linkDistance *= 1.5;
    baseConfig.charge *= 1.2;
  } else if (density < 0.1) {
    // Sparse graph - bring nodes closer
    baseConfig.linkDistance *= 0.8;
    baseConfig.charge *= 0.8;
  }
  
  // Layout-specific adjustments
  switch (layoutType) {
    case 'forceDirected2d':
      return {
        ...baseConfig,
        iterations: Math.min(300, nodeCount * 10)
      };
    
    case 'circular2d':
      return {
        ...baseConfig,
        radius: Math.max(100, nodeCount * 8)
      };
    
    case 'hierarchicalTd':
      return {
        ...baseConfig,
        levelSeparation: 150,
        nodeSpacing: 100,
        treeSpacing: 200
      };
    
    default:
      return baseConfig;
  }
};

/**
 * Apply smart edge bundling for better visual organization
 */
export const bundleEdges = (edges, bundlingStrength = 0.8) => {
  // Group edges by similar paths
  const edgeGroups = new Map();
  
  edges.forEach(edge => {
    const key = [edge.source, edge.target].sort().join('-');
    if (!edgeGroups.has(key)) {
      edgeGroups.set(key, []);
    }
    edgeGroups.get(key).push(edge);
  });
  
  // Apply bundling to grouped edges
  return edges.map(edge => ({
    ...edge,
    bundling: bundlingStrength,
    curvature: edgeGroups.get([edge.source, edge.target].sort().join('-')).length > 1 ? 0.3 : 0
  }));
};
