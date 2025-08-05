// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { tikkie as dummyTikkie } from "../data/tikkie"; // optioneel bestand

export default function Home({ currentUser, boetes }) {
  const [tikkieLink, setTikkieLink] = useState("");

  useEffect(() => {
    const storedTikkie = localStorage.getItem("tikkieLink");
    setTikkieLink(storedTikkie || dummyTikkie || "");
  }, []);

  if (!currentUser) {
    return (
      <div className="text-center text-sm text-gray-400">Niet ingelogd</div>
    );
  }

  const isAdmin = Array.isArray(currentUser.role)
    ? currentUser.role.includes("admin")
    : currentUser.role === "admin";

    const boetesVoorGebruiker = boetes.filter(
      (b) =>
        (b.speler === currentUser.name || b.speler === currentUser.username) &&
        !b.betaald
    );

  const totaalBedrag = boetesVoorGebruiker.reduce(
    (sum, b) => sum + parseFloat(b.bedrag || 0),
    0
  );

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleRefresh = () => {
    const storedBoetes = localStorage.getItem("boetes");
    storedBoetes(storedBoetes ? JSON.parse(storedBoetes) : []);
  };

  return (
    
    <div className="space-y-4">
      <Card>
        <h2 className="text-lg font-semibold mb-2 text-white">
          Welkom, <span className="text-blue-400">{currentUser.name}</span>
        </h2>
        {!isAdmin && (
          <div className="space-y-1 text-sm text-gray-300">
            <p>Aantal boetes: {boetesVoorGebruiker.length}</p>
            <p>
              Totaal openstaand bedrag:{" "}
              <strong className="text-white">€{totaalBedrag.toFixed(2)}</strong>
            </p>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-md font-semibold mb-2 text-white">
          Laatste boetes
        </h2>
        {boetesVoorGebruiker.length === 0 ? (
          <p className="text-sm text-gray-400">Je hebt nog geen boetes 🎉</p>
        ) : (
          <ul className="space-y-3">
            {boetesVoorGebruiker
              .slice(-5)
              .reverse()
              .map((b) => (
                <li
                  key={b.id}
                  className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-xl shadow-inner space-y-2"
                >
                  <div className="text-sm text-gray-300">
                    <strong className="text-2xl text-white">€{b.bedrag}</strong>
                    <p>
                      Reden:
                      <strong className="text-white"> {b.reden}</strong>
                    </p>
                    <p>
                      Datum:
                      <strong className="text-white">
                        {" "}
                        {formatDate(b.datum)}
                      </strong>
                    </p>
                  </div>
                  <Button
                    className="text-sm px-3 py-1 bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => {
                      if (tikkieLink) {
                        window.open(tikkieLink, "_blank");
                      } else {
                        alert("Er is nog geen Tikkie-link ingesteld.");
                      }
                    }}
                  >
                    Betaal nu
                  </Button>
                </li>
              ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
