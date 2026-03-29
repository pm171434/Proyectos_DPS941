export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Sistema de Gestión de Proyectos y Tareas
        </h1>

        <p className="text-gray-600 mb-6">
          Bienvenido al sistema.
        </p>

        <a
          href="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ir al Login
        </a>
      </div>
    </main>
  );
}