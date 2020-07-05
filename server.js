if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const bcrypt = require('bcrypt');
const passport = require('passport');
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();

const initialize = require('./passport-config');
const { checkAuthenticated, checkNotAuthenticated } = require('./authenticationCheck/authenticate');

initialize(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

const port = process.env.PORT || 3000;

const users = [];

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.post('/register', checkNotAuthenticated, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword
    });
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
});

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
})

app.listen(port, () => {
  console.log('Listening on port', port)
});