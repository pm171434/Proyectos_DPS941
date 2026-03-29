"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md rounded-lg px-6 py-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
      <div className="flex gap-3 flex-wrap">
        <a
          href="/dashboard"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Dashboard
        </a>

        <a
          href="/proyectos"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Proyectos
        </a>

        <a
          href="/tareas"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Tareas
        </a>
      </div>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </nav>
  );
}