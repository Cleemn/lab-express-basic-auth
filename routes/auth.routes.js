const express = require('express');
const bcryptjs = require('bcryptjs');
const salt = bcryptjs.genSaltSync(10);

const User = require('../models/User.model.js');

const router = express.Router();

router.get('/signup', (req, res, next) => {
   res.render('auth/signup', {});
});

router.post('/signup', (req, res, next) => {
   const { username, password } = req.body;

   const hashedPassword = bcryptjs.hashSync(password, salt);
   console.log(`Password hash: ${hashedPassword}`);

   User.create({
      username,
      passwordHash: hashedPassword,
   })
      .then((userFromDb) => {
         res.send('user créé!');
      })
      .catch((err) => {
         next(err);
      });
});

//authentifiction
//affichage du formulaire
router.get('/login', (req, res, next) => {
   res.render('auth/login');
});

//iteration 2
//traitement du formulaire
router.post('/login', (req, res, next) => {
   //  if (req.session.currentUser) {
   //     res.redirect('/');
   //  }

   //récuperer le username et password,
   //  console.log('session: ', req.session);
   const { username, password } = req.body;
   //vérifier que les 2 sont remplis, sinon renvoyer le formulaire
   if (!username || !password) {
      res.render('auth/login', { erroMessage: 'login/password wrong' });
      return;
   }
   //si non,  comparer username avec Bd,
   User.findOne({ username: username })
      .then((user) => {
         //si username n'existe pas, message erreur +page login
         if (!user) {
            res.render('auth/login', { erroMessage: 'login/password wrong' });
         }
         //si ça matche (user existe), comparer les mots de passe, + view profile
         else {
            //si ça matche (user existe), et que mot passe correspond, alors montrer view profile
            if (bcryptjs.compareSync(password, user.passwordHash)) {
               //pour cookie
               req.session.currentUser = user;
               res.render('auth/profile', { user: user });
            } else res.render('auth/login');
         }
      })
      .catch((err) => next(err));
});

//pour persister le login du user
router.get('/profile', (req, res, next) => {
   console.log(req.session.currentUser);
   res.render('auth/profile', {
      user: req.session.currentUser,
   });
});

// Protection de la page private => pas accessible si pas logged in

router.get('/private', (req, res) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  res.render('private', { user: req.session.currentUser });
});

router.get('/main', (req, res) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  res.render('main', { user: req.session.currentUser });
});

module.exports = router;
