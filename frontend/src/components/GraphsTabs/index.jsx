import React from "react";
import "./styles.css";

export default function GraphsTabs({ activeTab, setActiveTab, numOfCodons }) {
  return (
    <nav className="tabs">
      <ul>
        <li className={activeTab === 0 ? "active" : ""}>
          <button onClick={() => setActiveTab(0)}>Original Codons</button>
        </li>
        <li className={activeTab === 1 ? "active" : ""}>
          <button onClick={() => setActiveTab(1)}>Alpha One</button>
        </li>
        {numOfCodons >= 3 && (
          <li className={activeTab === 2 ? "active" : ""}>
            <button onClick={() => setActiveTab(2)}>Alpha Two</button>
          </li>
        )}
        {numOfCodons === 4 && (
          <li className={activeTab === 3 ? "active" : ""}>
            <button onClick={() => setActiveTab(3)}>Alpha Three</button>
          </li>
        )}
        <li className={activeTab === (numOfCodons === 2 ? 2 : numOfCodons === 3 ? 3 : 4) ? "active" : ""}>
          <button onClick={() => setActiveTab(numOfCodons === 2 ? 2 : numOfCodons === 3 ? 3 : 4)}>C{numOfCodons}</button>
        </li>
        <li className={activeTab === (numOfCodons === 2 ? 3 : numOfCodons === 3 ? 4 : 5) ? "active" : ""}>
          <button onClick={() => setActiveTab(numOfCodons === 2 ? 3 : numOfCodons === 3 ? 4 : 5)}>C-Cytoscape</button>
        </li>
      </ul>
    </nav>
  );
}
