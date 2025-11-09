import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom', // 또는 'jest-environment-jsdom'
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/?(*.)+(spec|test).[tj]sx?'],
}
export default config
