module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/src/'],
  coveragePathIgnorePatterns: ['<rootDir>/dist/'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
};
