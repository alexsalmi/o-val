export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.\\.?\\/.+)\\.js$": "$1",
    "classes/(.*).js": "<rootDir>/src/classes/$1",
    "rules/(.*).js": "<rootDir>/src/rules/$1"
  }
}