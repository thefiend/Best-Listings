// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const customConfig: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Git worktrees carry their own copies of the tests and node_modules
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/.worktrees/'],
  modulePathIgnorePatterns: ['<rootDir>/.worktrees/'],
}

export default createJestConfig(customConfig)
