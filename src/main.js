const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')

const indexRouter = require(path.join(__dirname, 'routes/index.js'));
const usersRouter = require(path.join(__dirname, 'routes/users.js'));
const entriesRouter = require(path.join(__dirname, 'routes/entry.js'));
const pollsRouter = require(path.join(__dirname, 'routes/polls.js'));

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/entries', entriesRouter);
app.use('/polls', pollsRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));

app.use(function(request, result, next) {
    next(createError(404));
});

app.use(function(err, request, result, next) {
    result.locals.message = err.message;
    result.locals.error = request.app.get('env') === 'development' ? err : {};
    
    result.status(err.status || 500);
    result.render('error');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;