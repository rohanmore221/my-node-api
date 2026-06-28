const NoteForm = ({ 
  title, 
  setTitle, 
  content, 
  setContent, 
  editingId, 
  onSubmit, 
  onCancel, 
  isLoading 
}) => {
  return (
    <form onSubmit={onSubmit} className="note-form">
      <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>
        {editingId ? 'Edit Note' : 'Create New Note'}
      </h4>

      <div className="form-group">
        <input 
          type="text" 
          className="form-input" 
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="form-group">
        <textarea 
          className="form-input" 
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={isLoading}
        ></textarea>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit" className="btn-primary" style={{ marginTop: 0 }} disabled={isLoading}>
          {isLoading ? 'Saving...' : (editingId ? 'Update Note' : 'Save Note')}
        </button>
        {editingId && (
          <button type="button" onClick={onCancel} className="btn-secondary" style={{ marginTop: 0 }} disabled={isLoading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default NoteForm;
