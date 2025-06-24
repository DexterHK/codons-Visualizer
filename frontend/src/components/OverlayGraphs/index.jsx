import React, { useState } from "react";
import "./styles.css";
import GraphV2 from "../graph-v2";
import { usePressedKey } from "../../hooks/usePressedKey";
import { useEffect } from "react";

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
            initialNodes={originalNodes}
            initialEdges={originalEdges}
            layoutType={layout}
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
            initialNodes={alphaOneNodes}
            initialEdges={alphaOneEdges}
            layoutType={layout}
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
              initialNodes={alphaTwoNodes}
              initialEdges={alphaTwoEdges}
              layoutType={layout}
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
              initialNodes={alphaThreeNodes}
              initialEdges={alphaThreeEdges}
              layoutType={layout}
              nodeColor="#ff69b4"
            />
          </div>
        )}
      </div>
    </div>
  );
}
