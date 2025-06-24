import { saveAs } from "file-saver";

export class ExportService {
  static exportGraphToCSV(activeTab, numOfCodons, originalCodons, alphaOne, alphaTwo, alphaThree, mergedGraph) {
    let csvContent;
    const c3TabIndex = this.getC3TabIndex(numOfCodons);
    
    if (activeTab === c3TabIndex) {
      // For C3 tab, export the merged graph
      csvContent = [
        "Source,Target,Label",
        ...mergedGraph.edges.map((edge) => `${edge.source},${edge.target},"${edge.label}"`),
      ].join("\n");
    } else {
      // For other tabs, export as before
      const activeGraph =
        activeTab === 0 ? originalCodons :
        activeTab === 1 ? alphaOne :
        activeTab === 2 ? alphaTwo :
        activeTab === 3 ? alphaThree : null;

      if (!activeGraph) return;

      csvContent = [
        "Source,Target",
        ...activeGraph.edges.map((edge) => `${edge[0]},${edge[1]}`),
      ].join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `graph_tab_${activeTab}.csv`);
  }

  static getC3TabIndex(numOfCodons) {
    if (numOfCodons === 2) return 2;
    if (numOfCodons === 3) return 3;
    if (numOfCodons === 4) return 4;
    return 3; // fallback
  }
}
