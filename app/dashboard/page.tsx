"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    loadProjects();
    loadTasks();
    loadUsers();
  }, []);

  const loadProjects = async () => {
    const res = await axios.get("http://localhost:4000/projects");
    setProjects(res.data);
  };

  const loadTasks = async () => {
    const res = await axios.get("http://localhost:4000/tasks");
    setTasks(res.data);
  };

  const loadUsers = async () => {
    const res = await axios.get("http://localhost:4000/users");
    setUsers(res.data);
  };

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const assignedTasks =
    user?.role === "usuario"
      ? tasks.filter((task) => String(task.assignedTo) === String(user?.id))
      : [];

  const completedTasks =
    user?.role === "usuario"
      ? assignedTasks.filter((task) => task.status === "Completada")
      : [];

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {user && (
            <p className="text-gray-600 mt-2">
              Bienvenido: {user.email} ({user.role})
            </p>
          )}
        </div>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      {/* TARJETAS GERENTE */}
      {user?.role === "gerente" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">Proyectos</h2>
            <p className="text-2xl">{projects.length}</p>
          </div>

          <div className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">Tareas</h2>
            <p className="text-2xl">{tasks.length}</p>
          </div>

          <div className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">Usuarios</h2>
            <p className="text-2xl">{users.length}</p>
          </div>
        </div>
      )}

      {/* TARJETAS USUARIO */}
      {user?.role === "usuario" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">Tareas asignadas</h2>
            <p className="text-2xl">{assignedTasks.length}</p>
          </div>

          <div className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">Tareas completadas</h2>
            <p className="text-2xl">{completedTasks.length}</p>
          </div>
        </div>
      )}

      {/* NAVEGACIÓN */}
      <div className="flex gap-4">
        <a
          href="/proyectos"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Ir a Proyectos
        </a>

        <a
          href="/tareas"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Ir a Tareas
        </a>
      </div>
    </div>
  );
}