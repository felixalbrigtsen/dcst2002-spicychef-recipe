import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import * as path from 'path';


dotenv.config();
const port: number = Number(process.env.PORT) || 3000;
const clientBuildPath = path.join(__dirname, (process.env.CLIENT_BUILD_PATH || '/../../client/public'));
console.log("Serving client from '" + clientBuildPath + "'");

const app: Express = express();
app.use(morgan('dev'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Serve static files from the React frontend
app.use(express.static(clientBuildPath));

// Test endpoint to check if server is running
app.get('/api', (req, res) => {
  res.send('Recipe Server!');
});

