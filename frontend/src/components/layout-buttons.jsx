import React from "react";

import "../css/layout-buttons.css";
import ForceDirected from "./icons/force-directed";
import Circular from "./icons/circular";

export default function LayoutButtons({ setLayout, layout }) {
  return (
    <div className="layout-buttons">
      <button
        type="button"
        className={`circular2d ${layout === "circular2d" && "active"}`}
        onClick={() => setLayout("circular2d")}
      >
        <span>Circular</span>
        <Circular />
      </button>

      <button
        type="button"
        className={`forceDirected2d ${layout === "forceDirected2d" && "active"}`}
        onClick={() => setLayout("forceDirected2d")}
      >
        <span>Force Directed</span>
        <ForceDirected />
      </button>
    </div>
  );
}
