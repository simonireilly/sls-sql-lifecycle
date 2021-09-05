module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transformIgnorePatterns: ['/node_modules/'],
  transform: {
    '.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        module: {
          type: 'commonjs',
        },
        env: {
          targets: {
            node: '14.0.0',
          },
        },

      },
    ],
  },
};
