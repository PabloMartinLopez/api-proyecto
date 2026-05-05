# API Proyecto - La Buhardilla

Esta es una API RESTual construida con Node.js y Express, diseñada para gestionar una colección de videojuegos. Utiliza PostgreSQL para el almacenamiento relacional de datos y Firebase para la autenticación de usuarios.

## Estructura del Proyecto

```text
api-proyecto/
├── config/        # Configuraciones de conexión (Firebase, Postgres, etc.)
├── controllers/   # Controladores que manejan la lógica de negocio de cada ruta
├── models/        # Modelos de datos que interactúan con la base de datos (Postgres/Firebase)
├── routes/        # Definición de las rutas del API usando Express Router
├── test/          # Batería de tests funcionales usando Vitest y Supertest
├── .env           # Archivo de variables de entorno (no incluido en versionado)
├── index.js       # Punto de entrada de la aplicación y configuración de Express
├── package.json   # Dependencias y scripts del proyecto
├── Dockerfile     # Configuración para dockerizar la aplicación
└── README.md      # Este archivo de documentación
```

## Endpoints de la API

### Videogames (`/api/videogames`)
- `GET /` - Obtiene todos los videojuegos disponibles.
- `GET /:id` - Obtiene los detalles de un videojuego específico por su ID.
- `GET /user/:id` - Obtiene la lista de videojuegos asociados a un usuario específico.
- `POST /` - Crea un nuevo videojuego, añadiendo opcionalmente su compañía y colección.

### Users (`/api/users`)
- `GET /` - Obtiene todos los usuarios registrados.
- `GET /:id` - Obtiene los detalles de un usuario específico por su ID.
- `GET /:id/suggestion` - Obtiene listas de juegos sugeridos para el usuario.
- `POST /:id/follow` - Alterna el estado de seguimiento entre usuarios (seguir/dejar de seguir).
- `POST /login` - Autentica a un usuario usando credenciales de Firebase (`email` y `password`) y devuelve los datos del usuario.

### Platforms (`/api/platforms`)
- `GET /` - Obtiene todas las plataformas disponibles.
- `GET /users/:id` - Obtiene la lista de plataformas asociadas a un usuario en específico.
- `POST /` - Crea una nueva plataforma.

### Companies (`/api/companies`)
- `GET /` - Obtiene la lista completa de compañías de videojuegos registradas.

### Collections (`/api/collections`)
- `GET /:User_id` - Obtiene las colecciones de videojuegos asociadas a un usuario en específico.
- `POST /` - Crea una nueva colección.

### Search (`/api/search`)
- `GET /` - Realiza búsquedas de elementos en la base de datos.

### Game (`/api/game`)
- `GET /:videogame_id` - Obtiene los comentarios y detalles de un videojuego específico.
- `GET /user/:user_id` - Obtiene los comentarios y juegos asociados a un usuario.
- `POST /:videogame_id` - Crea o añade una interacción (juego/comentario) para un videojuego específico.

### Player Statistics (`/api/Playerstat`)
- `GET /:id` - Obtiene las estadísticas (horas jugadas, número de juegos, etc.) de un jugador.

### Health (`/api/health`)
- `GET /` - Endpoint de verificación del estado y conectividad de la API.

## Configuración y Ejecución Local

### Prerrequisitos
- Node.js (v18+)
- PostgreSQL
- Proyecto de Firebase (Autenticación)

### Instalación

1. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   ```
2. Configura las variables de entorno en el archivo `.env`:
   ```env
   PORT=3000
   # Añade credenciales de Postgres y Firebase
   ```
3. Ejecuta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

### Tests
El proyecto incluye tests unitarios simulando la base de datos para no requerir conexiones activas. Para ejecutarlos:
```bash
npm run test
```

## Dockerización
Para desplegar la aplicación usando Docker tienes dos opciones:

### Usando Docker Compose (Recomendado)
Es la forma más sencilla. Asegúrate de tener tu archivo `.env` configurado e inicializa los servicios con:
```bash
docker-compose up -d
```
*(Nota: El archivo `docker-compose.yml` viene preparado para levantar también una base de datos PostgreSQL si descomentas las líneas correspondientes).*

### Usando Docker CLI directamente
1. Crea la imagen del contenedor:
   ```bash
   docker build -t api-buhardilla .
   ```
2. Ejecuta el contenedor:
   ```bash
   docker run -d -p 3000:3000 --env-file .env --name api-buhardilla api-buhardilla
   ```
