import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Info, Package, AlertTriangle } from 'lucide-react';

export default function VehicleProfile() {
  const { make, model, year } = useParams();
  const [parts, setParts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch directly from the compiled local API structure
    Promise.all([
      fetch(`/api/parts/${make}/${model}/${year}/windshield.json`).then(r => r.ok ? r.json() : null),
      fetch(`/api/parts/${make}/${model}/${year}/back_glass.json`).then(r => r.ok ? r.json() : null)
    ])
    .then(([ws, bg]) => {
      setParts({ windshield: ws, back_glass: bg });
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError("Failed to load vehicle parts intelligence.");
      setLoading(false);
    });
  }, [make, model, year]);

  if (loading) return <div className="container animate-in">Loading Intelligence Profile...</div>;

  return (
    <div className="container animate-in">
      <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Back to Search
      </Link>

      <div className="profile-header glass" style={{ padding: '2rem', marginTop: '1rem', background: 'rgba(59, 130, 246, 0.05)' }}>
        <div>
          <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.25rem', marginBottom: '0.5rem' }}>{year}</div>
          <h1 style={{ marginBottom: 0, textTransform: 'uppercase' }}>{make} {model.replace(/-/g, ' ')}</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="tag success" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
            <ShieldCheck size={18} style={{ display: 'inline', marginBottom: '-4px', marginRight: '4px' }} />
            VERIFIED PROFILE
          </div>
        </div>
      </div>

      <div className="glass-grid">
        {['windshield', 'back_glass'].map((type) => {
          const data = parts[type];
          if (!data) return null;

          return (
            <div key={type} className="glass" style={{ padding: '1.5rem', animationDelay: '0.2s', animation: 'fadeUp 0.5s backwards' }}>
              <h2 style={{ textTransform: 'capitalize', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                {type.replace('_', ' ')}
                <span className="tag blue">{data.parts.length} Part Numbers Found</span>
              </h2>

              {data.notes && data.notes.length > 0 && (
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1rem', borderRadius: '8px', color: '#fbbf24', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                  <AlertTriangle size={18} />
                  <div>{data.notes.join(' • ')}</div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {data.parts.map((p, i) => (
                  <div key={i} className="part-item">
                    <div className="part-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Package size={16} color="var(--text-muted)" />
                        <Link to={`/part/${p.part_number}`} style={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-main)', textDecoration: 'none' }}>
                          <span style={{ borderBottom: '1px dashed var(--text-muted)' }}>{p.part_number}</span>
                        </Link>
                        <span className={`tag ${p.type === 'OEM' ? 'oem' : (p.type === 'aftermarket' ? 'aftermarket' : 'blue')}`} style={{ fontSize: '0.7rem' }}>
                          {p.type}
                        </span>
                      </div>
                      
                      {p.features && p.features.length > 0 && (
                        <div className="part-features">
                          {p.features.map(f => (
                            <span key={f} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                              {f.replace('_', ' ').toUpperCase()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Source: <span style={{ textTransform: 'capitalize' }}>{p.source}</span></div>
                      <div style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <Info size={14} color={p.confidence > 0.8 ? '#10b981' : '#fbbf24'} />
                        <span style={{ color: p.confidence > 0.8 ? '#10b981' : '#fbbf24' }}>
                          {Math.round(p.confidence * 100)}% Confidence
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
