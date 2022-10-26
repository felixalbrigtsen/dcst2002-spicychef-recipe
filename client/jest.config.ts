import type {Config} from '@jest/types'

const config : Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ["**/*.test.js", "**/*.test.tsx"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  coverageReporters: ["html", "text", "text-summary" ],
  transformIgnorePatterns: ["node_modules/(?!@testing-library)"],
  setupFiles: [
    "dotenv/config",
  ],
}

export default config

