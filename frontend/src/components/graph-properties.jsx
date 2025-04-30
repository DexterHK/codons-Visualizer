import React from "react";

import "../css/graph-properties.css";
import Check from "./icons/check";
import Chevron from "./icons/chevron";
import Unchecked from "./icons/unchecked";

export default function GraphProperties({
  showProperties,
  setShowProperites,
  eigenschaften,
  eigenschaftenAlphaOne,
  eigenschaftenAlphaTwo,
  c3, // Add c3 as a prop
}) {
  return (
    <>
      <aside className={`widgets-wrapper ${showProperties && "dropped"}`}>
        <div>
          <h2>Eigenschaften:</h2>
          <div className="properties">
            {Object.keys(eigenschaften).map((key) => (
              <p
                key={key}
                className={`property ${eigenschaften[key] && "check"}`}
              >
                <span>{key}</span>
                {eigenschaften[key] ? <Check /> : <Unchecked />}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h2>Eigenschaften Alpha one:</h2>
          <div className="properties">
            {Object.keys(eigenschaftenAlphaOne).map((key) => (
              <p
                key={key}
                className={`property ${eigenschaftenAlphaOne[key] && "check"}`}
              >
                <span>{key}</span>
                {eigenschaftenAlphaOne[key] ? <Check /> : <Unchecked />}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h2>Eigenschaften Alpha Two:</h2>
          <div className="properties">
            {Object.keys(eigenschaftenAlphaTwo).map((key) => (
              <p
                key={key}
                className={`property ${eigenschaftenAlphaTwo[key] && "check"}`}
              >
                <span>{key}</span>
                {eigenschaftenAlphaTwo[key] ? <Check /> : <Unchecked />}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h2>C3:</h2>
          <div className="properties">
            <p className={`property ${c3 && "check"}`}>
              <span>C3</span>
              {c3 ? <Check /> : <Unchecked />}
            </p>
          </div>
        </div>
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
