import { API_ENDPOINTS } from "../../../config/api";

export class LongestPathService {
  static async fetchLongestPath(activeTab, numOfCodons, originalCodons, alphaOne, alphaTwo, alphaThree) {
    // Validate input parameters
    if (!numOfCodons || numOfCodons < 2) {
      throw new Error("Invalid number of codons");
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
      numOfCodons: numOfCodons
    };

    console.log("Sending longest path request:", requestData);

    const response = await fetch(API_ENDPOINTS.GRAPHS.LONGEST_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch longest path: ${response.status} ${errorText}`);
    }

    const longestPath = await response.json();
    console.log("Received longest path:", longestPath);

    if (!Array.isArray(longestPath)) {
      throw new Error("Invalid response format, expected array");
    }

    return longestPath;
  }

  static convertPathForTab(longestPath, activeTab, numOfCodons, isSeparated, isOverlaid) {
    const c3TabIndex = this.getC3TabIndex(numOfCodons);

    if (activeTab === c3TabIndex) {
      // For C3 tab, handle different views
      if (isSeparated) {
        // For separated view, create selections for available graphs
        let allSelections = [];
        
        allSelections.push(...longestPath.map(node => `${node}o_sep`));
        allSelections.push(...longestPath.map(node => `${node}a1_sep`));
        if (numOfCodons >= 3) allSelections.push(...longestPath.map(node => `${node}a2_sep`));
        if (numOfCodons === 4) allSelections.push(...longestPath.map(node => `${node}a3_sep`));
        
        return allSelections;
      } else if (isOverlaid) {
        // For overlay view, create selections for available overlay graphs
        let allSelections = [];
        
        allSelections.push(...longestPath.map(node => `${node}o_overlay`));
        allSelections.push(...longestPath.map(node => `${node}a1_overlay`));
        if (numOfCodons >= 3) allSelections.push(...longestPath.map(node => `${node}a2_overlay`));
        if (numOfCodons === 4) allSelections.push(...longestPath.map(node => `${node}a3_overlay`));
        
        return allSelections;
      } else {
        // For merged view, convert to merged node IDs
        return longestPath.map(node => `${node}_merged`);
      }
    } else {
      // For other tabs, handle as before
      const suffix = activeTab === 0 ? "o" : 
                    activeTab === 1 ? "a1" : 
                    activeTab === 2 ? "a2" : "a3";
      return longestPath.map((node) => `${node}${suffix}`);
    }
  }

  static getC3TabIndex(numOfCodons) {
    if (numOfCodons === 2) return 2;
    if (numOfCodons === 3) return 3;
    if (numOfCodons === 4) return 4;
    return 3; // fallback
  }
}
