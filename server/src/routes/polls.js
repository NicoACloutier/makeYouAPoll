const express = require('express');
const path = require('path');
const pool = require(path.join(__dirname, 'pool.js'));
const router = express.Router();

/*
Return a poll stored in the `polls` table.
*/
router.get('/', (request, response) => {
    const user_id = request.query["user_id"];
    const id = request.query["id"];
    if (id !== undefined) {
            pool.query('SELECT * FROM polls WHERE poll_id = $1', [id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows[0]);
        });
    }
    else if (user_id !== undefined) {
            pool.query('SELECT * FROM polls WHERE user_id = $1', [user_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows);
        });
    }
    else {
            pool.query('SELECT * FROM polls', [], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows);
        });
    }
});

/*
Create a poll and add to the `polls` table.
*/
router.post('/', (request, response) => {
    const { n_options, user_id, question, end_time } = request.body;
    pool.query('INSERT INTO polls (n_options, user_id, question, end_time) VALUES ($1, $2, $3, $4) RETURNING *', [n_options, user_id, question, end_time], (error, results) => {
        if (error) throw error;
        response.status(200).json(request.body);
    });
});

/*
Delete a given poll.
*/
router.delete('/', (request, response) => {
    const id = request.query["id"];
    if (id === undefined) {
        response.status(404).json(request.query);
    }
    else {
        pool.query('DELETE FROM polls WHERE poll_id = $1', [id], (error, results) => {
            if (error) throw error;
            response.status(200).json(request.body);
        });
    }
});


module.exports = router;