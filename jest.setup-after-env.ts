import { prisma } from './src/lib/prisma.ts';

beforeEach(async () => {
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({});
});
