import type {Config} from '@jest/types'

const config : Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // testMatch: ["**/*.test.js", "**/*.test.tsx"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  coverageReporters: ["html", "text", "text-summary" ],
  transformIgnorePatterns: ["node_modules/(?!@testing-library)"],
  setupFiles: [
    "./dotenv-config"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "/src/**/*.ts",
  ]
}

export default config

