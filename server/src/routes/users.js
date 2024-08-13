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
    const id = request.query.id; 
    const name = request.query.userName;
    if (id !== undefined) {
        pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows[0]);
        })
    }
    else if (email !== undefined) {
        pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
            if (error) throw error;
            if (results.rows.length === 0) { response.status(404).send('No user found.'); }
            response.status(200).json(results.rows[0]);
        });
    }
    else {
        pool.query('SELECT * FROM users WHERE name = $1', [name], (error, results) => {
            if (error) throw error;
            if (results.rows.length === 0) { response.status(404).send('No user found.'); }
            response.status(200).json(results.rows[0]);
        });
    }
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
Update a username or password.
*/
router.put('/', (request, response) => {
    const { newName, newHash, newSalt, id } = request.query;
    if (newName !== null) {
        pool.query('UPDATE users SET name = $1 WHERE user_id = $2;', [newName, id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows);
        });
    }
    else {
        pool.query('UPDATE users SET hash = $1, salt = $2 WHERE user_id = $3;', [newHash, newSalt, id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows);
        })
    }
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
