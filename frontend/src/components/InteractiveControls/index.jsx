import React, { useState, useTransition } from "react";
import { useStore } from "../../store";
import { API_ENDPOINTS } from "../../config/api";
import "./styles.css";

const InteractiveControls = ({ isDropdown = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isPending, startTransition] = useTransition();
  
  
  // Store state
  const codons = useStore((state) => state.codons);
  const numOfCodons = useStore((state) => state.numOfCodons);
  const setCodons = useStore((state) => state.setCodons);
  const setNumOfCodons = useStore((state) => state.setNumOfCodons);
  const setError = useStore((state) => state.setError);
  const setOriginalCodons = useStore((state) => state.setOriginalCodons);
  const setAlphaOne = useStore((state) => state.setAlphaOne);
  const setAlphaTwo = useStore((state) => state.setAlphaTwo);
  const setAlphaThree = useStore((state) => state.setAlphaThree);
  const setEigenschaften = useStore((state) => state.setEigenschaften);
  const setEigenschaftenAlphaOne = useStore((state) => state.setEigenschaftenAlphaOne);
  const setEigenschaftenAlphaTwo = useStore((state) => state.setEigenschaftenAlphaTwo);
  const setEigenschaftenAlphaThree = useStore((state) => state.setEigenschaftenAlphaThree);
  const setC3 = useStore((state) => state.setC3);

  // Local state for form inputs
  const [localCodons, setLocalCodons] = useState(codons || "");
  const [localNumOfCodons, setLocalNumOfCodons] = useState(numOfCodons || 2);

  // Update local state when store values change
  React.useEffect(() => {
    if (codons !== localCodons) {
      setLocalCodons(codons || "");
    }
  }, [codons]);

  React.useEffect(() => {
    if (numOfCodons !== localNumOfCodons) {
      setLocalNumOfCodons(numOfCodons || 2);
    }
  }, [numOfCodons]);

  const formatCodonsInGroups = (value, numberOfCodons) => {
    if (numberOfCodons > 4 || numberOfCodons < 2) return value;
    const cleanValue = value.replace(/\s/g, "");
    const regex = new RegExp(`.{${numberOfCodons}}`, "g");
    const matches = cleanValue.match(regex) || [];
    const remainder = cleanValue.slice(matches.join("").length);
    return matches.join(" ") + (remainder ? " " + remainder : "");
  };

  const handleCodonInput = (value) => {
    const filteredValue = value.toUpperCase().replace(/[^CGTA]/g, "");
    const formattedValue = formatCodonsInGroups(filteredValue, localNumOfCodons);
    setLocalCodons(formattedValue);
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const filteredContent = content.toUpperCase().replace(/[^CGTA]/g, "");
      const formattedContent = formatCodonsInGroups(filteredContent, localNumOfCodons);
      setLocalCodons(formattedContent);
    };
    reader.readAsText(file);
  };

  const updateGraphData = async () => {
    const cleanCodons = localCodons.replace(/\s/g, "");

    // Validate input
    if (!/^[CGTA]+$/i.test(cleanCodons)) {
      setError("Only letters C, G, T, and A are allowed.");
      return;
    }

    if (!localNumOfCodons || localNumOfCodons < 2 || localNumOfCodons > 4) {
      setError("Number of codons must be between 2 and 4.");
      return;
    }

    startTransition(async () => {
      try {
        // Update store with new values
        setCodons(localCodons);
        setNumOfCodons(localNumOfCodons);

        // Fetch all required data
        const originalResponse = await fetch(API_ENDPOINTS.GRAPHS.ORIGINAL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codons: cleanCodons, numOfCodons: localNumOfCodons }),
        });

        const alphaOneResponse = await fetch(API_ENDPOINTS.GRAPHS.ALPHA_ONE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codons: cleanCodons, numOfCodons: localNumOfCodons }),
        });

        let alphaTwoResponse = null;
        let alphaThreeResponse = null;
        let eigenschaftenAlphaTwoResponse = null;
        let eigenschaftenAlphaThreeResponse = null;

        if (localNumOfCodons >= 3) {
          alphaTwoResponse = await fetch(API_ENDPOINTS.GRAPHS.ALPHA_TWO, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codons: cleanCodons, numOfCodons: localNumOfCodons }),
          });

          eigenschaftenAlphaTwoResponse = await fetch(API_ENDPOINTS.PROPERTIES.ALPHA_TWO, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codons: cleanCodons, numOfCodons: localNumOfCodons }),
          });
        }

        if (localNumOfCodons === 4) {
          alphaThreeResponse = await fetch(API_ENDPOINTS.GRAPHS.ALPHA_THREE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codons: cleanCodons, numOfCodons: localNumOfCodons }),
          });

          eigenschaftenAlphaThreeResponse = await fetch(API_ENDPOINTS.PROPERTIES.ALPHA_THREE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codons: cleanCodons, numOfCodons: localNumOfCodons }),
          });
        }

        const eigenschaftenResponse = await fetch(API_ENDPOINTS.PROPERTIES.ORIGINAL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codons: cleanCodons, numOfCodons: localNumOfCodons }),
        });

        const eigenschaftenAlphaOneResponse = await fetch(API_ENDPOINTS.PROPERTIES.ALPHA_ONE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codons: cleanCodons, numOfCodons: localNumOfCodons }),
        });

        const c3Response = await fetch(API_ENDPOINTS.PROPERTIES.C3, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codons: cleanCodons, numOfCodons: localNumOfCodons }),
        });

        // Check responses
        if (
          originalResponse.status !== 200 ||
          alphaOneResponse.status !== 200 ||
          (alphaTwoResponse && alphaTwoResponse.status !== 200) ||
          (alphaThreeResponse && alphaThreeResponse.status !== 200) ||
          c3Response.status !== 200
        ) {
          setError("Failed to fetch graph data");
          return;
        }

        // Parse responses
        const originalData = await originalResponse.json();
        const alphaOneData = await alphaOneResponse.json();
        const alphaTwoData = alphaTwoResponse ? await alphaTwoResponse.json() : { nodes: [], edges: [] };
        const alphaThreeData = alphaThreeResponse ? await alphaThreeResponse.json() : { nodes: [], edges: [] };
        const eigenschaftenData = await eigenschaftenResponse.json();
        const eigenschaftenAlphaOneData = await eigenschaftenAlphaOneResponse.json();
        const eigenschaftenAlphaTwoData = eigenschaftenAlphaTwoResponse ? await eigenschaftenAlphaTwoResponse.json() : {};
        const eigenschaftenAlphaThreeData = eigenschaftenAlphaThreeResponse ? await eigenschaftenAlphaThreeResponse.json() : {};
        const c3Data = await c3Response.text();

        // Update store
        setOriginalCodons(originalData);
        setAlphaOne(alphaOneData);
        setAlphaTwo(alphaTwoData);
        setAlphaThree(alphaThreeData);
        setEigenschaften(eigenschaftenData);
        setEigenschaftenAlphaOne(eigenschaftenAlphaOneData);
        setEigenschaftenAlphaTwo(eigenschaftenAlphaTwoData);
        setEigenschaftenAlphaThree(eigenschaftenAlphaThreeData);
        setC3(c3Data === "True");

        setError(""); // Clear any previous errors
      } catch (error) {
        console.error("Error updating graph data:", error);
        setError("Failed to update graph data");
      }
    });
  };

  // Auto-update when inputs change (debounced)
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localCodons && localNumOfCodons) {
        updateGraphData();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [localCodons, localNumOfCodons]);

  if (isDropdown) {
    return (
      <div className="interactive-controls-dropdown">
        <div className="controls-panel-dropdown">
          <h3>Interactive Controls</h3>
          
          <div className="input-group">
            <label htmlFor="interactive-codons">Codons</label>
            <input
              id="interactive-codons"
              type="text"
              value={localCodons}
              onChange={(e) => handleCodonInput(e.target.value)}
              placeholder="Only letters C, G, T, and A are allowed"
              disabled={isPending}
            />
          </div>

          <div className="input-group">
            <label htmlFor="interactive-num-codons">Number of Codons</label>
            <input
              id="interactive-num-codons"
              type="number"
              min="2"
              max="4"
              value={localNumOfCodons}
              onChange={(e) => {
                const newValue = parseInt(e.target.value);
                setLocalNumOfCodons(newValue);
                if (localCodons) {
                  const formattedValue = formatCodonsInGroups(localCodons, newValue);
                  setLocalCodons(formattedValue);
                }
              }}
              disabled={isPending}
            />
          </div>

          <div className="input-group">
            <label htmlFor="interactive-file-import">Import File</label>
            <input
              id="interactive-file-import"
              type="file"
              accept=".csv, .txt"
              onChange={handleFileImport}
              disabled={isPending}
            />
          </div>

          {isPending && (
            <div className="loading-indicator">
              Updating graph...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`interactive-controls ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <button 
        className="toggle-button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand Controls" : "Collapse Controls"}
      >
        <div className="button-content">
          <span className="button-arrow">{isCollapsed ? '▶' : '◀'}</span>
          <span className="button-text">{isCollapsed ? 'EDIT' : 'HIDE'}</span>
        </div>
      </button>
      
      {!isCollapsed && (
        <div className="controls-panel">
          <h3>Interactive Controls</h3>
          
          <div className="input-group">
            <label htmlFor="interactive-codons">Codons</label>
            <input
              id="interactive-codons"
              type="text"
              value={localCodons}
              onChange={(e) => handleCodonInput(e.target.value)}
              placeholder="Only letters C, G, T, and A are allowed"
              disabled={isPending}
            />
          </div>

          <div className="input-group">
            <label htmlFor="interactive-num-codons">Number of Codons</label>
            <input
              id="interactive-num-codons"
              type="number"
              min="2"
              max="4"
              value={localNumOfCodons}
              onChange={(e) => {
                const newValue = parseInt(e.target.value);
                setLocalNumOfCodons(newValue);
                if (localCodons) {
                  const formattedValue = formatCodonsInGroups(localCodons, newValue);
                  setLocalCodons(formattedValue);
                }
              }}
              disabled={isPending}
            />
          </div>

          <div className="input-group">
            <label htmlFor="interactive-file-import">Import File</label>
            <input
              id="interactive-file-import"
              type="file"
              accept=".csv, .txt"
              onChange={handleFileImport}
              disabled={isPending}
            />
          </div>

          {isPending && (
            <div className="loading-indicator">
              Updating graph...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveControls;
