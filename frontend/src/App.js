import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import logo from "./assets/logo.jpeg"; 
import banner from "./assets/banner.jpeg";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

// Canciones sugeridas por género
const CANCIONES_POR_GENERO = {
  pop: [
    "Levitating - Dua Lipa",
    "As It Was - Harry Styles",
    "Blinding Lights - The Weeknd",
  ],
  rock: [
    "Bohemian Rhapsody - Queen",
    "Smells Like Teen Spirit - Nirvana",
    "Otherside - Red Hot Chili Peppers",
  ],
  reggaeton: [
    "Gasolina - Daddy Yankee",
    "Danza Kuduro - Don Omar",
    "La Botella - J Balvin",
  ],
  vallenato: [
    "La Gota Fría - Carlos Vives",
    "Volví a Nacer - Carlos Vives",
    "La Creciente - Los Diablitos",
  ],
  salsa: [
    "Vivir Mi Vida - Marc Anthony",
    "Pedro Navaja - Rubén Blades",
    "La Rebelión - Joe Arroyo",
  ],
  electronica: [
    "Titanium - David Guetta ft. Sia",
    "Wake Me Up - Avicii",
    "Strobe - Deadmau5",
  ],
  clasica: [
    "Sinfonía No. 5 - Beethoven",
    "Las Cuatro Estaciones - Vivaldi",
    "Claro de Luna - Debussy",
  ],
  jazz: [
    "Take Five - Dave Brubeck",
    "So What - Miles Davis",
    "Feeling Good - Nina Simone",
  ],
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [avisos, setAvisos] = useState([]);
  const [nuevoAviso, setNuevoAviso] = useState({ titulo: "", descripcion: "" });

  // Estado para opiniones / caja de comentarios
  const [opinion, setOpinion] = useState({ nombre: "", genero: "pop", comentario: "" });
  const [comentarios, setComentarios] = useState([]);

  // Estado para el desplegable de géneros musicales
  const [generoSeleccionado, setGeneroSeleccionado] = useState("pop");

  // 🔹 Cargar avisos y comentarios al iniciar sesión
  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`${API_URL}/avisos`)
        .then(res => setAvisos(res.data))
        .catch(err => console.error("Error al obtener avisos:", err));

      axios.get(`${API_URL}/opiniones`)
        .then(res => setComentarios(res.data))
        .catch(err => console.error("Error al obtener comentarios:", err));
    }
  }, [isLoggedIn]);

  // 🔹 Login
  const handleLogin = () => {
    axios.post(`${API_URL}/login`, { usuario, password })
      .then(res => {
        if (res.data.loggedIn) {
          setIsLoggedIn(true);
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => {
        console.error("Error en login:", err);
        alert(err.response?.data?.message || "Usuario o contraseña incorrectos");
      });
  };

  // 🔹 Agregar aviso
  const handleAgregarAviso = (e) => {
    e.preventDefault();
    axios.post(`${API_URL}/avisos`, nuevoAviso)
      .then(res => {
        setAvisos([...avisos, res.data]);
        setNuevoAviso({ titulo: "", descripcion: "" });
      })
      .catch(err => console.error("Error al agregar aviso:", err));
  };

  // 🔹 Comentarios / opiniones sobre música
  const handleOpinion = (e) => {
    e.preventDefault();
    axios.post(`${API_URL}/opiniones`, opinion)
      .then(res => {
        if (res.data.comentario) {
          setComentarios([res.data.comentario, ...comentarios]);
        }
        setOpinion({ nombre: "", genero: "pop", comentario: "" });
      })
      .catch(err => console.error("Error al enviar opinión:", err));
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box animate-fade">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2>Iniciar sesión</h2>
          <input type="text" placeholder="Usuario" onChange={(e) => setUsuario(e.target.value)} />
          <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Ingresar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header-emisora">
        <div className="header-top">
          <img src={logo} alt="Logo" className="logo-img" />
          <h1>EMISORA VIRTUAL</h1>
          <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>Cerrar Sesión</button>
        </div>

        <nav className="navbar">
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#canciones">Canciones</a></li>
            <li><a href="#avisos">Avisos</a></li>
            <li><a href="#opiniones">Comentarios</a></li>
            <li><a href="#emisoras">Emisoras Mundiales</a></li>
          </ul>
        </nav>
      </header>

      <main className="content">
        <section className="hero">
        
          <h1>Bienvenidos a la Emisora Escolar</h1>
          <p>Sintoniza la mejor programación creada por y para los estudiantes.</p>
        </section>

        {/* Avisos */}
        <section id="avisos" className="avisos-section">
          <h2>Avisos de la Emisora 🔔</h2>
          <form className="form-avisos" onSubmit={handleAgregarAviso}>
            <input type="text" placeholder="Título del aviso" value={nuevoAviso.titulo} onChange={(e) => setNuevoAviso({ ...nuevoAviso, titulo: e.target.value })} required />
            <textarea placeholder="Descripción del aviso" value={nuevoAviso.descripcion} onChange={(e) => setNuevoAviso({ ...nuevoAviso, descripcion: e.target.value })} required />
            <button type="submit">Agregar Aviso</button>
          </form>
          <div className="avisos-lista">
            {avisos.length > 0 ? (
              avisos.map((aviso) => (
                <div key={aviso.id} className="aviso-card">
                  <h3>{aviso.titulo}</h3>
                  <p>{aviso.descripcion}</p>
                </div>
              ))
            ) : (
              <p>No hay avisos disponibles en este momento.</p>
            )}
          </div>
        </section>

        {/* Canciones por género */}
        <section id="canciones" className="canciones-section">
          <h2>🎵 Canciones</h2>
          <label htmlFor="genero-select">Elige un género:</label>
          <select
            id="genero-select"
            className="genero-select"
            value={generoSeleccionado}
            onChange={(e) => setGeneroSeleccionado(e.target.value)}
          >
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="reggaeton">Reggaetón</option>
            <option value="vallenato">Vallenato</option>
            <option value="salsa">Salsa</option>
            <option value="electronica">Electrónica</option>
            <option value="clasica">Clásica</option>
            <option value="jazz">Jazz</option>
          </select>
          <ul className="canciones-lista">
            {CANCIONES_POR_GENERO[generoSeleccionado].map((cancion) => (
              <li key={cancion}>{cancion}</li>
            ))}
          </ul>
        </section>

        {/* Opiniones / Caja de comentarios */}
        <section id="opiniones" className="opiniones-section">
          <div className="opiniones-card">
            <h2>💬 Caja de Comentarios</h2>
            <form className="form-opinion" onSubmit={handleOpinion}>
              <div className="form-opinion-row">
                <input type="text" placeholder="Tu nombre" value={opinion.nombre} onChange={(e) => setOpinion({ ...opinion, nombre: e.target.value })} required />
                <select
                  value={opinion.genero}
                  onChange={(e) => setOpinion({ ...opinion, genero: e.target.value })}
                >
                  <option value="pop">Pop</option>
                  <option value="rock">Rock</option>
                  <option value="reggaeton">Reggaetón</option>
                  <option value="vallenato">Vallenato</option>
                  <option value="salsa">Salsa</option>
                  <option value="electronica">Electrónica</option>
                  <option value="clasica">Clásica</option>
                  <option value="jazz">Jazz</option>
                </select>
              </div>
              <textarea placeholder="Escribe tu opinión o sugerencia musical" value={opinion.comentario} onChange={(e) => setOpinion({ ...opinion, comentario: e.target.value })} required />
              <button type="submit">Enviar Comentario</button>
            </form>
            <div className="comentarios-lista">
              {comentarios.length > 0 ? (
                comentarios.map((c) => (
                  <div key={c.id} className="comentario-card">
                    <div className="comentario-header">
                      <span className="comentario-avatar">{c.nombre.charAt(0).toUpperCase()}</span>
                      <div>
                        <strong>{c.nombre}</strong>
                        {c.genero && <span className="comentario-genero">{c.genero}</span>}
                      </div>
                    </div>
                    <p>{c.comentario}</p>
                  </div>
                ))
              ) : (
                <p className="comentarios-vacio">Sé el primero en comentar.</p>
              )}
            </div>
          </div>
        </section>

        {/* Emisoras Mundiales */}
        <section id="emisoras" className="emisoras-section">
          <h2> Emisoras Mundiales Gratis 📻</h2>
          <ul className="emisoras-lista">
            <li><a href="https://somafm.com/player/#/now-playing/groovesalad" target="_blank" rel="noopener noreferrer">SomaFM - Groove Salad (Ambient/Chillout)</a></li>
            <li><a href="https://www.wqxr.org/" target="_blank" rel="noopener noreferrer">WQXR - Clásica de Nueva York</a></li>
            <li><a href="https://www.radioswissjazz.ch/en" target="_blank" rel="noopener noreferrer">Swiss Radio - Smooth Jazz</a></li>
            <li><a href="https://www.bbc.co.uk/sounds/play/live:bbc_radio_one" target="_blank" rel="noopener noreferrer">BBC Radio 1 - Hits Internacionales</a></li>
            <li><a href="https://www.npr.org/music" target="_blank" rel="noopener noreferrer">NPR Music - Estados Unidos</a></li>
            <li><a href="https://radios.com.co/" target="_blank" rel="noopener noreferrer">Radios.com.co - Emisoras Colombianas Gratis</a></li>
            <li><a href="https://www.di.fm/" target="_blank" rel="noopener noreferrer">DI.FM - Electrónica y Dance Gratis</a></li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 - Proyecto Emisora Escolar</p>
      </footer>
    </div>
  );
}

export default App