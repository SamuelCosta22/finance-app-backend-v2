import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';

export default async function () {
  console.log('🔄 Sincronizando banco no NeonDB...');

  // Carrega as variáveis do .env.test
  dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

  // Agora que DATABASE_URL está no process.env, o Prisma pode usar
  execSync('npx prisma db push', { stdio: 'inherit' });
}
