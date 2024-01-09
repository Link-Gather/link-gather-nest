module.exports = {
  verbose: true,
  testRegex: ['.*\\.test\\.ts$'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: ['./jest.setup.js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  moduleDirectories: ['node_modules'],
  preset: 'ts-jest',
  testMatch: null,
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@config': '<rootDir>/src/config',
    '^@middlewares': '<rootDir>/src/middlewares',
  },
};
