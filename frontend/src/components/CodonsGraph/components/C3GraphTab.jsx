import React from "react";
import OverlayGraphs from "../../OverlayGraphs";
import { GraphUtils } from "../utils/GraphUtils";
import GraphV2 from "../../graph-v2";

const C3GraphTab = ({
  numOfCodons,
  originalCodons,
  alphaOne,
  alphaTwo,
  alphaThree,
  isSeparated,
  isOverlaid,
  setIsSeparated,
  setIsOverlaid,
  setSelections,
  layout,
}) => {
  const handleViewChange = (viewType) => {
    setIsSeparated(viewType === "separated");
    setIsOverlaid(viewType === "overlaid");
    setSelections([]);
  };

  const originalNodes = GraphUtils.createGraphNodes(originalCodons.nodes, "o");
  const originalEdges = GraphUtils.createGraphEdges(
    originalCodons.edges,
    "o",
    GraphUtils.generateUniqueEdgeId,
  );

  const alphaOneNodes = GraphUtils.createGraphNodes(alphaOne.nodes, "a1");
  const alphaOneEdges = GraphUtils.createGraphEdges(
    alphaOne.edges,
    "a1",
    GraphUtils.generateUniqueEdgeId,
  );

  const alphaTwoNodes = GraphUtils.createGraphNodes(alphaTwo.nodes, "a2");
  const alphaTwoEdges = GraphUtils.createGraphEdges(
    alphaTwo.edges,
    "a2",
    GraphUtils.generateUniqueEdgeId,
  );

  const alphaThreeNodes = GraphUtils.createGraphNodes(alphaThree.nodes, "a3");
  const alphaThreeEdges = GraphUtils.createGraphEdges(
    alphaThree.edges,
    "a3",
    GraphUtils.generateUniqueEdgeId,
  );

  const renderLegend = () => (
    <div className="graph-legend-sidebar">
      <div className="graph-legend">
        <h4>Legend</h4>
        <div className="legend-items">
          {numOfCodons >= 2 && (
            <>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#9d4edd" }}
                ></div>
                <span>
                  All Graphs (
                  {numOfCodons === 2
                    ? "O1"
                    : numOfCodons === 3
                      ? "O12"
                      : "O123"}
                  )
                </span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#7dcfb6" }}
                ></div>
                <span>Original + Alpha 1 (O1)</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#90C67C" }}
                ></div>
                <span>Original Only (O)</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#60B5FF" }}
                ></div>
                <span>Alpha 1 Only (1)</span>
              </div>
            </>
          )}
          {numOfCodons >= 3 && (
            <>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#f9844a" }}
                ></div>
                <span>Original + Alpha 2 (O2)</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#ee6c4d" }}
                ></div>
                <span>Alpha 1 + Alpha 2 (12)</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#E78B48" }}
                ></div>
                <span>Alpha 2 Only (2)</span>
              </div>
            </>
          )}
          {numOfCodons === 4 && (
            <>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#ff6b9d" }}
                ></div>
                <span>Original + Alpha 3 (O3)</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#ffd23f" }}
                ></div>
                <span>Alpha 1 + Alpha 3 (13)</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#06ffa5" }}
                ></div>
                <span>Alpha 2 + Alpha 3 (23)</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#ff69b4" }}
                ></div>
                <span>Alpha 3 Only (3)</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderSeparatedGraphs = () => (
    <div className="separated-graphs-container">
      <div className="separated-graph">
        <h3>Original Graph</h3>
        <div className="graph-wrapper">
          <GraphV2
            initialNodes={originalNodes}
            initialEdges={originalEdges}
            layoutType={layout}
            nodeColor="#90C67C"
          />
        </div>
      </div>
      <div className="separated-graph">
        <h3>Alpha One Graph</h3>
        <div className="graph-wrapper">
          <GraphV2
            initialNodes={alphaOneNodes}
            initialEdges={alphaOneEdges}
            layoutType={layout}
            nodeColor="#60B5FF"
          />
        </div>
      </div>
      {numOfCodons >= 3 && (
        <div className="separated-graph">
          <h3>Alpha Two Graph</h3>
          <div className="graph-wrapper">
            <GraphV2
              initialNodes={alphaTwoNodes}
              initialEdges={alphaTwoEdges}
              layoutType={layout}
              nodeColor="#f9844a"
            />
          </div>
        </div>
      )}
      {numOfCodons === 4 && (
        <div className="separated-graph">
          <h3>Alpha Three Graph</h3>
          <div className="graph-wrapper">
            <GraphV2
              initialNodes={alphaThreeNodes}
              initialEdges={alphaThreeEdges}
              layoutType={layout}
              nodeColor="#ff6b9d"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="c3-merged-graph">
      <div className="c3-header">
        <div className="header-left">{/* Empty space for alignment */}</div>
        <div className="header-center">
          <h2>C{numOfCodons} Graph Analysis</h2>
        </div>
        <div className="header-right">
          <div className="view-controls">
            <button
              className={`view-btn ${isSeparated ? "active" : ""}`}
              onClick={() => handleViewChange("separated")}
            >
              Separate Graphs
            </button>
            <button
              className={`view-btn ${isOverlaid ? "active" : ""}`}
              onClick={() => handleViewChange("overlaid")}
            >
              Overlay Graphs
            </button>
          </div>
        </div>
      </div>

      <div className="c3-content">
        {!isSeparated && !isOverlaid && renderLegend()}

        {isSeparated
          ? renderSeparatedGraphs()
          : isOverlaid && (
              <OverlayGraphs
                originalNodes={originalNodes}
                originalEdges={originalEdges}
                alphaOneNodes={alphaOneNodes}
                alphaOneEdges={alphaOneEdges}
                alphaTwoNodes={alphaTwoNodes}
                alphaTwoEdges={alphaTwoEdges}
                alphaThreeNodes={alphaThreeNodes}
                alphaThreeEdges={alphaThreeEdges}
                layout={layout}
                numOfCodons={numOfCodons}
              />
            )}
      </div>
    </div>
  );
};

export default C3GraphTab;
