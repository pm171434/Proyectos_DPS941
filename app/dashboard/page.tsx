"use client"
// Esto indica que el código se ejecuta en el navegador.
// Es necesario para poder usar localStorage y hooks de React.

import { useEffect, useState } from "react";
// useState sirve para guardar datos en la página.
// useEffect se usa para ejecutar código cuando la página se carga.

import { useRouter } from "next/navigation";
// useRouter permite cambiar de página dentro de la aplicación.

export default function Dashboard(){

  const router = useRouter();
    // Esta variable nos permite redirigir a otras páginas.

  const [user, setUser] = useState<any>(null);
  // Aquí guardaremos los datos del usuario que inició sesión.

  useEffect(()=>{
    // Obtener el usuario guardado en localStorage

    const storedUser = localStorage.getItem("user");
    // -------------------------------
    // PROTEGER LA RUTA
    // -------------------------------
    // Si no hay usuario guardado significa que no ha iniciado sesión
    // por lo tanto lo enviamos al login.

    if(!storedUser){
      router.push("/login");
      return;
    }
    // Convertimos el texto guardado en localStorage a un objeto

    const userData = JSON.parse(storedUser);
        // Guardamos los datos del usuario en el estado

    setUser(userData);

  },[])
  // Este código se ejecuta cuando la página se carga.

  const logout = () => {

    // -------------------------------
    // CERRAR SESIÓN
    // -------------------------------
    // Eliminamos el usuario guardado en localStorage.

    localStorage.removeItem("user");
        // Luego enviamos al usuario nuevamente al login.

    router.push("/login");
  };


  return(
    <div>

      <h1>Dashboard</h1>

      {user && (
        <p>Bienvenida {user.email}</p>
      )}
      
      {/* Botón para cerrar sesión */}

      <button onClick={logout}>
        Cerrar sesión
      </button>

    </div>
  )
}