import React from "react";
import "../css/graphs-tabs.css";

export default function GraphsTabs({ activeTab, setActiveTab }) {
  return (
    <nav className="tabs">
      <ul>
        <li className={activeTab === 0 ? "active" : ""}>
          <button onClick={() => setActiveTab(0)}>Original Codons</button>
        </li>
        <li className={activeTab === 1 ? "active" : ""}>
          <button onClick={() => setActiveTab(1)}>Alpha One</button>
        </li>
        <li className={activeTab === 2 ? "active" : ""}>
          <button onClick={() => setActiveTab(2)}>Alpha Two</button>
        </li>
        <li className={activeTab === 3 ? "active" : ""}> {/* Add C3 tab */}
          <button onClick={() => setActiveTab(3)}>C3</button>
        </li>
      </ul>
    </nav>
  );
}
