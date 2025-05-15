import { prisma } from './src/lib/prisma.ts';
import { jest } from '@jest/globals';

jest.setTimeout(30000);

beforeEach(async () => {
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});
