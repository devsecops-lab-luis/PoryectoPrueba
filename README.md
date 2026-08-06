# ProyectoPrueba

ProyectoPrueba es una plataforma empresarial para la gestión de tareas por usuario.

Resumen rápido:
- Backend: NestJS + TypeScript + Prisma + PostgreSQL
- Frontend: React + TypeScript + Vite
- Autenticación: JWT (access + refresh)
- Documentación: Swagger
- Contenedores: Docker / docker-compose

Estado: scaffold inicial creado (backend + frontend + Prisma schema + Docker + docker-compose + .env.example).

Siguientes pasos sugeridos:
1. Ejecutar con Docker Compose: `docker compose up --build` (leer .env.example antes)
2. Desde el backend: instalar dependencias y terminar implementación de módulos: auth, users, tasks, audit, notifications.
3. Desde el frontend: instalar dependencias y desarrollar vistas.

Estructura principal creada:
- backend/
- frontend/
- docker-compose.yml
- .env.example

Ver más detalles en los READMEs de cada carpeta.
