const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
// Helper method for generating unique ids
// const uuid = require('./helpers/uuid');
const noteData = require('./db/db.json');
const PORT = 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

//GET Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//GET Route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
});

//GET Route for retrieving all the notes
// app.get('/api/notes', (req, res) => res.json(noteData));
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});