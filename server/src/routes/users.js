const express = require('express');
const path = require('path');
const uuid = require('uuid').v4;
const { createHash } = require('crypto');
const pool = require(path.join(__dirname, 'pool.js'));
const router = express.Router();

const SALT_LENGTH = 20;

/*
Return a user stored in the `users` table given their email.
*/
router.get('/', (request, response) => {
    const email = request.query.email; 
    const name = request.query.userName;
    if (email !== undefined) {
        pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows[0]);
        });
    }
    else {
        pool.query('SELECT * FROM users WHERE name = $1', [name], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows[0]);
        });
    }
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
    const { name, email, enteredPassword } = request.body;
    const salt = uuid().substring(0, SALT_LENGTH);
    const hash = createHash('sha256').update(enteredPassword + salt).digest('hex');
    pool.query('INSERT INTO users (salt, hash, email, name) VALUES ($1, $2, $3, $4) RETURNING *;', [salt, hash, email, name], (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows)
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
