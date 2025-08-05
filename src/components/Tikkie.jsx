import React, { useState, useEffect } from "react";

export default function Admin({ currentUser, users, boetes, fetchBoetes, setUsers }) {
  const [speler, setSpeler] = useState("");
  const [bedrag, setBedrag] = useState("");
  const [reden, setReden] = useState("");
  const [feedback, setFeedback] = useState("");
  const [templates, setTemplates] = useState([]);
  const [nieuweReden, setNieuweReden] = useState("");
  const [nieuwBedrag, setNieuwBedrag] = useState("");

  useEffect(() => {
    fetchTemplates();
    fetchUsers();
  }, []);

  const fetchTemplates = () => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then(setTemplates)
      .catch((err) => console.error("Fout bij ophalen templates:", err));
  };

  const fetchUsers = () => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error("Fout bij ophalen users:", err));
  };

  const spelers = users.filter((u) => u.role === "speler");
  const nietGoedgekeurd = users.filter((u) => u.role === "speler" && !u.goedgekeurd);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");

    if (!speler || !bedrag || !reden) {
      setFeedback("Vul alle velden in.");
      return;
    }

    try {
      const res = await fetch("/api/boetes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speler, bedrag, reden }),
      });

      if (!res.ok) throw new Error("Fout bij toevoegen");

      setFeedback("✅ Boete toegevoegd!");
      setSpeler("");
      setBedrag("");
      setReden("");
      fetchBoetes();
    } catch (err) {
      console.error(err);
      setFeedback("❌ Toevoegen mislukt");
    }
  };

  const handleTemplateAdd = async () => {
    if (!nieuweReden || !nieuwBedrag) return;

    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reden: nieuweReden, bedrag: nieuwBedrag }),
    });

    const nieuw = await res.json();
    setTemplates((prev) => [...prev, nieuw]);
    setNieuweReden("");
    setNieuwBedrag("");
  };

  const handleTemplateDelete = async (id) => {
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTemplateEdit = async (template) => {
    const nieuweReden = prompt("Nieuwe reden:", template.reden);
    const nieuwBedrag = prompt("Nieuw bedrag (€):", template.bedrag);

    if (nieuweReden && nieuwBedrag) {
      fetch(`/api/templates/${template.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reden: nieuweReden, bedrag: nieuwBedrag }),
      })
        .then((res) => res.json())
        .then((updated) => {
          setTemplates((prev) =>
            prev.map((t) => (t.id === updated.id ? updated : t))
          );
        })
        .catch((err) => console.error("Fout bij bewerken template:", err));
    }
  };

  const keurGoed = async (id) => {
    try {
      await fetch(`/api/users/${id}/approve`, { method: "PATCH" });
      fetchUsers();
    } catch (err) {
      console.error("Goedkeuren mislukt:", err);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* ➕ Boete uitdelen */}
      <div className="space-y-3 bg-white/10 p-4 rounded-xl border border-white/20">
        <h2 className="text-lg font-semibold">➕ Boete uitdelen</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            className="w-full p-2 rounded bg-white/10 border border-white/20"
            value={speler}
            onChange={(e) => setSpeler(e.target.value)}
          >
            <option value="">Selecteer speler</option>
            {spelers.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>

          <select
            className="w-full p-2 rounded bg-white/10 border border-white/20"
            onChange={(e) => {
              const template = templates.find(
                (t) => t.id === parseInt(e.target.value)
              );
              if (template) {
                setReden(template.reden);
                setBedrag(template.bedrag);
              }
            }}
          >
            <option value="">📋 Kies standaardboete</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.reden} — €{Number(t.bedrag).toFixed(2)}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Bedrag (€)"
            value={bedrag}
            onChange={(e) => setBedrag(e.target.value)}
            className="w-full p-2 rounded bg-white/10 border border-white/20"
          />

          <input
            type="text"
            placeholder="Reden"
            value={reden}
            onChange={(e) => setReden(e.target.value)}
            className="w-full p-2 rounded bg-white/10 border border-white/20"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            Toevoegen
          </button>

          {feedback && <p className="text-sm text-center">{feedback}</p>}
        </form>
      </div>

      {/* ⚙️ Standaardboetes beheren */}
      <div className="bg-white/10 p-4 rounded-xl border border-white/20">
        <h3 className="font-semibold text-lg mb-2">⚙️ Standaardboetes beheren</h3>

        {templates.length === 0 ? (
          <p className="text-sm text-gray-400">Nog geen standaardboetes</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {templates.map((t) => (
              <li
                key={t.id}
                className="flex justify-between items-center border-b border-white/10 pb-1"
              >
                <span>
                  {t.reden} — €{Number(t.bedrag).toFixed(2)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTemplateEdit(t)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleTemplateDelete(t.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* ➕ Nieuwe standaardboete */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <input
            type="text"
            placeholder="Reden"
            value={nieuweReden}
            onChange={(e) => setNieuweReden(e.target.value)}
            className="flex-1 p-2 rounded bg-white/10 border border-white/20"
          />
          <input
            type="number"
            placeholder="Bedrag"
            value={nieuwBedrag}
            onChange={(e) => setNieuwBedrag(e.target.value)}
            className="sm:w-24 w-full p-2 rounded bg-white/10 border border-white/20"
          />
          <button
            onClick={handleTemplateAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded w-full sm:w-auto"
          >
            ➕
          </button>
        </div>
      </div>

      {/* 📄 Openstaande boetes beheren */}
      <div className="bg-white/10 p-4 rounded-xl border border-white/20">
        <h3 className="font-semibold text-lg mb-2">📄 Openstaande boetes beheren</h3>

        {boetes.filter((b) => !b.betaald).length === 0 ? (
          <p className="text-sm text-gray-400">Geen openstaande boetes</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {boetes
              .filter((b) => !b.betaald)
              .map((b) => (
                <li
                  key={b.id}
                  className="flex justify-between items-center border-b border-white/10 pb-1"
                >
                  <span>
                    {b.speler} — {b.reden} — €{Number(b.bedrag).toFixed(2)}
                  </span>
                  <button
                    onClick={async () => {
                      const bevestigen = confirm(
                        `Weet je zeker dat je deze boete wilt verwijderen?\n\nSpeler: ${b.speler}\nReden: ${b.reden}`
                      );
                      if (!bevestigen) return;

                      try {
                        await fetch(`/api/boetes/${b.id}`, {
                          method: "DELETE",
                        });
                        fetchBoetes();
                      } catch (err) {
                        console.error("Fout bij verwijderen boete:", err);
                      }
                    }}
                    className="text-red-400 hover:text-red-600"
                  >
                    ❌
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* ✅ Goedkeuring nieuwe spelers */}
      <div className="bg-white/10 p-4 rounded-xl border border-white/20">
        <h3 className="font-semibold text-lg mb-2">⏳ Wachtende registraties</h3>
        {nietGoedgekeurd.length === 0 ? (
          <p className="text-sm text-gray-400">Geen wachtende registraties</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {nietGoedgekeurd.map((u) => (
              <li
                key={u.id}
                className="flex justify-between items-center border-b border-white/10 pb-1"
              >
                <span>{u.name} ({u.username})</span>
                <button
                  onClick={() => keurGoed(u.id)}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                >
                  ✅ Keur goed
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
