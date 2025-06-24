import React from "react";

import "./styles.css";
import ForceDirected from "../icons/force-directed";
import Circular from "../icons/circular";
import { Columns } from "../icons/columns";

export default function LayoutButtons({ setLayout, layout, toggleLongestPath }) {
  return (
    <div className="layout-buttons">
      <button
        type="button"
        className={`circular ${layout === "circular" && "active"}`}
        onClick={() => setLayout("circular")}
      >
        <span>Circular</span>
        <Circular />
      </button>

      <button
        type="button"
        className={`force ${layout === "force" && "active"}`}
        onClick={() => setLayout("force")}
      >
        <span>Force Directed</span>
        <ForceDirected />
      </button>

      <button
        type="button"
        className={`columns ${layout === "columns" && "active"}`}
        onClick={() => setLayout("columns")}
      >
        <span>Columns</span>
        <Columns />
      </button>
      <button
        type="button"
        className={`longestPath ${layout === "longestPath" && "active"}`}
        onClick={toggleLongestPath}
      >
        <span>Longest Path</span>
      </button>
    </div>
  );
}
