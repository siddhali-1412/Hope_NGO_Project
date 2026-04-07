import { useEffect, useState } from 'react';
import { fetchDonations, fetchNgos, makeDonation } from '../api';

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [form, setForm] = useState({ amount: '', donor_name: '', ngo_id: '' });

  const loadData = () => {
    fetchDonations().then(setDonations);
    fetchNgos().then(setNgos);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await makeDonation({ ...form, amount: parseFloat(form.amount) });
      setForm({ amount: '', donor_name: '', ngo_id: '' });
      loadData(); // refresh list
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  return (
    <div className="grid grid-cols-2">
      <div className="glass-panel">
        <h2>Make a Donation</h2>
        <p style={{marginBottom: '1.5rem', color: 'var(--text-muted)'}}>Transparent giving to the cause of your choice.</p>
        <form onSubmit={handleSubmit}>
          <label>Donation Amount (₹)</label>
          <input required type="number" min="1" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
          
          <label>Donor Name (Optional)</label>
          <input value={form.donor_name} placeholder="Anonymous" onChange={e => setForm({...form, donor_name: e.target.value})} />
          
          <label>Select NGO</label>
          <select required value={form.ngo_id} onChange={e => setForm({...form, ngo_id: e.target.value})}>
            <option value="">-- Choose an NGO --</option>
            {ngos.map(ngo => (
              <option key={ngo.id} value={ngo.id}>{ngo.name}</option>
            ))}
          </select>
          
          <button className="btn btn-primary" type="submit" style={{width: '100%', marginTop: '1rem'}}>Confirm Donation</button>
        </form>
      </div>

      <div className="glass-panel">
        <h2>Recent Contributions</h2>
        <div style={{marginTop: '1.5rem', maxHeight: '400px', overflowY: 'auto'}}>
          {donations.map(d => {
            const ngo = ngos.find(n => n.id == d.ngo_id);
            return (
              <div key={d.id} style={{padding: '1rem', borderBottom: '1px solid var(--surface-border)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                  <strong style={{color: 'var(--secondary)'}}>₹{parseFloat(d.amount).toFixed(2)}</strong>
                  <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{new Date(d.date).toLocaleDateString()}</span>
                </div>
                <div>{d.donor_name || 'Anonymous'} <span style={{color: 'var(--text-muted)'}}>→</span> <em style={{color: 'white'}}>{ngo?.name || 'Unknown NGO'}</em></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
