import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VehicleProfile from './pages/VehicleProfile';
import PartProfile from './pages/PartProfile';
import { Database, Search } from 'lucide-react';
import './index.css';

function App() {
  return (
    <Router>
      <header className="app-header">
        <a href="/" className="logo">
          <img src="/logo.svg" alt="Tim's Auto Glass" style={{ height: '28px', marginRight: '8px' }} />
          Parts Intelligence
        </a>
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
