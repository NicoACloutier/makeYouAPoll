const path = require('path');
const pool = require(path.join(__dirname, 'pool.js'));
const { createHash } = require('crypto');

const saltLength = 20;
const saltChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+`~;:[{]}/?.>,<';

/*
Create the salt for authentication.
Arguments:
Returns:
    `salt`: A string of length `saltLength` of randomly selected characters from `saltChars`.
*/
function createSalt() {
    let salt = '';
    const numCharacters = saltChars.length;
    let counter = 0;
    while (counter < saltLength) {
      salt += saltChars.charAt(Math.floor(Math.random() * numCharacters));
      counter += 1;
    }
    return salt;
}

/*
Return the current number of users stored in the `users` table.
*/
const getNumUsers = (request, response) => {
    pool.query('SELECT count(*) AS count FROM users', [], (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows);
    });
}

/*
Create a user and add to the `users` table.
*/
const createUser = (request, response) => {
    const { email, password } = parseInt(request.params.id);
    const id = getNumUsers();
    const salt = createSalt();
    const hash = createHash('sha256').update(password + salt).digest('hex');
    pool.query('INSERT INTO users (id, salt, hash, email) VALUES ($1, $2, $3, $4) RETURNING *', [id, salt, hash, email], (error, results) => {
        if (error) throw error;
    });
}

module.exports = { getNumUsers, createUser };