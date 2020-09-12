const express = require('express');
const bcryptjs = require('bcryptjs');
const salt = bcryptjs.genSaltSync(10);

const User = require('../models/User.model.js')

const router = express.Router()

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {})
})

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    const hashedPassword = bcryptjs.hashSync(password, salt)
    console.log(`Password hash: ${hashedPassword}`);

    User.create({
        username,
        passwordHash: hashedPassword
      }).then(userFromDb => {
        res.send('user créé!')
      }).catch(err => {
        next(err)
      })
  });

module.exports = router;