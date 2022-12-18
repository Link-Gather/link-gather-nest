module.exports = {
  verbose: true,
  testRegex: ['.*\\.test\\.ts$'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: ['./jest.setup.js'],
  // Referred https://github.com/jest-community/jest-extended
  //   setupFilesAfterEnv: ['./src/lib/jest-extended'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  moduleDirectories: ['node_modules'],
  preset: 'ts-jest',
  testMatch: null,
  testEnvironment: 'node',
};
