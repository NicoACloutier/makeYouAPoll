const express = require('express');
const path = require('path');
const uuid = require('uuid').v4;
const { createHash } = require('crypto');
const pool = require(path.join(__dirname, 'pool.js'));
const router = express.Router();

var sessions = {};
const PORT = 3000;

function informationMatches(enteredPassword, salt, hash) {
    const newHash = createHash('sha256').update(enteredPassword + salt).digest('hex');
    return newHash === hash;
}

async function findUser(email) {
    const response = await fetch(`http://localhost:${PORT}/users?email=${email}`, {
        method: 'GET',
    });
    if (response === undefined || response.status === 404) { return undefined; }
    return await response.json();
}

async function login(request, response) {
    const { email, enteredPassword } = request.body;
    const userInfo = await findUser(email);
    if (userInfo === undefined) {
        response.status(404).send('User not found.');
    }
    else {
        if (informationMatches(enteredPassword, userInfo["salt"], userInfo["hash"])) {
            const sessionId = uuid();
            sessions[sessionId] = { id: userInfo["user_id"], name: userInfo["name"], email: userInfo["email"] };
            response.cookie('si', sessionId, { httpOnly: false, maxAge: 3600000 });
            response.status(200).json(sessions[sessionId]);
        }
        else { response.status(401).send('Incorrect username or password.'); }
    }
}

function logout(request, response) {
    const id = request.cookies.si;
    if (sessions[id] !== undefined) { delete sessions[id]; }
    response.status(200).send('Logged out.');
}

function auth(request, response) {
    const id = request.cookies.si;
    if (sessions[id] === undefined) { response.status(401).send('Invalid session.'); }
    else { response.status(200).json(sessions[id]); }
}

router.post('/in', login);
router.post('/out', logout);
router.get('/', auth);

module.exports = router;
