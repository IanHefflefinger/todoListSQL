// FIXME: go through and understand EVERYTHING then add catchall route, add the index route, refactor the index.js so it works as an SPA with ajax, etc.

const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const databaseService = require('./databaseService');
const { response } = require('express');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// FIXME: add a way to render the hame page (with ejs or somethig like that)
// index
// app.get('/', (req, res) => {
//     // FIXME: add stuff here
// });

// create
app.post('/create', (req, res) => {
    const { task } = req.body;
    const db = databaseService.getDatabaseServiceInstance();

    const result = db.insertNewTask(task);
    result
    .then(data => res.json({ data : data }))
    .catch(error => console.log(error));
});

// read (search for single row/task)
app.get('/read/:task', (req, res) => {
    const { task } = req.params;
    const db = databaseService.getDatabaseServiceInstance();

    const result = db.getTask(task);

    result
    .then(data => res.json({data : data}))
    .catch(error => console.log(error));

});

// read-all
app.get('/readAll', (req, res) => {
    const db = databaseService.getDatabaseServiceInstance();

    const result = db.getAllData();

    result
    .then(data => res.json({data : data}))
    .catch(error => console.log(error));
});

// update
app.patch('/update', (req, res) => {
    const { id, task } = req.body;
    const db = databaseService.getDatabaseServiceInstance();

    const result = db.updateTaskById(id, task);

    result
    .then(data => res.json({success : data}))
    .catch(error => console.log(error));
});

// delete
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const db = databaseService.getDatabaseServiceInstance();

    const result = db.deleteRowById(id);

    result
    .then(data => res.json({success : true}))
    .catch(error => console.log(error));
});

// catch-all (no snooping around routes that don't exist)

app.listen(process.env.PORT, () => {
    console.log(`Todo list app listening on port ${process.env.PORT}`)
});