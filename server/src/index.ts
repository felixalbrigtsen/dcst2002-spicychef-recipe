import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import * as path from 'path';
import router from './routers/recipe-router';
import session from 'express-session';
import { enablePassport } from './routers/auth-router';
import type { User } from './models/User';

dotenv.config();
const port = Number(process.env.PORT) || 3000;
const clientBuildPath = path.join(__dirname, (process.env.CLIENT_BUILD_PATH || '/../../client/public'));
console.log("Serving client from '" + clientBuildPath + "'");

const app = express();
app.use(morgan('dev'));


declare module 'express-session' {
  interface SessionData {
    user: User;
  }
}

app.use(session({
    secret: process.env.SESSION_SECRET || 'UNSAFE_SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.SESSION_SECURE_COOKIE ? process.env.SESSION_SECURE_COOKIE != "false" : true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
}));

enablePassport(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use('/api', router);

// Serve static files from the React frontend
app.use(express.static(clientBuildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, '/index.html'));
});
