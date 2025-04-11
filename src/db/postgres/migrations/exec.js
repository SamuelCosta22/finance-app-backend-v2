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
    const files = fs
      .readdirSync(__dirname)
      .filter((file) => file.endsWith('.sql'));

    for (const file of files) {
      const filePath = path.join(__dirname, file);
      const script = fs.readFileSync(filePath, 'utf-8');
      await client.query(script.toString());

      console.log(`Migration ${file} executed successfully`);
    }

    console.log('All migrations were executed successfully');
  } catch (error) {
    console.log(error);
  } finally {
    await client.release();
  }
};

execMigrations();
