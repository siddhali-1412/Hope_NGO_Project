import { useState } from 'react';
import { registerNgo } from '../api';
import { useNavigate } from 'react-router-dom';

export default function RegisterNgo() {
  const [form, setForm] = useState({ name: '', mission: '', registration_number: '', location: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerNgo(form);
      alert('NGO Registered successfully!');
      navigate('/ngos');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  return (
    <div className="glass-panel" style={{maxWidth: '600px', margin: '0 auto'}}>
      <h2>Register your NGO</h2>
      <p style={{marginBottom: '2rem', color: 'var(--text-muted)'}}>Join the platform to receive volunteer help and transparent donations.</p>
      <form onSubmit={handleSubmit}>
        <label>NGO Name</label>
        <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        
        <label>Mission Statement</label>
        <textarea required rows="3" value={form.mission} onChange={e => setForm({...form, mission: e.target.value})}></textarea>
        
        <label>Registration Number</label>
        <input required value={form.registration_number} onChange={e => setForm({...form, registration_number: e.target.value})} />
        
        <label>Location (City, State)</label>
        <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
        
        <button className="btn btn-primary" type="submit" style={{width: '100%'}}>Register Organization</button>
      </form>
    </div>
  );
}
