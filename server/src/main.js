const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const usersRouter = require(path.join(__dirname, 'routes/users.js'));
const pollsRouter = require(path.join(__dirname, 'routes/polls.js'));
const loginRouter = require(path.join(__dirname, 'routes/logins.js'));
const answersRouter = require(path.join(__dirname, 'routes/answers.js'));
const entriesRouter = require(path.join(__dirname, 'routes/entries.js'))

const app = express();

app.use(function(request, response, next) {
  response.header('Content-Type', 'application/json;charset=UTF-8');
  response.header('Access-Control-Allow-Credentials', true);
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: 'http://127.0.0.1:8080',
    credentials: true
}));

app.use('/users', usersRouter);
app.use('/polls', pollsRouter);
app.use('/auth', loginRouter);
app.use('/answers', answersRouter);
app.use('/entries', entriesRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://127.0.0.1:${port}`);
});

module.exports = app;
