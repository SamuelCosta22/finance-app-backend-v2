import { execSync } from 'child_process';

export default async function () {
  console.log('🔄 Sincronizando banco no NeonDB...');
  execSync('npx prisma db push', { stdio: 'inherit' });
}
