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
    
    case 'centrality':
      // Sort by centrality (betweenness centrality approximation)
      return sortedNodes.sort((a, b) => (b.centrality || b.degree || 0) - (a.centrality || a.degree || 0));
    
    case 'random':
      // Random shuffle
      for (let i = sortedNodes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sortedNodes[i], sortedNodes[j]] = [sortedNodes[j], sortedNodes[i]];
      }
      return sortedNodes;
    
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

/**
 * Layout Algorithms
 */

/**
 * Apply circular layout
 */
export const applyCircularLayout = (nodes, options = {}) => {
  const { radius = 200, centerX = 0, centerY = 0 } = options;
  const angleStep = (2 * Math.PI) / nodes.length;
  
  return nodes.map((node, index) => ({
    ...node,
    position: {
      x: centerX + radius * Math.cos(index * angleStep),
      y: centerY + radius * Math.sin(index * angleStep)
    }
  }));
};

/**
 * Apply grid layout
 */
export const applyGridLayout = (nodes, options = {}) => {
  const { spacing = 150, columns = Math.ceil(Math.sqrt(nodes.length)) } = options;
  
  return nodes.map((node, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    
    return {
      ...node,
      position: {
        x: col * spacing,
        y: row * spacing
      }
    };
  });
};

/**
 * Apply force-directed layout using D3-Force
 */
export const applyForceLayout = async (nodes, edges, options = {}) => {
  const { 
    linkDistance = 100, 
    linkStrength = 1, 
    charge = -300,
    centerX = 0,
    centerY = 0,
    iterations = 300
  } = options;

  // Import d3-force dynamically
  try {
    const d3 = await import('d3-force');
    
    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(linkDistance).strength(linkStrength))
      .force('charge', d3.forceManyBody().strength(charge))
      .force('center', d3.forceCenter(centerX, centerY))
      .stop();

    // Run simulation
    for (let i = 0; i < iterations; i++) {
      simulation.tick();
    }

    return nodes.map(node => ({
      ...node,
      position: { x: node.x, y: node.y }
    }));
  } catch (error) {
    console.warn('D3-Force not available, falling back to simple layout');
    return applyGridLayout(nodes, options);
  }
};

/**
 * Apply Dagre hierarchical layout
 */
export const applyDagreLayout = async (nodes, edges, options = {}) => {
  const { direction = 'TB', nodeSpacing = 50, rankSpacing = 100 } = options;
  
  try {
    const dagre = await import('@dagrejs/dagre');
    
    const g = new dagre.graphlib.Graph();
    g.setGraph({ 
      rankdir: direction,
      nodesep: nodeSpacing,
      ranksep: rankSpacing
    });
    g.setDefaultEdgeLabel(() => ({}));

    // Add nodes
    nodes.forEach(node => {
      g.setNode(node.id, {
        width: node.measured?.width || 100,
        height: node.measured?.height || 50
      });
    });

    // Add edges
    edges.forEach(edge => {
      g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    return nodes.map(node => {
      const nodeWithPosition = g.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - (node.measured?.width || 100) / 2,
          y: nodeWithPosition.y - (node.measured?.height || 50) / 2
        }
      };
    });
  } catch (error) {
    console.warn('Dagre not available, falling back to grid layout');
    return applyGridLayout(nodes, options);
  }
};

/**
 * Apply D3 tree layout
 */
export const applyD3TreeLayout = async (nodes, edges, options = {}) => {
  const { nodeSize = [100, 100], separation = 1 } = options;
  
  try {
    const d3 = await import('d3-hierarchy');
    
    // Find root node (node with no incoming edges)
    const incomingEdges = new Set(edges.map(e => e.target));
    const rootNode = nodes.find(n => !incomingEdges.has(n.id)) || nodes[0];
    
    // Build hierarchy
    const stratify = d3.stratify()
      .id(d => d.id)
      .parentId(d => {
        const parentEdge = edges.find(e => e.target === d.id);
        return parentEdge ? parentEdge.source : null;
      });

    const root = stratify(nodes);
    const treeLayout = d3.tree().nodeSize(nodeSize).separation(() => separation);
    
    treeLayout(root);

    return nodes.map(node => {
      const treeNode = root.descendants().find(d => d.id === node.id);
      return {
        ...node,
        position: {
          x: treeNode ? treeNode.x : 0,
          y: treeNode ? treeNode.y : 0
        }
      };
    });
  } catch (error) {
    console.warn('D3-Hierarchy not available, falling back to grid layout');
    return applyGridLayout(nodes, options);
  }
};

/**
 * Apply ELK layout
 */
export const applyELKLayout = async (nodes, edges, options = {}) => {
  const { 
    algorithm = 'layered',
    direction = 'DOWN',
    spacing = 80,
    layerSpacing = 100
  } = options;
  
  try {
    const ELK = await import('elkjs/lib/elk.bundled.js');
    const elk = new ELK.default();
    
    const graph = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': algorithm,
        'elk.direction': direction,
        'elk.spacing.nodeNode': spacing,
        'elk.layered.spacing.nodeNodeBetweenLayers': layerSpacing
      },
      children: nodes.map(node => ({
        id: node.id,
        width: node.measured?.width || 100,
        height: node.measured?.height || 50
      })),
      edges: edges.map(edge => ({
        id: `${edge.source}-${edge.target}`,
        sources: [edge.source],
        targets: [edge.target]
      }))
    };

    const layoutedGraph = await elk.layout(graph);
    
    return nodes.map(node => {
      const layoutedNode = layoutedGraph.children.find(n => n.id === node.id);
      return {
        ...node,
        position: {
          x: layoutedNode ? layoutedNode.x : 0,
          y: layoutedNode ? layoutedNode.y : 0
        }
      };
    });
  } catch (error) {
    console.warn('ELK not available, falling back to grid layout');
    return applyGridLayout(nodes, options);
  }
};

/**
 * Apply column layout
 */
export const applyColumnLayout = (nodes, edges, options = {}) => {
  const { columnWidth = 200, nodeSpacing = 100 } = options;
  
  // Group nodes by their connections to create columns
  const nodesWithDegree = calculateNodeDegrees(nodes, edges);
  const sortedNodes = nodesWithDegree.sort((a, b) => b.degree - a.degree);
  
  const columns = [];
  const maxNodesPerColumn = Math.ceil(Math.sqrt(nodes.length));
  
  for (let i = 0; i < sortedNodes.length; i += maxNodesPerColumn) {
    columns.push(sortedNodes.slice(i, i + maxNodesPerColumn));
  }
  
  return nodes.map(node => {
    let columnIndex = 0;
    let nodeIndex = 0;
    
    // Find which column and position this node is in
    for (let i = 0; i < columns.length; i++) {
      const nodeIndexInColumn = columns[i].findIndex(n => n.id === node.id);
      if (nodeIndexInColumn !== -1) {
        columnIndex = i;
        nodeIndex = nodeIndexInColumn;
        break;
      }
    }
    
    return {
      ...node,
      position: {
        x: columnIndex * columnWidth,
        y: nodeIndex * nodeSpacing
      }
    };
  });
};

/**
 * Master layout function that applies the specified layout
 */
export const applyLayout = async (nodes, edges, layoutType, options = {}) => {
  const nodesWithDegree = calculateNodeDegrees(nodes, edges);
  
  switch (layoutType) {
    case 'circular':
      return applyCircularLayout(nodesWithDegree, options);
    
    case 'grid':
      return applyGridLayout(nodesWithDegree, options);
    
    case 'force':
      return await applyForceLayout(nodesWithDegree, edges, options);
    
    case 'columns':
      return applyColumnLayout(nodesWithDegree, edges, options);
    
    case 'dagre-tb':
      return await applyDagreLayout(nodesWithDegree, edges, { ...options, direction: 'TB' });
    
    case 'dagre-lr':
      return await applyDagreLayout(nodesWithDegree, edges, { ...options, direction: 'LR' });
    
    case 'dagre-bt':
      return await applyDagreLayout(nodesWithDegree, edges, { ...options, direction: 'BT' });
    
    case 'dagre-rl':
      return await applyDagreLayout(nodesWithDegree, edges, { ...options, direction: 'RL' });
    
    case 'd3-tree':
      return await applyD3TreeLayout(nodesWithDegree, edges, options);
    
    case 'd3-cluster':
      return await applyD3TreeLayout(nodesWithDegree, edges, { ...options, cluster: true });
    
    case 'elk-layered':
      return await applyELKLayout(nodesWithDegree, edges, { ...options, algorithm: 'layered' });
    
    case 'elk-force':
      return await applyELKLayout(nodesWithDegree, edges, { ...options, algorithm: 'org.eclipse.elk.force' });
    
    case 'elk-radial':
      return await applyELKLayout(nodesWithDegree, edges, { ...options, algorithm: 'org.eclipse.elk.radial' });
    
    case 'elk-stress':
      return await applyELKLayout(nodesWithDegree, edges, { ...options, algorithm: 'org.eclipse.elk.stress' });
    
    case 'auto-fit':
      // Auto-fit: choose best layout based on graph characteristics
      const nodeCount = nodes.length;
      const edgeCount = edges.length;
      const density = edgeCount / (nodeCount * (nodeCount - 1) / 2);
      
      if (nodeCount < 10) {
        return applyCircularLayout(nodesWithDegree, options);
      } else if (density > 0.3) {
        return await applyForceLayout(nodesWithDegree, edges, options);
      } else {
        return await applyDagreLayout(nodesWithDegree, edges, options);
      }
    
    case 'center':
      // Center the existing layout
      const bounds = getNodesBounds(nodesWithDegree);
      const centerX = -(bounds.x + bounds.width / 2);
      const centerY = -(bounds.y + bounds.height / 2);
      
      return nodesWithDegree.map(node => ({
        ...node,
        position: {
          x: node.position.x + centerX,
          y: node.position.y + centerY
        }
      }));
    
    case 'reset':
      // Reset to default positions
      return applyGridLayout(nodesWithDegree, options);
    
    default:
      return nodesWithDegree;
  }
};

/**
 * Get bounds of all nodes
 */
export const getNodesBounds = (nodes) => {
  if (nodes.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  
  const positions = nodes.map(n => n.position || { x: 0, y: 0 });
  const xs = positions.map(p => p.x);
  const ys = positions.map(p => p.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
};

/**
 * Calculate centrality measures for nodes
 */
export const calculateCentrality = (nodes, edges) => {
  const adjacencyList = new Map();
  
  // Build adjacency list
  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
  });
  
  edges.forEach(edge => {
    adjacencyList.get(edge.source)?.push(edge.target);
    adjacencyList.get(edge.target)?.push(edge.source);
  });
  
  // Calculate betweenness centrality (simplified)
  return nodes.map(node => {
    const neighbors = adjacencyList.get(node.id) || [];
    const degree = neighbors.length;
    
    // Simple centrality measure based on degree and neighbor connectivity
    let centrality = degree;
    neighbors.forEach(neighborId => {
      const neighborDegree = adjacencyList.get(neighborId)?.length || 0;
      centrality += neighborDegree * 0.1; // Weight neighbor connectivity
    });
    
    return {
      ...node,
      centrality,
      degree
    };
  });
};
