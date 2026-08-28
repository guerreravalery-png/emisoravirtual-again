import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import logo from "./assets/logo.jpeg"; 

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

// Canciones sugeridas por género con rutas limpias y sin espacios
const CANCIONES_POR_GENERO = {
  pop: [
    { titulo: "Levitating - Dua Lipa", audioUrl: "/audio/DuaLipa-Levitating.mp3" },
    { titulo: "As It Was - Harry Styles", audioUrl: "/audio/HarryStyles-AsItWas.mp3" },
  ],
  rock: [
    { titulo: "Bohemian Rhapsody - Queen", audioUrl: "/audio/Queen-Bohemian.mp3" },
    { titulo: "Smells Like Teen Spirit - Nirvana", audioUrl: "/audio/Nirvana-Smells.mp3" },
  ],
  reggaeton: [
    { titulo: "Danza Kuduro - Don Omar", audioUrl: "/audio/DonOmarDanza.mp3" },
    { titulo: "Morado - J Balvin", audioUrl: "/audio/JBalvinMorado.mp3" },
  ],
  vallenato: [
    { titulo: "Volví a Nacer - Carlos Vives", audioUrl: "/audio/CarlosVives.mp3" },
    { titulo: "La Creciente - Los Diablitos", audioUrl: "/audio/LaCreciente.mp3" },
  ],
  salsa: [
    { titulo: "Vivir Mi Vida - Marc Anthony", audioUrl: "/audio/MarcAnthony.mp3" },
    { titulo: "La Rebelión - Joe Arroyo", audioUrl: "/audio/JoeArroyoLaRebelion.mp3" },
  ],
  electronica: [
    { titulo: "Titanium - David Guetta ft. Sia", audioUrl: "/audio/DavidGuettaSia-Titanium.mp3" },
    { titulo: "Wake Me Up - Avicii", audioUrl: "/audio/Avicii.mp3" },
  ],
  clasica: [
    { titulo: "Sinfonía No. 5 - Beethoven", audioUrl: "/audio/sinfonia.mp3" },
    { titulo: "Las Cuatro Estaciones - Vivaldi", audioUrl: "/audio/Vivaldi.mp3" },
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

  // Variable que filtra dinámicamente las canciones según el select
  const cancionesActuales = CANCIONES_POR_GENERO[generoSeleccionado] || [];

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

        {/* Canciones por género con reproductor */}
        <section id="canciones" className="canciones-section">
          <h2>🎵 Canciones</h2>
          <label htmlFor="genero-select">Elige un género:</label>
          <select
            id="genero-select"
            className="genero-select"
            value={generoSeleccionado}
            onChange={(e) => {
              console.id = e.target.value; // Forzar lectura limpia
              setGeneroSeleccionado(e.target.value);
            }}
          >
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="reggaeton">Reggaetón</option>
            <option value="vallenato">Vallenato</option>
            <option value="salsa">Salsa</option>
            <option value="electronica">Electrónica</option>
            <option value="clasica">Clásica</option>
          </select>
          
          <div className="canciones-lista">
            {CANCIONES_POR_GENERO[generoSeleccionado] && CANCIONES_POR_GENERO[generoSeleccionado].map((item, index) => (
              <div key={`${generoSeleccionado}-${index}`} className="cancion-card" style={{ marginBottom: "20px", padding: "15px", background: "#f9f9f9", borderRadius: "8px" }}>
                <p style={{ fontWeight: "bold", marginBottom: "8px" }}>{item.titulo}</p>
                <audio controls style={{ width: "100%" }}>
                  <source src={item.audioUrl} type="audio/mpeg" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            ))}
          </div>
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
          <h2>🌍 Emisoras Mundiales Gratis 📻</h2>
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

export default App;