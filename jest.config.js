export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.\\.?\\/.+)\\.js$": "$1",
    "classes/(.*).js": "<rootDir>/src/classes/$1",
    "rules/(.*).js": "<rootDir>/src/rules/$1"
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  collectCoverageFrom: [
    "src/**/*",
    "!src/types/*"
  ]
}