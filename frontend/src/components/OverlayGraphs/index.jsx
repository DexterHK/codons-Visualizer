import React, { useState } from "react";
import Graph from "../graph";
import "./styles.css";

export default function OverlayGraphs({ 
  originalCodons, 
  alphaOne, 
  alphaTwo, 
  alphaThree,
  layout, 
  selections, 
  generateUniqueEdgeId,
  numOfCodons 
}) {
  const [graphOpacity, setGraphOpacity] = useState({
    original: 0.8,
    alphaOne: 0.8,
    alphaTwo: 0.8,
    alphaThree: 0.8,
  });

  const [graphZIndex, setGraphZIndex] = useState({
    original: 4,
    alphaOne: 3,
    alphaTwo: 2,
    alphaThree: 1,
  });

  const handleOpacityChange = (graph, value) => {
    setGraphOpacity(prev => ({
      ...prev,
      [graph]: parseFloat(value)
    }));
  };

  const bringToFront = (graph) => {
    const maxZ = Math.max(...Object.values(graphZIndex));
    setGraphZIndex(prev => ({
      ...prev,
      [graph]: maxZ + 1
    }));
  };

  // Generate preset buttons based on available graphs
  const generatePresetButtons = () => {
    const buttons = [];
    const availableGraphs = ['original', 'alphaOne'];
    if (numOfCodons >= 3) availableGraphs.push('alphaTwo');
    if (numOfCodons === 4) availableGraphs.push('alphaThree');

    // Focus buttons for each graph
    buttons.push(
      <button key="focus-original" onClick={() => {
        const newOpacity = { original: 1, alphaOne: 0.3, alphaTwo: 0.3, alphaThree: 0.3 };
        setGraphOpacity(newOpacity);
      }}>
        Focus Original
      </button>
    );

    buttons.push(
      <button key="focus-alpha1" onClick={() => {
        const newOpacity = { original: 0.3, alphaOne: 1, alphaTwo: 0.3, alphaThree: 0.3 };
        setGraphOpacity(newOpacity);
      }}>
        Focus Alpha 1
      </button>
    );

    if (numOfCodons >= 3) {
      buttons.push(
        <button key="focus-alpha2" onClick={() => {
          const newOpacity = { original: 0.3, alphaOne: 0.3, alphaTwo: 1, alphaThree: 0.3 };
          setGraphOpacity(newOpacity);
        }}>
          Focus Alpha 2
        </button>
      );
    }

    if (numOfCodons === 4) {
      buttons.push(
        <button key="focus-alpha3" onClick={() => {
          const newOpacity = { original: 0.3, alphaOne: 0.3, alphaTwo: 0.3, alphaThree: 1 };
          setGraphOpacity(newOpacity);
        }}>
          Focus Alpha 3
        </button>
      );
    }

    // Equal opacity button
    buttons.push(
      <button key="equal-opacity" onClick={() => {
        const equalValue = 0.7;
        const newOpacity = { 
          original: equalValue, 
          alphaOne: equalValue, 
          alphaTwo: numOfCodons >= 3 ? equalValue : 0.3, 
          alphaThree: numOfCodons === 4 ? equalValue : 0.3 
        };
        setGraphOpacity(newOpacity);
      }}>
        Equal Opacity
      </button>
    );

    return buttons;
  };

  return (
    <div className="overlay-container">
      <div className="overlay-controls">
        <h4>Graph Controls</h4>
        <div className="control-group">
          <label>
            <span style={{ color: '#90C67C' }}>Original Graph</span>
            <div className="control-row">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={graphOpacity.original}
                onChange={(e) => handleOpacityChange('original', e.target.value)}
              />
              <button 
                className="bring-front-btn"
                onClick={() => bringToFront('original')}
              >
                Bring to Front
              </button>
            </div>
          </label>
          
          <label>
            <span style={{ color: '#60B5FF' }}>Alpha One Graph</span>
            <div className="control-row">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={graphOpacity.alphaOne}
                onChange={(e) => handleOpacityChange('alphaOne', e.target.value)}
              />
              <button 
                className="bring-front-btn"
                onClick={() => bringToFront('alphaOne')}
              >
                Bring to Front
              </button>
            </div>
          </label>
          
          {numOfCodons >= 3 && (
            <label>
              <span style={{ color: '#E78B48' }}>Alpha Two Graph</span>
              <div className="control-row">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={graphOpacity.alphaTwo}
                  onChange={(e) => handleOpacityChange('alphaTwo', e.target.value)}
                />
                <button 
                  className="bring-front-btn"
                  onClick={() => bringToFront('alphaTwo')}
                >
                  Bring to Front
                </button>
              </div>
            </label>
          )}

          {numOfCodons === 4 && (
            <label>
              <span style={{ color: '#ff69b4' }}>Alpha Three Graph</span>
              <div className="control-row">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={graphOpacity.alphaThree}
                  onChange={(e) => handleOpacityChange('alphaThree', e.target.value)}
                />
                <button 
                  className="bring-front-btn"
                  onClick={() => bringToFront('alphaThree')}
                >
                  Bring to Front
                </button>
              </div>
            </label>
          )}
        </div>
        
        <div className="preset-buttons">
          {generatePresetButtons()}
        </div>
      </div>

      <div className="overlay-graphs">
        <div 
          className="overlay-graph-layer"
          style={{ 
            opacity: graphOpacity.original,
            zIndex: graphZIndex.original 
          }}
        >
          <Graph
            nodes={originalCodons.nodes.map(node => ({
              id: `${node}o_overlay`,
              label: node,
              fill: "#90C67C"
            }))}
            edges={originalCodons.edges.map((edge, index) => ({
              source: `${edge[0]}o_overlay`,
              target: `${edge[1]}o_overlay`,
              id: generateUniqueEdgeId(edge[0], edge[1], 'o_overlay', index),
              label: "",
              color: "#90C67C"
            }))}
            layout={layout}
            selections={selections.filter(sel => sel.includes('o_overlay'))}
            isC3Tab={false}
          />
        </div>

        <div 
          className="overlay-graph-layer"
          style={{ 
            opacity: graphOpacity.alphaOne,
            zIndex: graphZIndex.alphaOne 
          }}
        >
          <Graph
            nodes={alphaOne.nodes.map(node => ({
              id: `${node}a1_overlay`,
              label: node,
              fill: "#60B5FF"
            }))}
            edges={alphaOne.edges.map((edge, index) => ({
              source: `${edge[0]}a1_overlay`,
              target: `${edge[1]}a1_overlay`,
              id: generateUniqueEdgeId(edge[0], edge[1], 'a1_overlay', index),
              label: "",
              color: "#60B5FF"
            }))}
            layout={layout}
            selections={selections.filter(sel => sel.includes('a1_overlay'))}
            isC3Tab={false}
          />
        </div>

        {numOfCodons >= 3 && alphaTwo && (
          <div 
            className="overlay-graph-layer"
            style={{ 
              opacity: graphOpacity.alphaTwo,
              zIndex: graphZIndex.alphaTwo 
            }}
          >
            <Graph
              nodes={alphaTwo.nodes.map(node => ({
                id: `${node}a2_overlay`,
                label: node,
                fill: "#E78B48"
              }))}
              edges={alphaTwo.edges.map((edge, index) => ({
                source: `${edge[0]}a2_overlay`,
                target: `${edge[1]}a2_overlay`,
                id: generateUniqueEdgeId(edge[0], edge[1], 'a2_overlay', index),
                label: "",
                color: "#E78B48"
              }))}
              layout={layout}
              selections={selections.filter(sel => sel.includes('a2_overlay'))}
              isC3Tab={false}
            />
          </div>
        )}

        {numOfCodons === 4 && alphaThree && (
          <div 
            className="overlay-graph-layer"
            style={{ 
              opacity: graphOpacity.alphaThree,
              zIndex: graphZIndex.alphaThree 
            }}
          >
            <Graph
              nodes={alphaThree.nodes.map(node => ({
                id: `${node}a3_overlay`,
                label: node,
                fill: "#ff69b4"
              }))}
              edges={alphaThree.edges.map((edge, index) => ({
                source: `${edge[0]}a3_overlay`,
                target: `${edge[1]}a3_overlay`,
                id: generateUniqueEdgeId(edge[0], edge[1], 'a3_overlay', index),
                label: "",
                color: "#ff69b4"
              }))}
              layout={layout}
              selections={selections.filter(sel => sel.includes('a3_overlay'))}
              isC3Tab={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
