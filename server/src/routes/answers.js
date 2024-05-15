const express = require('express');
const path = require('path');
const pool = require(path.join(__dirname, 'pool.js'));
const router = express.Router();

/*
Return an answer stored in the `answers` table.
*/
router.get('/', (request, response) => {
    const poll_id = request.query["poll_id"];
    const answer_id = request.query["answer_id"];
    if (answer_id === undefined) {
        pool.query('SELECT * FROM answers WHERE poll_id = $1', [poll_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows);
        });
    }
    else {
        pool.query('SELECT * FROM answers WHERE poll_id = $1 AND answer_id = $2', [poll_id, answer_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows[0]);
        });
    }
});

/*
Create an answer and add to the `answers` table.
*/
router.post('/', (request, response) => {
    const { poll_id, answer_id, answer_text } = request.body;
    pool.query('INSERT INTO answers (poll_id, answer_id, answer_text) VALUES ($1, $2, $3) RETURNING *', [poll_id, answer_id, answer_text], (error, results) => {
        if (error) throw error;
        response.status(200).json(request.body);
    });
});

/*
Delete a given answer.
*/
router.delete('/', (request, response) => {
    const poll_id = request.query["poll_id"];
    const answer_id = request.query["answer_id"];
    if (answer_id === undefined) {
        pool.query('DELETE FROM answers WHERE poll_id = $1', [poll_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(request.body);
        });
    }
    else {
        pool.query('DELETE FROM answers WHERE poll_id = $1 AND answer_id = $2', [poll_id, answer_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(request.body);
        });
    }
});


module.exports = router;