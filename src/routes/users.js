const express = require('express');
const path = require('path');
const pool = require(path.join(__dirname, 'pool.js'));
const router = express.Router();

/*
Return the users stored in the `users` table.
*/
router.get('/', (request, response) => {
    pool.query('SELECT * FROM users', [], (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows);
    });
});

/*
Return a user stored in the `users` table given an id.
*/
router.get('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows);
    });
});

/*
Create a user and add to the `users` table.
*/
router.post('/', (request, response) => {
    const { email, name, id, salt, hash } = request.body;
    pool.query('INSERT INTO users (id, salt, hash, email, name) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id, salt, hash, email, name], (error, results) => {
        if (error) throw error;
    });
});

/*
Delete a user given an id.
*/
router.delete('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) throw error;
    });
});

module.exports = router;