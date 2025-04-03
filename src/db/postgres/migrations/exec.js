import 'dotenv/config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { poll } from '../helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execMigrations = async () => {
  const client = await poll.connect();
  try {
    const filePath = path.join(__dirname, '01-init.sql');
    const script = fs.readFileSync(filePath, 'utf-8');

    await client.query(script.toString());
    console.log('Migrations executed successfully');
  } catch (error) {
    console.log(error);
  } finally {
    await client.release();
  }
};

execMigrations();
