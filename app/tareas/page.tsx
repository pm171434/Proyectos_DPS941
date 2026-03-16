"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function Tareas() {
  const searchParams = useSearchParams();
  const selectedProjectId = searchParams.get("projectId");
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

const selectedProjectName = selectedProjectId
  ? getProjectName(selectedProjectId)
  : "Todas las tareas";

  const getUserEmail = (userId: string) => {
    const assignedUser = users.find((u) => u.id === userId);
    return assignedUser ? assignedUser.email : "Sin usuario";
  };

 const filteredTasks = tasks.filter((task) => {
  const sameProject = selectedProjectId
    ? String(task.projectId) === String(selectedProjectId)
    : true;

  if (user?.role === "gerente") {
    return sameProject;
  }

  return (
    sameProject &&
    String(task.assignedTo) === String(user?.id)
  );
});

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-2">Gestión de Tareas</h1>
        <p className="mb-6 text-gray-600">
          Proyecto: {selectedProjectName}
        </p>

      {/* FORMULARIO SOLO PARA GERENTE */}
      {user?.role === "gerente" && (
        <form
          onSubmit={editingId ? updateTask : createTask}
          className="mb-8 space-y-3"
        >
          <input
            type="text"
            placeholder="Título de la tarea"
            className="border p-2 w-full text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Descripción"
            className="border p-2 w-full text-black"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="border p-2 w-full text-black"
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
            className="border p-2 w-full text-black"
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

          <div className="flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              {editingId ? "Actualizar tarea" : "Crear tarea"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={clearForm}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      {/* LISTA DE TAREAS */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="border p-4 rounded">
            <h2 className="font-bold text-lg">{task.title}</h2>
            <p>{task.description}</p>
            <p>
              <strong>Proyecto:</strong> {getProjectName(task.projectId)}
            </p>
            <p>
              <strong>Asignado a:</strong> {getUserEmail(task.assignedTo)}
            </p>
            <p>
              <strong>Estado:</strong> {task.status}
            </p>

            {/* OPCIONES DEL GERENTE */}
            {user?.role === "gerente" && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => editTask(task)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Editar
                </button>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </div>
            )}

            {/* OPCIONES DEL USUARIO */}
            {user?.role === "usuario" && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => changeTaskStatus(task, "En progreso")}
                  className="bg-orange-500 text-white px-3 py-1 rounded"
                >
                  En progreso
                </button>

                <button
                  onClick={() => changeTaskStatus(task, "Completada")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Completada
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}