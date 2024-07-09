const express = require('express');
const path = require('path');
const pool = require(path.join(__dirname, 'pool.js'));
const router = express.Router();

/*
Return number of entries stored in the `entries` table.
*/
router.get('/', (request, response) => {
    const user_id = request.query["user_id"];
    const poll_id = request.query["poll_id"];
    const answer_id = request.query["answer_id"];
    if (user_id !== undefined) {
        pool.query('SELECT * FROM entries WHERE poll_id = $1 AND user_id = $2 AND answer_id = $2', [poll_id, user_id, answer_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows.length);
        });
    }
    else {
        pool.query('SELECT * FROM entries WHERE poll_id = $1 AND answer_id = $2', [poll_id, answer_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows.length);
        });
    }
});

/*
Create an entry and add to the `entries` table.
*/
router.post('/', (request, response) => {
    const { poll_id, answer_id, user_id } = request.body;
    pool.query('INSERT INTO entries (poll_id, answer_id, user_id) VALUES ($1, $2, $3) RETURNING *', [poll_id, answer_id, user_id], (error, results) => {
        if (error) throw error;
        response.status(200).json(request.body);
    });
});

module.exports = router;
