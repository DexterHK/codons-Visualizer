import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";

import Home from "./routes/home.jsx";
import Codons from "./routes/codons-graph.jsx";
import FlowGraph from "./routes/flow-graph.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="codons" element={<Codons />} />
        <Route path="flow-graph" element={<FlowGraph />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
