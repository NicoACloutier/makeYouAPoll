const express = require('express');
const path = require('path');
const pool = require(path.join(__dirname, 'pool.js'));
const router = express.Router();

/*
Return the polls stored in the `polls` table.
*/
router.get('/', (request, response) => {
    pool.query('SELECT * FROM polls', [], (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows);
    });
});

/*
Return a poll stored in the `polls` table given a poll id.
*/
router.get('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('SELECT * FROM polls WHERE poll_id = $1', [id], (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows);
    });
});


/*
Create a poll and add to the `polls` table.
*/
router.post('/', (request, response) => {
    const { poll_id, n_options, user_id, question, end_time } = request.body;
    pool.query('INSERT INTO polls (poll_id, n_options, user_id, question, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *', [poll_id, n_options, user_id, question, end_time], (error, results) => {
        if (error) throw error;
    });
});

/*
Delete a given poll.
*/
router.delete('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('DELETE FROM polls WHERE poll_id = $1', [id], (error, results) => {
        if (error) throw error;
    });
});


module.exports = router;