# Sistema de Gestión de Proyectos y Tareas

## Descripción
Aplicación web desarrollada con React y Next.js para gestionar proyectos y tareas de manera simple.  
El sistema permite registrar usuarios, iniciar sesión y administrar proyectos y tareas según el rol asignado.

## Tecnologías utilizadas
- React
- Next.js
- Axios
- Tailwind CSS
- JSON Server
- GitHub
- Vercel

## Funcionalidades principales

### Autenticación
- Registro de usuarios
- Inicio de sesión con validación
- Almacenamiento de sesión en localStorage
- Rutas protegidas
- Roles de usuario: gerente y usuario

### Rol gerente
- Crear proyectos
- Editar proyectos
- Eliminar proyectos
- Crear tareas
- Editar tareas
- Eliminar tareas
- Asignar tareas a usuarios
- Ver usuarios registrados

### Rol usuario
- Ver proyectos asignados
- Ver tareas asignadas
- Cambiar el estado de sus tareas
- Visualizar su progreso personal

## Estructura del proyecto

```bash
app/
 ├ components/
 │   └ Navbar.tsx
 ├ dashboard/
 │   └ page.tsx
 ├ login/
 │   └ page.tsx
 ├ registro/
 │   └ page.tsx
 ├ proyectos/
 │   └ page.tsx
 ├ tareas/
 │   └ page.tsx
 ├ usuarios/
 │   └ page.tsx
db.json
package.json
README.md
