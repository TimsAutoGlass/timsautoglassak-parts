import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VehicleProfile from './pages/VehicleProfile';
import PartProfile from './pages/PartProfile';
import { Sun, Moon } from 'lucide-react';
import './index.css';

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <Router>
      <header className="app-header">
        <a href="/" className="logo">
          <img src="/logo.svg" alt="Tim's Auto Glass" style={{ height: '28px', marginRight: '8px' }} />
          Parts Intelligence
        </a>
        <button 
          onClick={toggleTheme}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicle/:make/:model/:year" element={<VehicleProfile />} />
          <Route path="/part/:partNumber" element={<PartProfile />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
