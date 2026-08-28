require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

// Pool de conexiones a MySQL (mejor que una sola conexión: reconecta sola,
// soporta varias peticiones simultáneas y no requiere credenciales fijas en el código).
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "emisora_colegio",
  waitForConnections: true,
  connectionLimit: 10,
});

// Verificar la conexión al arrancar
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Conectado a la base de datos MySQL");
    conn.release();
  } catch (err) {
    console.error("Error conectando a la base de datos:", err.message);
  }
})();

// --- Avisos ---

app.get("/avisos", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM noticias ORDER BY fecha DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener avisos" });
  }
});

app.post("/avisos", async (req, res) => {
  const { titulo, descripcion, tipo } = req.body;
  if (!titulo || !descripcion) {
    return res.status(400).json({ message: "Título y descripción son obligatorios" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO noticias (titulo, descripcion, tipo) VALUES (?, ?, ?)",
      [titulo, descripcion, tipo || "aviso"]
    );
    res.status(201).json({ id: result.insertId, titulo, descripcion, tipo: tipo || "aviso" });
  } catch (err) {
    res.status(500).json({ message: "Error al crear el aviso" });
  }
});

// --- Login ---

app.post("/login", async (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) {
    return res.status(400).json({ loggedIn: false, message: "Usuario y contraseña son obligatorios" });
  }
  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = ?",
      [usuario]
    );
    if (rows.length === 0) {
      return res.status(401).json({ loggedIn: false, message: "Usuario o contraseña incorrectos" });
    }
    const coincide = await bcrypt.compare(password, rows[0].password);
    if (!coincide) {
      return res.status(401).json({ loggedIn: false, message: "Usuario o contraseña incorrectos" });
    }
    res.json({ loggedIn: true, message: "Bienvenido" });
  } catch (err) {
    res.status(500).json({ loggedIn: false, message: "Error del servidor" });
  }
});

// --- Opiniones / Caja de comentarios ---

app.get("/opiniones", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM opiniones ORDER BY fecha DESC LIMIT 50"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los comentarios" });
  }
});

app.post("/opiniones", async (req, res) => {
  const { nombre, genero, comentario } = req.body;
  if (!nombre || !comentario) {
    return res.status(400).json({ message: "Nombre y comentario son obligatorios" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO opiniones (nombre, genero, comentario) VALUES (?, ?, ?)",
      [nombre, genero || null, comentario]
    );
    res.status(201).json({
      message: "Opinión enviada, ¡gracias!",
      comentario: { id: result.insertId, nombre, genero: genero || null, comentario, fecha: new Date() },
    });
  } catch (err) {
    res.status(500).json({ message: "Error al enviar la opinión" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
