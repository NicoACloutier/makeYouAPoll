const express = require('express');
const path = require('path');
const pool = require(path.join(__dirname, 'pool.js'));
const router = express.Router();

/*
Return the entries stored in the `entries` table.
*/
router.get('/', (request, response) => {
    pool.query('SELECT * FROM entries', [], (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows);
    });
});

/*
Return an entry stored in the `entries` table given a poll and answer.
*/
router.get('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const { answer_id } = request.body;
    pool.query('SELECT * FROM entries WHERE poll_id = $1 AND answer_id = $2', [id, answer_id], (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows);
    });
});


/*
Create an answer and add to the `answers` table.
*/
router.post('/', (request, response) => {
    const id = parseInt(request.params.id);
    const { answer_id, answer } = request.body;
    pool.query('INSERT INTO entries (poll_id, answer_id, answer, n_answered) VALUES ($1, $2, $3, $4) RETURNING *', [id, answer_id, answer, 0], (error, results) => {
        if (error) throw error;
    });
});

/*
Delete an entry given poll and answer ids.
*/
router.delete('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const { answer_id } = request.body;
    pool.query('DELETE FROM entries WHERE poll_id = $1 AND answer_id = $2', [id, answer_id], (error, results) => {
        if (error) throw error;
    });
});

/*
Update the number of votes an entry has.
*/
router.put('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const { answer_id, n_answered } = request.body;
    pool.query('UPDATE entries SET n_answered = $1 WHERE poll_id = $2 AND answer_id = $3', [n_answered, id, answer_id], (error, results) => {
        if (error) throw error;
    });
});


module.exports = router;