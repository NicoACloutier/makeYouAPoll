const express = require('express');
const path = require('path');
const { createHash } = require('crypto');
const pool = require(path.join(__dirname, 'pool.js'));
const router = express.Router();

const PORT = 3000;

function informationMatches(enteredPassword, salt, hash) {
    const newHash = createHash('sha256').update(enteredPassword + salt).digest('hex');
    return newHash === hash;
}

async function findUser(email) {
    const response = await fetch(`http://localhost:${PORT}/users?email=${email}`, {
        method: 'GET',
    });
    if (response === undefined) { return undefined; }
    return response;
}

async function login(request, response) {
    const { email, enteredPassword } = request.body;
    const userInfo = (await findUser(email)).json();
    console.log(userInfo);
    if (userInfo === undefined) {
        response.status(404).send('User not found.');
    }
    
    if (informationMatches(enteredPassword, userInfo["salt"], userInfo["hash"])) {
        response.status(200).send('Success.');
    }
    else { response.status(401).send('Incorrect username or password.'); }
}

router.post('/', login);

module.exports = router;