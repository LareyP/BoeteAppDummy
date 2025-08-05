import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !username || !password) {
      setFeedback("Vul alle velden in.");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          password,
          role: "speler", // standaard als speler
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registratie mislukt");
      }

      setFeedback("✅ Registratie gelukt! Wacht op goedkeuring.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Registratie fout:", err);
      setFeedback(`❌ ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white text-center">Registreer</h2>
        <form onSubmit={handleRegister} className="space-y-3">
          <input
            type="text"
            placeholder="Naam"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
          />
          <input
            type="text"
            placeholder="Gebruikersnaam"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
          />
          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
          >
            Registreren
          </button>
          {feedback && <p className="text-sm text-white text-center">{feedback}</p>}
        </form>
        <div className="text-sm text-white text-center mt-4">
          <button
            onClick={() => navigate("/login")}
            className="underline hover:text-blue-400"
          >
            Terug naar inloggen
          </button>
        </div>
      </div>
    </div>
  );
}
