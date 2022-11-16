import mysql from 'mysql2';
import * as path from 'path';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

const sql_file_path = path.join(__dirname, '/../../db/'); 
const sqlFiles = [
  'main.sql',
  'users.sql',
];

const sqlFilesContent = sqlFiles.map((file) => {
  return readFileSync(sql_file_path + file, 'utf8').toString().replace(/(\r|\n)/g, ' ');
});

let pool: mysql.Pool;

function setupPool(envpath: string) {
  dotenv.config({ path: envpath });
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 4,
    multipleStatements: true,
    typeCast: (field, next) =>
      field.type == 'TINY' && field.length == 1 ? field.string() == '1' : next(),
  });
}

function runQuery(sql: string):  Promise<any> {
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } 
      resolve(results);
    });
  });
}

async function execFiles(silent: boolean) {
  for (const [ i, sql ] of sqlFilesContent.entries()) {
    if (!silent) { console.log(`Executing ${sqlFiles[i]}...`); }
    try {
      await runQuery(sql);

      if (!silent) { console.log(`Done ${sqlFiles[i]}`); }
    } catch (err) {
      if (!silent) { console.log(`Error ${sqlFiles[i]}`); }
      console.log(err);
      break;
    }
  }
  if (!silent) { console.log(" --- Done --- "); }
}

async function main() {
  setupPool('./.env');
  console.log("Operating on database " + process.env.MYSQL_DATABASE + " on host " + process.env.MYSQL_HOST);

  console.log("Loaded SQL files: " + sqlFiles.join(', '));

  console.log('This will delete all data in the database. Are you sure? (y/n)');
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', async function (inputBuffer) {
    let text = inputBuffer.toString().trim();

    if (text === 'y') {
      await execFiles(false);
    } else {
      console.log('Aborted');
    }
    console.log('Exiting...');
    process.exit();
  }); 
}


export async function initTest() {
  setupPool('./.env.test');
  await execFiles(true);
}

// if main flag is set, run main function
if (process.argv[2] === 'main') {
  main();
}
// Otherwise, this module can be imported and the test functions can be called

// module.exports = {
//   initTest,
// };
