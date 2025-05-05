import { prisma } from './src/lib/prisma.ts';

beforeEach(async () => {
  await prisma.user.deleteMany({});
  await prisma.transaction.deleteMany({});
});
