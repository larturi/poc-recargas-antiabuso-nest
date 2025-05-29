# POC Rate Limit - Sistema Anti-Abuso para Recargas

Este es un **Proof of Concept (POC)** desarrollado en **NestJS** que implementa un sistema de rate limiting para prevenir abuso en un endpoint de validación de líneas. Utiliza **Redis** para gestionar los límites y bloqueos.

## 🚀 Características

- **Rate Limiting**: Límite de 10 solicitudes por minuto por visitante
- **Bloqueo temporal**: Bloqueo de 15 minutos tras superar el límite
- **Persistencia en Redis**: Utiliza redis para los contadores y bloqueos

## 🛠️ Stack Tecnológico

- **Framework**: NestJS
- **Base de datos**: Redis
- **Lenguaje**: TypeScript
- **Runtime**: Node.js
- **Contenedores**: Docker & Docker Compose

## 📋 Prerrequisitos

- Node.js (v18 o superior)
- npm
- Docker y Docker Compose

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd poc-recargas-antiabuso-nest
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Levantar Redis con Docker

```bash
docker-compose up -d
```

### 4. Levantar la aplicación en modo desarrollo

```bash
npm run start:dev
```

### Prueba de Rate Limiting

Para probar el rate limiting, utilizar el frontend Next.js que implementa FingerprintJS para generar un `visitorId` único.

<https://github.com/larturi/poc-recargas-antiabuso-next>

## ⚙️ Configuración del Rate Limiting

### Modificar configuración

En `src/constants.ts`:

```typescript
// Cambiar límite de requests
export const RATE_LIMIT_MAX_REQUESTS = 10

// Cambiar ventana de tiempo
export const RATE_LIMIT_DURATION_SECONDS = 60

// Cambiar tiempo de bloqueo
export const RATE_LIMIT_BLOCK_DURATION_SECONDS = 900 // (15 minutos)
```

## 📁 Estructura del Proyecto

```bash
src/
├── app.module.ts               # Módulo principal con configuración de Redis
├── main.ts                     # Punto de entrada de la aplicación
├── constants.ts                # Configuración del límit (cantidad y segundos)
├── rate-limit/
│   └── rate-limit.service.ts   # Lógica de rate limiting
└── recargas/
    └── recargas.controller.ts  # Controlador del endpoint
```

La aplicación estará disponible en `http://localhost:3000`

## 📡 API Endpoints

### POST `/api/validar-linea`

Valida una línea telefónica aplicando rate limiting por visitor.

**Request Body:**

```json
{
  "numeroLinea": "1112345678",
  "visitorId": "abc123456789"
}
```

**Responses:**

**✅ Éxito (200)**

```json
{
  "success": true,
  "data": {
    "mensaje": "Línea válida",
    "numero": "1112345678"
  }
}
```

**❌ Error de validación (200)**

```json
{
  "success": false,
  "message": "No pudimos procesar tu solicitud. Intentá más tarde."
}
```

**🚫 Rate limit excedido (429)**

```json
{
  "error": "Límite superado. Acceso bloqueado temporalmente."
}
```

**🔒 Visitor bloqueado (429)**

```json
{
  "error": "Demasiados intentos. Intentá más tarde."
}
```

## 🧪 Pruebas

### Con cURL

```bash
curl --location 'http://localhost:3000/api/validar-linea' \
--header 'Content-Type: application/json' \
--data '{
  "numeroLinea": "1112345678",
  "visitorId": "abc123456789"
}'
```

## 🐳 Docker

### Levantar solo Redis

```bash
docker-compose up -d redis
```

### Ver logs de Redis

```bash
docker logs redis-local
```

### Detener Redis

```bash
docker-compose down
```

## 🔍 Monitoreo de Redis

### Conectar a Redis CLI

```bash
docker exec -it redis-local redis-cli
```

### Comandos útiles en Redis

```redis
# Ver todas las keys de rate limiting
KEYS rate:*

# Ver contador de un visitor específico
GET rate:visitor-id

# Ver si un visitor está bloqueado
GET rate:block:visitor-id

# Ver TTL de una key
TTL rate:visitor-id

# Limpiar todas las keys (¡Cuidado!)
FLUSHALL
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev
```
