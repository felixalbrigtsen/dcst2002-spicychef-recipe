import type {Config} from '@jest/types'

const config : Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '../.',
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  coverageReporters: ["html", "text", "text-summary" ],
  transformIgnorePatterns: ["node_modules/(?!@testing-library)"],
  setupFiles: [
    "./test/dotenv-config"
  ],
  verbose: true,
  maxWorkers: 1,
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,ts}",
    "!utils/**",
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

