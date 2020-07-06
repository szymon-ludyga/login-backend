module.exports = function(passport) {
  const express = require('express');
  const router = express.Router();

  router.get('', (req, res) => {
    res.render('login.ejs');
  });
  
  router.post('', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  return router;
};
