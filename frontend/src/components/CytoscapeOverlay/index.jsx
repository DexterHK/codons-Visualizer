import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import './styles.css';

// Register the layout extension
cytoscape.use(coseBilkent);

export default function CytoscapeOverlay({ 
  originalCodons, 
  alphaOne, 
  alphaTwo, 
  alphaThree,
  numOfCodons 
}) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [graphOpacity, setGraphOpacity] = useState({
    original: 0.8,
    alphaOne: 0.8,
    alphaTwo: 0.8,
    alphaThree: 0.8,
  });

  // Store graph positions to maintain them when switching visibility
  const [graphPositions, setGraphPositions] = useState({
    original: {},
    alphaOne: {},
    alphaTwo: {},
    alphaThree: {},
  });

  const [viewState, setViewState] = useState({
    zoom: 1,
    pan: { x: 0, y: 0 }
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Cytoscape
    const cy = cytoscape({
      container: containerRef.current,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px',
            'font-weight': 'bold',
            'color': '#000',
            'text-outline-width': 2,
            'text-outline-color': '#fff',
            'width': '30px',
            'height': '30px',
            'opacity': 'data(opacity)',
            'z-index': 'data(zIndex)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 'data(opacity)',
            'z-index': 'data(zIndex)'
          }
        },
        {
          selector: '.highlighted',
          style: {
            'border-width': 3,
            'border-color': '#ff0000',
            'border-opacity': 1
          }
        }
      ],
      layout: {
        name: 'cose-bilkent',
        animate: false,
        randomize: false,
        fit: true,
        padding: 50
      },
      wheelSensitivity: 0.2,
      minZoom: 0.1,
      maxZoom: 3
    });

    cyRef.current = cy;

    // Add event listeners for interaction
    cy.on('cxttap', 'node', function(evt) {
      // Right click - change POV (center view on node)
      const node = evt.target;
      cy.center(node);
      cy.fit(node, 100);
    });

    cy.on('tap', 'node', function(evt) {
      // Left click - move node position
      const node = evt.target;
      const graphType = node.data('graphType');
      
      // Store the new position
      setGraphPositions(prev => ({
        ...prev,
        [graphType]: {
          ...prev[graphType],
          [node.id()]: {
            x: node.position('x'),
            y: node.position('y')
          }
        }
      }));
    });

    // Handle viewport changes
    cy.on('viewport', function() {
      setViewState({
        zoom: cy.zoom(),
        pan: cy.pan()
      });
    });

    // Enable node dragging
    cy.nodes().grabify();

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, []);

  // Update graph data when props change (but NOT when opacity changes)
  useEffect(() => {
    if (!cyRef.current) return;

    const cy = cyRef.current;
    cy.elements().remove();

    const elements = [];

    // Add nodes and edges for each graph
    const graphs = [
      { data: originalCodons, type: 'original', color: '#90C67C', opacity: graphOpacity.original },
      { data: alphaOne, type: 'alphaOne', color: '#60B5FF', opacity: graphOpacity.alphaOne },
    ];

    if (numOfCodons >= 3 && alphaTwo) {
      graphs.push({ data: alphaTwo, type: 'alphaTwo', color: '#E78B48', opacity: graphOpacity.alphaTwo });
    }

    if (numOfCodons === 4 && alphaThree) {
      graphs.push({ data: alphaThree, type: 'alphaThree', color: '#ff69b4', opacity: graphOpacity.alphaThree });
    }

    graphs.forEach(({ data, type, color, opacity }) => {
      if (!data || !data.nodes || !data.edges) return;

      // Add nodes
      data.nodes.forEach(node => {
        const nodeId = `${node}_${type}`;
        const savedPosition = graphPositions[type][nodeId];
        
        elements.push({
          data: {
            id: nodeId,
            label: node,
            color: color,
            opacity: opacity,
            graphType: type,
            zIndex: type === 'original' ? 4 : type === 'alphaOne' ? 3 : type === 'alphaTwo' ? 2 : 1
          },
          position: savedPosition || undefined
        });
      });

      // Add edges
      data.edges.forEach((edge, index) => {
        elements.push({
          data: {
            id: `${edge[0]}_${edge[1]}_${type}_${index}`,
            source: `${edge[0]}_${type}`,
            target: `${edge[1]}_${type}`,
            color: color,
            opacity: opacity,
            graphType: type,
            zIndex: type === 'original' ? 4 : type === 'alphaOne' ? 3 : type === 'alphaTwo' ? 2 : 1
          }
        });
      });
    });

    cy.add(elements);

    // Apply layout only if no saved positions exist
    const hasPositions = Object.values(graphPositions).some(positions => Object.keys(positions).length > 0);
    if (!hasPositions) {
      cy.layout({
        name: 'cose-bilkent',
        animate: true,
        animationDuration: 1000,
        fit: true,
        padding: 50
      }).run();
    } else {
      cy.fit();
    }

    // Restore viewport state
    cy.zoom(viewState.zoom);
    cy.pan(viewState.pan);

  }, [originalCodons, alphaOne, alphaTwo, alphaThree, numOfCodons, graphPositions]);

  const handleOpacityChange = (graph, value) => {
    const newOpacity = parseFloat(value);
    setGraphOpacity(prev => ({
      ...prev,
      [graph]: newOpacity
    }));

    // Update opacity in Cytoscape without recreating the graph
    if (cyRef.current) {
      cyRef.current.nodes(`[graphType="${graph}"]`).forEach(node => {
        node.data('opacity', newOpacity);
      });
      cyRef.current.edges(`[graphType="${graph}"]`).forEach(edge => {
        edge.data('opacity', newOpacity);
      });
    }
  };

  const bringToFront = (graph) => {
    if (!cyRef.current) return;

    const maxZ = Math.max(4, 3, 2, 1) + 1;
    cyRef.current.nodes(`[graphType="${graph}"]`).data('zIndex', maxZ);
    cyRef.current.edges(`[graphType="${graph}"]`).data('zIndex', maxZ);
  };

  const resetLayout = () => {
    if (!cyRef.current) return;
    
    setGraphPositions({
      original: {},
      alphaOne: {},
      alphaTwo: {},
      alphaThree: {},
    });

    cyRef.current.layout({
      name: 'cose-bilkent',
      animate: true,
      animationDuration: 1000,
      fit: true,
      padding: 50
    }).run();
  };

  const fitToView = () => {
    if (!cyRef.current) return;
    cyRef.current.fit();
  };

  // Generate preset buttons based on available graphs
  const generatePresetButtons = () => {
    const buttons = [];

    buttons.push(
      <button key="focus-original" onClick={() => {
        const newOpacity = { original: 1, alphaOne: 0.3, alphaTwo: 0.3, alphaThree: 0.3 };
        setGraphOpacity(newOpacity);
        // Update all opacities in Cytoscape
        Object.entries(newOpacity).forEach(([graphType, opacity]) => {
          if (cyRef.current) {
            cyRef.current.nodes(`[graphType="${graphType}"]`).forEach(node => {
              node.data('opacity', opacity);
            });
            cyRef.current.edges(`[graphType="${graphType}"]`).forEach(edge => {
              edge.data('opacity', opacity);
            });
          }
        });
      }}>
        Focus Original
      </button>
    );

    buttons.push(
      <button key="focus-alpha1" onClick={() => {
        const newOpacity = { original: 0.3, alphaOne: 1, alphaTwo: 0.3, alphaThree: 0.3 };
        setGraphOpacity(newOpacity);
        // Update all opacities in Cytoscape
        Object.entries(newOpacity).forEach(([graphType, opacity]) => {
          if (cyRef.current) {
            cyRef.current.nodes(`[graphType="${graphType}"]`).forEach(node => {
              node.data('opacity', opacity);
            });
            cyRef.current.edges(`[graphType="${graphType}"]`).forEach(edge => {
              edge.data('opacity', opacity);
            });
          }
        });
      }}>
        Focus Alpha 1
      </button>
    );

    if (numOfCodons >= 3) {
      buttons.push(
        <button key="focus-alpha2" onClick={() => {
          const newOpacity = { original: 0.3, alphaOne: 0.3, alphaTwo: 1, alphaThree: 0.3 };
          setGraphOpacity(newOpacity);
          // Update all opacities in Cytoscape
          Object.entries(newOpacity).forEach(([graphType, opacity]) => {
            if (cyRef.current) {
              cyRef.current.nodes(`[graphType="${graphType}"]`).forEach(node => {
                node.data('opacity', opacity);
              });
              cyRef.current.edges(`[graphType="${graphType}"]`).forEach(edge => {
                edge.data('opacity', opacity);
              });
            }
          });
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
          // Update all opacities in Cytoscape
          Object.entries(newOpacity).forEach(([graphType, opacity]) => {
            if (cyRef.current) {
              cyRef.current.nodes(`[graphType="${graphType}"]`).forEach(node => {
                node.data('opacity', opacity);
              });
              cyRef.current.edges(`[graphType="${graphType}"]`).forEach(edge => {
                edge.data('opacity', opacity);
              });
            }
          });
        }}>
          Focus Alpha 3
        </button>
      );
    }

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
        // Update all opacities in Cytoscape
        Object.entries(newOpacity).forEach(([graphType, opacity]) => {
          if (cyRef.current) {
            cyRef.current.nodes(`[graphType="${graphType}"]`).forEach(node => {
              node.data('opacity', opacity);
            });
            cyRef.current.edges(`[graphType="${graphType}"]`).forEach(edge => {
              edge.data('opacity', opacity);
            });
          }
        });
      }}>
        Equal Opacity
      </button>
    );

    return buttons;
  };

  return (
    <div className="cytoscape-overlay-container">
      <div className="cytoscape-controls">
        <h4>Cytoscape Graph Controls</h4>
        <div className="control-instructions">
          <p><strong>Left Click:</strong> Drag nodes to reposition</p>
          <p><strong>Right Click:</strong> Center view on node</p>
          <p><strong>Mouse Wheel:</strong> Zoom in/out</p>
        </div>
        
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

        <div className="layout-controls">
          <button onClick={resetLayout}>Reset Layout</button>
          <button onClick={fitToView}>Fit to View</button>
        </div>
      </div>

      <div className="cytoscape-graph-container">
        <div ref={containerRef} className="cytoscape-graph" />
      </div>
    </div>
  );
}
