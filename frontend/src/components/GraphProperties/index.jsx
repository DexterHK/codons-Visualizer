import React from "react";

import "./styles.css";
import Check from "../icons/check";
import Chevron from "../icons/chevron";
import Unchecked from "../icons/unchecked";

export default function GraphProperties({
  showProperties,
  setShowProperites,
  eigenschaften,
  eigenschaftenAlphaOne,
  eigenschaftenAlphaTwo,
  eigenschaftenAlphaThree,
  c3,
  numOfCodons,
  activeTab,
}) {
  // Get the C3 tab index based on numOfCodons
  const getC3TabIndex = () => {
    if (numOfCodons === 2) return 2;
    if (numOfCodons === 3) return 3;
    if (numOfCodons === 4) return 4;
    return 3; // fallback
  };

  const c3TabIndex = getC3TabIndex();

  // Function to render properties section
  const renderPropertiesSection = (title, properties) => {
    if (!properties || Object.keys(properties).length === 0) {
      return null;
    }

    return (
      <div>
        <h2>{title}</h2>
        <div className="properties">
          {Object.keys(properties).map((key) => (
            <p
              key={key}
              className={`property ${properties[key] && "check"}`}
            >
              <span>{key}</span>
              {properties[key] ? <Check /> : <Unchecked />}
            </p>
          ))}
        </div>
      </div>
    );
  };


  return (
    <>
      <aside className={`widgets-wrapper ${showProperties && "dropped"}`}>
        {/* Show properties based on active tab */}
        {activeTab === 0 && renderPropertiesSection("Eigenschaften:", eigenschaften)}
        
        {activeTab === 1 && renderPropertiesSection("Eigenschaften Alpha One:", eigenschaftenAlphaOne)}
        
        {activeTab === 2 && numOfCodons >= 3 && renderPropertiesSection("Eigenschaften Alpha Two:", eigenschaftenAlphaTwo)}
        
        {activeTab === 3 && numOfCodons === 4 && renderPropertiesSection("Eigenschaften Alpha Three:", eigenschaftenAlphaThree)}
        
        {/* For C3 tab, show all properties */}
        {activeTab === c3TabIndex && (
          <>
            {renderPropertiesSection("Eigenschaften:", eigenschaften)}
            {renderPropertiesSection("Eigenschaften Alpha One:", eigenschaftenAlphaOne)}
            {numOfCodons >= 3 && renderPropertiesSection("Eigenschaften Alpha Two:", eigenschaftenAlphaTwo)}
            {numOfCodons === 4 && renderPropertiesSection("Eigenschaften Alpha Three:", eigenschaftenAlphaThree)}
          </>
        )}

      </aside>
      <button
        type="button"
        className="dropdown-trigger"
        onClick={() => setShowProperites((prev) => !prev)}
      >
        Show Properties
        <Chevron showProperties={showProperties} />
      </button>
    </>
  );
}
