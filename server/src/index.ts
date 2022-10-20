import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import * as path from 'path';
import router from './recipe-router';

dotenv.config();
const port = Number(process.env.PORT) || 3000;
const clientBuildPath = path.join(__dirname, (process.env.CLIENT_BUILD_PATH || '/../../client/public'));
console.log("Serving client from '" + clientBuildPath + "'");

const app = express();
app.use(morgan('dev'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use('/api', router);

// Serve static files from the React frontend
app.use(express.static(clientBuildPath));

