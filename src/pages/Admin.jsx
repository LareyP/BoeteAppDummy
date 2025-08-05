import React, { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { users as dummyUsers } from "../data/users";
import { boetes as dummyBoetes } from "../data/boetes";
import { templates as dummyTemplates } from "../data/template";
import { tikkie as dummyTikkie } from "../data/tikkie";
import { FaSave } from "react-icons/fa";

export default function Admin({ currentUser }) {
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : dummyUsers;
  });
  
  const [boetes, setBoetes] = useState(() => {
    const stored = localStorage.getItem("boetes");
    return stored ? JSON.parse(stored) : dummyBoetes;
  });
  
  const [templates, setTemplates] = useState(() => {
    const stored = localStorage.getItem("templates");
    return stored ? JSON.parse(stored) : dummyTemplates;
  });
  
  const [tikkieLink, setTikkieLink] = useState(() => {
    const stored = localStorage.getItem("tikkieLink");
    return stored ? stored : dummyTikkie.link;
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem("boetes", JSON.stringify(boetes));
  }, [boetes]);
  
  useEffect(() => {
    localStorage.setItem("templates", JSON.stringify(templates));
  }, [templates]);
  
  useEffect(() => {
    localStorage.setItem("tikkieLink", tikkieLink);
  }, [tikkieLink]);
  
  
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [status, setStatus] = useState("");

  const [speler, setSpeler] = useState("");
  const [bedrag, setBedrag] = useState("");
  const [reden, setReden] = useState("");
  const [feedback, setFeedback] = useState("");
  const [nieuweReden, setNieuweReden] = useState("");
  const [nieuwBedrag, setNieuwBedrag] = useState("");

  useEffect(() => {
    if (dummyTikkie.updatedAt) {
      const updated = new Date(dummyTikkie.updatedAt);
      const now = new Date();
      const diffDays = Math.floor((now - updated) / (1000 * 60 * 60 * 24));
      setDaysRemaining(Math.max(0, 14 - diffDays));
    }
  }, []);

  const spelers = users.filter(
    (u) => u.goedgekeurd && u.role.includes("speler")
  );
  
  const nietGoedgekeurd = users.filter(
    (u) => !u.goedgekeurd && u.role.includes("speler")
  );
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback("");

    if (!speler || !bedrag || !reden) {
      setFeedback("Vul alle velden in.");
      return;
    }

    const nieuweBoete = {
      id: Date.now(),
      speler,
      bedrag: parseFloat(bedrag),
      reden,
      datum: new Date().toISOString().split("T")[0],
      betaald: false,
    };

    setBoetes((prev) => [...prev, nieuweBoete]);
    setFeedback("✅ Boete toegevoegd!");
    setSpeler("");
    setBedrag("");
    setReden("");
  };

  const handleTemplateAdd = () => {
    if (!nieuweReden || !nieuwBedrag) return;

    const nieuw = {
      id: Date.now(),
      reden: nieuweReden,
      bedrag: parseFloat(nieuwBedrag),
    };

    setTemplates((prev) => [...prev, nieuw]);
    setNieuweReden("");
    setNieuwBedrag("");
  };

  const handleTemplateEdit = (template) => {
    const nieuweReden = prompt("Nieuwe reden:", template.reden);
    const nieuwBedrag = prompt("Nieuw bedrag (€):", template.bedrag);

    if (nieuweReden && nieuwBedrag) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === template.id
            ? { ...t, reden: nieuweReden, bedrag: parseFloat(nieuwBedrag) }
            : t
        )
      );
    }
  };

  const handleTemplateDelete = (id) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTikkieLinkSave = () => {
    setStatus("✅ Tikkie-link opgeslagen!");
    setTimeout(() => setStatus(""), 3000);
  };

  const keurGoed = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, goedgekeurd: true } : u))
    );
  };

  return (
    <div className="p-4 space-y-6">
      {/* ➕ Boete uitdelen */}
      <Card>
        <h2 className="text-lg font-semibold">➕ Boete uitdelen</h2>
        <form onSubmit={handleSubmit} className="space-y-3 mt-3">
          <select
            className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-800"
            value={speler}
            onChange={(e) => setSpeler(e.target.value)}
          >
            <option value="">Selecteer speler</option>
            {spelers.map((u) => (
              <option key={u.id} value={u.username}>
                {u.username}
              </option>
            ))}
          </select>

          <select
            className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-800"
            onChange={(e) => {
              const t = templates.find((tpl) => tpl.id === Number(e.target.value));
              if (t) {
                setReden(t.reden);
                setBedrag(t.bedrag);
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
            type="text"
            className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-800"
            placeholder="Reden"
            value={reden}
            onChange={(e) => setReden(e.target.value)}
          />
          <input
            type="number"
            className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-800"
            placeholder="Bedrag"
            value={bedrag}
            onChange={(e) => setBedrag(e.target.value)}
          />
          <Button type="submit">Toevoegen</Button>
          {feedback && <p className="text-sm text-center">{feedback}</p>}
        </form>
      </Card>

      {/* ⚙️ Standaardboetes beheren */}
      <Card>
        <h3 className="font-semibold text-lg mb-2">⚙️ Standaardboetes beheren</h3>
        {templates.length === 0 ? (
          <p className="text-sm text-gray-400">Nog geen standaardboetes</p>
        ) : (
          <ul className="space-y-2 text-sm ">
            {templates.map((t) => (
              <li
                key={t.id}
                className="flex justify-between items-center border-b border-white/10 pb-1"
              >
                <span>
                  {t.reden} — €{Number(t.bedrag).toFixed(2)}
                </span>
                <div className="flex gap-2 ">
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
        <div className="flex flex-col sm:flex-row gap-2 mt-4 ">
          <input
            type="text"
            placeholder="Reden"
            value={nieuweReden}
            onChange={(e) => setNieuweReden(e.target.value)}
            className="flex-1 p-2 rounded border bg-gray-100 dark:bg-gray-800"
          />
          <input
            type="number"
            placeholder="Bedrag"
            value={nieuwBedrag}
            onChange={(e) => setNieuwBedrag(e.target.value)}
            className="sm:w-24 w-full p-2 rounded border bg-gray-100 dark:bg-gray-800"
          />
          <button
            onClick={handleTemplateAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded w-full sm:w-auto"
          >
            ➕
          </button>
        </div>
      </Card>

      {/* 📄 Openstaande boetes beheren */}
      <Card>
        <h3 className="font-semibold text-lg mb-2">📄 Openstaande boetes beheren</h3>
        {boetes.filter((b) => !b.betaald).map((b) => (
          <li
            key={b.id}
            className="flex justify-between items-center border-b border-white/10 pb-1"
          >
            <span>
              {b.speler} — {b.reden} — €{Number(b.bedrag).toFixed(2)}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const confirmPay = confirm(
                    `Markeer deze boete als betaald?\n\nSpeler: ${b.speler}\nReden: ${b.reden}`
                  );
                  if (confirmPay) {
                    setBoetes((prev) =>
                      prev.map((boete) =>
                        boete.id === b.id ? { ...boete, betaald: true } : boete
                      )
                    );
                  }
                }}
                className="text-green-400 hover:text-green-600"
              >
                ✅ Betaald
              </button>
              <span>|</span>
              <button
                onClick={() => {
                  const confirmDelete = confirm(
                    `Weet je zeker dat je deze boete wilt verwijderen?\n\nSpeler: ${b.speler}\nReden: ${b.reden}`
                  );
                  if (confirmDelete) {
                    setBoetes((prev) => prev.filter((boete) => boete.id !== b.id));
                  }
                }}
                className="text-red-400 hover:text-red-600"
              >
                ❌ Verwijder
              </button>
            </div>
          </li>
        ))}
      </Card>

      {/* ✅ Goedkeuring spelers */}
      <Card>
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
      </Card>

      {/* Tikkie-link instellen */}
      <Card>
        <h2 className="text-lg font-semibold mb-2 text-white">
          Tikkie-link instellen
        </h2>
        <input
          type="text"
          value={tikkieLink}
          onChange={(e) => setTikkieLink(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
          placeholder="Plak hier de nieuwe Tikkie-link"
        />
        <p className="text-sm text-gray-400">
          {daysRemaining !== null
            ? `De link is nog ${daysRemaining} dag(en) geldig.`
            : "Laden..."}
        </p>
        <Button onClick={handleTikkieLinkSave} className="mt-2 flex items-center gap-2">
          <FaSave /> Opslaan
        </Button>
        {status && <p className="text-sm mt-2 text-gray-300">{status}</p>}
      </Card>
    </div>
  );
}
