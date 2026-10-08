module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'server.js',
    'db.js',
    '!node_modules/**'
  ],
  testMatch: ['**/tests/**/*.test.js'],
  modulePathIgnorePatterns: [
    '<rootDir>/yedek_',
    '<rootDir>/node_modules/'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/yedek_'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/yedek_',
    '/tests/'
  ],
  silent: false,
  verbose: true
};
