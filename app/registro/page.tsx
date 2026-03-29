"use client"
// Esto indica que el código se ejecuta en el navegador.
// Es necesario para usar useState y poder interactuar con el usuario.

import { useState } from "react";
// useState permite guardar datos que cambian en la página.
// En este caso se usa para guardar el correo y la contraseña que escribe el usuario.

import axios from "axios";
// Axios sirve para comunicarse con la API simulada (JSON Server)
// y guardar el nuevo usuario en la base de datos.

import { useRouter } from "next/navigation";
// useRouter permite cambiar de página dentro de la aplicación.

export default function Register(){

  const router = useRouter();
  // Esta variable nos permite redirigir al usuario a otra página después del registro.

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  // Aquí guardamos lo que el usuario escribe en los campos del formulario.

  const handleSubmit = async (e:any) =>{
    e.preventDefault();
    // Evita que el formulario recargue la página cuando se envía.

    // -------------------------------
    // VALIDACIÓN DE CAMPOS
    // -------------------------------
    // Primero verificamos que los campos no estén vacíos.

    if(!email || !password){
      alert("Debe completar todos los campos");
      return;
    }
    // Aquí revisamos que el correo tenga el símbolo @.

    if(!email.includes("@")){
      alert("Ingrese un correo válido");
      return;
    }
    // -------------------------------
    // GUARDAR USUARIO EN LA API
    // -------------------------------
    // Aquí enviamos los datos a JSON Server para guardar el nuevo usuario.


    await axios.post("http://localhost:4000/users",{
      email,
      password,
      role:"usuario"
    });
        // Se asigna automáticamente el rol "usuario".
    // Esto sirve para diferenciar entre gerente y usuario en el sistema.


    alert("Usuario registrado correctamente");
        // Después del registro se envía al usuario a la página de login
    // para que pueda iniciar sesión.



    router.push("/login");
  }

  return(
    // -------------------------------
    // DISEÑO DEL FORMULARIO DE REGISTRO
    // -------------------------------
    // Aquí se muestra la interfaz donde el usuario crea su cuenta.

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-80">

        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Registro
        </h1>

        <input
          type="email"
          placeholder="Correo"
          className="border p-2 rounded w-full mb-4 text-black"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="border p-2 rounded w-full mb-4 text-black"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600">
          Registrarse
        </button>

        <p className="text-sm text-center mt-4">
          ¿Ya tienes cuenta? 
          <a href="/login" className="text-blue-500"> Iniciar sesión</a>
        </p>
        {/* Este enlace lleva a la página de login si el usuario ya tiene cuenta */}

      </form>

    </div>

  )
}