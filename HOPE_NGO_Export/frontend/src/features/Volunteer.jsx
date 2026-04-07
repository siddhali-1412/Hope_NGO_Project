import { useState } from 'react';
import { registerVolunteer } from '../api';

export default function Volunteer() {
  const [form, setForm] = useState({ name: '', email: '', skills: '', location: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerVolunteer(form);
      setSuccess(true);
      setForm({ name: '', email: '', skills: '', location: '' });
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  return (
    <div className="glass-panel" style={{maxWidth: '600px', margin: '0 auto'}}>
      <h2>Become a Volunteer</h2>
      <p style={{marginBottom: '2rem', color: 'var(--text-muted)'}}>Offer your time and skills to NGOs in need.</p>
      
      {success && <div style={{padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--secondary)', borderRadius: '8px', marginBottom: '1rem', color: 'white'}}>Thanks for signing up! NGOs will contact you soon.</div>}

      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        
        <label>Email Address</label>
        <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        
        <label>Skills / Interests (e.g. Teaching, Web Dev, Event Planning)</label>
        <input required value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} />
        
        <label>Location (City, Zip Code)</label>
        <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
        
        <button className="btn btn-secondary" type="submit" style={{width: '100%'}}>Sign Up to Volunteer</button>
      </form>
    </div>
  );
}
