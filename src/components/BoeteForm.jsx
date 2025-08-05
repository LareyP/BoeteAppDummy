import React, { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";

export function BoeteForm({ users, onAdd, onCancel }) {
  const [speler, setSpeler] = useState(users[0]?.username || "");
  const [bedrag, setBedrag] = useState("");
  const [reden, setReden] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!speler || !bedrag || !reden) {
      return alert("Vul alle velden in.");
    }

    const nieuweBoete = {
      id: Date.now(),
      speler,
      bedrag: parseFloat(bedrag),
      reden,
      betaald: false,
      datum: new Date().toISOString().split("T")[0],
    };

    onAdd(nieuweBoete);

    // Reset formulier
    setBedrag("");
    setReden("");
    setSpeler(users[0]?.username || "");
  };

  return (
    <Card>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Speler</label>
          <select
            className="w-full p-3 rounded-xl border border-gray-300 bg-white shadow-sm"
            value={speler}
            onChange={(e) => setSpeler(e.target.value)}
          >
            {users.map((u) => (
              <option key={u.id} value={u.username}>
                {u.name} ({u.username})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Bedrag (€)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Bijv. 5.00"
            className="w-full p-3 rounded-xl border border-gray-300 bg-white shadow-sm"
            value={bedrag}
            onChange={(e) => setBedrag(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Reden</label>
          <input
            type="text"
            placeholder="Bijv. Te laat"
            className="w-full p-3 rounded-xl border border-gray-300 bg-white shadow-sm"
            value={reden}
            onChange={(e) => setReden(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit">Toevoegen</Button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full p-3 border border-gray-300 rounded-xl bg-white shadow-sm"
          >
            Annuleer
          </button>
        </div>
      </form>
    </Card>
  );
}
