import React, { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";

export default function AdminPanel({ users, setUsers, boetes, setBoetes, onBack }) {
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    password: "",
    role: "speler",
  });

  const addUser = () => {
    if (!newUser.name || !newUser.username || !newUser.password) {
      return alert("Vul alle velden in.");
    }

    const nieuweGebruiker = {
      ...newUser,
      id: Date.now(), // unieker ID
    };

    setUsers([...users, nieuweGebruiker]);
    setNewUser({ name: "", username: "", password: "", role: "speler" });
  };

  const deleteBoete = (id) => {
    setBoetes(boetes.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="font-semibold text-lg mb-2">Spelers beheren</h2>
        <div className="space-y-2">
          <input
            className="w-full p-2 border rounded"
            placeholder="Naam"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Gebruikersnaam"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Wachtwoord"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <select
            className="w-full p-2 border rounded"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="speler">Speler</option>
            <option value="admin">Admin</option>
          </select>
          <Button onClick={addUser}>Speler toevoegen</Button>
        </div>

        <ul className="mt-4 space-y-1">
          {users.map((u) => (
            <li key={u.id} className="text-sm">
              {u.name} ({u.username}) - {u.role}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-lg mb-2">Boetes beheren</h2>
        <ul className="space-y-2">
          {boetes.map((b) => (
            <li key={b.id} className="text-sm border-b pb-1 flex justify-between items-center">
              <div>
                <strong>{b.speler}</strong> - €{b.bedrag} - {b.reden} ({b.datum})
              </div>
              <button className="text-red-500" onClick={() => deleteBoete(b.id)}>
                Verwijder
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <div className="text-center">
        <Button onClick={onBack}>Terug</Button>
      </div>
    </div>
  );
}
