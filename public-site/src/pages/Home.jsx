import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, DatabaseZap, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState('ALL');
  const searchRef = useRef(null);

  useEffect(() => {
    // Fetch Supported Makes count
    fetch('/api/vehicles-index/makes.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.makes) setMakes(data.makes);
      })
      .catch(console.error);
      
    // Fetch full master registry of currently processed vehicles inside the graph
    fetch('/api/parts-index/_vehicles_master.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setVehicles(data);
      })
      .catch(console.error);

    // CMD+K Focus Logic
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = vehicles.filter(v => {
    const matchesSearch = search.trim() === '' || `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(search.toLowerCase());
    const matchesMake = selectedMake === 'ALL' || v.make.toUpperCase() === selectedMake.toUpperCase();
    return matchesSearch && matchesMake;
  });

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
        <div style={{ position: 'relative', display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search style={{ position: 'absolute', left: '1.25rem', top: '1.25rem', color: '#94a3b8' }} size={24} />
            <input 
              ref={searchRef}
              type="text" 
              className="search-input" 
              placeholder="Search by VIN, Make, Model, or Year..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '3.5rem' }}
            />
            <div style={{ position: 'absolute', right: '1.25rem', top: '1.35rem', color: 'var(--text-muted)', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', pointerEvents: 'none' }}>
              ⌘K
            </div>
          </div>
          
          <select 
            value={selectedMake} 
            onChange={(e) => setSelectedMake(e.target.value)}
            className="search-input"
            style={{ width: 'auto', paddingLeft: '1rem', paddingRight: '2rem', cursor: 'pointer', appearance: 'none' }}
          >
            <option value="ALL">All Makes</option>
            {makes.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        
        {/* Trust Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', animation: 'fadeUp 0.5s 0.2s backwards' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <DatabaseZap size={18} color="var(--primary)" />
            <span>NHTSA Baseline Auto-Sync</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <ShieldCheck size={18} color="var(--accent)" />
            <span>OEM & OEE Interchange Maps</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <CheckCircle2 size={18} color="#fbbf24" />
            <span>24/7 Verified Integrity</span>
          </div>
        </div>
      </div>

      <div className="animate-in delay-2" style={{ marginTop: '3rem' }}>
        <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          <span>{search.trim() === '' ? 'Latest Additions' : 'Search Results'}</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 400 }}>{filtered.length} matches across {makes.length} Supported Makes</span>
        </h2>
        
        <div className="results-grid">
          {filtered.slice(0, 16).map((v, i) => (
            <Link to={`/vehicle/${v.make.toLowerCase()}/${v.model.toLowerCase().replace(/ /g, '-')}/${v.year}`} key={i} className="glass vehicle-card" style={{ animationDelay: `${(i % 8) * 0.1}s` }}>
              <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>{v.year}</div>
              <h3>{v.make} {v.model}</h3>
              <div className="tag" style={{ marginTop: 'auto' }}>{v.type}</div>
            </Link>
          ))}
          {filtered.length > 16 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '1rem', fontSize: '0.875rem' }}>
              Refine your search to see more than 16 results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
