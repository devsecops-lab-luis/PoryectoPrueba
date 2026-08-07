---
title: "PoryectoPrueba - Documentación"
author: "LuisssGit"
date: "2026-08-07"
lang: "es-ES"
---

# PoryectoPrueba

**Proyecto de gestión de tareas por usuario**

Esta documentación cubre cómo instalar, ejecutar, desarrollar y contribuir al proyecto. Incluye instrucciones para generar documentación de API desde TypeScript (TypeDoc) y para convertir la documentación a PDF.

## Tabla de contenidos

- [Resumen](#resumen)
- [Requisitos](#requisitos)
- [Instalación](#instalaci%C3%B3n)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Uso (desarrollo y producción)](#uso-desarrollo-y-producci%C3%B3n)
- [Docker](#docker)
- [API y documentación técnica (TypeDoc)](#api-y-documentaci%C3%B3n-t%C3%A9cnica-typedoc)
- [Pruebas](#pruebas)
- [Cómo generar el PDF](#c%C3%B3mo-generar-el-pdf)
- [Contribuir](#contribuir)
- [Licencia](#licencia)


## Resumen

PoryectoPrueba es una aplicación backend/frontend (según la arquitectura del repo) escrita principalmente en TypeScript para gestionar tareas por usuario. Provee endpoints para crear, asignar, listar y actualizar tareas, y utilidades para autenticación y gestión de usuarios.

## Requisitos

- Node.js 18+ (recomendado) o la versión configurada en el proyecto
- npm o yarn
- Docker (opcional, para despliegue en contenedores)
- Pandoc + LaTeX (solo necesarios si quieres generar el PDF localmente)

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/LuisssGit/PoryectoPrueba.git
cd PoryectoPrueba
```

2. Instala dependencias:

```bash
npm install
# o
# yarn install
```

3. Variables de entorno

Crea un archivo `.env` en la raíz con las variables necesarias (ejemplo):

```env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/poryectoprueba
JWT_SECRET=tu_secreto
```

Ajusta según la configuración real del proyecto.

## Estructura del proyecto

- `src/` — Código fuente TypeScript
- `tests/` — Pruebas unitarias/integración
- `Dockerfile` — Imagen para producción
- `docs/` — Documentación del proyecto (esta carpeta)

## Uso (desarrollo y producción)

### Desarrollo

```bash
npm run dev
```

(Define `dev` en `package.json`, por ejemplo con `ts-node-dev` o `nodemon`)

### Producción

Build y ejecutar:

```bash
npm run build
npm start
```

## Docker

Construir imagen:

```bash
docker build -t poryectoprueba:latest .
```

Ejecutar contenedor:

```bash
docker run -d -p 3000:3000 --env-file .env poryectoprueba:latest
```

## API y documentación técnica (TypeDoc)

Para generar documentación de la API desde TypeScript usando TypeDoc:

1. Instala TypeDoc y el plugin de salida si hace falta:

```bash
npm install --save-dev typedoc
```

2. Añade un script en `package.json`:

```json
"scripts": {
  "docs:typedoc": "typedoc --out docs/typedoc ./src"
}
```

3. Ejecuta:

```bash
npm run docs:typedoc
```

Esto generará documentación HTML en `docs/typedoc`. Si quieres incluir la documentación de TypeDoc en el PDF final, puedes:

- Generar el HTML y exportarlo a PDF con una herramienta (por ejemplo, wkhtmltopdf) y añadirlo a `docs/`.
- O extraer secciones críticas y pegarlas en `docs/DOCUMENTACION.md` para que Pandoc lo incluya en el PDF.

## Pruebas

Ejecutar pruebas locales:

```bash
npm test
# o
# npm run test:coverage
```

Configura `jest` o la librería de pruebas que uses en el proyecto.

## Cómo generar el PDF

Hay dos formas:

1. Automática (GitHub Actions, incluida): la acción `.github/workflows/generate-docs.yml` convierte `docs/DOCUMENTACION.md` a `docs/DOCUMENTACION.pdf` y lo añade al repositorio en cada push a `main` o desde `workflow_dispatch`.

2. Local (manual) usando Pandoc:

```bash
sudo apt-get update
sudo apt-get install -y pandoc texlive-latex-recommended texlive-latex-extra texlive-fonts-recommended
pandoc docs/DOCUMENTACION.md -o docs/DOCUMENTACION.pdf --metadata title="PoryectoPrueba Documentación"
```

Si necesitas una portada con logo, añade una imagen `docs/logo.png` y usa la opción de Pandoc para incluirla en la primera página.

## Contribuir

1. Haz fork o crea una rama nueva:

```bash
git checkout -b feat/nueva-caracteristica
```

2. Haz tus cambios y tests.
3. Abre un Pull Request describiendo los cambios.

Por favor sigue el estilo de código del proyecto y añade pruebas para nuevas funcionalidades.

## Licencia

Incluye aquí la licencia del proyecto (por ejemplo MIT). Si no hay, decide una y añádela en `LICENSE`.

---

> Nota: Este documento inicial fue generado automáticamente. Revisa y ajusta ejemplos de comandos, variables de entorno y rutas a la estructura real del repositorio.