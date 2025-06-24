export class GraphMergeService {
  constructor(numOfCodons) {
    this.numOfCodons = numOfCodons;
  }

  mergeGraphs(originalCodons, alphaOne, alphaTwo, alphaThree) {
    const availableGraphs = this.getAvailableGraphs(originalCodons, alphaOne, alphaTwo, alphaThree);
    if (availableGraphs.length === 0 || !availableGraphs.every(graph => graph && graph.nodes && graph.edges)) {
      return { nodes: [], edges: [] };
    }

    const nodeMap = new Map();
    const edgeMap = new Map();

    // Process nodes from available graphs
    this.processNodes(originalCodons.nodes, 'O', nodeMap);
    this.processNodes(alphaOne.nodes, '1', nodeMap);
    if (this.numOfCodons >= 3) this.processNodes(alphaTwo.nodes, '2', nodeMap);
    if (this.numOfCodons === 4) this.processNodes(alphaThree.nodes, '3', nodeMap);

    // Process edges from available graphs
    this.processEdges(originalCodons.edges, 'O', edgeMap);
    this.processEdges(alphaOne.edges, '1', edgeMap);
    if (this.numOfCodons >= 3) this.processEdges(alphaTwo.edges, '2', edgeMap);
    if (this.numOfCodons === 4) this.processEdges(alphaThree.edges, '3', edgeMap);

    // Create merged nodes with appropriate labels and colors
    const mergedNodes = Array.from(nodeMap.entries()).map(([node, graphs]) => {
      const graphsArray = Array.from(graphs).sort();
      let label = graphsArray.join('');
      let color = this.getNodeColor(graphsArray, this.numOfCodons);

      return {
        id: `${node}_merged`,
        label: `${node} (${label})`,
        fill: color,
      };
    });

    // Create merged edges with appropriate labels
    const mergedEdges = Array.from(edgeMap.entries()).map(([edgeKey, edgeData], index) => {
      const graphsArray = Array.from(edgeData.graphs).sort();
      let graphLabel = graphsArray.join('');
      let color = this.getEdgeColor(graphsArray, this.numOfCodons);
      
      return {
        source: `${edgeData.source}_merged`,
        target: `${edgeData.target}_merged`,
        id: `${edgeKey}_merged_${index}`,
        label: graphLabel,
        stroke: color,
        strokeWidth: graphsArray.length === this.numOfCodons ? 3 : graphsArray.length >= 2 ? 2 : 1,
      };
    });

    return { nodes: mergedNodes, edges: mergedEdges };
  }

  getAvailableGraphs(originalCodons, alphaOne, alphaTwo, alphaThree) {
    const graphs = [originalCodons, alphaOne];
    if (this.numOfCodons >= 3) graphs.push(alphaTwo);
    if (this.numOfCodons === 4) graphs.push(alphaThree);
    return graphs;
  }

  processNodes(nodes, graphType, nodeMap) {
    nodes.forEach(node => {
      if (!nodeMap.has(node)) {
        nodeMap.set(node, new Set());
      }
      nodeMap.get(node).add(graphType);
    });
  }

  processEdges(edges, graphType, edgeMap) {
    edges.forEach(edge => {
      const edgeKey = `${edge[0]}-${edge[1]}`;
      const reverseKey = `${edge[1]}-${edge[0]}`;
      
      // Check if edge exists in either direction
      let existingKey = edgeKey;
      if (edgeMap.has(reverseKey)) {
        existingKey = reverseKey;
      }
      
      if (!edgeMap.has(existingKey)) {
        edgeMap.set(existingKey, { 
          source: edge[0], 
          target: edge[1], 
          graphs: new Set() 
        });
      }
      edgeMap.get(existingKey).graphs.add(graphType);
    });
  }

  getNodeColor(graphsArray, totalGraphs) {
    if (graphsArray.length === totalGraphs) {
      return '#9d4edd'; // purple for all graphs
    } else if (graphsArray.length === 2) {
      if (graphsArray.includes('O') && graphsArray.includes('1')) {
        return '#7dcfb6'; // teal for O+1
      } else if (graphsArray.includes('O') && graphsArray.includes('2')) {
        return '#f9844a'; // orange for O+2
      } else if (graphsArray.includes('O') && graphsArray.includes('3')) {
        return '#ff6b9d'; // pink for O+3
      } else if (graphsArray.includes('1') && graphsArray.includes('2')) {
        return '#ee6c4d'; // red for 1+2
      } else if (graphsArray.includes('1') && graphsArray.includes('3')) {
        return '#ffd23f'; // yellow for 1+3
      } else if (graphsArray.includes('2') && graphsArray.includes('3')) {
        return '#06ffa5'; // mint for 2+3
      }
    } else {
      if (graphsArray[0] === 'O') {
        return '#90C67C'; // green for original only
      } else if (graphsArray[0] === '1') {
        return '#60B5FF'; // blue for alpha one only
      } else if (graphsArray[0] === '2') {
        return '#E78B48'; // orange for alpha two only
      } else if (graphsArray[0] === '3') {
        return '#ff69b4'; // hot pink for alpha three only
      }
    }
    return '#ffffff'; // default white
  }

  getEdgeColor(graphsArray, totalGraphs) {
    if (graphsArray.length === totalGraphs) {
      return '#ff6b9d'; // bright pink for all graphs
    } else if (graphsArray.length === 2) {
      if (graphsArray.includes('O') && graphsArray.includes('1')) {
        return '#4ecdc4'; // turquoise for O+1
      } else if (graphsArray.includes('O') && graphsArray.includes('2')) {
        return '#ffa726'; // amber for O+2
      } else if (graphsArray.includes('O') && graphsArray.includes('3')) {
        return '#ab47bc'; // purple for O+3
      } else if (graphsArray.includes('1') && graphsArray.includes('2')) {
        return '#ef5350'; // red for 1+2
      } else if (graphsArray.includes('1') && graphsArray.includes('3')) {
        return '#ffee58'; // yellow for 1+3
      } else if (graphsArray.includes('2') && graphsArray.includes('3')) {
        return '#26a69a'; // teal for 2+3
      }
    } else {
      if (graphsArray[0] === 'O') {
        return '#66bb6a'; // green for original only
      } else if (graphsArray[0] === '1') {
        return '#42a5f5'; // blue for alpha one only
      } else if (graphsArray[0] === '2') {
        return '#ff7043'; // orange for alpha two only
      } else if (graphsArray[0] === '3') {
        return '#ec407a'; // pink for alpha three only
      }
    }
    return '#666666'; // default gray
  }
}
