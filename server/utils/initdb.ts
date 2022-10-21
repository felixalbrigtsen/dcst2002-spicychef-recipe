import mysql from 'mysql2';
import * as path from 'path';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

const sql_file_path = path.join(__dirname, '/../db/'); 
const sqlFiles = [
  'main.sql',
  'users.sql',
];

const sqlFilesContent = sqlFiles.map((file) => {
  return readFileSync(sql_file_path + file, 'utf8').toString().replace(/(\r|\n)/g, ' ');
});

dotenv.config();
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 4,
  multipleStatements: true,
  typeCast: (field, next) =>
    field.type == 'TINY' && field.length == 1 ? field.string() == '1' : next(),
});

async function main() {
  for (const [ i, sql ] of sqlFilesContent.entries()) {
    console.log(`Executing ${sqlFiles[i]}...`);
    await pool.execute(sql);
    console.log(`Done ${sqlFiles[i]}`);
  }
  console.log(" --- Done --- ");
}

console.log("Operating on database " + process.env.MYSQL_DATABASE + " on host " + process.env.MYSQL_HOST);

console.log("Loaded SQL files: " + sqlFiles.join(', '));

console.log('This will delete all data in the database. Are you sure? (y/n)');
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', async function (inputBuffer) {
  let text = inputBuffer.toString().trim();

  if (text === 'y') {
    await main();
  } else {
    console.log('Aborted');
  }
  console.log('Exiting...');
  process.exit();
}); 


