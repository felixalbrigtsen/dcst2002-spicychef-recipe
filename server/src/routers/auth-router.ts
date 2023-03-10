import express from 'express';
import session from 'express-session';
import userService from '../services/user-service';
import type { User } from '../models/User';
import type { UserProfile } from '../models/UserProfile';

const GoogleStrategy = require('passport-google-oauth20').Strategy;
import MockStrategy from '../test/MockPassportStrategy';

const passport = require('passport');

const authRouter = express.Router();
export default authRouter;

// Configure Passport to use Google OAuth2, unless we're in test mode
const PassportStrategy = process.env.NODE_ENV === 'test' ? MockStrategy : GoogleStrategy;
export const strategy = new PassportStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID || "",
    clientSecret: process.env.GOOGLE_OAUTH_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
    passReqToCallback: true
  },
  //@ts-ignore
  function verify(req, accessToken, refreshToken, profile: UserProfile, done) {
    userService.findOrCreate(profile)
      .then(user => {
        req.session.user = user;
        done(null, user)
      })
      .catch(err => done(err));
  }
);

passport.use(strategy);

declare module 'express-session' {
  interface SessionData {
    user: User;
  }
}
export function enableSession(app: express.Application) {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'UNSAFE_SECRET',
    resave: true,
    rolling: true,
    proxy: (process.env.SESSION_SECURE_COOKIE == 'true'),
    saveUninitialized: false,
    cookie: {
      secure: (process.env.SESSION_SECURE_COOKIE == 'true'),
      sameSite: 'strict',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  }));
}

//@ts-ignore
passport.serializeUser(function(user, done) { done(null, user); });
//@ts-ignore
passport.deserializeUser(function(user, done) { done(null, user); });

export function enablePassport(app: express.Application) {
  app.use(passport.initialize());
  app.use(passport.session());
}

authRouter.get('/login', (req, res) => res.redirect('/api/auth/google/login'));

authRouter.get('/google/login',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }), async (req, res) => {
    await refreshLogin(req, res);
    res.redirect('/');
  }
);

authRouter.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google/failure'
  }), async (req, res) => {
    req.session.user = req.user as User;
    if (req.session.user.email) {
      await refreshLogin(req, res);
      console.log("User logged in: " + req.session.user.email);
    } else {
      console.log("Invalid user logged in");
    }
    res.redirect('/');
  }
);

authRouter.get('/google/failure', (req, res) => {
  res.status(403).send('Failed to log in');
});

authRouter.get('/logout', (req, res) => {
  console.log("User logged out: " + req.session.user?.email );
  req.session.user = undefined;
  res.redirect('/');
});

authRouter.get('/profile', async (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.json(false);
  }
});

// @ts-ignore
export async function refreshLogin(req, res) {
  if (req.session && req.session.user && req.session.user.googleId) {
    let user = await userService.getUser(req.session.user.googleId);
    req.session.user = user;
  } else {
    req.session.user = undefined;
  }
}

// @ts-ignore
export const requireLogin = function(req, res, next) {
  if (req.session.user && req.session.user.googleId) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
}
// @ts-ignore
export const requireAdmin = function(req, res, next) {
  if (req.session.user?.isadmin) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
}
