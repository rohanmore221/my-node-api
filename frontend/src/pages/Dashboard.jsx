import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PROFILE_API_URL = 'https://my-node-api-oe6n.onrender.com/api/profile';
const NOTES_API_URL = 'https://my-node-api-oe6n.onrender.com/api/notes';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  
  // Note Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  // Load User and Notes
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        // Fetch User
        const userRes = await axios.get(PROFILE_API_URL, config);
        if (userRes.data.success) {
          setUser(userRes.data.data);
        }

        // Fetch Notes
        const notesRes = await axios.get(NOTES_API_URL, config);
        if (notesRes.data.success) {
          setNotes(notesRes.data.data);
        }
      } catch (err) {
        setError('Failed to fetch data. Your token might be expired.');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setTimeout(() => navigate('/login'), 2000);
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editingId) {
        // Update Note
        const res = await axios.put(`${NOTES_API_URL}/${editingId}`, { title, content }, config);
        setNotes(notes.map(n => n._id === editingId ? res.data.data : n));
        setEditingId(null);
      } else {
        // Create Note
        const res = await axios.post(NOTES_API_URL, { title, content }, config);
        setNotes([res.data.data, ...notes]);
      }
      // Reset form
      setTitle('');
      setContent('');
    } catch (err) {
      setFormError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleEditClick = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
    setFormError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.delete(`${NOTES_API_URL}/${id}`, config);
      setNotes(notes.filter(n => n._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete note');
    }
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
          </div>
        )}

        {/* NOTES SECTION */}
        {user && (
          <div className="notes-section">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>My Notes</h3>
            
            {/* Note Form */}
            <form onSubmit={handleNoteSubmit} className="note-form">
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>
                {editingId ? 'Edit Note' : 'Create New Note'}
              </h4>
              
              {formError && <div className="error-message">{formError}</div>}

              <div className="form-group">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Note Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <textarea 
                  className="form-input" 
                  placeholder="Write your note here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ marginTop: 0 }}>
                  {editingId ? 'Update Note' : 'Save Note'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="btn-secondary" style={{ marginTop: 0 }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Notes Grid */}
            {notes.length === 0 ? (
              <p className="subtitle" style={{ textAlign: 'left' }}>You haven't created any notes yet.</p>
            ) : (
              <div className="notes-grid">
                {notes.map(note => (
                  <div key={note._id} className="note-card">
                    <div className="note-title">{note.title}</div>
                    <div className="note-content">{note.content}</div>
                    <div className="note-actions">
                      <button onClick={() => handleEditClick(note)} className="btn-icon">Edit</button>
                      <button onClick={() => handleDelete(note._id)} className="btn-icon delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
