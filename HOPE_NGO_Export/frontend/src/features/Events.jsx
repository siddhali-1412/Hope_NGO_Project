import { useEffect, useState } from 'react';
import { fetchEvents, fetchNgos, createEvent } from '../api';
import { Calendar } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', location: '', ngo_id: '' });

  const loadData = () => {
    fetchEvents().then(setEvents);
    fetchNgos().then(setNgos);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(form);
      setForm({ title: '', date: '', location: '', ngo_id: '' });
      loadData();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  return (
    <div className="grid">
      <div className="glass-panel" style={{maxWidth: '800px'}}>
        <h2>Create an Event</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2" style={{gap: '1rem', marginTop: '1rem'}}>
          <div>
            <label>Event Title</label>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div>
            <label>Event Date</label>
            <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <div>
            <label>Location</label>
            <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          </div>
          <div>
            <label>Hosting NGO</label>
            <select required value={form.ngo_id} onChange={e => setForm({...form, ngo_id: e.target.value})}>
              <option value="">-- Choose an NGO --</option>
              {ngos.map(ngo => <option key={ngo.id} value={ngo.id}>{ngo.name}</option>)}
            </select>
          </div>
          <div style={{gridColumn: 'span 2'}}>
            <button className="btn btn-secondary" type="submit" style={{width: '100%'}}>Post Event</button>
          </div>
        </form>
      </div>

      <div style={{marginTop: '2rem'}}>
        <h2>Upcoming Events</h2>
        <div className="grid grid-cols-3" style={{marginTop: '1.5rem'}}>
          {events.map(ev => {
            const ngo = ngos.find(n => n.id === ev.ngo_id);
            return (
              <div key={ev.id} className="glass-panel">
                <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)'}}>
                  <Calendar size={18} /> {ev.title}
                </h3>
                <p style={{marginTop: '1rem', color: 'var(--text-muted)'}}>📅 {ev.date}</p>
                <p style={{color: 'var(--text-muted)'}}>📍 {ev.location}</p>
                <hr style={{borderColor: 'var(--surface-border)', margin: '1rem 0'}} />
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <p>Hosted by: {ngo?.name || 'Unknown'}</p>
                  <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${ev.date.replace(/-/g, '')}T040000Z/${ev.date.replace(/-/g, '')}T120000Z&location=${encodeURIComponent(ev.location)}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>Add to Calendar</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
