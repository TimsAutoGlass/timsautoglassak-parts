import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [makes, setMakes] = useState([]);

  useEffect(() => {
    // We are natively fetching the CF Pages mounted static files that the repo generates
    // In dev mode, this hits the `public/api/` folder we copy over.
    fetch('/api/vehicles-index/makes.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.makes) setMakes(data.makes);
      })
      .catch(console.error);
    
    // For a fast demo, we'll fetch the top 50 vehicles index or just mock a few for the search presentation
    setVehicles([
      { make: 'FORD', model: 'F-150', year: 2019, type: 'PICKUP' },
      { make: 'CHEVROLET', model: 'SILVERADO 1500', year: 2021, type: 'PICKUP' },
      { make: 'KIA', model: 'SORENTO', year: 2019, type: 'SUV' },
      { make: 'TOYOTA', model: 'TACOMA', year: 2022, type: 'PICKUP' }
    ]);
  }, []);

  const filtered = search.trim() === '' 
    ? vehicles 
    : vehicles.filter(v => 
        `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <div className="container animate-in">
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '20px', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>
          OPEN DATA ECOSYSTEM
        </div>
        <h1>Vehicle Parts Intelligence</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore confidence-rated auto glass part numbers, features, and historical pricing matrices parsed directly from the public GitHub repository.
        </p>
      </div>

      <div className="search-container delay-1">
        <Search style={{ position: 'absolute', left: '1.25rem', top: '1.25rem', color: '#94a3b8' }} size={24} />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search by VIN, Make, Model, or Year..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '3.5rem' }}
        />
      </div>

      <div className="animate-in delay-2">
        <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          <span>Trending Lookups</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 400 }}>{makes.length} Supported Makes</span>
        </h2>
        
        <div className="results-grid">
          {filtered.map((v, i) => (
            <Link to={`/vehicle/${v.make.toLowerCase()}/${v.model.toLowerCase().replace(/ /g, '-')}/${v.year}`} key={i} className="glass vehicle-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>{v.year}</div>
              <h3>{v.make} {v.model}</h3>
              <div className="tag" style={{ marginTop: 'auto' }}>{v.type}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
