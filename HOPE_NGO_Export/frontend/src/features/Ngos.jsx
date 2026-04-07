import { useEffect, useState } from 'react';
import { fetchNgos } from '../api';

export default function Ngos() {
  const [ngos, setNgos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchNgos().then(setNgos);
  }, []);

  const filteredNgos = ngos.filter(ngo => 
    ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ngo.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 style={{marginBottom: '1rem'}}>Nearby NGO Finder</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Search by NGO name or location..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2">
        {filteredNgos.map(ngo => (
          <div key={ngo.id} className="glass-panel">
            <h3 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>{ngo.name}</h3>
            <p><strong>Mission:</strong> {ngo.mission}</p>
            <p style={{marginTop: '1rem', color: 'var(--text-muted)'}}>
              📍 {ngo.location} | Reg: {ngo.registration_number}
            </p>
          </div>
        ))}
      </div>
      {ngos.length > 0 && filteredNgos.length === 0 && (
        <p className="glass-panel">No NGOs found matching your search.</p>
      )}
      {ngos.length === 0 && <p className="glass-panel">No NGOs registered yet.</p>}
    </div>
  );
}
