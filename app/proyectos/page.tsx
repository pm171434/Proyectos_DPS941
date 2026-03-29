"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Componentes/Navegacion";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    loadProjects();
    loadTasks();

    const onFocus = () => {
      loadProjects();
      loadTasks();
    };

    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const loadProjects = async () => {
    const res = await axios.get("http://localhost:4000/projects");
    setProjects(res.data);
  };

  const loadTasks = async () => {
    const res = await axios.get("http://localhost:4000/tasks");
    setTasks(res.data);
  };

  const createProject = async (e: any) => {
    e.preventDefault();

    if (!name || !description) {
      alert("Debe llenar todos los campos");
      return;
    }

    await axios.post("http://localhost:4000/projects", {
      name,
      description,
      status: "Pendiente"
    });

    setName("");
    setDescription("");
    loadProjects();
  };

  const deleteProject = async (id: any) => {
    if (confirm("¿Eliminar proyecto?")) {
      await axios.delete(`http://localhost:4000/projects/${id}`);
      loadProjects();
      loadTasks();
    }
  };

  const editProject = (project: any) => {
    setEditingId(project.id);
    setName(project.name);
    setDescription(project.description);
  };

  const updateProject = async (e: any) => {
    e.preventDefault();

    const currentProject = projects.find(
      (p) => String(p.id) === String(editingId)
    );

    await axios.put(`http://localhost:4000/projects/${editingId}`, {
      name,
      description,
      status: currentProject?.status || "Pendiente"
    });

    setEditingId(null);
    setName("");
    setDescription("");
    loadProjects();
  };

  const filteredProjects =
    user?.role === "gerente"
      ? projects
      : projects.filter((project) =>
          tasks.some(
            (task) =>
              String(task.projectId) === String(project.id) &&
              String(task.assignedTo) === String(user?.id)
          )
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 md:p-10">
      <Navbar />

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <p className="text-sm uppercase tracking-widest text-green-600 font-semibold mb-2">
          Gestión
        </p>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Proyectos del sistema
        </h1>
        <p className="text-lg text-gray-600">
          {user?.role === "gerente"
            ? "Aquí puedes crear, editar, eliminar y administrar proyectos."
            : "Aquí puedes visualizar los proyectos que tienes asignados."}
        </p>
      </div>

      {user?.role === "gerente" && (
        <form
          onSubmit={editingId ? updateProject : createProject}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            type="text"
            placeholder="Nombre del proyecto"
            className="border p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Descripción"
            className="border p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition">
            {editingId ? "Actualizar proyecto" : "Crear proyecto"}
          </button>
        </form>
      )}

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {project.name}
              </h2>

              <p className="text-gray-600 mb-3">{project.description}</p>

              <div className="mb-4">
                <span className="text-sm text-gray-500">Estado del proyecto</span>
                <p className="font-semibold text-gray-800">{project.status}</p>
              </div>

              {user?.role === "gerente" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => editProject(project)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => deleteProject(project.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>

                  <a
                    href={`/tareas?projectId=${project.id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Ver tareas
                  </a>
                </div>
              )}

              {user?.role === "usuario" && (
                <a
                  href={`/tareas?projectId=${project.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg inline-block hover:bg-blue-600 transition"
                >
                  Ver tareas
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-700">No hay proyectos asignados.</p>
        </div>
      )}
    </div>
  );
}