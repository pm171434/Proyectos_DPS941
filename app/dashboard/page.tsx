"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../Componentes/Navegacion";

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

    setUser(JSON.parse(storedUser));

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

  const assignedTasks =
    user?.role === "usuario"
      ? tasks.filter((task) => String(task.assignedTo) === String(user?.id))
      : [];

  const pendingTasks =
    user?.role === "usuario"
      ? assignedTasks.filter((task) => task.status === "Pendiente")
      : tasks.filter((task) => task.status === "Pendiente");

  const inProgressTasks =
    user?.role === "usuario"
      ? assignedTasks.filter((task) => task.status === "En progreso")
      : tasks.filter((task) => task.status === "En progreso");

  const completedTasks =
    user?.role === "usuario"
      ? assignedTasks.filter((task) => task.status === "Completada")
      : tasks.filter((task) => task.status === "Completada");

  const totalTasks =
    user?.role === "usuario" ? assignedTasks.length : tasks.length;

  const progress =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 md:p-10">
      <Navbar />

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <p className="text-sm uppercase tracking-widest text-blue-600 font-semibold mb-2">
          Panel principal
        </p>

        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Hola, bienvenido al sistema
        </h1>

        {user && (
          <p className="text-lg text-gray-600">
            Sesión iniciada como{" "}
            <span className="font-semibold text-gray-800">{user.email}</span>{" "}
            <span className="text-sm bg-gray-200 px-3 py-1 rounded-full ml-2">
              {user.role}
            </span>
          </p>
        )}
      </div>

      {/* GERENTE */}
      {user?.role === "gerente" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <div
              onClick={() => router.push("/proyectos")}
              className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 cursor-pointer hover:scale-105 transition"
            >
              <p className="text-sm text-gray-500 mb-2">Proyectos</p>
              <h2 className="text-3xl font-bold text-gray-800">{projects.length}</h2>
            </div>

            <div
              onClick={() => router.push("/tareas")}
              className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500 cursor-pointer hover:scale-105 transition"
            >
              <p className="text-sm text-gray-500 mb-2">Tareas</p>
              <h2 className="text-3xl font-bold text-gray-800">{tasks.length}</h2>
            </div>

           <div
            onClick={() => router.push("/usuarios")}
            className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500 cursor-pointer hover:scale-105 transition"
          >
            <p className="text-sm text-gray-500 mb-2">Usuarios</p>
            <h2 className="text-3xl font-bold text-gray-800">{users.length}</h2>
          </div>

            <div
              onClick={() => router.push("/tareas")}
              className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500 cursor-pointer hover:scale-105 transition"
            >
              <p className="text-sm text-gray-500 mb-2">Progreso general</p>
              <h2 className="text-3xl font-bold text-gray-800">{progress}%</h2>
            </div>
          </div>
        </>
      )}

      {/* USUARIO */}
      {user?.role === "usuario" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <div
              onClick={() => router.push("/tareas")}
              className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 cursor-pointer hover:scale-105 transition"
            >
              <p className="text-sm text-gray-500 mb-2">Tareas asignadas</p>
              <h2 className="text-3xl font-bold text-gray-800">{assignedTasks.length}</h2>
            </div>

            <div
              onClick={() => router.push("/tareas?estado=Pendiente")}
              className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-400 cursor-pointer hover:scale-105 transition"
            >
              <p className="text-sm text-gray-500 mb-2">Pendientes</p>
              <h2 className="text-3xl font-bold text-gray-800">{pendingTasks.length}</h2>
            </div>

            <div
              onClick={() => router.push("/tareas?estado=En progreso")}
              className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500 cursor-pointer hover:scale-105 transition"
            >
              <p className="text-sm text-gray-500 mb-2">En progreso</p>
              <h2 className="text-3xl font-bold text-gray-800">{inProgressTasks.length}</h2>
            </div>

            <div
              onClick={() => router.push("/tareas?estado=Completada")}
              className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500 cursor-pointer hover:scale-105 transition"
            >
              <p className="text-sm text-gray-500 mb-2">Completadas</p>
              <h2 className="text-3xl font-bold text-gray-800">{completedTasks.length}</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Mi avance
              </h2>

              <div className="mt-3 md:mt-0 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                Progreso personal: {progress}%
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              Aquí puedes ver tu progreso personal según las tareas asignadas.
            </p>

            <div className="w-full bg-gray-200 rounded-full h-6 mb-6 overflow-hidden">
              <div
                className="bg-green-600 h-6 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 text-gray-700">
              <div
                onClick={() => router.push("/tareas")}
                className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition"
              >
                <p className="text-sm text-gray-500">Asignadas</p>
                <p className="text-2xl font-bold">{assignedTasks.length}</p>
              </div>

              <div
                onClick={() => router.push("/tareas?estado=Pendiente")}
                className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition"
              >
                <p className="text-sm text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold">{pendingTasks.length}</p>
              </div>

              <div
                onClick={() => router.push("/tareas?estado=En progreso")}
                className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition"
              >
                <p className="text-sm text-gray-500">En progreso</p>
                <p className="text-2xl font-bold">{inProgressTasks.length}</p>
              </div>

              <div
                onClick={() => router.push("/tareas?estado=Completada")}
                className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition"
              >
                <p className="text-sm text-gray-500">Completadas</p>
                <p className="text-2xl font-bold">{completedTasks.length}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}