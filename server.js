const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static('public'));

// Define routes

// Correct the route path for the notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Route to read and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  res.json(notes);
});

// Route to receive a new note, save it to the db.json file, and return the new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = generateUniqueId(); // Correct the function name to generateUniqueId
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  notes.push(newNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  res.json(newNote);
});

// Route to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id; // Correct variable name to noteId
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  fs.writeFileSync('./db/db.json', JSON.stringify(updatedNotes));
  res.json({ message: 'Note deleted' });
});

// Route to return the index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Function to generate a unique ID (you can use the "uuid" library)
function generateUniqueId() {
  const { v4: uuidv4 } = require('uuid');
  return uuidv4(); // Generate a UUID and return it
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});