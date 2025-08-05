// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderbord";
import Register from "./components/Register";
import Boetes from "./pages/Boetes";
import NavBar from "./components/NavBar";
import { users as dummyUsers } from "./data/users";
import { boetes as dummyBoetes } from "./data/boetes";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [boetes, setBoetes] = useState([]);

  // ✅ Bij laden: haal alles uit localStorage, of gebruik fallback dummydata
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedUsers = localStorage.getItem("users");
    const storedBoetes = localStorage.getItem("boetes");
  
    const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
    const parsedBoetes = storedBoetes ? JSON.parse(storedBoetes) : [];
  
    setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
    setUsers(parsedUsers.length > 0 ? parsedUsers : dummyUsers);
    setBoetes(parsedBoetes.length > 0 ? parsedBoetes : dummyBoetes);

  }, []);

  // ✅ Schrijf terug naar localStorage bij updates
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="flex flex-col h-full max-w-md md:max-w-3xl mx-auto w-full">
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-28">
          <Routes>
            <Route
              path="/"
              element={
                currentUser ? (
                  <Navigate to="/home" />
                ) : (
                  <Login setCurrentUser={setCurrentUser} />
                )
              }
            />
            <Route
              path="/home"
              element={
                currentUser ? (
                  <Home currentUser={currentUser} boetes={boetes} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/admin"
              element={
                currentUser &&
                (Array.isArray(currentUser.role)
                  ? currentUser.role.includes("admin")
                  : currentUser.role === "admin") ? (
                  <Admin
                    currentUser={currentUser}
                    users={users}
                    setUsers={setUsers}
                    boetes={boetes}
                    setBoetes={setBoetes}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/boetes"
              element={
                currentUser ? (
                  <Boetes
                    currentUser={currentUser}
                    boetes={boetes}
                    fetchBoetes={() => {}} // dummy
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/leaderboard" element={<Leaderboard boetes={boetes} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {currentUser && (
          <footer className="fixed bottom-0 left-0 right-0 z-50">
            <NavBar
              isAdmin={
                Array.isArray(currentUser.role)
                  ? currentUser.role.includes("admin")
                  : currentUser.role === "admin"
              }
              onLogout={handleLogout}
            />
          </footer>
        )}
      </div>
    </div>
  );
}
