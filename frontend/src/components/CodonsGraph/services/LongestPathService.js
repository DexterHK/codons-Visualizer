import { API_ENDPOINTS } from "../../../config/api";

export class LongestPathService {
  static async fetchLongestPath(activeTab, numOfCodons, originalCodons, alphaOne, alphaTwo, alphaThree) {
    const c3TabIndex = this.getC3TabIndex(numOfCodons);
    
    // Calculate longest path using original codons for all tabs
    const calculationGraph = activeTab === c3TabIndex ? originalCodons : 
                           activeTab === 0 ? originalCodons : 
                           activeTab === 1 ? alphaOne : 
                           activeTab === 2 ? alphaTwo : alphaThree;
                           
    if (!calculationGraph || !calculationGraph.edges || !calculationGraph.nodes) {
      throw new Error("Invalid graph data");
    }

    const requestData = {
      codons: calculationGraph.edges,
      numOfCodons: calculationGraph.nodes.length,
    };

    const response = await fetch(API_ENDPOINTS.GRAPHS.LONGEST_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch longest path: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const longestPath = await response.json();

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
