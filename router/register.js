const fs = require("fs");
const path = require("path");
const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('', (req, res) => {
  res.render('register.ejs');
});

router.post('', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const users = JSON.parse(fs.readFileSync(
      path.join(__dirname, "../data/users.json")
    ));

    users.push({
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword
    });

    fs.writeFileSync(
      path.join(__dirname, "../data/users.json"),
      JSON.stringify(users)
    );

    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
});

module.exports = router;