import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PROFILE_API_URL = 'https://my-node-api-oe6n.onrender.com/api/profile';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(PROFILE_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch profile. Your token might be expired.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="glass-card">
        <div className="dashboard-header">
          <h2 className="title" style={{marginBottom: 0}}>Dashboard</h2>
          <button onClick={handleLogout} className="btn-secondary" style={{width: 'auto', marginTop: 0}}>
            Logout
          </button>
        </div>

        {error ? (
          <div className="error-message">{error}</div>
        ) : !user ? (
          <p className="subtitle">Loading profile data...</p>
        ) : (
          <div className="profile-info">
            <p>Welcome back, <strong>{user.username}</strong>!</p>
            <p>Your registered email is: <strong>{user.email}</strong></p>
            <p>Your unique User ID is: <strong>{user.id}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
