import React from 'react';
import './styles.css';

const GraphSortingControls = ({ 
  onNodeSortChange, 
  onLayoutOptimize,
  nodeSortType = 'alphabetical',
  isOptimized = false 
}) => {
  const nodeSortOptions = [
    { 
      value: 'alphabetical', 
      label: 'Alphabetical',
      icon: '🔤',
      description: 'Sort nodes alphabetically'
    },
    { 
      value: 'degree', 
      label: 'By Connections',
      icon: '🔗',
      description: 'Sort by number of connections'
    },
    { 
      value: 'cluster', 
      label: 'By Groups',
      icon: '🎯',
      description: 'Group related nodes together'
    },
    { 
      value: 'length', 
      label: 'By Length',
      icon: '📏',
      description: 'Sort by node name length'
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
        <div className="control-section">
          <div className="section-header">
            <span className="section-icon">🔄</span>
            <label className="section-label">Node Sorting</label>
          </div>
          
          <div className="sort-options-grid">
            {nodeSortOptions.map(option => (
              <div 
                key={option.value}
                className={`sort-option ${nodeSortType === option.value ? 'active' : ''}`}
                onClick={() => onNodeSortChange(option.value)}
                title={option.description}
              >
                <span className="option-icon">{option.icon}</span>
                <span className="option-label">{option.label}</span>
                {nodeSortType === option.value && (
                  <span className="active-indicator">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="control-section">
          <div className="section-header">
            <span className="section-icon">✨</span>
            <label className="section-label">Layout Optimization</label>
          </div>
          
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
        </div>
      </div>
    </div>
  );
};

export default GraphSortingControls;
