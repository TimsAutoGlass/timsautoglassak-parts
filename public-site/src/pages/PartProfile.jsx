import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, ShieldCheck, CheckCircle2, Factory, ExternalLink, Search } from 'lucide-react';
import { getOemCatalogUrl } from './VehicleProfile';

export default function PartProfile() {
  const { partNumber } = useParams();
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch directly from the compiled reverse-index API structure
    fetch(`/api/parts-index/${partNumber.toLowerCase()}.json`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        setPart(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [partNumber]);

  if (loading) return <div className="container animate-in">Loading Part Interchange Data...</div>;

  if (!part) return (
    <div className="container animate-in text-center" style={{ marginTop: '4rem' }}>
      <h2>Part Not Found</h2>
      <p>We could not find {partNumber} in our active indices.</p>
      <Link to="/" style={{ color: 'var(--primary)', marginTop: '1rem', display: 'inline-block' }}>Return Home</Link>
    </div>
  );

  return (
    <div className="container animate-in">
      <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Back to Search
      </Link>

      <div className="profile-header glass" style={{ padding: '2rem', marginTop: '1rem', background: 'rgba(16, 185, 129, 0.05)' }}>
        <div>
          <div style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={20} /> INTERCHANGE PROFILE
          </div>
          <h1 style={{ marginBottom: 0, textTransform: 'uppercase', fontFamily: 'monospace' }}>{part.part_number}</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="tag success" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
            <ShieldCheck size={18} style={{ display: 'inline', marginBottom: '-4px', marginRight: '4px' }} />
            {part.fitment.length} Verified Vehicles
          </div>
        </div>
      </div>

      <div className="glass-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="glass" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h2 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Specifications</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Manufacturer Types</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {part.types.map(t => (
                <span key={t} className={`tag ${t === 'OEM' ? 'oem' : 'aftermarket'}`}>
                  {t === 'OEM' ? <Factory size={12} style={{ display: 'inline', marginRight: '4px' }} /> : null}
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Standard Features</h3>
            {part.features.length === 0 ? (
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Base Generic Glass</span>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {part.features.map(f => (
                  <span key={f} style={{ fontSize: '0.875rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '4px' }}>
                    {f.replace('_', ' ').toUpperCase()}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Market Pricing Tools</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href={getOemCatalogUrl(part.fitment?.[0]?.make, part.part_number)} target="_blank" rel="noreferrer" className="tag oem" style={{ padding: '0.75rem', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none' }}>
                <ExternalLink size={14} style={{ marginRight: '6px' }} /> Official OEM Catalog
              </a>
              <a href={`https://www.ebay.com/sch/i.html?_nkw=${part.part_number}`} target="_blank" rel="noreferrer" className="tag aftermarket" style={{ padding: '0.75rem', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none' }}>
                <ExternalLink size={14} style={{ marginRight: '6px' }} /> Verify on eBay Motors
              </a>
              <a href={`https://www.rockauto.com/en/partsearch/?partnum=${part.part_number}`} target="_blank" rel="noreferrer" className="tag blue" style={{ padding: '0.75rem', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none' }}>
                <ExternalLink size={14} style={{ marginRight: '6px' }} /> Check RockAuto Catalog
              </a>
              <a href={`https://www.google.com/search?q=${part.part_number}+auto+glass`} target="_blank" rel="noreferrer" style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '4px', textAlign: 'center', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={14} style={{ marginRight: '6px' }} /> General Web Search
              </a>
            </div>
          </div>
        </div>

        <div className="glass" style={{ padding: '1.5rem' }}>
          <h2 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>Vehicle Fitment List</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {part.fitment.map((f, i) => (
              <Link to={`/vehicle/${f.make.toLowerCase()}/${f.model.toLowerCase().replace(/ /g, '-')}/${f.year}`} key={i} className="part-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle2 color="var(--accent)" size={18} />
                  <div>
                    <span style={{ color: 'var(--primary)', fontWeight: 600, marginRight: '8px' }}>{f.year}</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{f.make} {f.model}</span>
                  </div>
                </div>
                <div className="tag blue">{f.glass_type}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
