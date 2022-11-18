import type {Config} from '@jest/types'

const config : Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '../.',
  // testMatch: ["**/*.test.js", "**/*.test.tsx"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  coverageReporters: ["html", "text", "text-summary" ],
  transformIgnorePatterns: ["node_modules/(?!@testing-library)"],
  setupFiles: [
    "./test/dotenv-config"
  ],
  maxWorkers: 1,
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,ts}",
    "!test/**",
    "!coverage/**",
  ],
  // coverageThreshold: {
  //   global: {
  //     branches: 70,
  //     functions: 80,
  //     lines: 70,
  //     statements: 70
  //   }
  // },
}

export default config

