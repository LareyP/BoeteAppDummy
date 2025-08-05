import React, { useEffect, useState } from "react";
import { boetes as allBoetes } from "../data/boetes";
import { tikkie } from "../data/tikkie"; // import dummy Tikkie link

export default function Boetes({ currentUser }) {
  const [filter, setFilter] = useState("alle");
  const [tikkieLink, setTikkieLink] = useState("");

  if (!currentUser) return null;

  useEffect(() => {
    // Simuleer async ophalen van de Tikkie-link (zoals fetch)
    setTimeout(() => {
      setTikkieLink(tikkie.link);
    }, 200); // nepvertraging
  }, []);

  const mijnBoetes = allBoetes.filter(
    (b) => b.speler === currentUser.name // of .name afhankelijk van je login
  );

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const gefilterdeBoetes = mijnBoetes.filter((b) => {
    if (filter === "open") return !b.betaald;
    if (filter === "betaald") return b.betaald;
    return true;
  });


  return (
    <div className="space-y-4 pt-4 px-4">
      <div className="rounded-xl p-4 bg-white/10 backdrop-blur border border-white/20">
        <h2 className="font-semibold text-lg">
          Boetes van{" "}
          <span className="text-blue-400">{currentUser.name}</span>
        </h2>
      </div>

      {/* Filter tabs */}
      <div className="flex justify-around mb-2">
        {["alle", "open", "betaald"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === f
                ? {
                    alle: "bg-blue-600 text-white",
                    open: "bg-red-600 text-white",
                    betaald: "bg-green-600 text-white",
                  }[f]
                : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            }`}
          >
            {
              {
                alle: "📋 Alle",
                open: "🔴 Open",
                betaald: "🟢 Betaald",
              }[f]
            }
          </button>
        ))}
      </div>

      {/* Boetes lijst */}
      {gefilterdeBoetes.length === 0 ? (
        <p className="text-center text-gray-400">Geen boetes gevonden.</p>
      ) : (
        gefilterdeBoetes
          .sort((a, b) => {
            if (a.betaald === b.betaald) {
              return new Date(b.datum) - new Date(a.datum);
            }
            return a.betaald ? 1 : -1;
          })
          .map((b) => (
            <div
              key={b.id}
              className="rounded-xl p-4 bg-white/10 backdrop-blur border border-white/20"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold">
                    €{Number(b.bedrag).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {b.reden} — {formatDate(b.datum)}
                  </p>
                </div>

                {b.betaald ? (
                  <span className="text-green-500 text-sm font-semibold">
                    ✔️ Betaald
                  </span>
                ) : (
                  <button
                    onClick={() => window.open(tikkieLink, "_blank")}
                    className="text-blue-400 hover:text-blue-500 text-sm font-semibold"
                  >
                    Betaal
                  </button>
                )}
              </div>
            </div>
          ))
      )}
    </div>
  );
}
