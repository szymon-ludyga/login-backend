if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const fs = require("fs");
const path = require("path");
const passport = require('passport');
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();

const { checkAuthenticated, checkNotAuthenticated } = require('./authenticationCheck/authenticate');

const initialize = require('./passport-config');

const loginRouter = require('./router/login');
const logoutRouter = require('./router/logout');
const registerRouter = require('./router/register');
const rootRouter = require('./router/root');

const port = process.env.PORT || 3000;

initialize(
  passport,
  email => JSON.parse(fs.readFileSync(
    path.join(__dirname, "./data/users.json")
  )).find(user => user.email === email),
  id => JSON.parse(fs.readFileSync(
    path.join(__dirname, "./data/users.json")
  )).find(user => user.id === id)
);

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/login', checkNotAuthenticated, loginRouter(passport));
app.use('/logout', logoutRouter);
app.use('/register', checkNotAuthenticated, registerRouter);
app.use('/', checkAuthenticated, rootRouter);

app.listen(port, () => {
  console.log('Listening on port', port)
});