import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./routes/prototype.jsx";
import * as ReactDOMClient from "react-dom/client";

import Home from "./routes/home.jsx";
import Codons from "./routes/codons-graph.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="codons" element={<Codons />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

