module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    node: false,
    es6: true,
  },
  rules: {
    quotes: [2, 'single'],
    camelcase: 0,
    '@typescript-eslint/no-explicit-any': 0,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
};
