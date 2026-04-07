import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { HeartHandshake, Home, Users, DollarSign, Calendar, MapPin, LogOut, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

import HomePage from './features/Home';
import Ngos from './features/Ngos';
import RegisterNgo from './features/RegisterNgo';
import Volunteer from './features/Volunteer';
import Donations from './features/Donations';
import Events from './features/Events';
import Auth from './features/Auth';
import ProfileDropdown from './components/ProfileDropdown';

function App() {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState(localStorage.getItem('user_name') || '');
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  useEffect(() => {
    setUserName(localStorage.getItem('user_name') || '');
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    setToken(null);
    setUserName('');
  }

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/ngos', label: 'Find NGOs', icon: <MapPin size={18} /> },
    { path: '/register-ngo', label: 'Register NGO', icon: <HeartHandshake size={18} /> },
    { path: '/volunteer', label: 'Volunteer', icon: <Users size={18} /> },
    { path: '/donations', label: 'Donate', icon: <DollarSign size={18} /> },
    { path: '/events', label: 'Events', icon: <Calendar size={18} /> },
  ];

  if (!token) {
    return (
      <main className="container">
        <Auth setTokens={setToken} />
      </main>
    );
  }

  return (
    <>
      <nav>
        <div className="nav-container">
          <div className="flex-center" style={{gap: '0.5rem', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-main)', letterSpacing: '2px'}}>
            <HeartHandshake color="#4F46E5" />
            H.O.P.E
          </div>
          <div className="nav-links">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={location.pathname === item.path ? 'active' : ''}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--surface-border)' }}>
              <button 
                onClick={() => setIsLightMode(!isLightMode)} 
                title="Toggle Theme"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', marginRight: '1rem' }}
              >
                {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <ProfileDropdown 
                userName={userName} 
                onLogout={logout} 
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ngos" element={<Ngos />} />
          <Route path="/register-ngo" element={<RegisterNgo />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
