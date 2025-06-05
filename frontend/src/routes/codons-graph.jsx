import React from "react";
import { useStore } from "../store";
import Graph from "../components/graph";
import OverlayGraphs from "../components/OverlayGraphs";
import "../css/codons-graph.css";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import GraphProperties from "../components/GraphProperties";
import GraphsTabs from "../components/GraphsTabs";
import LayoutButtons from "../components/LayoutButtons";
import ThemeToggle from "../components/icons/theme-toggle";
import { saveAs } from "file-saver"; // Add this import for file saving

export default function CodonsGraph() {
  const originalCodons = useStore((state) => state.originalCodons);
  const alphaOne = useStore((state) => state.alphaOne);
  const alphaTwo = useStore((state) => state.alphaTwo);
  const alphaThree = useStore((state) => state.alphaThree);
  const eigenschaften = useStore((state) => state.eigenschaften);
  const eigenschaftenAlphaOne = useStore(
    (state) => state.eigenschaftenAlphaOne,
  );
  const eigenschaftenAlphaTwo = useStore(
    (state) => state.eigenschaftenAlphaTwo,
  );
  const eigenschaftenAlphaThree = useStore(
    (state) => state.eigenschaftenAlphaThree,
  );
  const c3 = useStore((state) => state.c3);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const [showProperties, setShowProperites] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const numOfCodons = useStore((state) => state.numOfCodons);
  const [layout, setLayout] = useState("circular2d");

  const [graphVisibility, setGraphVisibility] = useState({
    original: 1,
    alphaOne: 1,
    alphaTwo: 1,
    alphaThree: 1,
  });

  const [overlay, setOverlay] = useState(true); // New state variable
  const [selections, setSelections] = useState([]); // Add a state for selections
  const [isSeparated, setIsSeparated] = useState(false);
  const [isOverlaid, setIsOverlaid] = useState(false); // New state for overlay mode

  // Apply theme to body element
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleVisibilityChange = (graph, value) => {
    setGraphVisibility((prev) => ({
      ...prev,
      [graph]: value,
    }));
  };

  // Get the C3 tab index based on numOfCodons
  const getC3TabIndex = () => {
    if (numOfCodons === 2) return 2;
    if (numOfCodons === 3) return 3;
    if (numOfCodons === 4) return 4;
    return 3; // fallback
  };

  // Get available graphs based on numOfCodons
  const getAvailableGraphs = () => {
    const graphs = [originalCodons, alphaOne];
    if (numOfCodons >= 3) graphs.push(alphaTwo);
    if (numOfCodons === 4) graphs.push(alphaThree);
    return graphs;
  };

  const exportGraphToCSV = () => {
    let csvContent;
    const c3TabIndex = getC3TabIndex();
    
    if (activeTab === c3TabIndex) {
      // For C3 tab, export the merged graph
      const mergedGraph = mergeGraphs();
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
  };

  // Function to merge graphs into one with proper labeling
  const mergeGraphs = () => {
    const availableGraphs = getAvailableGraphs();
    if (availableGraphs.length === 0 || !availableGraphs.every(graph => graph && graph.nodes && graph.edges)) {
      return { nodes: [], edges: [] };
    }

    const nodeMap = new Map();
    const edgeMap = new Map();

    // Process nodes from available graphs
    const processNodes = (nodes, graphType) => {
      nodes.forEach(node => {
        if (!nodeMap.has(node)) {
          nodeMap.set(node, new Set());
        }
        nodeMap.get(node).add(graphType);
      });
    };

    processNodes(originalCodons.nodes, 'O');
    processNodes(alphaOne.nodes, '1');
    if (numOfCodons >= 3) processNodes(alphaTwo.nodes, '2');
    if (numOfCodons === 4) processNodes(alphaThree.nodes, '3');

    // Process edges from available graphs
    const processEdges = (edges, graphType) => {
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
    };

    processEdges(originalCodons.edges, 'O');
    processEdges(alphaOne.edges, '1');
    if (numOfCodons >= 3) processEdges(alphaTwo.edges, '2');
    if (numOfCodons === 4) processEdges(alphaThree.edges, '3');

    // Create merged nodes with appropriate labels and colors
    const mergedNodes = Array.from(nodeMap.entries()).map(([node, graphs]) => {
      const graphsArray = Array.from(graphs).sort();
      let label = graphsArray.join('');
      
      // Determine color based on which graphs contain the node
      let color = getNodeColor(graphsArray, numOfCodons);

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
      
      // Determine color based on which graphs contain the edge
      let color = getEdgeColor(graphsArray, numOfCodons);
      
      return {
        source: `${edgeData.source}_merged`,
        target: `${edgeData.target}_merged`,
        id: `${edgeKey}_merged_${index}`,
        label: graphLabel,
        stroke: color,
        strokeWidth: graphsArray.length === numOfCodons ? 3 : graphsArray.length >= 2 ? 2 : 1,
      };
    });

    return { nodes: mergedNodes, edges: mergedEdges };
  };

  // Helper function to get node color based on graph combinations
  const getNodeColor = (graphsArray, totalGraphs) => {
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
  };

  // Helper function to get edge color
  const getEdgeColor = (graphsArray, totalGraphs) => {
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
  };

  const toggleLongestPath = async () => {
    // If there are already selections, clear them to toggle off
    if (selections.length > 0) {
      setSelections([]);
      return;
    }

    try {
      const c3TabIndex = getC3TabIndex();
      // Calculate longest path using original codons for all tabs
      const calculationGraph = activeTab === c3TabIndex ? originalCodons : 
                             activeTab === 0 ? originalCodons : 
                             activeTab === 1 ? alphaOne : 
                             activeTab === 2 ? alphaTwo : alphaThree;
                             
      if (!calculationGraph || !calculationGraph.edges || !calculationGraph.nodes) {
        console.error("Invalid graph data");
        return;
      }

      const requestData = {
        codons: calculationGraph.edges,
        numOfCodons: calculationGraph.nodes.length,
      };

      const response = await fetch("http://localhost:5000/longest-path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch longest path:", response.status, errorData);
        return;
      }

      const longestPath = await response.json();

      if (!Array.isArray(longestPath)) {
        console.error("Invalid response format, expected array");
        return;
      }

      if (activeTab === c3TabIndex) {
        // For C3 tab, handle different views
        if (isSeparated) {
          // For separated view, create selections for available graphs
          const availableGraphs = getAvailableGraphs();
          let allSelections = [];
          
          allSelections.push(...longestPath.map(node => `${node}o_sep`));
          allSelections.push(...longestPath.map(node => `${node}a1_sep`));
          if (numOfCodons >= 3) allSelections.push(...longestPath.map(node => `${node}a2_sep`));
          if (numOfCodons === 4) allSelections.push(...longestPath.map(node => `${node}a3_sep`));
          
          setSelections(allSelections);
        } else if (isOverlaid) {
          // For overlay view, create selections for available overlay graphs
          let allSelections = [];
          
          allSelections.push(...longestPath.map(node => `${node}o_overlay`));
          allSelections.push(...longestPath.map(node => `${node}a1_overlay`));
          if (numOfCodons >= 3) allSelections.push(...longestPath.map(node => `${node}a2_overlay`));
          if (numOfCodons === 4) allSelections.push(...longestPath.map(node => `${node}a3_overlay`));
          
          setSelections(allSelections);
        } else {
          // For merged view, convert to merged node IDs
          const convertedPath = longestPath.map(node => `${node}_merged`);
          setSelections(convertedPath);
        }
      } else {
        // For other tabs, handle as before
        const suffix = activeTab === 0 ? "o" : 
                      activeTab === 1 ? "a1" : 
                      activeTab === 2 ? "a2" : "a3";
        const convertedPath = longestPath.map((node) => `${node}${suffix}`);
        setSelections(convertedPath);
      }
    } catch (error) {
      console.error("Error fetching longest path:", error);
    }
  };

  // Helper function to generate unique edge IDs
  const generateUniqueEdgeId = (source, target, type, index) => {
    return `${source}-${target}-${type}-${index}`;
  };

  // Check if we have the minimum required data
  const hasMinimumData = originalCodons && alphaOne && 
                        originalCodons.nodes && originalCodons.edges && 
                        alphaOne.nodes && alphaOne.edges;

  // Check if we have required data for current numOfCodons
  const hasRequiredData = () => {
    if (numOfCodons === 2) return hasMinimumData;
    if (numOfCodons === 3) return hasMinimumData && alphaTwo && alphaTwo.nodes && alphaTwo.edges;
    if (numOfCodons === 4) return hasMinimumData && alphaTwo && alphaTwo.nodes && alphaTwo.edges && 
                                  alphaThree && alphaThree.nodes && alphaThree.edges;
    return false;
  };

  if (!hasRequiredData()) {
    return (
      <main>
        <p className="error-message">No Data Provided</p>
        <Link to="/" className="back-link">
          Go Back
        </Link>
      </main>
    );
  }

  const c3TabIndex = getC3TabIndex();

  return (
    <main className="graphs-wrapper">
      <div className="graphs-header">
        <div className="header-left-controls">
          <button className="export-button" onClick={exportGraphToCSV}>
            Export
          </button>
          <button className="theme-toggle-button" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            <ThemeToggle isDark={theme === 'dark'} />
          </button>
        </div>
        <GraphsTabs activeTab={activeTab} setActiveTab={setActiveTab} numOfCodons={numOfCodons} />
      </div>
      
      <div className="graphs-content">
        {activeTab === 0 && (
          <div className="original-codons">
            <Graph
              nodes={[
                ...originalCodons.nodes.map((node) => ({
                  id: `${node}o`,
                  label: node,
                  fill: "#90C67C",
                })),
              ]}
              edges={[
                ...originalCodons.edges.map((edge, index) => ({
                  source: `${edge[0]}o`,
                  target: `${edge[1]}o`,
                  id: generateUniqueEdgeId(edge[0], edge[1], 'o', index),
                  label: `${edge[0]}-${edge[1]}`,
                })),
              ]}
              layout={layout}
              selections={selections}
            />
          </div>
        )}
        
        {activeTab === 1 && (
          <div className="alpha-one">
            <Graph
              nodes={[
                ...alphaOne.nodes.map((node) => ({
                  id: `${node}a1`,
                  label: node,
                  fill: "#60B5FF",
                })),
              ]}
              edges={[
                ...alphaOne.edges.map((edge, index) => ({
                  source: `${edge[0]}a1`,
                  target: `${edge[1]}a1`,
                  id: generateUniqueEdgeId(edge[0], edge[1], 'a1', index),
                  label: `${edge[0]}-${edge[1]}`,
                })),
              ]}
              layout={layout}
              selections={selections}
            />
          </div>
        )}
        
        {activeTab === 2 && numOfCodons >= 3 && (
          <div className="alpha-two">
            <Graph
              nodes={[
                ...alphaTwo.nodes.map((node) => ({
                  id: `${node}a2`,
                  label: node,
                  fill: "#E78B48",
                })),
              ]}
              edges={[
                ...alphaTwo.edges.map((edge, index) => ({
                  source: `${edge[0]}a2`,
                  target: `${edge[1]}a2`,
                  id: generateUniqueEdgeId(edge[0], edge[1], 'a2', index),
                  label: `${edge[0]}-${edge[1]}`,
                })),
              ]}
              layout={layout}
              selections={selections}
            />
          </div>
        )}
        
        {activeTab === 3 && numOfCodons === 4 && (
          <div className="alpha-three">
            <Graph
              nodes={[
                ...alphaThree.nodes.map((node) => ({
                  id: `${node}a3`,
                  label: node,
                  fill: "#ff69b4",
                })),
              ]}
              edges={[
                ...alphaThree.edges.map((edge, index) => ({
                  source: `${edge[0]}a3`,
                  target: `${edge[1]}a3`,
                  id: generateUniqueEdgeId(edge[0], edge[1], 'a3', index),
                  label: `${edge[0]}-${edge[1]}`,
                })),
              ]}
              layout={layout}
              selections={selections}
            />
          </div>
        )}
        
        {activeTab === c3TabIndex && (
          <div className="c3-merged-graph">
            <div className="c3-header">
              <div className="header-left">
                {/* Empty space for alignment */}
              </div>
              <div className="header-center">
                <h2>C{numOfCodons} Graph Analysis</h2>
              </div>
              <div className="header-right">
                <div className="view-controls">
                  <button 
                    className={`view-btn ${!isSeparated && !isOverlaid ? 'active' : ''}`}
                    onClick={() => {
                      setIsSeparated(false);
                      setIsOverlaid(false);
                      setSelections([]);
                    }}
                  >
                    Merged View
                  </button>
                  <button 
                    className={`view-btn ${isSeparated ? 'active' : ''}`}
                    onClick={() => {
                      setIsSeparated(true);
                      setIsOverlaid(false);
                      setSelections([]);
                    }}
                  >
                    Separate Graphs
                  </button>
                  <button 
                    className={`view-btn ${isOverlaid ? 'active' : ''}`}
                    onClick={() => {
                      setIsSeparated(false);
                      setIsOverlaid(true);
                      setSelections([]);
                    }}
                  >
                    Overlay Graphs
                  </button>
                </div>
              </div>
            </div>
            
            <div className="c3-content">
              {!isSeparated && !isOverlaid && (
                <div className="graph-legend-sidebar">
                  <div className="graph-legend">
                    <h4>Legend</h4>
                    <div className="legend-items">
                      {numOfCodons >= 2 && (
                        <>
                          <div className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: '#9d4edd' }}></div>
                            <span>All Graphs ({numOfCodons === 2 ? 'O1' : numOfCodons === 3 ? 'O12' : 'O123'})</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: '#7dcfb6' }}></div>
                            <span>Original + Alpha 1 (O1)</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: '#90C67C' }}></div>
                            <span>Original Only (O)</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: '#60B5FF' }}></div>
                            <span>Alpha 1 Only (1)</span>
                          </div>
                        </>
                      )}
                      {numOfCodons >= 3 && (
                        <>
                          <div className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: '#f9844a' }}></div>
                            <span>Original + Alpha 2 (O2)</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: '#ee6c4d' }}></div>
                            <span>Alpha 1 + Alpha 2 (12)</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: '#E78B48' }}></div>
                            <span>Alpha 2 Only (2)</span>
                          </div>
                        </>
                      )}
                      {numOfCodons === 4 && (
                        <>
                          <div className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: '#ff6b9d' }}></div>
                            <span>Original + Alpha 3 (O3)</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: '#ffd23f' }}></div>
                            <span>Alpha 1 + Alpha 3 (13)</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: '#06ffa5' }}></div>
                            <span>Alpha 2 + Alpha 3 (23)</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: '#ff69b4' }}></div>
                            <span>Alpha 3 Only (3)</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {isSeparated ? (
                <div className="separated-graphs-container">
                  <div className="separated-graph">
                    <h3>Original Graph</h3>
                    <div className="graph-wrapper">
                      <Graph
                        nodes={originalCodons.nodes.map(node => ({
                          id: `${node}o_sep`,
                          label: node,
                          fill: "#90C67C"
                        }))}
                        edges={originalCodons.edges.map((edge, index) => ({
                          source: `${edge[0]}o_sep`,
                          target: `${edge[1]}o_sep`,
                          id: generateUniqueEdgeId(edge[0], edge[1], 'o_sep', index),
                          label: "O"
                        }))}
                        layout={layout}
                        selections={selections.filter(sel => sel.includes('o_sep'))}
                      />
                    </div>
                  </div>
                  <div className="separated-graph">
                    <h3>Alpha One Graph</h3>
                    <div className="graph-wrapper">
                      <Graph
                        nodes={alphaOne.nodes.map(node => ({
                          id: `${node}a1_sep`,
                          label: node,
                          fill: "#60B5FF"
                        }))}
                        edges={alphaOne.edges.map((edge, index) => ({
                          source: `${edge[0]}a1_sep`,
                          target: `${edge[1]}a1_sep`,
                          id: generateUniqueEdgeId(edge[0], edge[1], 'a1_sep', index),
                          label: "1"
                        }))}
                        layout={layout}
                        selections={selections.filter(sel => sel.includes('a1_sep'))}
                      />
                    </div>
                  </div>
                  {numOfCodons >= 3 && (
                    <div className="separated-graph">
                      <h3>Alpha Two Graph</h3>
                      <div className="graph-wrapper">
                        <Graph
                          nodes={alphaTwo.nodes.map(node => ({
                            id: `${node}a2_sep`,
                            label: node,
                            fill: "#E78B48"
                          }))}
                          edges={alphaTwo.edges.map((edge, index) => ({
                            source: `${edge[0]}a2_sep`,
                            target: `${edge[1]}a2_sep`,
                            id: generateUniqueEdgeId(edge[0], edge[1], 'a2_sep', index),
                            label: "2"
                          }))}
                          layout={layout}
                          selections={selections.filter(sel => sel.includes('a2_sep'))}
                        />
                      </div>
                    </div>
                  )}
                  {numOfCodons === 4 && (
                    <div className="separated-graph">
                      <h3>Alpha Three Graph</h3>
                      <div className="graph-wrapper">
                        <Graph
                          nodes={alphaThree.nodes.map(node => ({
                            id: `${node}a3_sep`,
                            label: node,
                            fill: "#ff69b4"
                          }))}
                          edges={alphaThree.edges.map((edge, index) => ({
                            source: `${edge[0]}a3_sep`,
                            target: `${edge[1]}a3_sep`,
                            id: generateUniqueEdgeId(edge[0], edge[1], 'a3_sep', index),
                            label: "3"
                          }))}
                          layout={layout}
                          selections={selections.filter(sel => sel.includes('a3_sep'))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : isOverlaid ? (
                <OverlayGraphs 
                  originalCodons={originalCodons}
                  alphaOne={alphaOne}
                  alphaTwo={numOfCodons >= 3 ? alphaTwo : null}
                  alphaThree={numOfCodons === 4 ? alphaThree : null}
                  layout={layout}
                  selections={selections}
                  generateUniqueEdgeId={generateUniqueEdgeId}
                  numOfCodons={numOfCodons}
                />
              ) : (
                <div className="merged-graph-container">
                  <Graph
                    key="c3-merged"
                    layout={layout}
                    nodes={mergeGraphs().nodes}
                    edges={mergeGraphs().edges}
                    selections={selections}
                    isC3Tab={true}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="graphs-footer">
        <LayoutButtons
          toggleLongestPath={toggleLongestPath}
          setLayout={setLayout}
          layout={layout}
        />
      </div>
      
      <GraphProperties
        showProperties={showProperties}
        setShowProperites={setShowProperites}
        eigenschaften={eigenschaften}
        eigenschaftenAlphaOne={eigenschaftenAlphaOne}
        eigenschaftenAlphaTwo={eigenschaftenAlphaTwo}
        eigenschaftenAlphaThree={eigenschaftenAlphaThree}
        c3={c3}
        numOfCodons={numOfCodons}
        activeTab={activeTab}
      />
    </main>
  );
}
