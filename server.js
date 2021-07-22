const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
// const noteData = require('./db/db.json');
const PORT = 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

// /**
//  *  Function to write data to the JSON file given a destination and some content
//  *  @param {string} destination The file you want to write to.
//  *  @param {object} content The content you want to write to the file.
//  *  @returns {void} Nothing
//  */
// const writeToFile = (destination, content) =>
//     fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
//         err ? console.error(err) : console.info(`\nData written to ${destination}`)
//     );

// /**
// *  Function to read data from a given a file and append some content
// *  @param {object} content The content you want to append to the file.
// *  @param {string} file The path to the file you want to save to.
// *  @returns {void} Nothing
// */
// const readAndAppend = (content, file) => {
//     fs.readFile(file, 'utf8', (err, data) => {
//         if (err) {
//             console.error(err);
//         } else {
//             const parsedData = JSON.parse(data);
//             parsedData.push(content);
//             writeToFile(file, parsedData);
//         }
//     });
// };

//GET Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//GET Route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
});

//GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => 
    {
        res.json(JSON.parse(data));
        // var arrayofObjects = JSON.parse(data);
        // console.log(arrayofObjects);
    }
    );
    
});

// POST Route for a new note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
    console.log(req);

    readFromFile('./db/db.json').then((data) => 
    {
        // res.json(JSON.parse(data));
        var arrayofObjects = JSON.parse(data);
        console.log(arrayofObjects);
    

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        arrayofObjects.push(newNote);
        console.log(arrayofObjects);
        // Convert the data to a string so we can save it
        // const noteString = JSON.stringify(newNote);

        // Write the string to a file
        fs.writeFileSync(`./db/db.json`, JSON.stringify(arrayofObjects), 'utf-8', (err) =>
            err
                ? console.error(err)
                : console.log(
                    `Note for ${arrayofObjects[arrayofObjects.length - 1].note_id} has been written to JSON file`
                )
        );
        const response = {
            status: 'success',
            body: arrayofObjects[arrayofObjects.length-1],
        };

        console.log(response);
        res.json(response);
    } else {
        res.json('Error in posting note');
    }
});
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});