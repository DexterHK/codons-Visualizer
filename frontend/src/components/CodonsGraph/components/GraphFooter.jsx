import React from "react";
import LayoutButtons from "../../LayoutButtons";
import Chevron from "../../icons/chevron";

const GraphFooter = ({ 
  isFooterCollapsed, 
  setIsFooterCollapsed, 
  toggleLongestPath, 
  setLayout, 
  layout 
}) => {
  return (
    <>
      {!isFooterCollapsed && (
        <div className="graphs-footer">
          <LayoutButtons
            toggleLongestPath={toggleLongestPath}
            setLayout={setLayout}
            layout={layout}
          />
        </div>
      )}
      
      <button
        type="button"
        className={`footer-collapse-toggle ${isFooterCollapsed ? 'collapsed' : 'expanded'}`}
        onClick={() => setIsFooterCollapsed((prev) => !prev)}
        title={isFooterCollapsed ? 'Show Layout Controls' : 'Hide Layout Controls'}
      >
        <Chevron showProperties={!isFooterCollapsed} />
      </button>
    </>
  );
};

export default GraphFooter;
