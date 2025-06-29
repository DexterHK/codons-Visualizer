import React, { useState } from 'react';
import './styles.css';

const GraphSortingControls = ({ 
  onNodeSortChange, 
  onLayoutOptimize,
  onLayoutChange,
  nodeSortType = 'alphabetical',
  isOptimized = false,
  currentLayout = 'force',
  toggleLongestPath,
  calculateShortestPath,
  shortestPathSource,
  setShortestPathSource,
  shortestPathTarget,
  setShortestPathTarget
}) => {
  const [expandedSections, setExpandedSections] = useState({
    layoutAlgorithms: true,
    advancedLayouts: false,
    pathFinding: true,
    optimization: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const basicLayoutOptions = [
    {
      value: 'force',
      label: 'Force Directed',
      icon: '🌐',
      description: 'Physics-based force simulation layout'
    },
    {
      value: 'circular',
      label: 'Circular',
      icon: '⭕',
      description: 'Arrange nodes in a circle'
    },
    {
      value: 'grid',
      label: 'Grid',
      icon: '⚏',
      description: 'Arrange nodes in a grid pattern'
    },
    {
      value: 'columns',
      label: 'Columns',
      icon: '📊',
      description: 'Arrange nodes in columns'
    }
  ];

  const advancedLayoutOptions = [
    {
      value: 'dagre-tb',
      label: 'Hierarchical (Top-Bottom)',
      icon: '⬇️',
      description: 'Dagre hierarchical layout, top to bottom'
    },
    {
      value: 'dagre-lr',
      label: 'Hierarchical (Left-Right)',
      icon: '➡️',
      description: 'Dagre hierarchical layout, left to right'
    },
    {
      value: 'dagre-bt',
      label: 'Hierarchical (Bottom-Top)',
      icon: '⬆️',
      description: 'Dagre hierarchical layout, bottom to top'
    },
    {
      value: 'dagre-rl',
      label: 'Hierarchical (Right-Left)',
      icon: '⬅️',
      description: 'Dagre hierarchical layout, right to left'
    },
    {
      value: 'd3-tree',
      label: 'Tree Layout',
      icon: '🌳',
      description: 'D3 tree layout for hierarchical data'
    },
    {
      value: 'd3-cluster',
      label: 'Cluster Layout',
      icon: '🌿',
      description: 'D3 cluster layout (dendrogram)'
    },
    {
      value: 'elk-layered',
      label: 'ELK Layered',
      icon: '📚',
      description: 'ELK layered algorithm for directed graphs'
    },
    {
      value: 'elk-force',
      label: 'ELK Force',
      icon: '⚡',
      description: 'ELK force-directed algorithm'
    },
    {
      value: 'elk-radial',
      label: 'ELK Radial',
      icon: '🎯',
      description: 'ELK radial layout algorithm'
    },
    {
      value: 'elk-stress',
      label: 'ELK Stress',
      icon: '💪',
      description: 'ELK stress minimization algorithm'
    }
  ];


  return (
    <div className="graph-sorting-controls">
      <div className="controls-header">
        <div className="header-icon">⚙️</div>
        <h4 className="controls-title">Organization Controls</h4>
        <div className="header-decoration"></div>
      </div>
      
      <div className="controls-content">
        {/* Basic Layout Algorithms Section */}
        <div className="control-section">
          <div 
            className="section-header clickable"
            onClick={() => toggleSection('layoutAlgorithms')}
          >
            <span className="section-icon">🎨</span>
            <label className="section-label">Basic Layouts</label>
            <span className={`chevron ${expandedSections.layoutAlgorithms ? 'expanded' : ''}`}>▼</span>
          </div>
          
          {expandedSections.layoutAlgorithms && (
            <div className="layout-options-grid">
              {basicLayoutOptions.map(option => (
                <div 
                  key={option.value}
                  className={`layout-option ${currentLayout === option.value ? 'active' : ''} ${option.isAction ? 'action-option' : ''}`}
                  onClick={() => {
                    if (option.isAction && option.value === 'longest-path') {
                      toggleLongestPath && toggleLongestPath();
                    } else {
                      onLayoutChange && onLayoutChange(option.value);
                    }
                  }}
                  title={option.description}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                  {currentLayout === option.value && !option.isAction && (
                    <span className="active-indicator">✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Advanced Layout Algorithms Section */}
        <div className="control-section">
          <div 
            className="section-header clickable"
            onClick={() => toggleSection('advancedLayouts')}
          >
            <span className="section-icon">🧠</span>
            <label className="section-label">Advanced Layouts</label>
            <span className={`chevron ${expandedSections.advancedLayouts ? 'expanded' : ''}`}>▼</span>
          </div>
          
          {expandedSections.advancedLayouts && (
            <div className="layout-options-grid advanced">
              {advancedLayoutOptions.map(option => (
                <div 
                  key={option.value}
                  className={`layout-option ${currentLayout === option.value ? 'active' : ''}`}
                  onClick={() => onLayoutChange && onLayoutChange(option.value)}
                  title={option.description}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                  {currentLayout === option.value && (
                    <span className="active-indicator">✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Path Finding Section */}
        {(calculateShortestPath || toggleLongestPath) && (
          <div className="control-section">
            <div 
              className="section-header clickable"
              onClick={() => toggleSection('pathFinding')}
            >
              <span className="section-icon">🗺️</span>
              <label className="section-label">Path Finding</label>
              <span className={`chevron ${expandedSections.pathFinding ? 'expanded' : ''}`}>▼</span>
            </div>
            
            {expandedSections.pathFinding && (
              <div className="path-finding-controls">
                {/* Shortest Path Controls */}
                {calculateShortestPath && (
                  <div className="shortest-path-section">
                    <div className="path-section-title">
                      <span className="path-icon">🎯</span>
                      <span className="path-label">Shortest Path</span>
                    </div>
                    
                    <div className="path-inputs">
                      <div className="input-group">
                        <label className="input-label">Source Node:</label>
                        <input
                          type="text"
                          className="path-input"
                          placeholder="e.g., TG"
                          value={shortestPathSource || ''}
                          onChange={(e) => setShortestPathSource && setShortestPathSource(e.target.value)}
                        />
                      </div>
                      
                      <div className="input-group">
                        <label className="input-label">Target Node:</label>
                        <input
                          type="text"
                          className="path-input"
                          placeholder="e.g., AA"
                          value={shortestPathTarget || ''}
                          onChange={(e) => setShortestPathTarget && setShortestPathTarget(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <button 
                      className="path-calculate-btn"
                      onClick={calculateShortestPath}
                      title="Calculate and highlight the shortest path between source and target nodes"
                    >
                      <span className="btn-icon">🔍</span>
                      <span className="btn-text">Find Shortest Path</span>
                    </button>
                  </div>
                )}
                
                {/* Longest Path Controls */}
                {toggleLongestPath && (
                  <div className="longest-path-section">
                    <div className="path-section-title">
                      <span className="path-icon">🛤️</span>
                      <span className="path-label">Longest Path</span>
                    </div>
                    
                    <button 
                      className="path-calculate-btn longest-path-btn"
                      onClick={toggleLongestPath}
                      title="Toggle longest path highlighting"
                    >
                      <span className="btn-icon">🛤️</span>
                      <span className="btn-text">Toggle Longest Path</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Layout Optimization Section */}
        <div className="control-section">
          <div 
            className="section-header clickable"
            onClick={() => toggleSection('optimization')}
          >
            <span className="section-icon">✨</span>
            <label className="section-label">Layout Optimization</label>
            <span className={`chevron ${expandedSections.optimization ? 'expanded' : ''}`}>▼</span>
          </div>
          
          {expandedSections.optimization && (
            <div className="optimization-controls">
              <button 
                onClick={onLayoutOptimize}
                className={`optimize-button ${isOptimized ? 'optimized' : ''}`}
                title="Optimize layout parameters based on graph characteristics"
              >
                <span className="button-icon">
                  {isOptimized ? '✅' : '🎯'}
                </span>
                <span className="button-text">
                  {isOptimized ? 'Layout Optimized' : 'Optimize Layout'}
                </span>
                {isOptimized && (
                  <span className="success-pulse"></span>
                )}
              </button>
              
              <div className="quick-actions">
                <button 
                  className="quick-action-btn"
                  onClick={() => onLayoutChange && onLayoutChange('auto-fit')}
                  title="Auto-fit layout to viewport"
                >
                  <span className="btn-icon">🎯</span>
                  <span className="btn-text">Auto Fit</span>
                </button>
                
                <button 
                  className="quick-action-btn"
                  onClick={() => onLayoutChange && onLayoutChange('center')}
                  title="Center the graph"
                >
                  <span className="btn-icon">🎪</span>
                  <span className="btn-text">Center</span>
                </button>
                
                <button 
                  className="quick-action-btn"
                  onClick={() => onLayoutChange && onLayoutChange('reset')}
                  title="Reset to default layout"
                >
                  <span className="btn-icon">🔄</span>
                  <span className="btn-text">Reset</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphSortingControls;
