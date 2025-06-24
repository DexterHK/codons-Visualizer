export class GraphUtils {
  static generateUniqueEdgeId(source, target, type, index) {
    return `${source}-${target}-${type}-${index}`;
  }

  static hasMinimumData(originalCodons, alphaOne) {
    return originalCodons && alphaOne && 
           originalCodons.nodes && originalCodons.edges && 
           alphaOne.nodes && alphaOne.edges;
  }

  static hasRequiredData(numOfCodons, originalCodons, alphaOne, alphaTwo, alphaThree) {
    const hasMinimum = this.hasMinimumData(originalCodons, alphaOne);
    
    if (numOfCodons === 2) return hasMinimum;
    if (numOfCodons === 3) return hasMinimum && alphaTwo && alphaTwo.nodes && alphaTwo.edges;
    if (numOfCodons === 4) return hasMinimum && alphaTwo && alphaTwo.nodes && alphaTwo.edges && 
                                  alphaThree && alphaThree.nodes && alphaThree.edges;
    return false;
  }

  static getC3TabIndex(numOfCodons) {
    if (numOfCodons === 2) return 2;
    if (numOfCodons === 3) return 3;
    if (numOfCodons === 4) return 4;
    return 3; // fallback
  }

  static createGraphNodes(nodes, suffix) {
    return nodes.map((node) => ({
      id: `${node}${suffix}`,
      data: {label: node},
    }));
  }

  static createGraphEdges(edges, suffix, generateUniqueEdgeId) {
    return edges.map((edge, index) => ({
      source: `${edge[0]}${suffix}`,
      target: `${edge[1]}${suffix}`,
      id: generateUniqueEdgeId(edge[0], edge[1], suffix, index),
      label: `${edge[0]}-${edge[1]}`,
    }));
  }
}
