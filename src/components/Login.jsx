// src/components/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { users as dummyUsers } from "../data/users"; // fallback

export function Login({ setCurrentUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("users");
    try {
      const parsed = JSON.parse(stored);
      setUsers(Array.isArray(parsed) && parsed.length > 0 ? parsed : dummyUsers);
    } catch {
      setUsers(dummyUsers);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!foundUser) {
      setError("Ongeldige gebruikersnaam of wachtwoord");
      return;
    }
    console.log("Ingelogd als:", foundUser.name);

    // ✅ Save naar state en localStorage
    setCurrentUser(foundUser);
    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    navigate("/home");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      <div className="w-full max-w-sm bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">Inloggen</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Gebruikersnaam"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-white/10 border border-white/20"
          />
          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-white/10 border border-white/20"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Inloggen
          </button>
          {error && <p className="text-sm text-center text-red-400">{error}</p>}
        </form>

        <div className="text-sm text-white text-center mt-4">
          Nog geen account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Registreer
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
