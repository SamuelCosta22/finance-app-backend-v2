/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm', // Usando o preset para ESM
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transformIgnorePatterns: [
    '/node_modules/',
    '/generated/prisma/', // Ignora a pasta do Prisma no transform
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/generated/prisma/', // Ignora a pasta do Prisma na cobertura
  ],
  globalSetup: '<rootDir>/jest.global-setup.ts',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Processa arquivos .ts e .tsx com ts-jest
  },
  extensionsToTreatAsEsm: ['.ts'], // Faz o Jest tratar arquivos .ts como módulos ESM
};

export default config;
