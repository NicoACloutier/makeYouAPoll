function main(app) {
    const port = 3000;
    app.get('/', (request, result) => {
        result.sendFile('../index.html');
    });
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}

module.exports = main;