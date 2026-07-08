module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  testMatch: [
    '<rootDir>/projects/accessibility-lib/src/**/*.spec.ts',
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/projects/accessibility-lib/src/$1',
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/accessibility-lib',
  coverageReporters: ['html', 'text-summary'],
};
