# POC Rate Limit - Sistema Anti-Abuso para Recargas

Este es un **Proof of Concept (POC)** desarrollado en **NestJS** que implementa un sistema de rate limiting para prevenir abuso en un endpoint de validación de líneas telefónicas. Utiliza **Redis** para gestionar los límites de velocidad y bloqueos temporales.

## 🚀 Características

- **Rate Limiting**: Límite de 10 solicitudes por minuto por visitante
- **Bloqueo temporal**: Bloqueo de 15 minutos tras superar el límite
- **Persistencia en Redis**: Gestión eficiente de contadores y bloqueos
- **Simulación realista**: Incluye delays artificiales para simular errores de red
- **API RESTful**: Endpoint simple para validación de líneas

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

**❌ Datos faltantes (400)**

```json
{
  "error": "Faltan datos"
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

### Con Postman

1. Crear una nueva request POST
2. URL: `http://localhost:3000/api/validar-linea`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):

```json
{
  "numeroLinea": "1112345678",
  "visitorId": "unique-visitor-id"
}
```

### Prueba de Rate Limiting

Para probar el rate limiting, ejecuta la misma request más de 10 veces en 1 minuto con el mismo `visitorId`.

## ⚙️ Configuración del Rate Limiting

### Parámetros actuales

- **Límite de requests**: 10 por minuto
- **Ventana de tiempo**: 60 segundos
- **Tiempo de bloqueo**: 15 minutos (900 segundos)
- **Simulación de error**: 30% de probabilidad

### Modificar configuración

En `src/rate-limit/rate-limit.service.ts`:

```typescript
// Cambiar límite de requests
return count <= 10; // Modificar este número

// Cambiar ventana de tiempo
await this.redis.expire(key, 60); // segundos

// Cambiar tiempo de bloqueo
await this.redis.set(key, '1', 'EX', 900); // segundos
```

## 📁 Estructura del Proyecto

```bash
src/
├── app.module.ts           # Módulo principal con configuración de Redis
├── main.ts                 # Punto de entrada de la aplicación
├── rate-limit/
│   └── rate-limit.service.ts   # Lógica de rate limiting
└── recargas/
    └── recargas.controller.ts  # Controlador del endpoint
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

# Producción
npm run build
npm run start:prod

# Testing
npm run test
npm run test:e2e
npm run test:cov

# Linting y formato
npm run lint
npm run format
```
