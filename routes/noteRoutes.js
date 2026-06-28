const express = require('express');
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

router.route('/:id')
  .put(protect, updateNote)
  .delete(protect, deleteNote);

module.exports = router;
