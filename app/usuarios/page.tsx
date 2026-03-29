"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Componentes/Navegacion";

export default function Usuarios() {
  const [users, setUsers] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await axios.get("http://localhost:4000/users");
    setUsers(res.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 md:p-10">
      <Navbar />

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <p className="text-sm uppercase tracking-widest text-green-600 font-semibold mb-2">
          Administración
        </p>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Usuarios del sistema
        </h1>
        <p className="text-lg text-gray-600">
         Usuarios Registrados.
        </p>
      </div>

      {user?.role === "gerente" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {u.email}
              </h2>

              <p className="text-gray-600">
                <span className="font-semibold">Rol:</span> {u.role}
              </p>

              <p className="text-gray-600">
                <span className="font-semibold">ID:</span> {u.id}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-700">
            No tienes permiso para ver esta sección.
          </p>
        </div>
      )}
    </div>
  );
}