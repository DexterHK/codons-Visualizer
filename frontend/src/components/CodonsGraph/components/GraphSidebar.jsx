import React from "react";
import GraphSortingControls from "../../GraphSortingControls";
import GraphProperties from "../../GraphProperties";
import Chevron from "../../icons/chevron";

const GraphSidebar = ({
  showOrganizationControls,
  setShowOrganizationControls,
  nodeSortType,
  setNodeSortType,
  enableOptimization,
  setEnableOptimization,
  currentLayout,
  setCurrentLayout,
  showProperties,
  setShowProperites,
  eigenschaften,
  eigenschaftenAlphaOne,
  eigenschaftenAlphaTwo,
  eigenschaftenAlphaThree,
  c3,
  numOfCodons,
  activeTab,
  toggleLongestPath,
}) => {
  const handleLayoutChange = (layoutType) => {
    if (setCurrentLayout) {
      setCurrentLayout(layoutType);
    }
  };

  return (
    <>
      <div
        className={`organization-controls-sidebar ${showOrganizationControls ? "dropped" : ""}`}
      >
        <GraphSortingControls
          onNodeSortChange={setNodeSortType}
          onLayoutOptimize={() => setEnableOptimization(!enableOptimization)}
          onLayoutChange={handleLayoutChange}
          nodeSortType={nodeSortType}
          isOptimized={enableOptimization}
          currentLayout={currentLayout || 'force'}
          toggleLongestPath={toggleLongestPath}
        />
      </div>

      <button
        type="button"
        className="organization-controls-trigger"
        onClick={() => setShowOrganizationControls((prev) => !prev)}
      >
        <span>Organization Controls</span>
        <Chevron showProperties={showOrganizationControls} />
      </button>

      <GraphProperties
        showProperties={showProperties}
        setShowProperites={setShowProperites}
        eigenschaften={eigenschaften}
        eigenschaftenAlphaOne={eigenschaftenAlphaOne}
        eigenschaftenAlphaTwo={eigenschaftenAlphaTwo}
        eigenschaftenAlphaThree={eigenschaftenAlphaThree}
        c3={c3}
        numOfCodons={numOfCodons}
        activeTab={activeTab}
      />
    </>
  );
};

export default GraphSidebar;
