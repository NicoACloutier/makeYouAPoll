const path = require('path');
const { getNumUsers, createUser } = require(path.join(__dirname, 'serverApi/serverApi.js'));

function main(app) {
    app.get('/users', getNumUsers);
    const port = 3000;
    app.get('/', (request, result) => {
        result.sendFile('../index.html');
    });
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}

module.exports = main;