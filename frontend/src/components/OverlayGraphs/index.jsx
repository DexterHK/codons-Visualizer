import React, { useState } from "react";
import "./styles.css";
import GraphV2 from "../graph-v2";
import { usePressedKey } from "../../hooks/usePressedKey";
import { useEffect } from "react";
import { createConsistentLayout, applyConsistentPositions } from "../../utils/consistentLayout";

export default function OverlayGraphs({
  originalNodes,
  originalEdges,
  alphaOneNodes,
  alphaOneEdges,
  alphaTwoNodes,
  alphaTwoEdges,
  alphaThreeNodes,
  alphaThreeEdges,
  layout,
  numOfCodons,
}) {
  const [graphOpacity, setGraphOpacity] = useState({
    original: 1,
    alphaOne: 0.5,
    alphaTwo: 0.5,
    alphaThree: 0.5,
  });

  const [graphZIndex, setGraphZIndex] = useState({
    original: 2,
    alphaOne: 1,
    alphaTwo: 1,
    alphaThree: 1,
  });

  const [consistentPositioning, setConsistentPositioning] = useState(true);
  const [positionedNodes, setPositionedNodes] = useState({
    original: null,
    alphaOne: null,
    alphaTwo: null,
    alphaThree: null,
  });

  const pressedKey = usePressedKey(["z", "x", "c", "v"]);

  const [prevZIndexsState, setPrevZIndexsState] = useState({});

  const graphKeyMapping = {
    z: "original",
    x: "alphaOne",
    c: "alphaTwo",
    v: "alphaThree",
  }

  const handleOpacityChange = (graph, value) => {
    setGraphOpacity((prev) => ({
      ...prev,
      [graph]: parseFloat(value),
    }));
  };

  const bringToFront = (graph) => {
    const currentTop = Object.keys(graphZIndex).find(
      (key) => graphZIndex[key] === 2,
    );
    if (currentTop) {
      setGraphZIndex((prev) => ({
        ...prev,
        [currentTop]: 1,
      }));
    }
    setGraphZIndex((prev) => ({
      ...prev,
      [graph]: 2,
    }));
  };

  useEffect(() => {
    setPrevZIndexsState({
      graphZIndex,
    });

    if (pressedKey && graphKeyMapping[pressedKey]) {
      bringToFront(graphKeyMapping[pressedKey]);
    }
    if (!pressedKey) {
      setGraphZIndex(prevZIndexsState);
    }
  }, [pressedKey]);

  // Effect to compute consistent positions when nodes change or positioning settings change
  useEffect(() => {
    if (!consistentPositioning) {
      // Reset to original nodes if consistent positioning is disabled
      setPositionedNodes({
        original: originalNodes,
        alphaOne: alphaOneNodes,
        alphaTwo: alphaTwoNodes,
        alphaThree: alphaThreeNodes,
      });
      return;
    }

    // Collect all graph nodes for analysis
    const allGraphNodes = [
      originalNodes,
      alphaOneNodes,
      alphaTwoNodes,
      alphaThreeNodes,
    ].filter(Boolean);

    if (allGraphNodes.length === 0) return;

    // Assume a standard canvas size for positioning (will be scaled by GraphV2)
    const canvasWidth = 800;
    const canvasHeight = 600;

    // Create consistent layout
    const positionMap = createConsistentLayout({
      allGraphNodes,
      width: canvasWidth,
      height: canvasHeight,
    });

    // Apply consistent positions to each graph
    const newPositionedNodes = {
      original: originalNodes ? applyConsistentPositions(
        originalNodes,
        positionMap,
        "#90C67C",
        layout,
        canvasWidth,
        canvasHeight
      ) : null,
      alphaOne: alphaOneNodes ? applyConsistentPositions(
        alphaOneNodes,
        positionMap,
        "#60B5FF",
        layout,
        canvasWidth,
        canvasHeight
      ) : null,
      alphaTwo: alphaTwoNodes ? applyConsistentPositions(
        alphaTwoNodes,
        positionMap,
        "#E78B48",
        layout,
        canvasWidth,
        canvasHeight
      ) : null,
      alphaThree: alphaThreeNodes ? applyConsistentPositions(
        alphaThreeNodes,
        positionMap,
        "#ff69b4",
        layout,
        canvasWidth,
        canvasHeight
      ) : null,
    };

    setPositionedNodes(newPositionedNodes);
  }, [
    originalNodes,
    alphaOneNodes,
    alphaTwoNodes,
    alphaThreeNodes,
    consistentPositioning,
    layout,
  ]);

  // Generate preset buttons based on available graphs
  const generatePresetButtons = () => {
    const buttons = [];
    const availableGraphs = ["original", "alphaOne"];
    if (numOfCodons >= 3) availableGraphs.push("alphaTwo");
    if (numOfCodons === 4) availableGraphs.push("alphaThree");

    // Focus buttons for each graph
    buttons.push(
      <button
        key="focus-original"
        onClick={() => {
          const newOpacity = {
            original: 1,
            alphaOne: 0.3,
            alphaTwo: 0.3,
            alphaThree: 0.3,
          };
          setGraphOpacity(newOpacity);
        }}
      >
        Focus Original
      </button>,
    );

    buttons.push(
      <button
        key="focus-alpha1"
        onClick={() => {
          const newOpacity = {
            original: 0.3,
            alphaOne: 1,
            alphaTwo: 0.3,
            alphaThree: 0.3,
          };
          setGraphOpacity(newOpacity);
        }}
      >
        Focus Alpha 1
      </button>,
    );

    if (numOfCodons >= 3) {
      buttons.push(
        <button
          key="focus-alpha2"
          onClick={() => {
            const newOpacity = {
              original: 0.3,
              alphaOne: 0.3,
              alphaTwo: 1,
              alphaThree: 0.3,
            };
            setGraphOpacity(newOpacity);
          }}
        >
          Focus Alpha 2
        </button>,
      );
    }

    if (numOfCodons === 4) {
      buttons.push(
        <button
          key="focus-alpha3"
          onClick={() => {
            const newOpacity = {
              original: 0.3,
              alphaOne: 0.3,
              alphaTwo: 0.3,
              alphaThree: 1,
            };
            setGraphOpacity(newOpacity);
          }}
        >
          Focus Alpha 3
        </button>,
      );
    }

    // Equal opacity button
    buttons.push(
      <button
        key="equal-opacity"
        onClick={() => {
          const equalValue = 0.7;
          const newOpacity = {
            original: equalValue,
            alphaOne: equalValue,
            alphaTwo: numOfCodons >= 3 ? equalValue : 0.3,
            alphaThree: numOfCodons === 4 ? equalValue : 0.3,
          };
          setGraphOpacity(newOpacity);
        }}
      >
        Equal Opacity
      </button>,
    );

    return buttons;
  };

  return (
    <div className="overlay-container">
      <div className="overlay-controls">
        <h4>Graph Controls</h4>
        
        {/* Consistent Positioning Controls */}
        <div className="positioning-controls">
          <h5>Node Positioning</h5>
          <div className="positioning-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={consistentPositioning}
                onChange={(e) => setConsistentPositioning(e.target.checked)}
              />
              <span>Consistent Node Positioning</span>
            </label>
            
            {consistentPositioning && (
              <div className="positioning-method">
                <span style={{ fontSize: '0.85rem', color: '#cccccc' }}>
                  Using dynamic analysis to position nodes with the same sequence in identical locations across all graphs.
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="control-group">
          <label>
            <span style={{ color: "#90C67C" }}>Original Graph</span>
            <div className="control-row">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={graphOpacity.original}
                onChange={(e) =>
                  handleOpacityChange("original", e.target.value)
                }
              />
              <button
                className="bring-front-btn"
                onClick={() => bringToFront("original")}
              >
                Bring to Front
              </button>
            </div>
          </label>

          <label>
            <span style={{ color: "#60B5FF" }}>Alpha One Graph</span>
            <div className="control-row">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={graphOpacity.alphaOne}
                onChange={(e) =>
                  handleOpacityChange("alphaOne", e.target.value)
                }
              />
              <button
                className="bring-front-btn"
                onClick={() => bringToFront("alphaOne")}
              >
                Bring to Front
              </button>
            </div>
          </label>

          {numOfCodons >= 3 && (
            <label>
              <span style={{ color: "#E78B48" }}>Alpha Two Graph</span>
              <div className="control-row">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={graphOpacity.alphaTwo}
                  onChange={(e) =>
                    handleOpacityChange("alphaTwo", e.target.value)
                  }
                />
                <button
                  className="bring-front-btn"
                  onClick={() => bringToFront("alphaTwo")}
                >
                  Bring to Front
                </button>
              </div>
            </label>
          )}

          {numOfCodons === 4 && (
            <label>
              <span style={{ color: "#ff69b4" }}>Alpha Three Graph</span>
              <div className="control-row">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={graphOpacity.alphaThree}
                  onChange={(e) =>
                    handleOpacityChange("alphaThree", e.target.value)
                  }
                />
                <button
                  className="bring-front-btn"
                  onClick={() => bringToFront("alphaThree")}
                >
                  Bring to Front
                </button>
              </div>
            </label>
          )}
        </div>

        <div className="preset-buttons">{generatePresetButtons()}</div>
      </div>

      <div className="overlay-graphs">
        <div
          className="overlay-graph-layer"
          style={{
            opacity: graphOpacity.original,
            zIndex: graphZIndex.original,
          }}
        >
          <GraphV2
            initialNodes={consistentPositioning ? positionedNodes.original : originalNodes}
            initialEdges={originalEdges}
            layoutType={consistentPositioning ? "preset" : layout}
            nodeColor="#90C67C"
          />
        </div>

        <div
          className="overlay-graph-layer"
          style={{
            opacity: graphOpacity.alphaOne,
            zIndex: graphZIndex.alphaOne,
          }}
        >
          <GraphV2
            initialNodes={consistentPositioning ? positionedNodes.alphaOne : alphaOneNodes}
            initialEdges={alphaOneEdges}
            layoutType={consistentPositioning ? "preset" : layout}
            nodeColor="#60B5FF"
          />
        </div>

        {numOfCodons >= 3 && alphaOneNodes && (
          <div
            className="overlay-graph-layer"
            style={{
              opacity: graphOpacity.alphaTwo,
              zIndex: graphZIndex.alphaTwo,
            }}
          >
            <GraphV2
              initialNodes={consistentPositioning ? positionedNodes.alphaTwo : alphaTwoNodes}
              initialEdges={alphaTwoEdges}
              layoutType={consistentPositioning ? "preset" : layout}
              nodeColor="#E78B48"
            />
          </div>
        )}

        {numOfCodons === 4 && alphaThreeNodes && (
          <div
            className="overlay-graph-layer"
            style={{
              opacity: graphOpacity.alphaThree,
              zIndex: graphZIndex.alphaThree,
            }}
          >
            <GraphV2
              initialNodes={consistentPositioning ? positionedNodes.alphaThree : alphaThreeNodes}
              initialEdges={alphaThreeEdges}
              layoutType={consistentPositioning ? "preset" : layout}
              nodeColor="#ff69b4"
            />
          </div>
        )}
      </div>
    </div>
  );
}
