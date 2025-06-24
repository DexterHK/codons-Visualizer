import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useStore } from "../../store";
import { useGraphData } from "./hooks/useGraphData";
import { GraphMergeService } from "./services/GraphMergeService";
import { ExportService } from "./services/ExportService";
import { LongestPathService } from "./services/LongestPathService";
import { GraphUtils } from "./utils/GraphUtils";
import GraphHeader from "./components/GraphHeader";
import GraphFooter from "./components/GraphFooter";
import SingleGraphTab from "./components/SingleGraphTab";
import C3GraphTab from "./components/C3GraphTab";
import GraphSidebar from "./components/GraphSidebar";
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
  const [selections, setSelections] = useState([]);
  const [isSeparated, setIsSeparated] = useState(false);
  const [isOverlaid, setIsOverlaid] = useState(false);
  const [nodeSortType, setNodeSortType] = useState('alphabetical');
  const [enableOptimization, setEnableOptimization] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [isFooterCollapsed, setIsFooterCollapsed] = useState(false);

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
    }
  };

  // Data validation
  if (!GraphUtils.hasRequiredData(
    graphData.numOfCodons,
    graphData.originalCodons,
    graphData.alphaOne,
    graphData.alphaTwo,
    graphData.alphaThree
  )) {
    return (
      <main>
        <p className="error-message">No Data Provided</p>
        <Link to="/" className="back-link">
          Go Back
        </Link>
      </main>
    );
  }

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
            layout={layout}
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
            layout={layout}
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
            layout={layout}
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
            layout={layout}
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
          layout={layout}
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
      />
      
      <div className="graphs-content">
        {renderTabContent()}
      </div>
      
      <GraphFooter
        isFooterCollapsed={isFooterCollapsed}
        setIsFooterCollapsed={setIsFooterCollapsed}
        toggleLongestPath={toggleLongestPath}
        setLayout={setLayout}
        layout={layout}
      />
      
      <GraphSidebar
        showOrganizationControls={showOrganizationControls}
        setShowOrganizationControls={setShowOrganizationControls}
        nodeSortType={nodeSortType}
        setNodeSortType={setNodeSortType}
        enableOptimization={enableOptimization}
        setEnableOptimization={setEnableOptimization}
        showProperties={showProperties}
        setShowProperites={setShowProperites}
        eigenschaften={graphData.eigenschaften}
        eigenschaftenAlphaOne={graphData.eigenschaftenAlphaOne}
        eigenschaftenAlphaTwo={graphData.eigenschaftenAlphaTwo}
        eigenschaftenAlphaThree={graphData.eigenschaftenAlphaThree}
        c3={graphData.c3}
        numOfCodons={graphData.numOfCodons}
        activeTab={activeTab}
      />
    </main>
  );
};

export default CodonsGraph;
