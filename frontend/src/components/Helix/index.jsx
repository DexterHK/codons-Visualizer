import React from "react";
import "./helix.css";

const Helix = () => {
  return (
    <div className="dna-container">
      <div className="dna-helix">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="dna-segment"
            style={{ "--segment": i }}
          >
            <div className="base-pair">
              <div className="base base-left"></div>
              <div className="connector"></div>
              <div className="base base-right"></div>
            </div>
            <div className="backbone backbone-left"></div>
            <div className="backbone backbone-right"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Helix;
