import express from 'express';
import userService from '../services/user-service';
import type { User } from '../models/User';

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

const authRouter = express.Router();
export default authRouter;

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID || "",
    clientSecret: process.env.GOOGLE_OAUTH_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
    passReqToCallback: true
  },
  //@ts-ignore
  function verify(req, accessToken, refreshToken, profile, done) {
    userService.findOrCreate(profile)
      .then(user => {
        req.session.user = user;
        done(null, user)
      })
      .catch(err => done(err));
  }
));

//@ts-ignore
passport.serializeUser(function(user, done) {
  done(null, user);
});
//@ts-ignore
passport.deserializeUser(function(user, done) {
  done(null, user);
});

export function enablePassport(app: express.Application) {
  app.use(passport.initialize());
  app.use(passport.session());
}

authRouter.get('/login', (req, res) => res.redirect('/api/auth/google/login'));

authRouter.get('/google/login',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }), (req, res) => {
    res.redirect('/');
  }
);

authRouter.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google/failure'
  }), (req, res) => {
    console.log(req.user);
    req.session.user = req.user as User;
    res.redirect('/');
  }
);

authRouter.get('/google/failure', (req, res) => {
  res.status(403).send('Failed to log in');
});

authRouter.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});

authRouter.get('/profile', (req, res) => {
  res.json(req.session.user);
});


