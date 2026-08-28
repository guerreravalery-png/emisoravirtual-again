# Emisora Virtual

Aplicación web para el módulo de control e interacción de una emisora escolar. Permite iniciar sesión, publicar avisos y recibir opiniones sobre la programación musical.

No hay registro de usuarios desde la app: el usuario se crea directamente en la base de datos (ver sección "Crear el usuario" abajo).

## Estructura del proyecto

```
emisoravirtual-again/
├── backend/    # API en Node.js + Express + MySQL
└── frontend/   # Interfaz en React
```

## Requisitos

- Node.js 18+
- MySQL (por ejemplo, vía XAMPP)

## Backend

```bash
cd backend
npm install
cp .env.example .env   # completa tus credenciales de MySQL
npm run dev
```

El servidor corre por defecto en `http://localhost:3001`.

Antes de arrancar, crea la base de datos y las tablas con el script incluido:

```bash
mysql -u root -p < schema.sql
```

## Crear el usuario

Como no hay pantalla de registro, el único usuario se crea a mano en MySQL. La contraseña debe guardarse con hash (no en texto plano), así que usa el script incluido para generarlo:

```bash
cd backend
node hash-password.js miContraseña123
```

Copia el hash que te imprime y pégalo en un INSERT como el que te muestra el propio script, por ejemplo:

```sql
INSERT INTO usuarios (usuario, password) VALUES ('admin', '<hash-generado>');
```

## Frontend

```bash
cd frontend
npm install
npm start
```

La app corre en `http://localhost:3000` y consume la API definida en `REACT_APP_API_URL` (por defecto `http://localhost:3001`).

## Endpoints de la API

| Método | Ruta         | Descripción                          |
|--------|--------------|---------------------------------------|
| POST   | `/login`     | Autenticación de usuario              |
| GET    | `/avisos`    | Lista de avisos publicados            |
| POST   | `/avisos`    | Crear un nuevo aviso                  |
| GET    | `/opiniones` | Lista de comentarios/opiniones        |
| POST   | `/opiniones` | Enviar una opinión musical            |
