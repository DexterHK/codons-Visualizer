import React from "react";
import "../css/home.css";
import { useTransition } from "react";
import { useNavigate } from "react-router";
import { useStore } from "../store";
import FlowGraph from "../components/graph-v2";
import { API_ENDPOINTS } from "../config/api";
import Helix from "../components/Helix";
import { Dna, ChevronRight } from "lucide-react";

export default function Home() {
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
  const setEigenschaftenAlphaOne = useStore(
    (state) => state.setEigenschaftenAlphaOne,
  );
  const setEigenschaftenAlphaTwo = useStore(
    (state) => state.setEigenschaftenAlphaTwo,
  );
  const setEigenschaftenAlphaThree = useStore(
    (state) => state.setEigenschaftenAlphaThree,
  );
  const setC3 = useStore((state) => state.setC3);

  const [isPending, startTransition] = useTransition();

  const navigate = useNavigate();

  const formatCodonsInGroups = (value, numberOfCodons) => {
    // Return if invalid number of codons
    if (numberOfCodons > 4 || numberOfCodons < 2) return value;

    // Remove any existing spaces
    const cleanValue = value.replace(/\s/g, "");

    // Create regex pattern based on number of codons
    const regex = new RegExp(`.{${numberOfCodons}}`, "g");

    // Match full groups and get remainder
    const matches = cleanValue.match(regex) || [];
    const remainder = cleanValue.slice(matches.join("").length);

    // Combine full groups with spaces and add remainder
    return matches.join(" ") + (remainder ? " " + remainder : "");
  };

  // Update the codon input handler
  const handleCodonInput = (value) => {
    // Filter invalid characters
    const filteredValue = value.toUpperCase().replace(/[^CGTA]/g, "");
    // Format with spaces based on current numOfCodons
    const formattedValue = formatCodonsInGroups(filteredValue, numOfCodons);
    setCodons(formattedValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanCodons = codons.replace(/\s/g, "");

    // Validate input before submission
    if (!/^[CGTA]+$/i.test(cleanCodons)) {
      setError("Only letters C, G, T, and A are allowed.");
      return;
    }

    if (!numOfCodons || numOfCodons < 2 || numOfCodons > 4) {
      setError("Tuple Length must be between 2 and 4.");
      return;
    }

    startTransition(async () => {
      const originalResponse = await fetch(API_ENDPOINTS.GRAPHS.ORIGINAL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codons: cleanCodons, numOfCodons }),
      });

      const alphaOneResponse = await fetch(API_ENDPOINTS.GRAPHS.ALPHA_ONE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codons: cleanCodons, numOfCodons }),
      });

      // Only fetch alphaTwo and alphaThree if numOfCodons >= 3 and 4 respectively
      let alphaTwoResponse = null;
      let alphaThreeResponse = null;
      let eigenschaftenAlphaTwoResponse = null;
      let eigenschaftenAlphaThreeResponse = null;

      if (numOfCodons >= 3) {
        alphaTwoResponse = await fetch(API_ENDPOINTS.GRAPHS.ALPHA_TWO, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ codons: cleanCodons, numOfCodons }),
        });

        eigenschaftenAlphaTwoResponse = await fetch(
          API_ENDPOINTS.PROPERTIES.ALPHA_TWO,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ codons: cleanCodons, numOfCodons }),
          },
        );
      }

      if (numOfCodons === 4) {
        alphaThreeResponse = await fetch(API_ENDPOINTS.GRAPHS.ALPHA_THREE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ codons: cleanCodons, numOfCodons }),
        });

        eigenschaftenAlphaThreeResponse = await fetch(
          API_ENDPOINTS.PROPERTIES.ALPHA_THREE,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ codons: cleanCodons, numOfCodons }),
          },
        );
      }

      const eigenschaftenResponse = await fetch(
        API_ENDPOINTS.PROPERTIES.ORIGINAL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ codons: cleanCodons, numOfCodons }),
        },
      );

      const eigenschaftenAlphaOneResponse = await fetch(
        API_ENDPOINTS.PROPERTIES.ALPHA_ONE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ codons: cleanCodons, numOfCodons }),
        },
      );

      const c3Response = await fetch(API_ENDPOINTS.PROPERTIES.C3, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codons: cleanCodons, numOfCodons }),
      });

      // Check responses based on what was fetched
      if (
        originalResponse.status !== 200 ||
        alphaOneResponse.status !== 200 ||
        (alphaTwoResponse && alphaTwoResponse.status !== 200) ||
        (alphaThreeResponse && alphaThreeResponse.status !== 200) ||
        c3Response.status !== 200
      ) {
        setError(originalResponse.statusText);
        return;
      }

      const originalData = await originalResponse.json();
      const alphaOneData = await alphaOneResponse.json();
      const alphaTwoData = alphaTwoResponse
        ? await alphaTwoResponse.json()
        : { nodes: [], edges: [] };
      const alphaThreeData = alphaThreeResponse
        ? await alphaThreeResponse.json()
        : { nodes: [], edges: [] };
      const eigenschaftenData = await eigenschaftenResponse.json();
      const eigenschaftenAlphaOneData =
        await eigenschaftenAlphaOneResponse.json();
      const eigenschaftenAlphaTwoData = eigenschaftenAlphaTwoResponse
        ? await eigenschaftenAlphaTwoResponse.json()
        : {};
      const eigenschaftenAlphaThreeData = eigenschaftenAlphaThreeResponse
        ? await eigenschaftenAlphaThreeResponse.json()
        : {};
      const c3Data = await c3Response.text(); // C3 response is a string (True/False)

      setOriginalCodons(originalData);
      setAlphaOne(alphaOneData);
      setAlphaTwo(alphaTwoData);
      setAlphaThree(alphaThreeData);
      setEigenschaften(eigenschaftenData);
      setEigenschaftenAlphaOne(eigenschaftenAlphaOneData);
      setEigenschaftenAlphaTwo(eigenschaftenAlphaTwoData);
      setEigenschaftenAlphaThree(eigenschaftenAlphaThreeData);
      setC3(c3Data === "True"); // Update C3 in the store

      navigate({
        pathname: "/codons",
      });
    });
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const filteredContent = content.toUpperCase().replace(/[^CGTA]/g, "");
      setCodons(filteredContent);
    };
    reader.readAsText(file);
  };

  return (
    <main className="home-main home-container">
      <Helix />
      <div className="hero">
        <div className="title-wrapper">
          <Dna size={64} color="#646cff" />
          <h1 className="title">
            Codon<span className="gradient-text">Analysis</span>
          </h1>
        </div>
        <p className="desc">
          Analyze DNA sequences by identifying and translating codons into amino
          acids.
        </p>
      </div>
      <div>
        <button className="visualizer-btn" onClick={() => navigate("/codons")}>
          <span>Start Analysis</span>
          <ChevronRight className="cta-icon" />
        </button>
      </div>

    </main>
  );
}
