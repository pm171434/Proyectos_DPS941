"use client"

import { useEffect, useState } from "react";
import axios from "axios";

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

  // FILTRAR PROYECTOS SEGÚN ROL
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
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Gestión de Proyectos</h1>

      {/* SOLO GERENTE PUEDE CREAR */}
      {user?.role === "gerente" && (
        <form
          onSubmit={editingId ? updateProject : createProject}
          className="mb-8"
        >
          <input
            type="text"
            placeholder="Nombre del proyecto"
            className="border p-2 mr-2 text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Descripción"
            className="border p-2 mr-2 text-black"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="bg-blue-500 text-white p-2">
            {editingId ? "Actualizar" : "Crear"}
          </button>
        </form>
      )}

      {/* LISTA DE PROYECTOS */}
      {filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
          <div key={project.id} className="border p-4 mb-4 rounded">
            <h2 className="font-bold">{project.name}</h2>

            <p>{project.description}</p>

            <p className="text-sm">Estado: {project.status}</p>

            {/* SOLO GERENTE */}
            {user?.role === "gerente" && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => editProject(project)}
                  className="bg-yellow-500 text-white p-1"
                >
                  Editar
                </button>

                <button
                  onClick={() => deleteProject(project.id)}
                  className="bg-red-500 text-white p-1"
                >
                  Eliminar
                </button>

               <a
                href={`/tareas?projectId=${project.id}`}
                className="bg-blue-500 text-white p-1"
              >
                Ver tareas
              </a>
                 
              </div>
            )}

            {/* SOLO USUARIO */}
            {user?.role === "usuario" && (
          <a
            href={`/tareas?projectId=${project.id}`}
            className="bg-blue-500 text-white p-1 inline-block mt-2"
          >
            Ver tareas
          </a>
                      )}
          </div>
        ))
      ) : (
        <p>No hay proyectos asignados.</p>
      )}
    </div>
  );
}