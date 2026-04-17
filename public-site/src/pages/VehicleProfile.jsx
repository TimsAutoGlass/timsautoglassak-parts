import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Info, Package, AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react';

export const getOemCatalogUrl = (make, partNumber) => {
  const p = encodeURIComponent(partNumber);
  const m = make?.toUpperCase() || 'UNKNOWN';
  
  if (['CHEVROLET', 'GMC', 'CADILLAC', 'BUICK'].includes(m)) return `https://parts.chevrolet.com/search?searchTerm=${p}`;
  if (['FORD', 'LINCOLN'].includes(m)) return `https://parts.ford.com/shop/en/us/search?searchQuery=${p}`;
  if (['TOYOTA', 'LEXUS'].includes(m)) return `https://autoparts.toyota.com/search?search_query=${p}`;
  if (['HONDA', 'ACURA'].includes(m)) return `https://www.hondapartsnow.com/search?search_query=${p}`;
  if (['KIA'].includes(m)) return `https://www.kiapartsnow.com/search?search_query=${p}`;
  if (['HYUNDAI', 'GENESIS'].includes(m)) return `https://www.hyundaioemparts.com/search?search_query=${p}`;
  if (['SUBARU'].includes(m)) return `https://parts.subaru.com/productSearch.aspx?searchTerm=${p}`;
  if (['NISSAN', 'INFINITI'].includes(m)) return `https://parts.nissanusa.com/productSearch.aspx?searchTerm=${p}`;
  if (['JEEP', 'RAM', 'DODGE', 'CHRYSLER'].includes(m)) return `https://store.mopar.com/search?search_query=${p}`;
  if (['VOLKSWAGEN', 'AUDI'].includes(m)) return `https://parts.vw.com/productSearch.aspx?searchTerm=${p}`;
  if (['BMW', 'MINI'].includes(m)) return `https://www.getbmwparts.com/search?search_query=${p}`;
  
  return `https://www.google.com/search?q=${p}+${make}+OEM+Parts`;
};

const getSourceUrl = (source, partNumber, make) => {
  const p = encodeURIComponent(partNumber);
  switch(source.toLowerCase()) {
    case 'ebay': return `https://www.ebay.com/sch/i.html?_nkw=${p}`;
    case 'rockauto': return `https://www.rockauto.com/en/partsearch/?partnum=${p}`;
    case 'partsgeek': return `https://www.partsgeek.com/keyword/?searchkeyword=${p}`;
    case 'safelite': return `https://www.safelite.com/`;
    case 'dealer': return getOemCatalogUrl(make, partNumber);
    case 'oem': return getOemCatalogUrl(make, partNumber);
    default: return `https://www.google.com/search?q=${p}+auto+glass`;
  }
};

export default function VehicleProfile() {
  const { make, model, year } = useParams();
  const [parts, setParts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleCopy = (e, text) => {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

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

              {data.parts.some(p => p.features && p.features.some(f => f.toUpperCase().includes('ADAS'))) && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '8px', color: '#ef4444', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', fontWeight: 600 }}>
                  <AlertTriangle size={18} />
                  <div>⚠️ CALIBRATION WARNING: This vehicle requires ADAS camera recalibration after windshield replacement. Always quote the recalibration fee.</div>
                </div>
              )}

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
                        <button 
                          onClick={(e) => handleCopy(e, p.part_number)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: copied === p.part_number ? '#10b981' : 'var(--text-muted)' }}
                          title="Copy Part Number to Clipboard"
                        >
                          {copied === p.part_number ? <Check size={14} /> : <Copy size={14} />}
                        </button>
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
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <a 
                          href={getSourceUrl(p.source, p.part_number, make)} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}
                        >
                          Check {p.source.charAt(0).toUpperCase() + p.source.slice(1)} Pricing <ExternalLink size={12} />
                        </a>
                      </div>
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
