import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [stats, setStats] = useState({ ngos: 0, volunteers: 0 });

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/api/ngos').then(r => r.json()),
      fetch('http://localhost:3000/api/volunteers').then(r => r.json())
    ]).then(([ngos, vols]) => {
      setStats({ ngos: ngos.length, volunteers: vols.length });
    }).catch(err => console.error(err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Hero Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="hero-container">
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>They Need Us</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '2rem', fontStyle: 'italic', lineHeight: 1.6 }}>
              Your smallest contribution can bring the biggest smile to those who need it most. Stand with them today.
            </p>
            <Link to="/donations" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '8px', marginTop: '1rem' }}>
              Donate Now
            </Link>
          </div>
          
          <div className="hero-image-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
            <img src="/color_portrait_indian_girl.png" alt="Hopeful Indian girl" />
          </div>

          <div>
            <h2 className="hero-handwriting">Together We Can Make Difference!</h2>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2">
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>Registered NGOs</h3>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>{stats.ngos}</h2>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>Active Volunteers</h3>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>{stats.volunteers}</h2>
        </div>
      </section>

      {/* How it Works */}
      <section className="glass-panel">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>How It Works</h2>
        <div className="grid grid-cols-3">
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.5rem' }}>🔍</div>
            <h3>Discover</h3>
            <p style={{ color: 'var(--text-muted)' }}>Find verified local NGOs making an impact in your city.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.5rem' }}>🤝</div>
            <h3>Connect</h3>
            <p style={{ color: 'var(--text-muted)' }}>Volunteer for events or set up direct donations.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.5rem' }}>✨</div>
            <h3>Impact</h3>
            <p style={{ color: 'var(--text-muted)' }}>Watch the community transform through your direct action.</p>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="glass-panel" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem' }}>Contact Us</h2>
        <div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Have questions about making a donation or volunteering? We are here to help and guide you through the process.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
            <p>📍 Karvenagar, Pune</p>
            <p>📞 +91 98234 56789</p>
          </div>
        </div>
      </section>
    </div>
  );
}
