import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';

const PROFILE_API_URL = 'https://my-node-api-oe6n.onrender.com/api/profile';
const NOTES_API_URL = 'https://my-node-api-oe6n.onrender.com/api/notes';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  
  // Note Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        toast.error('Session expired. Please log in again.');
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
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editingId) {
        // Update Note
        const res = await axios.put(`${NOTES_API_URL}/${editingId}`, { title, content }, config);
        setNotes(notes.map(n => n._id === editingId ? res.data.data : n));
        toast.success('Note updated!');
        setEditingId(null);
      } else {
        // Create Note
        const res = await axios.post(NOTES_API_URL, { title, content }, config);
        setNotes([res.data.data, ...notes]);
        toast.success('Note created!');
      }
      // Reset form
      setTitle('');
      setContent('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save note');
    } finally {
      setIsLoading(false);
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.delete(`${NOTES_API_URL}/${id}`, config);
      setNotes(notes.filter(n => n._id !== id));
      toast.success('Note deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete note');
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | My Notes App</title>
        <meta name="description" content="View and manage your private notes." />
      </Helmet>

      <div className="dashboard-container">
        <div className="glass-card">
          <div className="dashboard-header">
            <h2 className="title" style={{marginBottom: 0}}>Dashboard</h2>
            <button onClick={handleLogout} className="btn-secondary" style={{width: 'auto', marginTop: 0}}>
              Logout
            </button>
          </div>

          {!user ? (
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
              
              <NoteForm 
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                editingId={editingId}
                onSubmit={handleNoteSubmit}
                onCancel={handleCancelEdit}
                isLoading={isLoading}
              />

              {/* Notes Grid */}
              {notes.length === 0 ? (
                <p className="subtitle" style={{ textAlign: 'left' }}>You haven't created any notes yet.</p>
              ) : (
                <div className="notes-grid">
                  {notes.map(note => (
                    <NoteCard 
                      key={note._id} 
                      note={note} 
                      onEdit={handleEditClick} 
                      onDelete={handleDelete} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
