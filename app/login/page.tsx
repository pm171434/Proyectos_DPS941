"use client"
// Esto indica que este código se ejecuta en el navegador.
// Es necesario para poder usar funciones como useState y localStorage.

import { useState } from "react";
// useState nos permite guardar datos que cambian en la página,
// en este caso el correo y la contraseña que escribe el usuario.

import axios from "axios";
// Axios sirve para comunicarse con la base de datos simulada (JSON Server)
// y obtener los usuarios registrados.

import { useRouter } from "next/navigation";
// useRouter sirve para cambiar de página dentro del sistema.
// Lo usamos para enviar al usuario al dashboard después del login.


export default function Login() {

  const router = useRouter();
    // Esta variable nos permite redirigir a otra página.


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    // Aquí guardamos lo que el usuario escribe en los campos del formulario.


  const handleSubmit = async (e:any) => {
  e.preventDefault();
  // Evita que la página se recargue cuando se envía el formulario.

  // -------------------------------
  // VALIDACIÓN DE LOS CAMPOS
  // -------------------------------
  // Primero verificamos que el usuario haya llenado todos los campos.

  // validar campos vacíos
  if(!email || !password){
    alert("Debe completar todos los campos");
    return;
  }

// Aquí revisamos que el correo tenga el símbolo @
  if(!email.includes("@")){
    alert("Ingrese un correo válido");
    return;
  }
  // -------------------------------
  // CONSULTA A LA BASE DE DATOS
  // -------------------------------
  // Se hace una petición a JSON Server para obtener la lista de usuarios.

  const res = await axios.get("http://localhost:4000/users");
  // -------------------------------
  // VERIFICAR SI EL USUARIO EXISTE
  // -------------------------------
  // Aquí buscamos si hay un usuario con ese correo y contrase

  const user = res.data.find(
    (u:any) => u.email === email && u.password === password
  );

  if(user){

    // Guardamos el usuario en localStorage
    // Esto sirve para mantener la sesión iniciada.

    localStorage.setItem("user", JSON.stringify(user));
    // Después del login enviamos al usuario al dashboard

    router.push("/dashboard");

  }else{

    // Si el correo o la contraseña no coinciden
    // mostramos un mensaje de error.

    alert("Credenciales incorrectas");

    // También limpiamos los campos del formulario
    setEmail("");
    setPassword("");
  }
};

  return (
    // -------------------------------
   // DISEÑO DEL FORMULARIO
   // -------------------------------
   // Aquí se muestra la interfaz donde el usuario ingresa sus datos.

   <div className="flex items-center justify-center min-h-screen bg-gray-100">

  <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-80">

    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
      Iniciar Sesión
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

    <button className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
      Entrar
    </button>

    <p className="text-sm text-center mt-4">
    ¿No tienes cuenta? <a href="/registro" className="text-blue-500">Registrarse</a>
    </p>
    {/* Este enlace lleva a la página de registro si el usuario no tiene cuenta */}

  </form>

</div>
  );
}
