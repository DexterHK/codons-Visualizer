import React, { useState } from "react";
import "../css/home.css";
import { useTransition } from "react";
import { useNavigate } from "react-router";
import { useStore } from "../store";

export default function Home() {
  const codons = useStore((state) => state.codons);
  const numOfCodons = useStore((state) => state.numOfCodons);

  const setCodons = useStore((state) => state.setCodons);
  const setNumOfCodons = useStore((state) => state.setNumOfCodons);
  const setError = useStore((state) => state.setError);
  const setOriginalCodons = useStore((state) => state.setOriginalCodons);
  const setAlphaOne = useStore((state) => state.setAlphaOne);
  const setAlphaTwo = useStore((state) => state.setAlphaTwo);
  const setEigenschaften = useStore((state) => state.setEigenschaften);
  const setEigenschaftenAlphaOne = useStore((state) => state.setEigenschaftenAlphaOne);
  const setEigenschaftenAlphaTwo = useStore((state) => state.setEigenschaftenAlphaTwo);
  const setC3 = useStore((state) => state.setC3);


  const [isPending, startTransition] = useTransition();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    startTransition(async () => {
      const originalResponse = await fetch(
        "http://localhost:5000/codons-list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ codons, numOfCodons }),
        },
      );

      const alphaOneResponse = await fetch(
        "http://localhost:5000/codons-list-alpha-one",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ codons, numOfCodons }),
        },
      );

      const alphaTwoResponse = await fetch(
        "http://localhost:5000/codons-list-alpha-two",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ codons, numOfCodons }),
        },
      );

      const eigenschaftenResponse = await fetch(
        "http://localhost:5000/eigenschaften",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ codons, numOfCodons }),
        },
      );
      
      const eigenschaftenAlphaOneResponse = await fetch(
        "http://localhost:5000/eigenschaften-alpha-one",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ codons, numOfCodons }),
        },
      );

      const eigenschaftenAlphaTwoResponse = await fetch(
        "http://localhost:5000/eigenschaften-alpha-two",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ codons, numOfCodons }),
        },
      );

      const c3Response = await fetch(
        "http://localhost:5000/eigenschaften-c3",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ codons, numOfCodons }),
        },
      );

      if (
        originalResponse.status !== 201 ||
        alphaOneResponse.status !== 201 ||
        alphaTwoResponse.status !== 201 ||
        c3Response.status !== 201
      ) {
        setError(originalResponse.statusText);
        return;
      }

      const originalData = await originalResponse.json();
      const alphaOneData = await alphaOneResponse.json();
      const alphaTwoData = await alphaTwoResponse.json();
      const eigenschaftenData = await eigenschaftenResponse.json();
      const eigenschaftenAlphaOneData = await eigenschaftenAlphaOneResponse.json();
      const eigenschaftenAlphaTwoData = await eigenschaftenAlphaTwoResponse.json();
      const c3Data = await c3Response.text(); // C3 response is a string (True/False)

      setOriginalCodons(originalData);
      setAlphaOne(alphaOneData);
      setAlphaTwo(alphaTwoData);
      setEigenschaften(eigenschaftenData);
      setEigenschaftenAlphaOne(eigenschaftenAlphaOneData)
      setEigenschaftenAlphaTwo(eigenschaftenAlphaTwoData)
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
      const filteredContent = content
        .toUpperCase()
        .replace(/[^GCAT]/g, ""); // Keep only G, C, A, T
      setCodons(filteredContent); // Populate the "Codons" field
    };
    reader.readAsText(file);
  };

  return (
    <main>
      <h1 className="title">Codons Analysis</h1>
      <form className="codons-form" onSubmit={handleSubmit}>
        <h2 className="subtitle">User Input</h2>
        <div className="input-wrapper">
          <label htmlFor="codons">Codons</label>
          <input
            id="codons"
            type="text"
            value={codons}
            onChange={(e) => setCodons(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="num-of-codons">Number of Codons</label>
          <input
            id="num-of-codons"
            type="number"
            onChange={(e) => setNumOfCodons(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="file-import">Import CSV or TXT</label>
          <input
            id="file-import"
            type="file"
            accept=".csv, .txt" // Accept both CSV and TXT files
            onChange={handleFileImport}
          />
        </div>

        <button className="submit-button" type="submit" disabled={isPending}>
          Submit
        </button>
      </form>
    </main>
  );
}
