import React from "react";

export default function Leaderboard({ boetes }) {
  const leaderboard = boetes.reduce((acc, b) => {
    acc[b.speler] = (acc[b.speler] || 0) + Number(b.bedrag);
    return acc;
  }, {});

  const sorted = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]);

  const medaille = (i) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return `#${i + 1}`;
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-xl shadow-inner">
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2">🏆 Klassement</h2>
      {sorted.length === 0 ? (
        <p className="text-gray-400 text-sm">Nog geen boetes geregistreerd.</p>
      ) : (
        sorted.map(([speler, totaal], i) => (
          <div
            key={speler}
            className={`flex justify-between items-center p-3 rounded-xl border backdrop-blur ${
              i === 0
                ? "bg-yellow-400/10 border-yellow-400/30"
                : i === 1
                ? "bg-gray-400/10 border-gray-400/30"
                : i === 2
                ? "bg-orange-400/10 border-orange-400/30"
                : "bg-white/10 border-white/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{medaille(i)}</span>
              <span className="font-medium">{speler}</span>
            </div>
            <span className="font-semibold text-right">
              €{totaal.toFixed(2)}
            </span>
          </div>
        ))
      )}
    </div>
    </div>
  );
}
