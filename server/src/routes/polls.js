const express = require('express');
const path = require('path');
const uuid = require('uuid').v4;
const pool = require(path.join(__dirname, 'pool.js'));
const router = express.Router();

/*
Return a poll stored in the `polls` table.
*/
router.get('/', (request, response) => {
    const user_id = request.query["user_id"];
    const id = request.query["id"];
    const poll_name = request.query["poll_name"];
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
    else if (poll_name !== undefined) {
        const queryLength = poll_name.length;
        pool.query('SELECT * FROM polls WHERE SUBSTRING(question, 1, $1) = $2 LIMIT 10', [poll_name.length, poll_name], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows);
    });
    }
    else {
        pool.query('SELECT * FROM polls OFFSET (SELECT count(*) FROM polls)-10', [], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows.reverse());
        });
    }
});

/*
Create a poll and add to the `polls` table.
*/
router.post('/', (request, response) => {
    const { nAnswers, id, question, endTime } = request.body;
    const pollId = uuid();
    pool.query('INSERT INTO polls (poll_id, n_options, user_id, question, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *', [pollId, nAnswers, id, question, endTime], (error, results) => {
        if (error) throw error;
        response.status(200).json({ id: pollId });
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
