import React from "react";
import GraphsTabs from "../../GraphsTabs";
import ThemeToggle from "../../icons/theme-toggle";
import Chevron from "../../icons/chevron";

const GraphHeader = ({ 
  isHeaderCollapsed, 
  setIsHeaderCollapsed, 
  onExport, 
  theme, 
  toggleTheme, 
  activeTab, 
  setActiveTab, 
  numOfCodons,
  showInteractiveControls,
  setShowInteractiveControls
}) => {
  return (
    <div className={`graphs-header ${isHeaderCollapsed ? 'collapsed' : ''}`}>
      {!isHeaderCollapsed && (
        <>
          <div className="header-left-controls">
            <button className="export-button" onClick={onExport}>
              Export
            </button>
            <button 
              className="theme-toggle-button" 
              onClick={toggleTheme} 
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              <ThemeToggle isDark={theme === 'dark'} />
            </button>
            <button 
              className="interactive-controls-button" 
              onClick={() => setShowInteractiveControls(!showInteractiveControls)} 
              title={showInteractiveControls ? 'Hide Interactive Controls' : 'Show Interactive Controls'}
            >
              {showInteractiveControls ? '◀' : '▶'} EDIT
            </button>
          </div>
          <GraphsTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            numOfCodons={numOfCodons} 
          />
        </>
      )}
      <button 
        className="header-collapse-toggle"
        onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
        title={isHeaderCollapsed ? 'Expand header' : 'Collapse header'}
      >
        <Chevron showProperties={!isHeaderCollapsed} />
      </button>
    </div>
  );
};

export default GraphHeader;
