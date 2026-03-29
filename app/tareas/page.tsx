"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Navbar from "../Componentes/Navegacion";

export default function Tareas() {
  const searchParams = useSearchParams();
  const selectedProjectId = searchParams.get("projectId");
  const estadoFiltro = searchParams.get("estado");

  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [editingId, setEditingId] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    loadTasks();
    loadProjects();
    loadUsers();
  }, []);

  const loadTasks = async () => {
    const res = await axios.get("http://localhost:4000/tasks");
    setTasks(res.data);
  };

  const loadProjects = async () => {
    const res = await axios.get("http://localhost:4000/projects");
    setProjects(res.data);
  };

  const loadUsers = async () => {
    const res = await axios.get("http://localhost:4000/users");
    setUsers(res.data);
  };

  const createTask = async (e: any) => {
    e.preventDefault();

    if (!title || !description || !projectId || !assignedTo) {
      alert("Debe llenar todos los campos");
      return;
    }

    await axios.post("http://localhost:4000/tasks", {
      title,
      description,
      projectId,
      assignedTo,
      status: "Pendiente"
    });

    clearForm();
    loadTasks();
  };

  const editTask = (task: any) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setProjectId(task.projectId);
    setAssignedTo(task.assignedTo);
  };

  const updateTask = async (e: any) => {
    e.preventDefault();

    if (!title || !description || !projectId || !assignedTo) {
      alert("Debe llenar todos los campos");
      return;
    }

    const taskToEdit = tasks.find((t) => t.id === editingId);

    await axios.put(`http://localhost:4000/tasks/${editingId}`, {
      title,
      description,
      projectId,
      assignedTo,
      status: taskToEdit?.status || "Pendiente"
    });

    clearForm();
    loadTasks();
  };

  const deleteTask = async (id: any) => {
    const confirmDelete = confirm("¿Eliminar tarea?");
    if (!confirmDelete) return;

    await axios.delete(`http://localhost:4000/tasks/${id}`);
    loadTasks();
  };

  const changeTaskStatus = async (task: any, newStatus: string) => {
    await axios.patch(`http://localhost:4000/tasks/${task.id}`, {
      status: newStatus
    });

    const relatedProject = projects.find(
      (p) => String(p.id) === String(task.projectId)
    );

    if (relatedProject) {
      await axios.patch(`http://localhost:4000/projects/${relatedProject.id}`, {
        status: newStatus
      });
    }

    alert(`El estado de la tarea "${task.title}" cambió a "${newStatus}"`);

    loadTasks();
    loadProjects();
  };

  const clearForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setProjectId("");
    setAssignedTo("");
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(
      (p) => String(p.id) === String(projectId)
    );
    return project ? project.name : "Sin proyecto";
  };

  const getUserEmail = (userId: string) => {
    const assignedUser = users.find((u) => String(u.id) === String(userId));
    return assignedUser ? assignedUser.email : "Sin usuario";
  };

  const selectedProjectName = selectedProjectId
    ? getProjectName(selectedProjectId)
    : "Todas las tareas";

  const filteredTasks = tasks.filter((task) => {
    const sameProject = selectedProjectId
      ? String(task.projectId) === String(selectedProjectId)
      : true;

    const sameStatus = estadoFiltro
      ? task.status === estadoFiltro
      : true;

    if (user?.role === "gerente") {
      return sameProject && sameStatus;
    }

    return (
      sameProject &&
      sameStatus &&
      String(task.assignedTo) === String(user?.id)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 md:p-10">
      <Navbar />

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <p className="text-sm uppercase tracking-widest text-purple-600 font-semibold mb-2">
          Gestión
        </p>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Tareas del proyecto
        </h1>
        <p className="text-lg text-gray-600">
          Proyecto seleccionado:{" "}
          <span className="font-semibold text-gray-800">{selectedProjectName}</span>
        </p>
        <p className="text-gray-600 mt-2">
          Estado: <strong>{estadoFiltro || "Todos"}</strong>
        </p>
      </div>

      {user?.role === "gerente" && (
        <form
          onSubmit={editingId ? updateTask : createTask}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 grid grid-cols-1 gap-4"
        >
          <input
            type="text"
            placeholder="Título de la tarea"
            className="border p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Descripción"
            className="border p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="border p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">Seleccione un proyecto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            className="border p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Seleccione un usuario</option>
            {users
              .filter((u) => u.role === "usuario")
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email}
                </option>
              ))}
          </select>

          <div className="flex flex-wrap gap-2">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
              {editingId ? "Actualizar tarea" : "Crear tarea"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={clearForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {task.title}
              </h2>

              <p className="text-gray-600 mb-3">{task.description}</p>

              <div className="space-y-1 mb-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Proyecto:</span>{" "}
                  {getProjectName(task.projectId)}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Asignado a:</span>{" "}
                  {getUserEmail(task.assignedTo)}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Estado:</span> {task.status}
                </p>
              </div>

              {user?.role === "gerente" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => editTask(task)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </div>
              )}

              {user?.role === "usuario" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => changeTaskStatus(task, "En progreso")}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    En progreso
                  </button>

                  <button
                    onClick={() => changeTaskStatus(task, "Completada")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Completada
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-700">No hay tareas para este filtro.</p>
        </div>
      )}
    </div>
  );
}