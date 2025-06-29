import { API_ENDPOINTS } from "../../../config/api";

export class ShortestPathService {
  static async fetchShortestPath(activeTab, numOfCodons, originalCodons, alphaOne, alphaTwo, alphaThree, source, target) {
    // Validate input parameters
    if (!numOfCodons || numOfCodons < 2) {
      throw new Error("Invalid number of codons");
    }

    if (!source || !target) {
      throw new Error("Both source and target nodes must be specified");
    }

    if (source === target) {
      throw new Error("Source and target nodes cannot be the same");
    }

    const c3TabIndex = this.getC3TabIndex(numOfCodons);
    
    // Use the appropriate graph data based on the active tab
    const calculationGraph = activeTab === c3TabIndex ? originalCodons : 
                           activeTab === 0 ? originalCodons : 
                           activeTab === 1 ? alphaOne : 
                           activeTab === 2 ? alphaTwo : alphaThree;
                           
    // Check if graph data is properly loaded
    if (!calculationGraph || typeof calculationGraph !== 'object') {
      throw new Error("Graph data not loaded. Please wait for the graph to load completely.");
    }

    // Check if the graph has the expected structure
    if (!calculationGraph.edges || !calculationGraph.nodes) {
      throw new Error("Graph data is incomplete. Missing nodes or edges data. Please ensure the graph has been properly loaded.");
    }

    // Check if edges is an array and has content
    if (!Array.isArray(calculationGraph.edges)) {
      throw new Error("Graph edges data is not in the expected format (should be an array).");
    }

    if (calculationGraph.edges.length === 0) {
      throw new Error("No edges found in the graph data. The graph appears to be empty.");
    }

    // Check if nodes is an array
    if (!Array.isArray(calculationGraph.nodes)) {
      throw new Error("Graph nodes data is not in the expected format (should be an array).");
    }

    if (calculationGraph.nodes.length === 0) {
      throw new Error("No nodes found in the graph data. The graph appears to be empty.");
    }

    // Validate that source and target nodes exist in the graph
    if (!calculationGraph.nodes.includes(source)) {
      throw new Error(`Source node "${source}" does not exist in the graph`);
    }

    if (!calculationGraph.nodes.includes(target)) {
      throw new Error(`Target node "${target}" does not exist in the graph`);
    }

    // Convert edges to the format expected by the backend
    const edgesData = calculationGraph.edges.map(edge => {
      // Handle different edge formats
      if (!edge) {
        console.warn("Invalid edge found:", edge);
        return null;
      }
      
      // If edge is an array [source, target]
      if (Array.isArray(edge) && edge.length === 2) {
        return {
          source: edge[0],
          target: edge[1]
        };
      }
      
      // If edge is an object with source and target properties
      if (edge.source !== undefined && edge.target !== undefined) {
        return {
          source: edge.source,
          target: edge.target
        };
      }
      
      // If edge has other properties like data.source, data.target (Cytoscape format)
      if (edge.data && edge.data.source !== undefined && edge.data.target !== undefined) {
        return {
          source: edge.data.source,
          target: edge.data.target
        };
      }
      
      console.warn("Invalid edge format found:", edge);
      return null;
    }).filter(edge => edge !== null);

    if (edgesData.length === 0) {
      throw new Error("No valid edges found in the graph data");
    }

    const requestData = {
      edges: edgesData,
      nodes: calculationGraph.nodes,
      source: source,
      target: target,
      numOfCodons: numOfCodons
    };

    console.log("Sending shortest path request:", requestData);

    const response = await fetch(API_ENDPOINTS.GRAPHS.SHORTEST_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch shortest path: ${response.status} ${errorText}`);
    }

    const shortestPath = await response.json();
    console.log("Received shortest path:", shortestPath);

    if (!Array.isArray(shortestPath)) {
      throw new Error("Invalid response format, expected array");
    }

    if (shortestPath.length === 0) {
      throw new Error(`No path found between "${source}" and "${target}"`);
    }

    return shortestPath;
  }

  static convertPathForTab(shortestPath, activeTab, numOfCodons, isSeparated, isOverlaid) {
    const c3TabIndex = this.getC3TabIndex(numOfCodons);

    if (activeTab === c3TabIndex) {
      // For C3 tab, handle different views
      if (isSeparated) {
        // For separated view, create selections for available graphs
        let allSelections = [];
        
        allSelections.push(...shortestPath.map(node => `${node}o_sep`));
        allSelections.push(...shortestPath.map(node => `${node}a1_sep`));
        if (numOfCodons >= 3) allSelections.push(...shortestPath.map(node => `${node}a2_sep`));
        if (numOfCodons === 4) allSelections.push(...shortestPath.map(node => `${node}a3_sep`));
        
        return allSelections;
      } else if (isOverlaid) {
        // For overlay view, create selections for available overlay graphs
        let allSelections = [];
        
        allSelections.push(...shortestPath.map(node => `${node}o_overlay`));
        allSelections.push(...shortestPath.map(node => `${node}a1_overlay`));
        if (numOfCodons >= 3) allSelections.push(...shortestPath.map(node => `${node}a2_overlay`));
        if (numOfCodons === 4) allSelections.push(...shortestPath.map(node => `${node}a3_overlay`));
        
        return allSelections;
      } else {
        // For merged view, convert to merged node IDs
        return shortestPath.map(node => `${node}_merged`);
      }
    } else {
      // For other tabs, handle as before
      const suffix = activeTab === 0 ? "o" : 
                    activeTab === 1 ? "a1" : 
                    activeTab === 2 ? "a2" : "a3";
      return shortestPath.map((node) => `${node}${suffix}`);
    }
  }

  static getC3TabIndex(numOfCodons) {
    if (numOfCodons === 2) return 2;
    if (numOfCodons === 3) return 3;
    if (numOfCodons === 4) return 4;
    return 3; // fallback
  }
}
