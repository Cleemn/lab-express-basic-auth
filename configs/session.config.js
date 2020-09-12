const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

module.exports = (app) => {
   app.use(
      session({
         secret: 'maPhraseSecrete',
         resave: false,
         saveUninitialized: true,
         store: new MongoStore({
            //pour que les sessions soient persistées au redémarrage du serveur à cause de nodeom
            mongooseConnection: mongoose.connection,
            ttl: 60 * 60 * 24,
         }),
      })
   );
};
