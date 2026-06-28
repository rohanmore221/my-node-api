const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <div className="note-card">
      <div className="note-title">{note.title}</div>
      <div className="note-content">{note.content}</div>
      <div className="note-actions">
        <button onClick={() => onEdit(note)} className="btn-icon">Edit</button>
        <button onClick={() => onDelete(note._id)} className="btn-icon delete">Delete</button>
      </div>
    </div>
  );
};

export default NoteCard;
