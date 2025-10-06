import { Link, NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Thanks from './pages/Thanks'

// 👇 Add the chat dock
import ChatDock from './components/ChatDock'
// 👇 Add the Logo component
import Logo from './components/Logo'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            <Logo size={34} />
            <div>
              <div className="brand-text">Sophia — Software Solutions</div>
              <span className="brand-sub">Design • Build • Ship</span>
            </div>
          </Link>

          {/* SINGLE NAV (header only) */}
          <nav className="nav" aria-label="Main">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/privacy">Privacy</NavLink>
            <Link className="cta" to="/contact" aria-label="Design a project">
              DESIGN A PROJECT
            </Link>
          </nav>
        </div>
      </header>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/thanks" element={<Thanks />} />
      </Routes>

      {/* Footer — no duplicate nav */}
      <footer className="footer">
        <div className="container footer-inner">
          © {new Date().getFullYear()} Sophia — Software Solutions
        </div>
      </footer>

      {/* Fixed-position chat dock (Blueprint Planner) */}
      <ChatDock />
    </div>
  )
}
