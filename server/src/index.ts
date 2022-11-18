import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import * as path from 'path';

if (process.env.NODE_ENV !== "test") {
  dotenv.config();
}

import router from './routers/recipe-router';
import { enablePassport, enableSession } from './routers/auth-router';
import type { User } from './models/User';
import { doesNotMatch } from 'assert';


const port = Number(process.env.PORT) || 3000;
const clientBuildPath = path.join(__dirname, (process.env.CLIENT_BUILD_PATH || '/../../client/public'));
console.log("Serving client from '" + clientBuildPath + "'");
console.log("Loaded Google Client ID: " + process.env.GOOGLE_OAUTH_ID);

const app = express();

if (process.env.NODE_ENV !== "test") {
  // Log requests in the console
  app.use(morgan('dev'));
}

enableSession(app);
enablePassport(app);

export const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use('/api', router);

// Serve static files from the React frontend, with fallback to index.html
app.use(express.static(clientBuildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, '/index.html'));
});

export default app