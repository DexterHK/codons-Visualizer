import React from "react";
import { useStore } from "../store";
import Graph from "../components/graph";
import "../css/codons-graph.css";
import { Link } from "react-router";
import { useState } from "react";
import GraphProperties from "../components/graph-properties";
import GraphsTabs from "../components/graphs-tabs";
import LayoutButtons from "../components/layout-buttons";
import { saveAs } from "file-saver"; // Add this import for file saving

export default function CodonsGraph() {
  const originalCodons = useStore((state) => state.originalCodons);
  const alphaOne = useStore((state) => state.alphaOne);
  const alphaTwo = useStore((state) => state.alphaTwo);
  const eigenschaften = useStore((state) => state.eigenschaften);
  const eigenschaftenAlphaOne = useStore(
    (state) => state.eigenschaftenAlphaOne,
  );
  const eigenschaftenAlphaTwo = useStore(
    (state) => state.eigenschaftenAlphaTwo,
  );
  const c3 = useStore((state) => state.c3);

  const [showProperties, setShowProperites] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [layout, setLayout] = useState("circular2d");

  const [graphVisibility, setGraphVisibility] = useState({
    original: 1,
    alphaOne: 1,
    alphaTwo: 1,
  });

  const [overlay, setOverlay] = useState(true); // New state variable
  const [selections, setSelections] = useState([]); // Add a state for selections

  const handleVisibilityChange = (graph, value) => {
    setGraphVisibility((prev) => ({
      ...prev,
      [graph]: value,
    }));
  };

  const exportGraphToCSV = () => {
    const activeGraph =
      activeTab === 0
        ? originalCodons
        : activeTab === 1
        ? alphaOne
        : activeTab === 2
        ? alphaTwo
        : null;

    if (!activeGraph) return;

    const csvContent = [
      "Source,Target",
      ...activeGraph.edges.map((edge) => `${edge[0]},${edge[1]}`),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `graph_tab_${activeTab}.csv`);
  };  const toggleLongestPath = async () => {
    // If there are already selections, clear them to toggle off
    if (selections.length > 0) {
      setSelections([]);
      return;
    }

    try {
      // Calculate longest path using original codons for all tabs
      const calculationGraph = activeTab === 3 ? originalCodons : 
                             activeTab === 0 ? originalCodons : 
                             activeTab === 1 ? alphaOne : alphaTwo;
                             
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

      if (activeTab === 3) {
        // For C3 tab, create selections for all three versions
        const convertedPath = [
          ...longestPath.map(node => `${node}o`),   // Original
          ...longestPath.map(node => `${node}a1`),  // Alpha One
          ...longestPath.map(node => `${node}a2`)   // Alpha Two
        ];
        setSelections(convertedPath);
      } else {
        // For other tabs, handle as before
        const suffix = activeTab === 0 ? "o" : activeTab === 1 ? "a1" : "a2";
        const convertedPath = longestPath.map((node) => `${node}${suffix}`);
        setSelections(convertedPath);
      }
    } catch (error) {
      console.error("Error fetching longest path:", error);
    }
  };

  return !originalCodons ||
    !alphaOne ||
    !alphaTwo ||
    !originalCodons.nodes ||
    !originalCodons.edges ||
    !alphaOne.nodes ||
    !alphaOne.edges ||
    !alphaTwo.nodes ||
    !alphaTwo.edges ? (
    <main>
      <p className="error-message">No Data Provided</p>
      <Link to="/" className="back-link">
        Go Back
      </Link>
    </main>
  ) : (
    <main className="graphs-wrapper">
      <button className="export-button" onClick={exportGraphToCSV}>
        Export
      </button>
      {/* Ensure the button is outside of any conditional rendering */}
      <GraphsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab == 0 && (
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
              ...originalCodons.edges.map((edge) => ({
                source: `${edge[0]}o`,
                target: `${edge[1]}o`,
                id: `${edge[0]}o-${edge[1]}o-o`,
                label: `${edge[0]}-${edge[1]}`,
              })),
            ]}
            layout={layout}
            selections={selections} // Highlight nodes
          />
        </div>
      )}
      {activeTab == 1 && (
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
              ...alphaOne.edges.map((edge) => ({
                source: `${edge[0]}a1`,
                target: `${edge[1]}a1`,
                id: `${edge[0]}a1-${edge[1]}a1-a1`,
                label: `${edge[0]}-${edge[1]}`,
              })),
            ]}
            layout={layout}
            selections={selections} // Highlight nodes
          />
        </div>
      )}
      {activeTab == 2 && (
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
              ...alphaTwo.edges.map((edge) => ({
                source: `${edge[0]}a2`,
                target: `${edge[1]}a2`,
                id: `${edge[0]}a2-${edge[1]}a2-a2`,
                label: `${edge[0]}-${edge[1]}`,
              })),
            ]}
            layout={layout}
            selections={selections} // Highlight nodes
          />
        </div>
      )}
      {activeTab == 3 && (
        <div className={overlay ? "c3-graphs-overlay" : "c3-graphs"}>
          {/* Visibility controls */}
          <div className="visibility-controls">
            <h3>Graph Visibility</h3>
            <label>
              Original Codons
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={graphVisibility.original}
                onChange={(e) =>
                  handleVisibilityChange("original", parseFloat(e.target.value))
                }
              />
            </label>
            <label>
              Alpha One
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={graphVisibility.alphaOne}
                onChange={(e) =>
                  handleVisibilityChange("alphaOne", parseFloat(e.target.value))
                }
              />
            </label>
            <label>
              Alpha Two
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={graphVisibility.alphaTwo}
                onChange={(e) =>
                  handleVisibilityChange("alphaTwo", parseFloat(e.target.value))
                }
              />
            </label>
            <button type="button" onClick={() => setOverlay(!overlay)}>
              {overlay ? "Separate Graphs" : "Overlay Graphs"}
            </button>
          </div>

          {/* Render all three graphs */}
          {overlay ? (
            <>
              <div
                className="overlay-graph original-codons"
                style={{ opacity: graphVisibility.original }}
              >
                <Graph
                  key="c3-original"
                  layout={layout}
                  nodes={[
                    ...originalCodons.nodes.map((node) => ({
                      id: `${node}o`,
                      label: node,
                      fill: "#90C67C",
                    })),
                  ]}
                  edges={[
                    ...originalCodons.edges.map((edge) => ({
                      source: `${edge[0]}o`,
                      target: `${edge[1]}o`,
                      id: `${edge[0]}o-${edge[1]}o-o`,
                      label: `${edge[0]}-${edge[1]}`,
                    })),
                  ]}
                  selections={selections} // Highlight nodes
                />
              </div>
              <div
                className="overlay-graph alpha-one"
                style={{ opacity: graphVisibility.alphaOne }}
              >
                <Graph
                  key="c3-alphaOne"
                  layout={layout}
                  nodes={[
                    ...alphaOne.nodes.map((node) => ({
                      id: `${node}a1`,
                      label: node,
                      fill: "#60B5FF",
                    })),
                  ]}
                  edges={[
                    ...alphaOne.edges.map((edge) => ({
                      source: `${edge[0]}a1`,
                      target: `${edge[1]}a1`,
                      id: `${edge[0]}a1-${edge[1]}a1-a1`,
                      label: `${edge[0]}-${edge[1]}`,
                    })),
                  ]}
                  selections={selections} // Highlight nodes
                />
              </div>
              <div
                className="overlay-graph alpha-two"
                style={{ opacity: graphVisibility.alphaTwo }}
              >
                <Graph
                  key="c3-alphaTwo"
                  layout={layout}
                  nodes={[
                    ...alphaTwo.nodes.map((node) => ({
                      id: `${node}a2`,
                      label: node,
                      fill: "#E78B48",
                    })),
                  ]}
                  edges={[
                    ...alphaTwo.edges.map((edge) => ({
                      source: `${edge[0]}a2`,
                      target: `${edge[1]}a2`,
                      id: `${edge[0]}a2-${edge[1]}a2-a2`,
                      label: `${edge[0]}-${edge[1]}`,
                    })),
                  ]}
                  selections={selections} // Highlight nodes
                />
              </div>
            </>
          ) : (
            <>
              <div
                className="graph-container"
                style={{ opacity: graphVisibility.original }}
              >
                <h3>Original Codons</h3>
                <Graph
                  key="c3-original"
                  layout={layout}
                  nodes={[
                    ...originalCodons.nodes.map((node) => ({
                      id: `${node}o`,
                      label: node,
                      fill: "#90C67C",
                    })),
                  ]}
                  edges={[
                    ...originalCodons.edges.map((edge) => ({
                      source: `${edge[0]}o`,
                      target: `${edge[1]}o`,
                      id: `${edge[0]}o-${edge[1]}o-o`,
                      label: `${edge[0]}-${edge[1]}`,
                    })),
                  ]}
                  selections={selections} // Highlight nodes
                />
              </div>
              <div
                className="graph-container"
                style={{ opacity: graphVisibility.alphaOne }}
              >
                <h3>Alpha One</h3>
                <Graph
                  key="c3-alphaOne"
                  layout={layout}
                  nodes={[
                    ...alphaOne.nodes.map((node) => ({
                      id: `${node}a1`,
                      label: node,
                      fill: "#60B5FF",
                    })),
                  ]}
                  edges={[
                    ...alphaOne.edges.map((edge) => ({
                      source: `${edge[0]}a1`,
                      target: `${edge[1]}a1`,
                      id: `${edge[0]}a1-${edge[1]}a1-a1`,
                      label: `${edge[0]}-${edge[1]}`,
                    })),
                  ]}
                  selections={selections} // Highlight nodes
                />
              </div>
              <div
                className="graph-container"
                style={{ opacity: graphVisibility.alphaTwo }}
              >
                <h3>Alpha Two</h3>
                <Graph
                  key="c3-alphaTwo"
                  layout={layout}
                  nodes={[
                    ...alphaTwo.nodes.map((node) => ({
                      id: `${node}a2`,
                      label: node,
                      fill: "#E78B48",
                    })),
                  ]}
                  edges={[
                    ...alphaTwo.edges.map((edge) => ({
                      source: `${edge[0]}a2`,
                      target: `${edge[1]}a2`,
                      id: `${edge[0]}a2-${edge[1]}a2-a2`,
                      label: `${edge[0]}-${edge[1]}`,
                    })),
                  ]}
                  selections={selections} // Highlight nodes
                />
              </div>
            </>
          )}
        </div>
      )}      <LayoutButtons
        toggleLongestPath={toggleLongestPath}
        setLayout={setLayout}
      />
      <GraphProperties
        showProperties={showProperties}
        setShowProperites={setShowProperites}
        eigenschaften={eigenschaften}
        eigenschaftenAlphaOne={eigenschaftenAlphaOne}
        eigenschaftenAlphaTwo={eigenschaftenAlphaTwo}
        c3={c3}
      />
    </main>
  );
}
