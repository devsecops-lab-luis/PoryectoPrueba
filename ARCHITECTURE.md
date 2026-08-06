# ARCHITECTURE

## 1. Descripción del sistema

PoryectoPrueba es una aplicación para la gestión de tareas por usuario. Permite a los usuarios crear, asignar, priorizar y hacer seguimiento del estado de tareas, con notificaciones y permisos por rol. El objetivo de esta arquitectura es preparar el proyecto para crecer hasta convertirse en una aplicación empresarial: escalable, mantenible, observable y segura.

Casos de uso iniciales:
- Registro e inicio de sesión de usuarios.
- CRUD de tareas (crear, leer, actualizar, eliminar).
- Asignación de tareas entre usuarios y equipos.
- Comentarios y archivos adjuntos en tareas.
- Búsqueda y filtrado por estado, prioridad y etiquetas.
- Notificaciones (email/push) y recordatorios.

## 2. Arquitectura propuesta (visión general)

Recomiendo una arquitectura modular, en capas y preparada para microservicios si fuese necesario con el tiempo. La propuesta inicial está pensada como una arquitectura híbrida:

- Monorepo estructurado (apps/ libs/ infra/) para acelerar el desarrollo y facilitar refactorizaciones.
- Backend en microservicios lógicos o módulos desacoplados (Auth, Tasks, Notifications, Search) comunicados mediante HTTP y/o eventos (Message Broker).
- Frontend separado (SPA/SSR) y API pública versionada.
- Persistencia con bases de datos relacionales para datos transaccionales y un índice de búsqueda (Elasticsearch/Meilisearch) para consultas avanzadas.
- Infraestructura containerizada (Docker) y preparada para orquestación (Kubernetes) en producción.

Topología básica:
- Clientes (Web, Mobile)
- API Gateway / Reverse Proxy (rate-limiting, TLS, routing)
- Backend (microservicios o monolito modular)
- Base de datos relacional (Postgres)
- Cache (Redis)
- Message Broker (RabbitMQ o Kafka) para eventos y procesamiento asíncrono
- Motor de búsqueda (Meilisearch o Elasticsearch)
- Armazenamiento de objetos (S3-compatible) para archivos adjuntos
- Observabilidad: logs centralizados, métricas, tracing

## 3. Tecnologías recomendadas

Elegí tecnologías maduras y con ecosistema empresarial. Pueden sustituirse según el equipo.

- Lenguaje backend: TypeScript + Node.js (NestJS recomendado) -- estructura modular, DI, patrones empresariales.
- Base de datos: PostgreSQL (primary), migraciones con Prisma o TypeORM/knex + migrate scripts.
- Cache: Redis (sessions, rate-limits, colas ligeras).
- Mensajería: RabbitMQ (fácil) o Kafka (alto rendimiento/streaming) según escala prevista.
- Búsqueda: Meilisearch (fácil) o Elasticsearch (más funcionalidades, más complejidad).
- Frontend: React + Next.js (SSR opcional) o Vue/Nuxt según preferencia.
- Autenticación: JWT + Refresh tokens; usar OAuth2/OpenID Connect si se integra con terceros/SSO.
- Archivos: S3 (AWS) o MinIO para entornos on-premise.
- Contenerización/orquestación: Docker para desarrollo, Kubernetes + Helm para producción.
- CI/CD: GitHub Actions (pipelines para test, build, image publish, deploy).
- Observabilidad: Prometheus + Grafana (métricas), ELK/Opensearch o Loki para logs, Jaeger/OTel para tracing.
- Infraestructura como código: Terraform o Pulumi.
- Seguridad: Dependabot, Snyk (opcional), escaneo de imágenes y revisiones de secretos.

## 4. Componentes principales

1. API Gateway / Reverse Proxy
   - Entrypoint de la plataforma. Maneja TLS, CORS, rate-limits, autenticación básica y enrutamiento a servicios.
   - Tecnologías: Nginx/Traefik o API Gateway en la nube.

2. Servicio de Autenticación (auth-service)
   - Registro, login, gestión de usuarios, roles y permisos (RBAC).
   - Emite JWT y tokens de refresh.

3. Servicio de Tareas (tasks-service)
   - Lógica de dominio: CRUD, asignaciones, estados, reglas de negocio.
   - Exponer API REST/GraphQL versionada.

4. Servicio de Notificaciones (notifications-service)
   - Envío asíncrono de emails, push y recordatorios.
   - Conector a proveedores (SMTP, Firebase, etc.).

5. Servicio de Búsqueda (search-service)
   - Indexa tareas, comentarios y usuarios para consultas rápidas.

6. Worker / Scheduler
   - Procesamiento asíncrono de colas: envío de notificaciones, generación de reports, tareas periódicas (cron).

7. Base de datos principal
   - PostgreSQL con esquemas por bounded context (opcional) y migraciones versionadas.

8. Cache y sesiones
   - Redis para cache de consultas, rate-limits y sesiones (si aplica).

9. Almacenamiento de objetos
   - S3/MinIO para adjuntos de tareas y archivos de usuario.

10. Frontend (web-app)
    - SPA/SSR que consume API pública; autenticación y autorización en el cliente mínima.

11. Observabilidad
    - Logs centralizados, dashboards de métricas, alertas, tracing distribuido.

12. Infra / Devops
    - IaC, pipelines, entorno local con Docker Compose, entornos de staging y producción.

## 5. Flujo de información (ejemplos)

Caso: Crear una tarea y notificar al asignado
1. Usuario en la UI envía POST /api/v1/tasks al API Gateway.
2. Gateway enruta la petición a tasks-service. El request contiene el JWT del usuario.
3. tasks-service valida permisos con auth-service (o valida scopes locales).
4. tasks-service persiste la tarea en PostgreSQL y publica un evento TaskCreated en el Message Broker.
5. El worker/notifications-service consume TaskCreated y encola envío de notificación por email/push.
6. notifications-service manda el email (SMTP) y registra el intento en la BD de logs/actividad.
7. Si la tarea contiene archivos, el frontend los sube a S3 y guarda referencias en tasks-service.

Lectura/Busqueda:
- Consultas simples: tasks-service sirve desde Postgres y Redis cache cuando aplique.
- Consultas complejas: search-service (indexado incremental) para búsquedas por texto/filtrado avanzado.

Autenticación:
- Login -> auth-service devuelve JWT y refresh token.
- Cada petición autenticada incluye JWT en Authorization header.
- Para acciones críticas, el backend puede requerir validación adicional (2FA) o comprobación de roles en auth-service.

## 6. Decisiones técnicas iniciales

Estas decisiones se deben revisar conforme el equipo y el uso real:

1. Estructura del repositorio
   - Monorepo con carpetas: /apps (backend, frontend), /packages (libs compartidas), /infra (manifests, helm, terraform), /docs, /scripts, /db/migrations.
   - Ventaja: código compartido y sincronización; desventaja: curva de herramientas (nx, turborepo, pnpm).

2. Backend: NestJS + TypeScript
   - Razón: estructura por módulos, inyección de dependencias, patterns empresariales, buen soporte de testing y documentación automática (Swagger).

3. Base de datos: PostgreSQL
   - Razón: consistencia transaccional, relaciones, soporte para JSONB cuando se necesite flexibilidad.

4. Messaging: RabbitMQ para comenzar
   - Razón: fácil de operar y suficiente para la mayoría de requisitos asíncronos; considerar Kafka si se requiere streaming y retención.

5. Buscar: Meilisearch en etapas iniciales
   - Razón: rápido de desplegar y excelente para búsquedas orientadas a texto; migrar a Elasticsearch si necesitáis más funcionalidades analíticas.

6. Autenticación: JWT + refresh tokens y almacenamiento de sesiones en Redis (opcional)
   - Razón: balance entre escalabilidad y simplicidad. Evaluar OAuth2/OpenID Connect si habrá SSO.

7. Contenerización: Docker + Docker Compose para desarrollo
   - Razón: reproducibilidad local; preparar manifests para Kubernetes para staging/producción.

8. CI/CD: GitHub Actions
   - Pipelines: lint -> test -> build -> image -> publish -> deploy (staging/production).

9. Observabilidad mínima desde el inicio
   - Añadir logs estructurados (JSON), métricas básicas (latency qps errors) y tracing distribuido en puntos críticos.

10. Seguridad
   - Forzar HTTPS, encabezados seguros, limitación de tamaño de subida, validación de inputs y escaneo de dependencias.

## 7. Estructura de carpetas sugerida (inicio)

- /apps
  - /api (tasks-service: NestJS)
  - /auth (auth-service)
  - /web (nextjs)
- /packages
  - /common (tipos, utilidades compartidas)
  - /db (migrations, seeds)
- /infra
  - /k8s
  - /helm
  - /terraform
- /scripts
- /docs
- /ARCHITECTURE.md

## 8. Primeros pasos / Roadmap inicial

1. Scaffold monorepo con directorios iniciales y README por servicio.
2. Implementar auth-service mínimo (registro/login JWT) y tasks-service con endpoints CRUD.
3. Añadir Docker Compose con Postgres, Redis, RabbitMQ, MinIO y una instancia de Meilisearch para desarrollo.
4. Pipelines de CI: lint, tests unitarios, build de images.
5. Instrumentación básica: logs (JSON), Prometheus metrics.
6. Crear documentación de API (Swagger/OpenAPI) y políticas de versionado (v1).

## 9. Recomendaciones finales

- Mantener el dominio y la lógica de negocio alejados de infra y frameworks (adoptar patrones de Clean Architecture/Hexagonal).
- Escribir tests desde el inicio: unitarios, integración y end-to-end para flujos críticos.
- Revisar decisiones cada sprint: el tamaño del equipo y la carga de usuarios guiarán si migrar a microservicios o mantener monolito modular.
- Automatizar despliegues y backups de base de datos desde las primeras etapas.

---

Documento creado para servir como guía de arquitectura inicial. Ajustes posteriores deben registrarse en este mismo archivo y en decisiones de arquitectura (ADR) separadas en /docs/adr/.
