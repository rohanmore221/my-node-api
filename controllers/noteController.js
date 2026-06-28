const Note = require('../models/Note');

// @desc    Get all notes for logged in user
// @route   GET /api/notes
// @access  Private
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
exports.createNote = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const note = await Note.create(req.body);
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
exports.updateNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    // Make sure user owns note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this note' });
    }

    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: note });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    // Make sure user owns note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this note' });
    }

    await note.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
