import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useStore } from "../../store";
import { useGraphData } from "./hooks/useGraphData";
import { GraphMergeService } from "./services/GraphMergeService";
import { ExportService } from "./services/ExportService";
import { LongestPathService } from "./services/LongestPathService";
import { ShortestPathService } from "./services/ShortestPathService";
import { GraphUtils } from "./utils/GraphUtils";
import GraphHeader from "./components/GraphHeader";
import SingleGraphTab from "./components/SingleGraphTab";
import C3GraphTab from "./components/C3GraphTab";
import GraphSidebar from "./components/GraphSidebar";
import InteractiveControls from "../InteractiveControls";
import "../../css/codons-graph.css";

const CodonsGraph = () => {
  const graphData = useGraphData();
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  
  // UI State
  const [showProperties, setShowProperites] = useState(false);
  const [showOrganizationControls, setShowOrganizationControls] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [layout, setLayout] = useState("circular2d");
  const [currentLayout, setCurrentLayout] = useState("force");
  const [selections, setSelections] = useState([]);
  const [isSeparated, setIsSeparated] = useState(false);
  const [isOverlaid, setIsOverlaid] = useState(false);
  const [shortestPathSource, setShortestPathSource] = useState('');
  const [shortestPathTarget, setShortestPathTarget] = useState('');
  const [nodeSortType, setNodeSortType] = useState('alphabetical');
  const [enableOptimization, setEnableOptimization] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [isFooterCollapsed, setIsFooterCollapsed] = useState(false);
  const [showInteractiveControls, setShowInteractiveControls] = useState(false);

  // Services
  const [graphMergeService, setGraphMergeService] = useState(null);

  // Initialize services
  useEffect(() => {
    if (graphData.numOfCodons) {
      setGraphMergeService(new GraphMergeService(graphData.numOfCodons));
    }
  }, [graphData.numOfCodons]);

  // Apply theme to body element
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Set default view for C3 tab and clear selections when switching tabs
  useEffect(() => {
    const c3TabIndex = GraphUtils.getC3TabIndex(graphData.numOfCodons);
    if (activeTab === c3TabIndex && graphData.numOfCodons) {
      setIsSeparated(true);
      setIsOverlaid(false);
    } else if (activeTab !== c3TabIndex) {
      setIsSeparated(false);
      setIsOverlaid(false);
    }
    
    // Clear selections when switching tabs so they don't persist incorrectly
    setSelections([]);
  }, [activeTab, graphData.numOfCodons]);

  // Event Handlers
  const handleExport = () => {
    const mergedGraph = graphMergeService ? 
      graphMergeService.mergeGraphs(
        graphData.originalCodons, 
        graphData.alphaOne, 
        graphData.alphaTwo, 
        graphData.alphaThree
      ) : { nodes: [], edges: [] };

    ExportService.exportGraphToCSV(
      activeTab,
      graphData.numOfCodons,
      graphData.originalCodons,
      graphData.alphaOne,
      graphData.alphaTwo,
      graphData.alphaThree,
      mergedGraph
    );
  };

  const toggleLongestPath = async () => {
    // If there are already selections, clear them to toggle off
    if (selections.length > 0) {
      setSelections([]);
      return;
    }

    try {
      // Check if graph data is loaded
      if (!graphData.numOfCodons) {
        console.error("Graph data not loaded yet");
        alert("Please wait for the graph data to load completely before calculating the longest path.");
        return;
      }

      // Additional validation to check if the current tab has valid graph data
      const c3TabIndex = GraphUtils.getC3TabIndex(graphData.numOfCodons);
      let currentGraphData;
      
      if (activeTab === c3TabIndex) {
        currentGraphData = graphData.originalCodons;
      } else if (activeTab === 0) {
        currentGraphData = graphData.originalCodons;
      } else if (activeTab === 1) {
        currentGraphData = graphData.alphaOne;
      } else if (activeTab === 2) {
        currentGraphData = graphData.alphaTwo;
      } else if (activeTab === 3) {
        currentGraphData = graphData.alphaThree;
      }

      // Check if the current graph data is properly loaded
      if (!currentGraphData || typeof currentGraphData !== 'object' || 
          Object.keys(currentGraphData).length === 0) {
        alert("Graph data for the current tab is not loaded yet. Please wait for the data to load completely or try switching to a different tab.");
        return;
      }

      const longestPath = await LongestPathService.fetchLongestPath(
        activeTab,
        graphData.numOfCodons,
        graphData.originalCodons,
        graphData.alphaOne,
        graphData.alphaTwo,
        graphData.alphaThree
      );

      const convertedPath = LongestPathService.convertPathForTab(
        longestPath,
        activeTab,
        graphData.numOfCodons,
        isSeparated,
        isOverlaid
      );


      setSelections(convertedPath);
    } catch (error) {
      console.error("Error fetching longest path:", error);
      
      // Provide more user-friendly error messages
      let userMessage = error.message;
      if (error.message.includes("Graph data not loaded")) {
        userMessage = "The graph data is still loading. Please wait a moment and try again.";
      } else if (error.message.includes("No edges found") || error.message.includes("No valid edges found")) {
        userMessage = "The current graph has no connections between nodes. Please ensure the graph data is properly loaded or try a different tab.";
      } else if (error.message.includes("Graph data is incomplete")) {
        userMessage = "The graph data is incomplete. Please refresh the page and ensure all data is loaded properly.";
      } else if (error.message.includes("Failed to fetch longest path")) {
        userMessage = "Unable to calculate the longest path. Please check your connection and try again.";
      }
      
      alert(`Failed to calculate longest path: ${userMessage}`);
    }
  };

  const calculateShortestPath = async () => {
    // If there are already selections, clear them to toggle off
    if (selections.length > 0) {
      setSelections([]);
      return;
    }

    try {
      // Validate inputs
      if (!shortestPathSource.trim() || !shortestPathTarget.trim()) {
        alert("Please enter both source and target nodes.");
        return;
      }

      // Check if graph data is loaded
      if (!graphData.numOfCodons) {
        console.error("Graph data not loaded yet");
        alert("Please wait for the graph data to load completely before calculating the shortest path.");
        return;
      }

      // Additional validation to check if the current tab has valid graph data
      const c3TabIndex = GraphUtils.getC3TabIndex(graphData.numOfCodons);
      let currentGraphData;
      
      if (activeTab === c3TabIndex) {
        currentGraphData = graphData.originalCodons;
      } else if (activeTab === 0) {
        currentGraphData = graphData.originalCodons;
      } else if (activeTab === 1) {
        currentGraphData = graphData.alphaOne;
      } else if (activeTab === 2) {
        currentGraphData = graphData.alphaTwo;
      } else if (activeTab === 3) {
        currentGraphData = graphData.alphaThree;
      }

      // Check if the current graph data is properly loaded
      if (!currentGraphData || typeof currentGraphData !== 'object' || 
          Object.keys(currentGraphData).length === 0) {
        alert("Graph data for the current tab is not loaded yet. Please wait for the data to load completely or try switching to a different tab.");
        return;
      }

      const shortestPath = await ShortestPathService.fetchShortestPath(
        activeTab,
        graphData.numOfCodons,
        graphData.originalCodons,
        graphData.alphaOne,
        graphData.alphaTwo,
        graphData.alphaThree,
        shortestPathSource.trim(),
        shortestPathTarget.trim()
      );

      const convertedPath = ShortestPathService.convertPathForTab(
        shortestPath,
        activeTab,
        graphData.numOfCodons,
        isSeparated,
        isOverlaid
      );

      setSelections(convertedPath);
    } catch (error) {
      console.error("Error fetching shortest path:", error);
      
      // Provide more user-friendly error messages
      let userMessage = error.message;
      if (error.message.includes("Graph data not loaded")) {
        userMessage = "The graph data is still loading. Please wait a moment and try again.";
      } else if (error.message.includes("No edges found") || error.message.includes("No valid edges found")) {
        userMessage = "The current graph has no connections between nodes. Please ensure the graph data is properly loaded or try a different tab.";
      } else if (error.message.includes("Graph data is incomplete")) {
        userMessage = "The graph data is incomplete. Please refresh the page and ensure all data is loaded properly.";
      } else if (error.message.includes("Failed to fetch shortest path")) {
        userMessage = "Unable to calculate the shortest path. Please check your connection and try again.";
      } else if (error.message.includes("does not exist in the graph")) {
        userMessage = error.message; // Keep the specific node error message
      } else if (error.message.includes("No path found between")) {
        userMessage = `${error.message}. This means these nodes are not connected in the current graph. Try different nodes or check if they exist in the selected tab.`;
      }
      
      // Use a more informative dialog instead of alert
      if (error.message.includes("No path found between")) {
        console.info(`Shortest path result: ${userMessage}`);
        // Don't show this as an error since it's a valid result
        alert(`Path Search Result: ${userMessage}`);
      } else {
        console.error("Error calculating shortest path:", error);
        alert(`Failed to calculate shortest path: ${userMessage}`);
      }
    }
  };

  const c3TabIndex = GraphUtils.getC3TabIndex(graphData.numOfCodons);
  const mergedGraph = graphMergeService ? 
    graphMergeService.mergeGraphs(
      graphData.originalCodons, 
      graphData.alphaOne, 
      graphData.alphaTwo, 
      graphData.alphaThree
    ) : { nodes: [], edges: [] };

  const renderTabContent = () => {
    if (activeTab === 0) {
      return (
        <div className="original-codons">
          <SingleGraphTab
            graphData={graphData.originalCodons}
            suffix="o"
            color="#90C67C"
            layout={currentLayout}
            longestPathSelections={selections}
          />
        </div>
      );
    }

    if (activeTab === 1) {
      return (
        <div className="alpha-one">
          <SingleGraphTab
            graphData={graphData.alphaOne}
            suffix="a1"
            color="#60B5FF"
            layout={currentLayout}
            longestPathSelections={selections}
          />
        </div>
      );
    }

    if (activeTab === 2 && graphData.numOfCodons >= 3) {
      return (
        <div className="alpha-two">
          <SingleGraphTab
            graphData={graphData.alphaTwo}
            suffix="a2"
            color="#E78B48"
            layout={currentLayout}
            longestPathSelections={selections}
          />
        </div>
      );
    }

    if (activeTab === 3 && graphData.numOfCodons === 4) {
      return (
        <div className="alpha-three">
          <SingleGraphTab
            graphData={graphData.alphaThree}
            suffix="a3"
            color="#ff69b4"
            layout={currentLayout}
            longestPathSelections={selections}
          />
        </div>
      );
    }

    if (activeTab === c3TabIndex) {
      return (
        <C3GraphTab
          numOfCodons={graphData.numOfCodons}
          originalCodons={graphData.originalCodons}
          alphaOne={graphData.alphaOne}
          alphaTwo={graphData.alphaTwo}
          alphaThree={graphData.alphaThree}
          isSeparated={isSeparated}
          isOverlaid={isOverlaid}
          setIsSeparated={setIsSeparated}
          setIsOverlaid={setIsOverlaid}
          setSelections={setSelections}
          layout={currentLayout}
          selections={selections}
          mergedGraph={mergedGraph}
        />
      );
    }

    return null;
  };

  return (
    <main className="graphs-wrapper">
      <GraphHeader
        isHeaderCollapsed={isHeaderCollapsed}
        setIsHeaderCollapsed={setIsHeaderCollapsed}
        onExport={handleExport}
        theme={theme}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        numOfCodons={graphData.numOfCodons}
        showInteractiveControls={showInteractiveControls}
        setShowInteractiveControls={setShowInteractiveControls}
      />
      
      {showInteractiveControls && (
        <InteractiveControls isDropdown={true} />
      )}
      
      <div className="graphs-content">
        {renderTabContent()}
      </div>
      
      
      <GraphSidebar
        showOrganizationControls={showOrganizationControls}
        setShowOrganizationControls={setShowOrganizationControls}
        nodeSortType={nodeSortType}
        setNodeSortType={setNodeSortType}
        enableOptimization={enableOptimization}
        setEnableOptimization={setEnableOptimization}
        currentLayout={currentLayout}
        setCurrentLayout={setCurrentLayout}
        showProperties={showProperties}
        setShowProperites={setShowProperites}
        eigenschaften={graphData.eigenschaften}
        eigenschaftenAlphaOne={graphData.eigenschaftenAlphaOne}
        eigenschaftenAlphaTwo={graphData.eigenschaftenAlphaTwo}
        eigenschaftenAlphaThree={graphData.eigenschaftenAlphaThree}
        c3={graphData.c3}
        numOfCodons={graphData.numOfCodons}
        activeTab={activeTab}
        toggleLongestPath={toggleLongestPath}
        calculateShortestPath={calculateShortestPath}
        shortestPathSource={shortestPathSource}
        setShortestPathSource={setShortestPathSource}
        shortestPathTarget={shortestPathTarget}
        setShortestPathTarget={setShortestPathTarget}
      />
    </main>
  );
};

export default CodonsGraph;
