import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VehicleProfile from './pages/VehicleProfile';
import { Database, Search } from 'lucide-react';
import './index.css';

function App() {
  return (
    <Router>
      <header className="app-header">
        <a href="/" className="logo">
          <Database size={24} color="#3b82f6" />
          Tim's Auto Glass — Parts Intelligence
        </a>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicle/:make/:model/:year" element={<VehicleProfile />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
